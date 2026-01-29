import gpuSpecsJson from '@/data/gpu_specs.json';
import modelSpecsJson from '@/data/model_specs.json';
import benchmarksJson from '@/data/benchmarks.json';

export type GpuTier = "consumer" | "workstation" | "datacenter";
export type GpuSpec = {
  id: string;
  name: string;
  tier: GpuTier;
  vramGB: number;
  memoryBandwidthGBs?: number;
  fp16Tflops?: number;
  notes?: string;
  sources?: { label: string; url: string; date?: string }[];
};

export type ModelFamily = "llama" | "mistral" | "qwen" | "deepseek" | "other";
export type ModelSpec = {
  id: string;
  name: string;
  family: ModelFamily;
  paramsB: number;
  defaultContext: number;
  notes?: string;
  sources?: { label: string; url: string; date?: string }[];
};

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

export const GPU_SPECS: GpuSpec[] = gpuSpecsJson;
export const MODEL_SPECS: ModelSpec[] = modelSpecsJson;
export const BENCHMARKS: BenchmarkPoint[] = benchmarksJson;