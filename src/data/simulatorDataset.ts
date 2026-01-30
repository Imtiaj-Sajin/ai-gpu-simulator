// src/data/simulatorDataset.ts
export type GpuTier = "consumer" | "workstation" | "datacenter";

export type GpuSpec = {
  id: string;
  name: string;
  tier: GpuTier;
  /** High-level architecture family (used for conservative scaling), e.g. Ada / Hopper / Blackwell. */
  architecture?: "Ada" | "Ampere" | "Hopper" | "Blackwell" | "Other";
  vramGB: number;
  memoryBandwidthGBs?: number;
  fp16Tflops?: number;
  notes?: string;
  sources?: { label: string; url: string }[];
};

export type ModelFamily = "llama" | "mistral" | "qwen" | "deepseek" | "other";

export type ModelSpec = {
  id: string;
  name: string;
  family: ModelFamily;
  paramsB: number;
  defaultContext: number;
  notes?: string;
  sources?: { label: string; url: string }[];
};

export const GPU_SPECS: GpuSpec[] = [
  {
    id: "rtx-4070-ti-super",
    name: "RTX 4070 Ti Super",
    tier: "consumer",
    architecture: "Ada",
    vramGB: 16,
    memoryBandwidthGBs: 672.3,
    fp16Tflops: 88.2,
    notes: "Ada Lovelace consumer GPU",
    sources: [{ label: "TechPowerUp", url: "https://www.techpowerup.com/gpu-specs/geforce-rtx-4070-ti-super.c4187" }],
  },
  {
    id: "rtx-4080-super",
    name: "RTX 4080 Super",
    tier: "consumer",
    architecture: "Ada",
    vramGB: 16,
    memoryBandwidthGBs: 736.3,
    fp16Tflops: 104.4,
    notes: "Ada Lovelace consumer GPU",
    sources: [{ label: "TechPowerUp", url: "https://www.techpowerup.com/gpu-specs/geforce-rtx-4080-super.c4182" }],
  },
  {
    id: "rtx-4090",
    name: "RTX 4090",
    tier: "consumer",
    architecture: "Ada",
    vramGB: 24,
    memoryBandwidthGBs: 1008,
    fp16Tflops: 165.2,
    notes: "Ada Lovelace consumer GPU",
    sources: [
      { label: "TechPowerUp", url: "https://www.techpowerup.com/gpu-specs/geforce-rtx-4090.c3889" },
      { label: "NVIDIA", url: "https://www.nvidia.com/en-us/geforce/graphics-cards/40-series/compare/" },
    ],
  },
  {
    id: "rtx-5070-ti",
    name: "RTX 5070 Ti",
    tier: "consumer",
    architecture: "Blackwell",
    vramGB: 16,
    memoryBandwidthGBs: 896,
    fp16Tflops: 177.4,
    notes: "Blackwell 2.0 consumer GPU",
    sources: [
      { label: "TechPowerUp", url: "https://www.techpowerup.com/gpu-specs/geforce-rtx-5070-ti.c4243" },
      { label: "NVIDIA", url: "https://www.nvidia.com/en-us/geforce/graphics-cards/50-series/compare/" },
    ],
  },
  {
    id: "rtx-5080",
    name: "RTX 5080",
    tier: "consumer",
    architecture: "Blackwell",
    vramGB: 16,
    memoryBandwidthGBs: 960,
    fp16Tflops: 225.1,
    notes: "Blackwell 2.0 consumer GPU",
    sources: [
      { label: "TechPowerUp", url: "https://www.techpowerup.com/gpu-specs/geforce-rtx-5080.c4217" },
      { label: "NVIDIA", url: "https://www.nvidia.com/en-us/geforce/graphics-cards/50-series/compare/" },
    ],
  },
  {
    id: "rtx-5090",
    name: "RTX 5090",
    tier: "consumer",
    architecture: "Blackwell",
    vramGB: 32,
    memoryBandwidthGBs: 1792,
    fp16Tflops: 419.2,
    notes: "Blackwell 2.0 flagship consumer GPU (3352 AI TOPS)",
    sources: [
      { label: "TechPowerUp", url: "https://www.techpowerup.com/gpu-specs/geforce-rtx-5090.c4216" },
      { label: "NVIDIA", url: "https://www.nvidia.com/en-us/geforce/graphics-cards/50-series/rtx-5090/" },
    ],
  },
  {
    id: "rtx-a6000",
    name: "RTX A6000",
    tier: "workstation",
    architecture: "Ampere",
    vramGB: 48,
    memoryBandwidthGBs: 768,
    fp16Tflops: 38.71,
    notes: "Ampere workstation GPU",
    sources: [{ label: "TechPowerUp", url: "https://www.techpowerup.com/gpu-specs/rtx-a6000.c3686" }],
  },
  {
    id: "rtx-pro-6000-blackwell-48gb",
    name: "RTX PRO 6000 Blackwell (48GB)",
    tier: "workstation",
    architecture: "Blackwell",
    vramGB: 48,
    notes:
      "Blackwell workstation GPU variant. Exact bandwidth/TFLOPS can vary by edition; kept conservative until confirmed.",
    sources: [
      { label: "NVIDIA", url: "https://www.nvidia.com/en-us/data-center/rtx-pro-6000-blackwell-server-edition/" },
    ],
  },
  {
    id: "rtx-pro-6000-blackwell-96gb",
    name: "RTX PRO 6000 Blackwell (96GB)",
    tier: "workstation",
    architecture: "Blackwell",
    vramGB: 96,
    memoryBandwidthGBs: 1792,
    fp16Tflops: 126,
    notes: "Blackwell workstation GPU (4000 AI TOPS)",
    sources: [
      { label: "TechPowerUp", url: "https://www.techpowerup.com/gpu-specs/rtx-pro-6000-blackwell.c4272" },
      {
        label: "NVIDIA Datasheet",
        url: "https://www.nvidia.com/content/dam/en-zz/Solutions/data-center/rtx-pro-6000-blackwell-workstation-edition/workstation-blackwell-rtx-pro-6000-workstation-edition-nvidia-us-3519208-web.pdf",
      },
    ],
  },
  {
    id: "a100-80gb",
    name: "A100 80GB",
    tier: "datacenter",
    architecture: "Ampere",
    vramGB: 80,
    memoryBandwidthGBs: 2039,
    fp16Tflops: 312,
    notes: "Ampere datacenter GPU",
    sources: [
      { label: "NVIDIA", url: "https://www.nvidia.com/en-us/data-center/a100/" },
      { label: "TechPowerUp", url: "https://www.techpowerup.com/gpu-specs/a100-pcie-80-gb.c3821" },
    ],
  },
  {
    id: "h100-sxm",
    name: "H100 (SXM)",
    tier: "datacenter",
    architecture: "Hopper",
    vramGB: 80,
    memoryBandwidthGBs: 3350,
    fp16Tflops: 1979,
    notes: "Hopper datacenter GPU (SXM, 3958 FP8 TFLOPS)",
    sources: [
      { label: "NVIDIA", url: "https://www.nvidia.com/en-us/data-center/h100/" },
      { label: "Architecture Whitepaper", url: "https://resources.nvidia.com/en-us-hopper-architecture/nvidia-h100-tensor-c" },
    ],
  },
  {
    id: "h100-pcie",
    name: "H100 (PCIe)",
    tier: "datacenter",
    architecture: "Hopper",
    vramGB: 80,
    memoryBandwidthGBs: 2000,
    fp16Tflops: 1513,
    notes: "Hopper datacenter GPU (PCIe)",
    sources: [{ label: "NVIDIA", url: "https://www.nvidia.com/en-us/data-center/h100/" }],
  },
];

export const MODEL_SPECS: ModelSpec[] = [
  {
    id: "llama-3-1-8b",
    name: "Llama 3.1 8B",
    family: "llama",
    paramsB: 8,
    defaultContext: 128000,
    sources: [{ label: "Meta AI", url: "https://ai.meta.com/blog/meta-llama-3-1/" }],
  },
  {
    id: "llama-3-1-70b",
    name: "Llama 3.1 70B",
    family: "llama",
    paramsB: 70,
    defaultContext: 128000,
    sources: [{ label: "Meta AI", url: "https://ai.meta.com/blog/meta-llama-3-1/" }],
  },
  {
    id: "mistral-7b",
    name: "Mistral 7B",
    family: "mistral",
    paramsB: 7,
    defaultContext: 8192,
    sources: [{ label: "Mistral AI", url: "https://mistral.ai/news/announcing-mistral-7b/" }],
  },
  {
    id: "mixtral-8x7b",
    name: "Mixtral 8x7B",
    family: "mistral",
    paramsB: 46.7,
    defaultContext: 32768,
    sources: [{ label: "Mistral AI", url: "https://mistral.ai/news/mixtral-of-experts/" }],
  },
  {
    id: "mixtral-8x22b",
    name: "Mixtral 8x22B",
    family: "mistral",
    paramsB: 141,
    defaultContext: 65536,
    sources: [{ label: "Mistral AI", url: "https://mistral.ai/news/mixtral-8x22b/" }],
  },
  {
    id: "qwen-2-5-7b",
    name: "Qwen2.5 7B",
    family: "qwen",
    paramsB: 7.61,
    defaultContext: 131072,
    sources: [{ label: "Qwen Team", url: "https://qwenlm.github.io/blog/qwen2.5/" }],
  },
  {
    id: "qwen-2-5-14b",
    name: "Qwen2.5 14B",
    family: "qwen",
    paramsB: 14.7,
    defaultContext: 131072,
    sources: [{ label: "Qwen Team", url: "https://qwenlm.github.io/blog/qwen2.5/" }],
  },
  {
    id: "qwen-2-5-32b",
    name: "Qwen2.5 32B",
    family: "qwen",
    paramsB: 32.5,
    defaultContext: 131072,
    sources: [{ label: "Qwen Team", url: "https://qwenlm.github.io/blog/qwen2.5/" }],
  },
  {
    id: "qwen-2-5-72b",
    name: "Qwen2.5 72B",
    family: "qwen",
    paramsB: 72,
    defaultContext: 128000,
    sources: [{ label: "Qwen Team", url: "https://qwenlm.github.io/blog/qwen2.5/" }],
  },
  {
    id: "deepseek-r1-distill-32b",
    name: "DeepSeek R1 Distill 32B",
    family: "deepseek",
    paramsB: 32,
    defaultContext: 32768,
    sources: [{ label: "DeepSeek AI", url: "https://github.com/deepseek-ai/DeepSeek-R1" }],
  },
  {
    id: "gpt-oss-20b",
    name: "GPT-OSS 20B",
    family: "other",
    paramsB: 21,
    defaultContext: 128000,
    notes:
      "MoE model (active ~21B). VRAM depends heavily on quantization + context; see source for detailed requirements.",
    sources: [{ label: "apxml model card", url: "https://apxml.com/models/gpt-oss-20b" }],
  },
  {
    id: "gpt-oss-120b",
    name: "GPT-OSS 120B",
    family: "other",
    paramsB: 117,
    defaultContext: 128000,
    notes:
      "MoE model (active ~117B). Typically multi-GPU for FP16; quantization required for single-GPU attempts.",
    sources: [{ label: "apxml model card", url: "https://apxml.com/models/gpt-oss-120b" }],
  },
];

export type BenchmarkPoint = {
  id: string;
  gpuId: string;
  modelId: string;
  context: number;
  precision: "fp16" | "int8" | "int4";
  mode: "single" | "throughput";
  batchSize: number;
  concurrency: number;
  prefillTps?: number;
  decodeTps: number;
  source?: { label: string; url: string; date?: string };
};

export const BENCHMARKS: BenchmarkPoint[] = [
  // RTX 4090 benchmarks
  {
    id: "bench-rtx4090-llama8b-fp16-single",
    gpuId: "rtx-4090",
    modelId: "llama-3-1-8b",
    context: 4096,
    precision: "fp16",
    mode: "single",
    batchSize: 1,
    concurrency: 1,
    prefillTps: 900,
    decodeTps: 110,
    source: {
      label: "ermolushka vLLM Benchmark (FP16 baseline)",
      url: "https://ermolushka.github.io/posts/vllm-benchmark-4090/",
      date: "2024-09",
    },
  },
  {
    id: "bench-rtx4090-llama8b-awq-single",
    gpuId: "rtx-4090",
    modelId: "llama-3-1-8b",
    context: 4096,
    precision: "int4",
    mode: "single",
    batchSize: 1,
    concurrency: 1,
    prefillTps: 4500,
    decodeTps: 579,
    source: {
      label: "ermolushka vLLM Benchmark (AWQ 4-bit)",
      url: "https://ermolushka.github.io/posts/vllm-benchmark-4090/",
      date: "2024-09",
    },
  },
  {
    id: "bench-rtx4090-llama8b-gptq-single",
    gpuId: "rtx-4090",
    modelId: "llama-3-1-8b",
    context: 4096,
    precision: "int4",
    mode: "single",
    batchSize: 1,
    concurrency: 1,
    prefillTps: 4650,
    decodeTps: 599,
    source: {
      label: "ermolushka vLLM Benchmark (GPTQ 4-bit)",
      url: "https://ermolushka.github.io/posts/vllm-benchmark-4090/",
      date: "2024-09",
    },
  },
  // RTX 5090 benchmarks
  {
    id: "bench-rtx5090-qwen7b-single",
    gpuId: "rtx-5090",
    modelId: "qwen-2-5-7b",
    context: 4096,
    precision: "fp16",
    mode: "single",
    batchSize: 1,
    concurrency: 1,
    prefillTps: 7000,
    decodeTps: 220,
    source: {
      label: "Introl LLM Hardware Guide (estimated from throughput data)",
      url: "https://introl.com/blog/local-llm-hardware-pricing-guide-2025",
      date: "2025-08",
    },
  },
  // A100 benchmarks
  {
    id: "bench-a100-80gb-llama8b-fp16-single",
    gpuId: "a100-80gb",
    modelId: "llama-3-1-8b",
    context: 2048,
    precision: "fp16",
    mode: "single",
    batchSize: 1,
    concurrency: 1,
    prefillTps: 2100,
    decodeTps: 120,
    source: {
      label: "Ori H100 vs A100 Benchmark",
      url: "https://www.ori.co/blog/benchmarking-llama-3.1-8b-instruct-on-nvidia-h100-and-a100-chips-with-the-vllm-inferencing-engine",
    },
  },
  {
    id: "bench-a100-80gb-llama70b-fp16-single",
    gpuId: "a100-80gb",
    modelId: "llama-3-1-70b",
    context: 4096,
    precision: "fp16",
    mode: "single",
    batchSize: 1,
    concurrency: 1,
    prefillTps: 420,
    decodeTps: 35,
    source: {
      label: "Introl LLM Hardware Guide (A100 80GB dual GPU)",
      url: "https://introl.com/blog/local-llm-hardware-pricing-guide-2025",
      date: "2025-08",
    },
  },
  // H100 benchmarks
  {
    id: "bench-h100-sxm-llama8b-fp16-single",
    gpuId: "h100-sxm",
    modelId: "llama-3-1-8b",
    context: 2048,
    precision: "fp16",
    mode: "single",
    batchSize: 1,
    concurrency: 1,
    prefillTps: 8000,
    decodeTps: 250,
    source: {
      label: "Ori H100 vs A100 Benchmark",
      url: "https://www.ori.co/blog/benchmarking-llama-3.1-8b-instruct-on-nvidia-h100-and-a100-chips-with-the-vllm-inferencing-engine",
    },
  },
  {
    id: "bench-h100-sxm-llama8b-throughput",
    gpuId: "h100-sxm",
    modelId: "llama-3-1-8b",
    context: 4096,
    precision: "fp16",
    mode: "throughput",
    batchSize: 16,
    concurrency: 16,
    prefillTps: 12000,
    decodeTps: 2400,
    source: {
      label: "vLLM v0.6.0 Performance Update",
      url: "https://blog.vllm.ai/2024/09/05/perf-update.html",
      date: "2024-09-05",
    },
  },
  {
    id: "bench-h100-sxm-llama70b-fp16-tp4",
    gpuId: "h100-sxm",
    modelId: "llama-3-1-70b",
    context: 4096,
    precision: "fp16",
    mode: "throughput",
    batchSize: 8,
    concurrency: 8,
    prefillTps: 3500,
    decodeTps: 180,
    source: {
      label: "Hyperstack H100 Benchmark (4x H100 tensor parallel)",
      url: "https://www.hyperstack.cloud/technical-resources/performance-benchmarks/llm-inference-benchmark-comparing-nvidia-a100-nvlink-vs-nvidia-h100-sxm",
      date: "2025-09",
    },
  },
];
