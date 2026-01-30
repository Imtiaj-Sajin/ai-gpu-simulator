// src/lib/sim/estimator.ts
import { BENCHMARKS, GPU_SPECS, MODEL_SPECS, type BenchmarkPoint } from "@/data/simulatorDataset";

export type Precision = "fp16" | "int8" | "int4";
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
  vram?: { fits: boolean; requiredGB?: number; availableGB?: number };
};

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

/* -------------------------------------------------- */
/* VRAM VALIDATION */
/* -------------------------------------------------- */
function validateVRAM(
  gpuId: string,
  modelId: string,
  precision: Precision,
  context: number,
) {
  const gpu = GPU_SPECS.find(g => g.id === gpuId);
  const model = MODEL_SPECS.find(m => m.id === modelId);
  if (!gpu || !model) return { fits: true };

  // Conservative memory model (GB):
  // - weights scale with params and bytes/param
  // - KV-cache scales with params and context
  // - overhead accounts for framework + fragmentation
  const bytesPerParam = precision === "fp16" ? 2.0 : precision === "int8" ? 1.0 : 0.5;
  const weightsGB = model.paramsB * bytesPerParam;
  // KV-cache is highly implementation-dependent; keep conservative so we warn early.
  const kvGB =
    model.paramsB *
    (context / 4096) *
    (precision === "fp16" ? 0.8 : precision === "int8" ? 0.6 : 0.5);
  const overheadGB = Math.max(2, weightsGB * 0.25);
  const required = weightsGB + kvGB + overheadGB;

  return {
    fits: required <= gpu.vramGB,
    requiredGB: required,
    availableGB: gpu.vramGB,
  };
}

/* -------------------------------------------------- */
/* SMART BENCHMARK MATCHING */
/* -------------------------------------------------- */
function findBestBenchmarkMatch(input: EstimateInput) {
  // Score candidates by closeness (context, batch, concurrency). Exact GPU+model still preferred.
  const candidates = BENCHMARKS.filter(
    b =>
      b.gpuId === input.gpuId &&
      b.modelId === input.modelId &&
      b.precision === input.precision &&
      b.mode === input.mode,
  );
  if (candidates.length) {
    const scored = candidates
      .map((b) => {
        const ctxScore = 1 - Math.min(1, Math.abs(Math.log2((b.context || 4096) / Math.max(1, input.context))) / 4);
        const bsScore = 1 - Math.min(1, Math.abs((b.batchSize || 1) - input.batchSize) / 32);
        const ccScore = 1 - Math.min(1, Math.abs((b.concurrency || 1) - input.concurrency) / 64);
        const score = ctxScore * 0.5 + bsScore * 0.25 + ccScore * 0.25;
        return { b, score };
      })
      .sort((a, z) => z.score - a.score);
    const best = scored[0]?.b;
    if (best) return { benchmark: best, scale: 1.0, confidence: "high" as Confidence };
  }

  const model = MODEL_SPECS.find(m => m.id === input.modelId);
  if (!model) return null;

  const sameGpu = BENCHMARKS.filter(
    b => b.gpuId === input.gpuId && b.precision === input.precision,
  );

  for (const b of sameGpu) {
    const bm = MODEL_SPECS.find(m => m.id === b.modelId);
    if (!bm) continue;

    const ratio = bm.paramsB / model.paramsB;
    if (ratio > 0.3 && ratio < 3.0) {
      return {
        benchmark: b,
        scale: Math.pow(ratio, 0.65),
        confidence: "medium" as Confidence,
      };
    }
  }

  return null;
}

function maxReasonableDecodeTps(paramsB: number) {
  // Conservative caps to avoid absurd outputs when we fall back to specs.
  if (paramsB <= 8) return 180;
  if (paramsB <= 15) return 90;
  if (paramsB <= 35) return 45;
  if (paramsB <= 80) return 25;
  if (paramsB <= 130) return 14;
  return 8;
}

/* -------------------------------------------------- */
/* SPEC FALLBACK */
/* -------------------------------------------------- */
function estimateFromSpecs(input: EstimateInput) {
  const gpu = GPU_SPECS.find(g => g.id === input.gpuId);
  const model = MODEL_SPECS.find(m => m.id === input.modelId);
  if (!gpu || !model) {
    return { prefillTps: 0, decodeTps: 0, rationale: "Missing GPU or model spec." };
  }

  const bw = gpu.memoryBandwidthGBs ?? 900;
  const tf = gpu.fp16Tflops ?? 120;

  // Two-limiter model: bandwidth + compute, then downscale by model size.
  const bwScore = (bw / 1000) * 75;
  const tfScore = Math.sqrt(tf / 150) * 75;
  let speed = Math.min(bwScore, tfScore);

  speed /= Math.pow(model.paramsB / 8, 0.78);

  // Architecture multipliers (kept conservative).
  if (gpu.architecture === "Blackwell") speed *= 1.20;
  else if (gpu.architecture === "Hopper") speed *= 1.10;
  else if (gpu.architecture === "Ada") speed *= 1.00;
  else if (gpu.architecture === "Ampere") speed *= 0.90;

  // Quantization: typical speedup but keep conservative.
  if (input.precision === "int8") speed *= 1.35;
  if (input.precision === "int4") speed *= 1.55;

  if (input.mode === "throughput") {
    // Throughput mode increases tokens/sec but sublinearly.
    speed *= Math.min(Math.pow(Math.max(1, input.batchSize), 0.35), 2.2);
    speed *= Math.min(Math.pow(Math.max(1, input.concurrency), 0.15), 1.5);
  }

  const decodeTps = clamp(speed, 0.5, maxReasonableDecodeTps(model.paramsB));
  return {
    decodeTps,
    prefillTps: clamp(decodeTps * 5.5, 1, 25_000),
    rationale:
      "Estimated conservatively from GPU bandwidth/compute, model size, precision, and workload mode (capped to avoid unrealistic outputs).",
  };
}

/* -------------------------------------------------- */
/* MAIN ENTRY */
/* -------------------------------------------------- */
export function estimatePerformance(input: EstimateInput): EstimateOutput {
  const inTok = clamp(input.inputTokens, 1, 2_000_000);
  const outTok = clamp(input.outputTokens, 1, 2_000_000);
  const context = clamp(input.context, 1024, 32768);

  const vram = validateVRAM(input.gpuId, input.modelId, input.precision, context);
  if (!vram.fits) {
    return {
      ttftSeconds: Infinity,
      prefillTps: 0,
      decodeTps: 0,
      totalSeconds: Infinity,
      confidence: "low",
      rationale: `Model does not fit in VRAM (~${vram.requiredGB?.toFixed(1)}GB required, ${vram.availableGB?.toFixed(
        1,
      )}GB available). Try quantization or a larger VRAM GPU.`,
      vram,
    };
  }

  const match = findBestBenchmarkMatch(input);
  if (match) {
    const decode = match.benchmark.decodeTps * match.scale;
    const prefill = match.benchmark.prefillTps ?? decode * 7;

    const model = MODEL_SPECS.find(m => m.id === input.modelId);
    const cappedDecode = model ? Math.min(decode, maxReasonableDecodeTps(model.paramsB)) : decode;
    const cappedPrefill = model ? Math.min(prefill, maxReasonableDecodeTps(model.paramsB) * 6.0) : prefill;

    return {
      ttftSeconds: inTok / cappedPrefill,
      prefillTps: cappedPrefill,
      decodeTps: cappedDecode,
      totalSeconds: inTok / cappedPrefill + outTok / cappedDecode,
      confidence: match.confidence,
      rationale:
        match.confidence === "high"
          ? "Direct benchmark match (with conservative caps)."
          : "Scaled from nearby benchmark data (with conservative caps).",
      citation: match.benchmark.source,
      vram,
    };
  }

  const spec = estimateFromSpecs(input);
  return {
    ttftSeconds: inTok / spec.prefillTps,
    prefillTps: spec.prefillTps,
    decodeTps: spec.decodeTps,
    totalSeconds: inTok / spec.prefillTps + outTok / spec.decodeTps,
    confidence: "low",
    rationale: spec.rationale,
    vram,
  };
}
