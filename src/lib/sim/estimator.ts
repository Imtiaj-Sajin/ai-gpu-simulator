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
  const candidates = BENCHMARKS.filter(
    (b) =>
      b.gpuId === input.gpuId &&
      b.modelId === input.modelId &&
      b.precision === input.precision &&
      b.mode === input.mode,
  );
  if (!candidates.length) return null;

  // closest context, then closest batch/concurrency
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
  // Heuristic: decode scales roughly inversely with model size, and up with GPU tier.
  // This is a conservative placeholder until we populate real benchmark datapoints.
  const tierFactor = gpu.tier === "datacenter" ? 1.6 : gpu.tier === "workstation" ? 1.25 : 1.0;

  // Use VRAM as a weak proxy for capability when bandwidth/TFLOPS not filled.
  const vramFactor = clamp((gpu.vramGB || 16) / 24, 0.6, 2.2);
  const sizePenalty = Math.pow(clamp(model.paramsB / 8, 1, 30), 0.55);

  let decodeTps = (110 * tierFactor * vramFactor) / sizePenalty;
  // Context impacts TTFT more than decode; small dampening for very large context.
  decodeTps *= clamp(Math.pow(4096 / clamp(input.context, 1024, 32768), 0.08), 0.75, 1.0);

  // Throughput mode benefits from batching/concurrency (but diminishing returns).
  if (input.mode === "throughput") {
    const batchBoost = Math.pow(clamp(input.batchSize, 1, 64), 0.35);
    const concBoost = Math.pow(clamp(input.concurrency, 1, 128), 0.25);
    decodeTps *= clamp(batchBoost * concBoost, 1, 3.0);
  }

  // INT8 conditional speedup (if selected)
  if (input.precision === "int8") decodeTps *= 1.25;

  decodeTps = clamp(decodeTps, 1, 2000);

  // Prefill is usually much faster than decode; scale similarly but higher base.
  let prefillTps = decodeTps * 7.5;
  // Larger context increases memory pressure => lower prefill throughput.
  prefillTps *= clamp(Math.pow(4096 / clamp(input.context, 1024, 32768), 0.35), 0.25, 1.0);
  prefillTps = clamp(prefillTps, 20, 20000);

  return {
    prefillTps,
    decodeTps,
    rationale: "Spec-based estimate (placeholder): scaled by GPU tier/VRAM, model size, context, and workload mode.",
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
    return {
      ttftSeconds,
      prefillTps,
      decodeTps: exact.decodeTps,
      totalSeconds: ttftSeconds + genSeconds,
      confidence: exact.source?.url ? "high" : "medium",
      rationale: "Matched closest available datapoint (GPU+model+settings).",
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
