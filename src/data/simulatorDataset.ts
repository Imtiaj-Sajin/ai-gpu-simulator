export type GpuTier = "consumer" | "workstation" | "datacenter";

export type GpuSpec = {
  id: string;
  name: string;
  tier: GpuTier;
  vramGB: number;
  memoryBandwidthGBs?: number; // optional until confirmed
  fp16Tflops?: number; // optional until confirmed
  notes?: string;
  sources?: { label: string; url: string }[];
};

export type ModelFamily = "llama" | "mistral" | "qwen" | "deepseek" | "other";

export type ModelSpec = {
  id: string;
  name: string;
  family: ModelFamily;
  paramsB: number; // parameter count in billions
  defaultContext: number;
  notes?: string;
  sources?: { label: string; url: string }[];
};

/**
 * NOTE:
 * - Specs marked TBD are placeholders until we confirm exact public spec sheets.
 * - The simulator still works using the hybrid estimator fallback path.
 */
export const GPU_SPECS: GpuSpec[] = [
  {
    id: "rtx-4070-ti-super",
    name: "RTX 4070 Ti Super",
    tier: "consumer",
    vramGB: 16,
    notes: "Ada Lovelace consumer GPU.",
  },
  {
    id: "rtx-4080-super",
    name: "RTX 4080 Super",
    tier: "consumer",
    vramGB: 16,
    notes: "Ada Lovelace consumer GPU.",
  },
  {
    id: "rtx-4090",
    name: "RTX 4090",
    tier: "consumer",
    vramGB: 24,
    notes: "Ada Lovelace consumer GPU.",
  },
  {
    id: "h100-sxm",
    name: "H100 (SXM)",
    tier: "datacenter",
    vramGB: 80,
    notes: "Hopper datacenter GPU (exact variant may differ by deployment).",
  },
  {
    id: "h100-pcie",
    name: "H100 (PCIe)",
    tier: "datacenter",
    vramGB: 80,
    notes: "Hopper datacenter GPU (PCIe).",
  },
  {
    id: "a100-80gb",
    name: "A100 80GB",
    tier: "datacenter",
    vramGB: 80,
    notes: "Ampere datacenter GPU.",
  },
  // Requested additions (specs will be confirmed via public sources)
  {
    id: "rtx-5070-ti",
    name: "RTX 5070 Ti",
    tier: "consumer",
    vramGB: 0,
    notes: "TBD specs (placeholder).",
  },
  {
    id: "rtx-5080",
    name: "RTX 5080",
    tier: "consumer",
    vramGB: 0,
    notes: "TBD specs (placeholder).",
  },
  {
    id: "rtx-5090",
    name: "RTX 5090",
    tier: "consumer",
    vramGB: 0,
    notes: "TBD specs (placeholder).",
  },
  {
    id: "rtx-pro-6000-blackwell-96gb",
    name: "RTX PRO 6000 Blackwell (96GB)",
    tier: "workstation",
    vramGB: 96,
    notes: "Requested workstation Blackwell SKU (placeholder until confirmed).",
  },
  {
    id: "rtx-pro-blackwell-48gb",
    name: "RTX PRO Blackwell (48GB)",
    tier: "workstation",
    vramGB: 48,
    notes: "Requested workstation Blackwell 48GB SKU (placeholder until confirmed).",
  },
];

export const MODEL_SPECS: ModelSpec[] = [
  { id: "llama-3-1-8b", name: "Llama 3.1 8B", family: "llama", paramsB: 8, defaultContext: 4096 },
  { id: "llama-3-1-70b", name: "Llama 3.1 70B", family: "llama", paramsB: 70, defaultContext: 4096 },

  { id: "mistral-7b", name: "Mistral 7B", family: "mistral", paramsB: 7, defaultContext: 4096 },
  { id: "mixtral-8x7b", name: "Mixtral 8x7B", family: "mistral", paramsB: 46, defaultContext: 4096 },
  { id: "mixtral-8x22b", name: "Mixtral 8x22B", family: "mistral", paramsB: 141, defaultContext: 4096 },

  { id: "qwen-2-5-7b", name: "Qwen2.5 7B", family: "qwen", paramsB: 7, defaultContext: 4096 },
  { id: "qwen-2-5-14b", name: "Qwen2.5 14B", family: "qwen", paramsB: 14, defaultContext: 4096 },
  { id: "qwen-2-5-32b", name: "Qwen2.5 32B", family: "qwen", paramsB: 32, defaultContext: 4096 },
  { id: "qwen-2-5-72b", name: "Qwen2.5 72B", family: "qwen", paramsB: 72, defaultContext: 4096 },

  // We keep DeepSeek as “one or two popular variants”; can expand once benchmark coverage is confirmed.
  { id: "deepseek-r1-distill-32b", name: "DeepSeek R1 Distill 32B", family: "deepseek", paramsB: 32, defaultContext: 4096 },
];

export type BenchmarkPoint = {
  id: string;
  gpuId: string;
  modelId: string;
  context: number;
  precision: "fp16" | "int8";
  mode: "single" | "throughput";
  batchSize: number;
  concurrency: number;
  prefillTps?: number;
  decodeTps: number;
  source?: { label: string; url: string; date?: string };
};

/**
 * Minimal seed datapoints. As we research more, this grows.
 * These are intentionally conservative and treated as “medium” at best.
 */
export const BENCHMARKS: BenchmarkPoint[] = [
  {
    id: "seed-4090-llama8b-single-fp16-4k",
    gpuId: "rtx-4090",
    modelId: "llama-3-1-8b",
    context: 4096,
    precision: "fp16",
    mode: "single",
    batchSize: 1,
    concurrency: 1,
    prefillTps: 900,
    decodeTps: 110,
    source: { label: "Seed estimate (replace with citation)", url: "" },
  },
  {
    id: "seed-a100-llama70b-single-fp16-4k",
    gpuId: "a100-80gb",
    modelId: "llama-3-1-70b",
    context: 4096,
    precision: "fp16",
    mode: "single",
    batchSize: 1,
    concurrency: 1,
    prefillTps: 350,
    decodeTps: 35,
    source: { label: "Seed estimate (replace with citation)", url: "" },
  },
];
