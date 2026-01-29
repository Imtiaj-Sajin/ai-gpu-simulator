// src/lib/sim/estimator.ts
import { BENCHMARKS, GPU_SPECS, MODEL_SPECS, type BenchmarkPoint } from "@/data/simulatorDataset";

export type Precision = "fp16" | "int8";
export type WorkloadMode = "single" | "throughput";

export type EstimateInput = {
  gpuId: string;
  modelId: string;
  inputTokens: number;
  outputTokens: number;
  context: number;
  precision: Precision;
  mode: WorkloadMode;
  batchSize: number;
  concurrency: number;
};

export type Confidence = "high" | "medium" | "low";

export type EstimateOutput = {
  ttftSeconds: number;
  prefillTps: number;
  decodeTps: number;
  totalSeconds: number;
  confidence: Confidence;
  rationale: string;
  citation?: { label: string; url: string; date?: string };
};

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

function findSpec(gpuId: string, modelId: string) {
  const gpu = GPU_SPECS.find((g) => g.id === gpuId);
  const model = MODEL_SPECS.find((m) => m.id === modelId);
  if (!gpu || !model) return null;
  return { gpu, model };
}

function bestBenchmarkMatch(input: EstimateInput): BenchmarkPoint | null {
  // First, look for exact or very close matches
  const candidates = BENCHMARKS.filter(
    (b) => b.gpuId === input.gpuId && b.modelId === input.modelId && b.precision === input.precision && b.mode === input.mode,
  );

  if (!candidates.length) {
    // Try to find same GPU/precision but different model in same family
    const gpu = input.gpuId;
    const modelSpec = MODEL_SPECS.find((m) => m.id === input.modelId);
    if (modelSpec) {
      const sameFamily = BENCHMARKS.filter(
        (b) => b.gpuId === gpu && b.precision === input.precision && MODEL_SPECS.find((m) => m.id === b.modelId)?.family === modelSpec.family,
      );
      if (sameFamily.length) return sameFamily[0];
    }
    return null;
  }

  // Score by context, batch, concurrency proximity
  const scored = candidates
    .map((b) => {
      const ctxDelta = Math.abs(b.context - input.context);
      const batchDelta = Math.abs(b.batchSize - input.batchSize);
      const concDelta = Math.abs(b.concurrency - input.concurrency);
      const score = ctxDelta * 100 + batchDelta * 10 + concDelta;
      return { b, score };
    })
    .sort((a, z) => a.score - z.score);

  return scored[0]?.b ?? null;
}

function estimateFromSpecs(input: EstimateInput): { prefillTps: number; decodeTps: number; rationale: string } {
  const spec = findSpec(input.gpuId, input.modelId);
  if (!spec) {
    return { prefillTps: 200, decodeTps: 20, rationale: "Fallback baseline (missing GPU/model spec)." };
  }

  const { gpu, model } = spec;

  // Enhanced tier factors based on actual architectures
  let tierFactor = 1.0;
  if (gpu.tier === "datacenter") {
    if (gpu.id.includes("h100")) tierFactor = 3.2;
    else if (gpu.id.includes("a100")) tierFactor = 1.8;
    else tierFactor = 2.0;
  } else if (gpu.tier === "workstation") {
    if (gpu.id.includes("blackwell")) tierFactor = 2.8;
    else if (gpu.id.includes("a6000")) tierFactor = 1.3;
    else tierFactor = 1.5;
  } else {
    // consumer
    if (gpu.id.includes("rtx-5")) tierFactor = 1.8;
    else if (gpu.id.includes("rtx-4090")) tierFactor = 1.4;
    else tierFactor = 1.2;
  }

  // Memory bandwidth is critical for inference
  const bwFactor = gpu.memoryBandwidthGBs ? clamp(gpu.memoryBandwidthGBs / 1000, 0.6, 3.5) : 1.0;

  // Model size penalty
  const sizePenalty = Math.pow(clamp(model.paramsB / 8, 1, 30), 0.6);

  let decodeTps = (100 * tierFactor * bwFactor) / sizePenalty;

  // Context impacts prefill more than decode
  decodeTps *= clamp(Math.pow(4096 / clamp(input.context, 1024, 32768), 0.1), 0.7, 1.0);

  // Throughput mode benefits
  if (input.mode === "throughput") {
    const batchBoost = Math.pow(clamp(input.batchSize, 1, 64), 0.4);
    const concBoost = Math.pow(clamp(input.concurrency, 1, 128), 0.3);
    decodeTps *= clamp(batchBoost * concBoost, 1, 4.0);
  }

  // INT8 quantization speedup
  if (input.precision === "int8") decodeTps *= 1.8;

  decodeTps = clamp(decodeTps, 1, 20000);

  // Prefill is typically much faster
  let prefillTps = decodeTps * 8.0;
  prefillTps *= clamp(Math.pow(4096 / clamp(input.context, 1024, 32768), 0.4), 0.2, 1.0);
  prefillTps = clamp(prefillTps, 20, 50000);

  return {
    prefillTps,
    decodeTps,
    rationale:
      "Spec-based estimate: scaled by GPU architecture/bandwidth, model size, context, precision, and workload mode.",
  };
}

export function estimatePerformance(input: EstimateInput): EstimateOutput {
  const inTok = clamp(Math.floor(input.inputTokens), 1, 2_000_000);
  const outTok = clamp(Math.floor(input.outputTokens), 1, 2_000_000);
  const context = clamp(Math.floor(input.context), 1024, 32768);

  const exact = bestBenchmarkMatch({ ...input, inputTokens: inTok, outputTokens: outTok, context });
  if (exact) {
    const prefillTps = exact.prefillTps ?? exact.decodeTps * 7;
    const ttftSeconds = inTok / prefillTps;
    const genSeconds = outTok / exact.decodeTps;

    // Determine confidence based on match quality
    let confidence: Confidence = "medium";
    if (
      exact.gpuId === input.gpuId &&
      exact.modelId === input.modelId &&
      exact.precision === input.precision &&
      exact.mode === input.mode &&
      Math.abs(exact.context - input.context) < 1024
    ) {
      confidence = exact.source?.url ? "high" : "medium";
    }

    return {
      ttftSeconds,
      prefillTps,
      decodeTps: exact.decodeTps,
      totalSeconds: ttftSeconds + genSeconds,
      confidence,
      rationale: `Matched benchmark: ${exact.gpuId} + ${exact.modelId} (${exact.precision}, ${exact.mode} mode)`,
      citation: exact.source?.url ? exact.source : undefined,
    };
  }

  const specEst = estimateFromSpecs({ ...input, inputTokens: inTok, outputTokens: outTok, context });
  const ttftSeconds = inTok / specEst.prefillTps;
  const genSeconds = outTok / specEst.decodeTps;
  return {
    ttftSeconds,
    prefillTps: specEst.prefillTps,
    decodeTps: specEst.decodeTps,
    totalSeconds: ttftSeconds + genSeconds,
    confidence: "low",
    rationale: specEst.rationale,
  };
}