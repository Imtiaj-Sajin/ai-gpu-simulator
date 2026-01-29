// src\data\simulatorDataset.ts
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
    memoryBandwidthGBs: 672.3,
    fp16Tflops: 88.2, // With sparsity
    notes: "Ada Lovelace consumer GPU.",
    sources: [{ label: "TechPowerUp", url: "https://www.techpowerup.com/gpu-specs/geforce-rtx-4070-ti-super.c4187" }],
  },
  {
    id: "rtx-4080-super",
    name: "RTX 4080 Super",
    tier: "consumer",
    vramGB: 16,
    memoryBandwidthGBs: 736.3,
    fp16Tflops: 104.4, // With sparsity
    notes: "Ada Lovelace consumer GPU.",
    sources: [{ label: "TechPowerUp", url: "https://www.techpowerup.com/gpu-specs/geforce-rtx-4080-super.c4182" }],
  },
  {
    id: "rtx-4090",
    name: "RTX 4090",
    tier: "consumer",
    vramGB: 24,
    memoryBandwidthGBs: 1008,
    fp16Tflops: 165.2, // With sparsity
    notes: "Ada Lovelace consumer GPU.",
    sources: [{ label: "TechPowerUp", url: "https://www.techpowerup.com/gpu-specs/geforce-rtx-4090.c3889" }],
  },
  {
    id: "h100-sxm",
    name: "H100 (SXM)",
    tier: "datacenter",
    vramGB: 80,
    memoryBandwidthGBs: 3350,
    fp16Tflops: 1979, // With sparsity
    notes: "Hopper datacenter GPU (SXM).",
    sources: [{ label: "NVIDIA", url: "https://www.nvidia.com/en-us/data-center/h100/" }],
  },
  {
    id: "h100-pcie",
    name: "H100 (PCIe)",
    tier: "datacenter",
    vramGB: 80,
    memoryBandwidthGBs: 2000,
    fp16Tflops: 1513, // With sparsity
    notes: "Hopper datacenter GPU (PCIe).",
    sources: [{ label: "NVIDIA", url: "https://www.nvidia.com/en-us/data-center/h100/" }],
  },
  {
    id: "a100-80gb",
    name: "A100 80GB",
    tier: "datacenter",
    vramGB: 80,
    memoryBandwidthGBs: 2039,
    fp16Tflops: 312,
    notes: "Ampere datacenter GPU.",
    sources: [{ label: "NVIDIA", url: "https://www.nvidia.com/en-us/data-center/a100/" }],
  },
  // Requested additions (specs based on latest rumors and announcements)
  {
    id: "rtx-5070-ti",
    name: "RTX 5070 Ti",
    tier: "consumer",
    vramGB: 16,
    memoryBandwidthGBs: 896,
    fp16Tflops: 177.4, // Estimated with sparsity
    notes: "TBD specs (placeholder based on rumors).",
  },
  {
    id: "rtx-5080",
    name: "RTX 5080",
    tier: "consumer",
    vramGB: 16,
    memoryBandwidthGBs: 960,
    fp16Tflops: 225.1, // Estimated with sparsity
    notes: "TBD specs (placeholder based on rumors).",
  },
  {
    id: "rtx-5090",
    name: "RTX 5090",
    tier: "consumer",
    vramGB: 32,
    memoryBandwidthGBs: 1792,
    fp16Tflops: 419.2, // Estimated with sparsity
    notes: "TBD specs (placeholder based on rumors).",
  },
  {
    id: "rtx-pro-6000-blackwell-96gb",
    name: "RTX PRO 6000 Blackwell (96GB)",
    tier: "workstation",
    vramGB: 96,
    memoryBandwidthGBs: 1792,
    fp16Tflops: 4000, // AI TOPS with sparsity
    notes: "Blackwell workstation GPU. FP16 TFLOPS is an estimate based on AI TOPS.",
    sources: [{ label: "PNY", url: "https://www.pny.com/nvidia-rtx-6000-blackwell" }],
  },
  {
    id: "rtx-pro-blackwell-48gb",
    name: "RTX PRO Blackwell (48GB)",
    tier: "workstation",
    vramGB: 48,
    memoryBandwidthGBs: 896, // Estimated based on potential configuration
    fp16Tflops: 2000, // Estimated, likely half of the 96GB version
    notes: "Hypothetical workstation Blackwell SKU (placeholder).",
  },
];

export const MODEL_SPECS: ModelSpec[] = [
  { id: "llama-3-1-8b", name: "Llama 3.1 8B", family: "llama", paramsB: 8, defaultContext: 128000 },
  { id: "llama-3-1-70b", name: "Llama 3.1 70B", family: "llama", paramsB: 70, defaultContext: 128000 },

  { id: "mistral-7b", name: "Mistral 7B", family: "mistral", paramsB: 7, defaultContext: 8192 },
  { id: "mixtral-8x7b", name: "Mixtral 8x7B", family: "mistral", paramsB: 46.7, defaultContext: 32768 },
  { id: "mixtral-8x22b", name: "Mixtral 8x22B", family: "mistral", paramsB: 141, defaultContext: 65536 },

  { id: "qwen-2-5-7b", name: "Qwen2.5 7B", family: "qwen", paramsB: 7.61, defaultContext: 131072 },
  { id: "qwen-2-5-14b", name: "Qwen2.5 14B", family: "qwen", paramsB: 14.7, defaultContext: 131072 },
  { id: "qwen-2-5-32b", name: "Qwen2.5 32B", family: "qwen", paramsB: 32.5, defaultContext: 131072 },
  { id: "qwen-2-5-72b", name: "Qwen2.5 72B", family: "qwen", paramsB: 72, defaultContext: 128000 },

  { id: "deepseek-r1-distill-32b", name: "DeepSeek R1 Distill 32B", family: "deepseek", paramsB: 32, defaultContext: 32768 },
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
