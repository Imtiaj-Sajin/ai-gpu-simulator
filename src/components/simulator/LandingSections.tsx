// src/components/simulator/LandingSections.tsx
'use client';
import type { ReactNode } from "react";
import { BENCHMARKS, GPU_SPECS, MODEL_SPECS } from "@/data/simulatorDataset";
import { estimatePerformance, type Precision } from "@/lib/sim/estimator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Cpu, Database, ExternalLink, Gauge, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionAnimator, type AnimationType } from "@/components/animator/SectionAnimator";

type SectionVariant = "a" | "b" | "c" | "d";
type AsideKind = "none" | "motif" | "image-a" | "image-b" | "image-c";

function ScrollStack({ children, className }: { children: ReactNode[]; className?: string }) {
  return (
    <div className={cn("scroll-stack", className)}>
      {children.map((child, i) => (
        <div key={i} className="scroll-stack-panel">
          <div className="scroll-stack-sticky" style={{ zIndex: children.length - i }}>
            <div className={cn("relative", i > 0 && "animate-fade-in")}>{child}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function SectionShell({ variant, children, className }: { variant: SectionVariant; children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl bg-white/10 px-4 py-10 shadow-soft backdrop-blur-xl border sm:px-8 md:px-10 md:py-12",
        className,
      )}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
}

function LandingSection({
  id,
  className,
  eyebrow,
  title,
  description,
  variant,
  layout = "left",
  aside = "motif",
  animation,
  children,
}: {
  id?: string;
  className?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  variant: SectionVariant;
  layout?: "left" | "right";
  aside?: AsideKind;
  animation?: AnimationType;
  children: ReactNode;
}) {
  const hasAsideImage = aside === "image-a" || aside === "image-b" || aside === "image-c";
  
  const asideNode = (() => {
    if (!hasAsideImage) return null;
    
    let src = "";
    if (aside === "image-a") src = "/landing/section-aside2.jpg";
    else if (aside === "image-b") src = "/landing/section-aside5.png";
    else if (aside === "image-c") src = "/landing/section5.jpg";

    return (
      <div className="mt-6 overflow-hidden rounded-2xl border bg-white/50 p-2 backdrop-blur-md">
        <img src={src} alt="Decorative section visual" className="h-full w-full rounded-xl object-cover" loading="lazy" />
      </div>
    );
  })();
  return (
    <section id={id} className={cn("scroll-mt-24", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 my-32">
        <div
          className={cn(
            hasAsideImage && "grid items-start gap-8 lg:grid-cols-[1fr_360px]",
            hasAsideImage && layout === "right" && "lg:grid-cols-[360px_1fr]",
          )}
        >
          <div className={cn(hasAsideImage ? layout === "right" && "lg:order-2" : "mx-auto w-full")}>
            <SectionShell variant={variant} className="panel-card">
              {animation && (
                <div className="absolute top-6 right-6 hidden md:block">
                  <SectionAnimator type={animation} />
                </div>
              )}
              <header className="mx-auto   text-left">
                {eyebrow ? (
                  <div className="text-xs font-medium uppercase tracking-[0.22em] text-gray-500">{eyebrow}</div>
                ) : null}
                <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl text-gray-900">{title}</h2>
                {description ? (
                  <p className="mt-3 text-pretty text-sm text-gray-500 sm:text-base">{description}</p>
                ) : null}
              </header>
              <div className="mt-8">{children}</div>
            </SectionShell>
          </div>
          {asideNode ? (
            <aside className={cn("hidden lg:block", layout === "right" && "lg:order-1")}>
              <div className={cn("panel-aside")}>{asideNode}</div>
            </aside>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function HowItWorksInline({
  selectedGpuName,
  selectedModelName,
  precisionLabel,
}: {
  selectedGpuName?: string;
  selectedModelName?: string;
  precisionLabel: string;
}) {
  const steps = [
    {
      icon: Cpu,
      title: "Pick hardware + model",
      text: `Choose a GPU (${selectedGpuName ?? "…"}) and a model (${selectedModelName ?? "…"}).`,
      badge: "Inputs",
    },
    {
      icon: ShieldCheck,
      title: "VRAM fit check",
      text: "We estimate weights + KV-cache + overhead for your context length and precision. If it won't fit, we warn and stop.",
      badge: "Safety",
    },
    {
      icon: Database,
      title: "Benchmark-first matching",
      text: "If we have a benchmark datapoint for your GPU/model/precision/mode, we use it. If not, we scale from the closest match.",
      badge: "Data",
    },
    {
      icon: Gauge,
      title: "Conservative caps",
      text: `We clamp outputs to avoid unrealistic tok/s. Precision (${precisionLabel}) affects both speed and VRAM needs.`,
      badge: "Realism",
    },
  ];
  return (
    <div className="grid gap-4 lg:grid-cols-4">
      {steps.map((s, idx) => (
        <Card key={s.title} className="shadow-soft bg-white/50 backdrop-blur-md">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <Badge variant="secondary" className="bg-gray-100 text-gray-600">{s.badge}</Badge>
              <div className="text-xs text-gray-500">Step {idx + 1}</div>
            </div>
            <CardTitle className="mt-3 flex items-center gap-2 text-base text-gray-900">
              <s.icon className="h-4 w-4 text-gray-600" />
              {s.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-500">{s.text}</CardContent>
        </Card>
      ))}
    </div>
  );
}

function bytesPerParam(p: Precision) {
  return p === "fp16" ? 2.0 : p === "int8" ? 1.0 : 0.5;
}

function kvMultiplier(p: Precision) {
  return p === "fp16" ? 0.8 : p === "int8" ? 0.6 : 0.5;
}

function FormulasInline({ precision, context, estimate }: { precision: Precision; context: number; estimate: ReturnType<typeof estimatePerformance> }) {
  const bpp = bytesPerParam(precision);
  const kvm = kvMultiplier(precision);
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="shadow-soft bg-white/50 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-base text-gray-900">VRAM (fit check)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-gray-500">
          <div className="rounded-md border bg-gray-50 p-3 font-mono text-xs text-gray-900">
            weightsGB = paramsB × {bpp}
            <br />
            kvGB = paramsB × (context/4096) × {kvm}
            <br />
            overheadGB = max(2, weightsGB × 0.25)
            <br />
            requiredGB = weightsGB + kvGB + overheadGB
          </div>
          <div className="text-xs">
            Current context: <span className="text-gray-900">{context.toLocaleString()}</span> tokens; precision:{" "}
            <span className="text-gray-900">{precision.toUpperCase()}</span>.
          </div>
          {estimate.vram?.requiredGB ? (
            <div className="text-xs">
              Current requirement estimate:{" "}
              <span className="text-gray-900">~{estimate.vram.requiredGB.toFixed(1)}GB</span>
            </div>
          ) : null}
        </CardContent>
      </Card>
      <Card className="shadow-soft bg-white/50 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-base text-gray-900">Speed (decode)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-gray-500">
          <div className="rounded-md border bg-gray-50 p-3 font-mono text-xs text-gray-900">
            decodeTps ≈ min(bwScore, tfScore)
            <br />
            ÷ (paramsB/8)^0.78
            <br />
            × architectureMultiplier
            <br />
            × precisionMultiplier
            <br />
            clamped by size-caps
          </div>
          <div className="text-xs">When a matching benchmark exists, we use it first (then apply conservative caps).</div>
        </CardContent>
      </Card>
      <Card className="shadow-soft bg-white/50 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-base text-gray-900">TTFT + Total time</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-gray-500">
          <div className="rounded-md border bg-gray-50 p-3 font-mono text-xs text-gray-900">
            ttftSeconds = inputTokens / prefillTps
            <br />
            genSeconds = outputTokens / decodeTps
            <br />
            totalSeconds = ttftSeconds + genSeconds
          </div>
          <div className="text-xs">Shown on the simulator cards in real-time.</div>
        </CardContent>
      </Card>
    </div>
  );
}

function GpuSpecsTableInline({ selectedGpuId }: { selectedGpuId: string }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-semibold tracking-tight text-gray-900">GPU specs</div>
        <Badge variant="secondary" className="bg-gray-100 text-gray-600">{GPU_SPECS.length} GPUs</Badge>
      </div>
      <div className="rounded-2xl border bg-white/50 shadow-soft backdrop-blur-md">
        <div className="max-h-[520px] overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-gray-900">GPU</TableHead>
                <TableHead className="text-right text-gray-900">VRAM</TableHead>
                <TableHead className="text-right text-gray-900">BW</TableHead>
                <TableHead className="text-right text-gray-900">FP16</TableHead>
                <TableHead className="text-gray-900">Sources</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {GPU_SPECS.map((g) => {
                const selected = g.id === selectedGpuId;
                return (
                  <TableRow key={g.id} className={cn("transition-colors", selected && "bg-gray-100")}>
                    <TableCell>
                      <div className="font-medium text-gray-900">{g.name}</div>
                      <div className="text-xs text-gray-500">
                        {g.tier} · {g.architecture ?? "–"}
                      </div>
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-gray-900">{g.vramGB}GB</TableCell>
                    <TableCell className="text-right tabular-nums text-gray-900">
                      {typeof g.memoryBandwidthGBs === "number" ? `${g.memoryBandwidthGBs.toFixed(0)} GB/s` : "–"}
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-gray-900">
                      {typeof g.fp16Tflops === "number" ? `${g.fp16Tflops.toFixed(0)} TF` : "–"}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        {(g.sources ?? []).slice(0, 2).map((s) => (
                          <a
                            key={s.url}
                            href={s.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-pink-600 hover:text-pink-800 transition-colors"
                          >
                            {s.label}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

function ModelSpecsTableInline({ selectedModelId }: { selectedModelId: string }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-semibold tracking-tight text-gray-900">Model specs</div>
        <Badge variant="secondary" className="bg-gray-100 text-gray-600">{MODEL_SPECS.length} models</Badge>
      </div>
      <div className="rounded-2xl border bg-white/50 shadow-soft backdrop-blur-md">
        <div className="max-h-[520px] overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-gray-900">Model</TableHead>
                <TableHead className="text-right text-gray-900">Params</TableHead>
                <TableHead className="text-right text-gray-900">Context</TableHead>
                <TableHead className="text-gray-900">Sources</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MODEL_SPECS.map((m) => {
                const selected = m.id === selectedModelId;
                return (
                  <TableRow key={m.id} className={cn("transition-colors", selected && "bg-gray-100")}>
                    <TableCell>
                      <div className="font-medium text-gray-900">{m.name}</div>
                      <div className="text-xs text-gray-500">{m.family}</div>
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-gray-900">{m.paramsB}B</TableCell>
                    <TableCell className="text-right tabular-nums text-gray-900">{(m.defaultContext / 1000).toFixed(0)}K</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        {(m.sources ?? []).slice(0, 2).map((s) => (
                          <a
                            key={s.url}
                            href={s.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-pink-600 hover:text-pink-800 transition-colors"
                          >
                            {s.label}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

function BenchmarksTableInline({ selectedGpuId, selectedModelId }: { selectedGpuId: string; selectedModelId: string }) {
  const gpuName = (id: string) => GPU_SPECS.find((g) => g.id === id)?.name ?? id;
  const modelName = (id: string) => MODEL_SPECS.find((m) => m.id === id)?.name ?? id;
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-semibold tracking-tight text-gray-900">Benchmarks</div>
        <Badge variant="secondary" className="bg-gray-100 text-gray-600">{BENCHMARKS.length} datapoints</Badge>
      </div>
      <div className="rounded-2xl border bg-white/50 shadow-soft backdrop-blur-md">
        <div className="max-h-[520px] overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-gray-900">GPU</TableHead>
                <TableHead className="text-gray-900">Model</TableHead>
                <TableHead className="text-right text-gray-900">Ctx</TableHead>
                <TableHead className="text-gray-900">Prec</TableHead>
                <TableHead className="text-gray-900">Mode</TableHead>
                <TableHead className="text-right text-gray-900">Prefill</TableHead>
                <TableHead className="text-right text-gray-900">Decode</TableHead>
                <TableHead className="text-gray-900">Source</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {BENCHMARKS.map((b) => {
                const selected = b.gpuId === selectedGpuId || b.modelId === selectedModelId;
                return (
                  <TableRow key={b.id} className={cn("transition-colors", selected && "bg-gray-100")}>
                    <TableCell className="font-medium text-gray-900">{gpuName(b.gpuId)}</TableCell>
                    <TableCell className="text-gray-900">{modelName(b.modelId)}</TableCell>
                    <TableCell className="text-right tabular-nums text-gray-900">{(b.context / 1000).toFixed(0)}K</TableCell>
                    <TableCell className="uppercase text-gray-900">{b.precision}</TableCell>
                    <TableCell className="text-gray-900">{b.mode}</TableCell>
                    <TableCell className="text-right tabular-nums text-gray-900">
                      {typeof b.prefillTps === "number" ? b.prefillTps.toFixed(0) : "–"}
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-gray-900">{b.decodeTps.toFixed(1)}</TableCell>
                    <TableCell>
                      {b.source ? (
                        <a
                          href={b.source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-pink-600 hover:text-pink-800 transition-colors"
                        >
                          {b.source.label}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        "–"
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

function PerformanceBenchmarksInline() {
  return (
    <Card className="shadow-soft bg-white/50 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-900">
          Performance Benchmarks
          <Badge variant="secondary" className="bg-gray-100 text-gray-600">10+ Datapoints</Badge>
        </CardTitle>
        <CardDescription className="text-gray-500">Real-world inference benchmarks from vLLM, TensorRT-LLM, and research papers</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 text-gray-500">
        <div>
          <h4 className="mb-2 font-semibold text-gray-900">Benchmark Sources</h4>
          <ul className="grid gap-2 text-sm md:grid-cols-2">
            <li className="rounded-md border bg-gray-50 p-2">
              <div className="font-medium text-gray-900">vLLM Benchmarks</div>
              <div className="text-xs text-gray-500">Official vLLM performance data for H100, A100, RTX series</div>
            </li>
            <li className="rounded-md border bg-gray-50 p-2">
              <div className="font-medium text-gray-900">Community Research</div>
              <div className="text-xs text-gray-500">ermolushka, Introl, Hyperstack benchmark studies</div>
            </li>
            <li className="rounded-md border bg-gray-50 p-2">
              <div className="font-medium text-gray-900">NVIDIA TensorRT-LLM</div>
              <div className="text-xs text-gray-500">Optimized inference benchmarks with FP8/INT8/INT4 quantization</div>
            </li>
            <li className="rounded-md border bg-gray-50 p-2">
              <div className="font-medium text-gray-900">Academic Papers</div>
              <div className="text-xs text-gray-500">Hardware acceleration research (arxiv.org)</div>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="mb-2 font-semibold text-gray-900">Key Findings</h4>
          <div className="space-y-2 rounded-md bg-gray-50 p-3 text-sm">
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
          <h4 className="mb-2 font-semibold text-gray-900">Methodology Notes</h4>
          <ul className="space-y-1 text-xs text-gray-500">
            <li>• Benchmarks use vLLM, TensorRT-LLM, or Ollama frameworks</li>
            <li>• Throughput measured in tokens per second (tok/s)</li>
            <li>• Single-user mode: batch size 1, concurrency 1</li>
            <li>• Throughput mode: optimized batching and concurrent requests</li>
            <li>• Quantization (INT8/INT4) often improves speed and reduces VRAM needs</li>
            <li>• Context length impacts prefill time; decode speed remains stable</li>
          </ul>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href="https://blog.vllm.ai/2024/09/05/perf-update.html"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-pink-600 hover:text-pink-800 transition-colors"
          >
            vLLM v0.6.0 Performance
            <ExternalLink className="h-3 w-3" />
          </a>
          <a
            href="https://ermolushka.github.io/posts/vllm-benchmark-4090/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-pink-600 hover:text-pink-800 transition-colors"
          >
            RTX 4090 Study
            <ExternalLink className="h-3 w-3" />
          </a>
          <a
            href="https://developer.nvidia.com/blog/achieving-top-inference-performance-with-the-nvidia-h100-tensor-core-gpu-and-nvidia-tensorrt-llm/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-pink-600 hover:text-pink-800 transition-colors"
          >
            H100 TensorRT-LLM
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
}

function EstimationMethodologyInline() {
  return (
    <Card className="shadow-soft bg-white/50 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-gray-900">Estimation Methodology</CardTitle>
        <CardDescription className="text-gray-500">How we calculate performance for configurations without benchmark data</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-gray-500">
        <div>
          <h4 className="font-semibold text-gray-900">Confidence Levels</h4>
          <ul className="mt-1 space-y-1">
            <li>
              <Badge variant="default" className="mr-2 bg-gray-100 text-gray-600">
                High
              </Badge>
              Exact match from published benchmark
            </li>
            <li>
              <Badge variant="secondary" className="mr-2 bg-gray-100 text-gray-600">
                Medium
              </Badge>
              Interpolated from similar configurations
            </li>
            <li>
              <Badge variant="outline" className="mr-2 bg-gray-100 text-gray-600">
                Low
              </Badge>
              Spec-based estimate (GPU tier, VRAM, model size)
            </li>
          </ul>
        </div>
        <div className="rounded-md bg-gray-50 p-3 text-xs">
          <p className="font-medium text-gray-900">Estimation Factors:</p>
          <ul className="mt-1 space-y-1">
            <li>• GPU tier and architecture (consumer/workstation/datacenter)</li>
            <li>• Memory bandwidth and VRAM capacity</li>
            <li>• Model parameter count and context window size</li>
            <li>• Precision (FP16 vs INT8 vs INT4) and quantization method</li>
            <li>• Workload mode (single-user vs throughput optimization)</li>
            <li>• Batch size and concurrency settings</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export function LandingSections({ selectedGpuId, selectedModelId, precision, context, estimate }: {
  selectedGpuId: string;
  selectedModelId: string;
  precision: Precision;
  context: number;
  estimate: ReturnType<typeof estimatePerformance>;
}) {
  const selectedGpu = GPU_SPECS.find((g) => g.id === selectedGpuId);
  const selectedModel = MODEL_SPECS.find((m) => m.id === selectedModelId);
  const precisionLabel = precision === "fp16" ? "FP16" : precision === "int8" ? "INT8" : "INT4";

  return (
    <div className="pb-16 pt-14">
      <ScrollStack>
        <LandingSection
          id="how-it-works"
          eyebrow="Overview"
          title="How the simulator works (step-by-step)"
          description="Benchmark-first when possible; conservative spec-based fallbacks when data is missing."
          variant="a"
          layout="left"
          aside="motif"
          animation="process"
        >
          <HowItWorksInline
            selectedGpuName={selectedGpu?.name}
            selectedModelName={selectedModel?.name}
            precisionLabel={precisionLabel}
          />
        </LandingSection>
        <LandingSection
          id="formulas"
          eyebrow="Math"
          title="Formulas & assumptions"
          description="These are the same rules the simulator uses behind the scenes."
          variant="b"
          layout="right"
          aside="motif"
          animation="math"
        >
          <FormulasInline precision={precision} context={context} estimate={estimate} />
        </LandingSection>
        <LandingSection
          id="gpu-specs"
          eyebrow="Dataset"
          title="GPU specs (with sources)"
          description="Everything we know about GPUs. Your selected GPU is highlighted."
          variant="c"
          layout="left"
          aside="image-a"
          animation="chip"
        >
          <GpuSpecsTableInline selectedGpuId={selectedGpuId} />
        </LandingSection>
        <LandingSection
          id="model-specs"
          eyebrow="Dataset"
          title="Model specs (with sources)"
          description="Everything we know about models. Your selected model is highlighted."
          variant="d"
          layout="right"
          aside="image-b"
          animation="neural"
        >
          <ModelSpecsTableInline selectedModelId={selectedModelId} />
        </LandingSection>
        <LandingSection
          id="benchmarks"
          eyebrow="Evidence"
          title="Benchmarks in the dataset"
          description="Rows related to your selection are highlighted."
          variant="a"
          layout="left"
          aside="image-c"
          animation="chart"
        >
          <BenchmarksTableInline selectedGpuId={selectedGpuId} selectedModelId={selectedModelId} />
        </LandingSection>
        <LandingSection
          id="methodology"
          eyebrow="Method"
          title="Performance benchmark findings"
          description="What real-world inference benchmarks show across frameworks and GPUs."
          variant="b"
          layout="right"
          aside="motif"
          animation="scan"
        >
          <PerformanceBenchmarksInline />
        </LandingSection>
        <LandingSection
          id="estimation-methodology"
          eyebrow="Method"
          title="Estimation methodology"
          description="How we estimate performance when there's no exact benchmark match."
          variant="c"
          layout="left"
          aside="motif"
          animation="rain"
        >
          <EstimationMethodologyInline />
        </LandingSection>
      </ScrollStack>
    </div>
  );
}