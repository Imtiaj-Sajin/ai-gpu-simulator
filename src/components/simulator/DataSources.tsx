// src/components/simulator/DataSources.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ExternalLink, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function DataSources() {
  const [openGpu, setOpenGpu] = useState(false);
  const [openModel, setOpenModel] = useState(false);
  const [openBenchmark, setOpenBenchmark] = useState(false);

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Data Sources & Methodology</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          All estimates are based on verified benchmarks from published sources. Hover over performance metrics to see
          citations.
        </p>
      </div>

      {/* GPU Specifications */}
      <Collapsible open={openGpu} onOpenChange={setOpenGpu}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  GPU Specifications
                  <Badge variant="secondary">11 GPUs</Badge>
                </CardTitle>
                <CardDescription>Hardware specs from manufacturer datasheets and verified databases</CardDescription>
              </div>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  <ChevronDown className={`h-4 w-4 transition-transform ${openGpu ? "rotate-180" : ""}`} />
                </Button>
              </CollapsibleTrigger>
            </div>
          </CardHeader>
          <CollapsibleContent>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="mb-2 font-semibold">Consumer GPUs</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="font-medium">RTX 50 Series:</span>
                      <span className="text-muted-foreground">Blackwell architecture (5090, 5080, 5070 Ti)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-medium">RTX 40 Series:</span>
                      <span className="text-muted-foreground">Ada Lovelace architecture (4090, 4080 Super, 4070 Ti Super)</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="mb-2 font-semibold">Datacenter GPUs</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="font-medium">H100:</span>
                      <span className="text-muted-foreground">Hopper architecture (SXM & PCIe variants)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-medium">A100:</span>
                      <span className="text-muted-foreground">Ampere architecture (80GB)</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="mt-4 rounded-md bg-muted p-3 text-xs">
                <p className="font-medium">Key Metrics Tracked:</p>
                <ul className="mt-1 space-y-1 text-muted-foreground">
                  <li>• VRAM capacity (16GB - 96GB range)</li>
                  <li>• Memory bandwidth (672 GB/s - 3350 GB/s)</li>
                  <li>• FP16 TFLOPS (38 - 1979 TFLOPS)</li>
                  <li>• Architecture-specific features (Tensor Cores, RT Cores)</li>
                </ul>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <a
                  href="https://www.techpowerup.com/gpu-specs/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  TechPowerUp GPU Database
                  <ExternalLink className="h-3 w-3" />
                </a>
                <a
                  href="https://www.nvidia.com/en-us/data-center/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  NVIDIA Official Specs
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Model Specifications */}
      <Collapsible open={openModel} onOpenChange={setOpenModel}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  LLM Model Specifications
                  <Badge variant="secondary">10 Models</Badge>
                </CardTitle>
                <CardDescription>Model parameters and context windows from official releases</CardDescription>
              </div>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  <ChevronDown className={`h-4 w-4 transition-transform ${openModel ? "rotate-180" : ""}`} />
                </Button>
              </CollapsibleTrigger>
            </div>
          </CardHeader>
          <CollapsibleContent>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="mb-2 font-semibold">Model Families</h4>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <span className="font-medium">Llama 3.1:</span> 8B, 70B (128K context)
                    </li>
                    <li>
                      <span className="font-medium">Mistral/Mixtral:</span> 7B, 8x7B, 8x22B
                    </li>
                    <li>
                      <span className="font-medium">Qwen2.5:</span> 7B, 14B, 32B, 72B (131K context)
                    </li>
                    <li>
                      <span className="font-medium">DeepSeek:</span> R1 Distill 32B
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="mb-2 font-semibold">Size Range</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>Smallest: 7B parameters</li>
                    <li>Largest: 141B parameters (Mixtral 8x22B)</li>
                    <li>Context: 8K - 131K tokens</li>
                    <li>VRAM requirements: 4GB (int4) - 282GB (fp16)</li>
                  </ul>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <a
                  href="https://ai.meta.com/blog/meta-llama-3-1/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  Meta Llama
                  <ExternalLink className="h-3 w-3" />
                </a>
                <a
                  href="https://mistral.ai/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  Mistral AI
                  <ExternalLink className="h-3 w-3" />
                </a>
                <a
                  href="https://qwenlm.github.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  Qwen Team
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Benchmark Data */}
      <Collapsible open={openBenchmark} onOpenChange={setOpenBenchmark}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  Performance Benchmarks
                  <Badge variant="secondary">10+ Datapoints</Badge>
                </CardTitle>
                <CardDescription>Real-world inference benchmarks from vLLM, TensorRT-LLM, and research papers</CardDescription>
              </div>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  <ChevronDown className={`h-4 w-4 transition-transform ${openBenchmark ? "rotate-180" : ""}`} />
                </Button>
              </CollapsibleTrigger>
            </div>
          </CardHeader>
          <CollapsibleContent>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="mb-2 font-semibold">Benchmark Sources</h4>
                  <ul className="grid gap-2 text-sm md:grid-cols-2">
                    <li className="rounded-md border p-2">
                      <div className="font-medium">vLLM Benchmarks</div>
                      <div className="text-xs text-muted-foreground">Official vLLM performance data for H100, A100, RTX series</div>
                    </li>
                    <li className="rounded-md border p-2">
                      <div className="font-medium">Community Research</div>
                      <div className="text-xs text-muted-foreground">ermolushka, Introl, Hyperstack benchmark studies</div>
                    </li>
                    <li className="rounded-md border p-2">
                      <div className="font-medium">NVIDIA TensorRT-LLM</div>
                      <div className="text-xs text-muted-foreground">Optimized inference benchmarks with FP8/INT8 quantization</div>
                    </li>
                    <li className="rounded-md border p-2">
                      <div className="font-medium">Academic Papers</div>
                      <div className="text-xs text-muted-foreground">Hardware acceleration research (arxiv.org)</div>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="mb-2 font-semibold">Key Findings</h4>
                  <div className="space-y-2 rounded-md bg-muted p-3 text-sm">
                    <p>
                      <strong>RTX 4090 (FP16):</strong> 110 tok/s decode for Llama 8B → 599 tok/s with GPTQ 4-bit (5.4x speedup)
                    </p>
                    <p>
                      <strong>RTX 5090:</strong> 5,841 tok/s on Qwen2.5-Coder-7B (72% improvement over RTX 4090)
                    </p>
                    <p>
                      <strong>H100 SXM:</strong> 2,400 tok/s throughput for Llama 8B with vLLM 0.6.0 (16 concurrent requests)
                    </p>
                    <p>
                      <strong>H100 vs A100:</strong> 2.8x throughput improvement for Llama 70B (3311 vs 1148 tok/s)
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 font-semibold">Methodology Notes</h4>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    <li>• Benchmarks use vLLM, TensorRT-LLM, or Ollama frameworks</li>
                    <li>• Throughput measured in tokens per second (tok/s)</li>
                    <li>• Single-user mode: batch size 1, concurrency 1</li>
                    <li>• Throughput mode: optimized batching and concurrent requests</li>
                    <li>• Quantization (INT8/INT4) provides 3-6x speedup with minimal quality loss</li>
                    <li>• Context length impacts prefill time; decode speed remains stable</li>
                  </ul>
                </div>

                <div className="flex flex-wrap gap-2">
                  <a
                    href="https://blog.vllm.ai/2024/09/05/perf-update.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    vLLM v0.6.0 Performance
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  <a
                    href="https://ermolushka.github.io/posts/vllm-benchmark-4090/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    RTX 4090 Study
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  <a
                    href="https://developer.nvidia.com/blog/achieving-top-inference-performance-with-the-nvidia-h100-tensor-core-gpu-and-nvidia-tensorrt-llm/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    H100 TensorRT-LLM
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Estimation Methodology */}
      <Card>
        <CardHeader>
          <CardTitle>Estimation Methodology</CardTitle>
          <CardDescription>How we calculate performance for configurations without benchmark data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <h4 className="font-semibold">Confidence Levels</h4>
            <ul className="mt-1 space-y-1 text-muted-foreground">
              <li>
                <Badge variant="default" className="mr-2">
                  High
                </Badge>
                Exact match from published benchmark
              </li>
              <li>
                <Badge variant="secondary" className="mr-2">
                  Medium
                </Badge>
                Interpolated from similar configurations
              </li>
              <li>
                <Badge variant="outline" className="mr-2">
                  Low
                </Badge>
                Spec-based estimate (GPU tier, VRAM, model size)
              </li>
            </ul>
          </div>
          <div className="rounded-md bg-muted p-3 text-xs">
            <p className="font-medium">Estimation Factors:</p>
            <ul className="mt-1 space-y-1">
              <li>• GPU tier and architecture (consumer/workstation/datacenter)</li>
              <li>• Memory bandwidth and VRAM capacity</li>
              <li>• Model parameter count and context window size</li>
              <li>• Precision (FP16 vs INT8) and quantization method</li>
              <li>• Workload mode (single-user vs throughput optimization)</li>
              <li>• Batch size and concurrency settings</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}