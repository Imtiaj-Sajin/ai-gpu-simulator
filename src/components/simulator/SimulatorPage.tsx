// src/components/simulator/SimulatorPage.tsx
'use client';
import type { ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { BENCHMARKS, GPU_SPECS, MODEL_SPECS, type GpuTier, type ModelFamily } from "@/data/simulatorDataset";
import { estimatePerformance, type Precision, type WorkloadMode } from "@/lib/sim/estimator";
import { randomWords } from "@/lib/sim/randomText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowRight, Cpu, Database, ExternalLink, Gauge, Info, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { motion } from 'framer-motion';
import { HeaderDotAnimation } from "@/components/animator/HeaderDotAnimation";
import { Star } from '@solar-icons/react';
import { SectionAnimator, type AnimationType } from "@/components/animator/SectionAnimator";

import {
  Zap,
  Search,
  Inbox,
  Disc,
  LayoutGrid,
  Map,
  Users,
  // Star,
  ChevronDown,
  LayoutTemplate,
  Filter,
  Plus,
  Bell,
  PanelLeft,
  CheckCircle2,
  Circle,
  Layout,
  FileText,
  Hash,
  Download
} from 'lucide-react';
import { SimulatingStatus } from "../animator/SimulatingStatus";

type SectionVariant = "a" | "b" | "c" | "d";
type AsideKind = "none" | "motif" | "image-a" | "image-b" | "image-c";
type RunState = "idle" | "prefill" | "streaming" | "done";

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

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
// Update this logic block inside LandingSection function:
  
  const hasAsideImage = aside === "image-a" || aside === "image-b" || aside === "image-c";
  
  const asideNode = (() => {
    if (!hasAsideImage) return null;
    
    // Logic to pick the correct image based on the 'aside' prop
    let src = "";
    if (aside === "image-a") src = "/landing/section-aside2.jpg";
    else if (aside === "image-b") src = "/landing/section-aside5.png";
    else if (aside === "image-c") src = "/landing/section5.jpg"; // Your new image

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

                          {/* --- 3. ADD THE ANIMATOR HERE --- */}
              {animation && (
                <div className="absolute top-6 right-6 hidden md:block">
                  <SectionAnimator type={animation} />
                </div>
              )}
              {/* ------------------------------- */}

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
      text: "We estimate weights + KV-cache + overhead for your context length and precision. If it won’t fit, we warn and stop.",
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
                  <TableRow key={b.id} className={cn(selected && "bg-gray-100")}>
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

function FooterInline() {
  return (
    <footer className="py-8 bg-[#F9F9F9]">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex justify-end text-xs text-gray-500">
          credit: <span className="ml-1 text-gray-900">bytelabs</span>
        </div>
      </div>
    </footer>
  );
}

function familyLabel(f: ModelFamily) {
  switch (f) {
    case "llama":
      return "Llama";
    case "mistral":
      return "Mistral / Mixtral";
    case "qwen":
      return "Qwen2.5";
    case "deepseek":
      return "DeepSeek";
    default:
      return "Other";
  }
}

function tierLabel(t: GpuTier) {
  switch (t) {
    case "consumer":
      return "Consumer";
    case "workstation":
      return "Workstation";
    case "datacenter":
      return "Datacenter";
  }
}

function formatSeconds(s: number) {
  if (!Number.isFinite(s)) return "–";
  if (s < 1) return `${s.toFixed(2)}s`;
  if (s < 60) return `${s.toFixed(1)}s`;
  const m = Math.floor(s / 60);
  const r = s - m * 60;
  return `${m}m ${r.toFixed(0)}s`;
}

function confBadge(conf: "high" | "medium" | "low") {
  if (conf === "high") return { variant: "default" as const, text: "High" };
  if (conf === "medium") return { variant: "secondary" as const, text: "Medium" };
  return { variant: "outline" as const, text: "Low" };
}

// --- Background Component (Fixed: Tighter Corners & Clean Center) ---
const Background = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-[#F9F9F9]">
      {/* ===== LEFT WING (Neutral Pastels) ===== */}
      <div
        className="absolute top-0 left-0 h-full w-[28vw] flex"
        style={{
          maskImage:
            'radial-gradient(ellipse at 0% 0%, black 42%, transparent 72%)',
          WebkitMaskImage:
            'radial-gradient(ellipse at 0% 0%, black 42%, transparent 72%)',
        }}
      >
        {[
          '#EFEFEF',
          '#F2F2F2',
          '#F5F5F5',
          '#F7F7F7',
          '#F9F9F9',
          '#FBFBFB',
        ].map((color, i) => (
          <div key={i} className="flex-1" style={{ backgroundColor: color }} />
        ))}
      </div>
      {/* ===== RIGHT WING (Color Pastels) ===== */}
      <div
        className="absolute top-0 right-0 h-full w-[28vw] flex"
        style={{
          maskImage:
            'radial-gradient(ellipse at 100% 0%, black 42%, transparent 72%)',
          WebkitMaskImage:
            'radial-gradient(ellipse at 100% 0%, black 42%, transparent 72%)',
        }}
      >
        {[
          '#EADCF5', // lilac
          '#E6C6E8',
          '#E6B2D6',
          '#F2B0B0',
          '#F4BABA',
          '#F7CACA',
        ].map((color, i) => (
          <div key={i} className="flex-1" style={{ backgroundColor: color }} />
        ))}
      </div>
      {/* ===== CORNER-ONLY NOISE (UNCHANGED, BUT BALANCED) ===== */}
      <div
        className="absolute inset-0 opacity-[0.12] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          maskImage:
            'radial-gradient(circle at 0% 0%, black 28%, transparent 60%), radial-gradient(circle at 100% 0%, black 28%, transparent 60%)',
          WebkitMaskImage:
            'radial-gradient(circle at 0% 0%, black 28%, transparent 60%), radial-gradient(circle at 100% 0%, black 28%, transparent 60%)',
          maskComposite: 'add',
          WebkitMaskComposite: 'add',
        }}
      />
    </div>
  );
};

export default function SimulatorPage() {
  const [gpuId, setGpuId] = useState<string>("rtx-4090");
  const [modelId, setModelId] = useState<string>("llama-3-1-8b");
  const [inputTokens, setInputTokens] = useState<number>(512);
  const [outputTokens, setOutputTokens] = useState<number>(256);
  const [context, setContext] = useState<number>(4096);
  const [precision, setPrecision] = useState<Precision>("fp16");
  const [throughputMode, setThroughputMode] = useState<boolean>(false);
  const [batchSize, setBatchSize] = useState<number>(1);
  const [concurrency, setConcurrency] = useState<number>(1);
  const mode: WorkloadMode = throughputMode ? "throughput" : "single";
  useEffect(() => {
    if (!throughputMode) {
      setBatchSize(1);
      setConcurrency(1);
    }
  }, [throughputMode]);
  const estimate = useMemo(() => {
    return estimatePerformance({
      gpuId,
      modelId,
      inputTokens,
      outputTokens,
      context,
      precision,
      mode,
      batchSize: throughputMode ? batchSize : 1,
      concurrency: throughputMode ? concurrency : 1,
    });
  }, [gpuId, modelId, inputTokens, outputTokens, context, precision, mode, batchSize, concurrency, throughputMode]);
  const [runState, setRunState] = useState<RunState>("idle");
  const [generatedTokens, setGeneratedTokens] = useState<number>(0);
  const [consoleText, setConsoleText] = useState<string>("");
  const prefillTimerRef = useRef<number | null>(null);
  const tickTimerRef = useRef<number | null>(null);
  const streamStartRef = useRef<number>(0);
  const emittedRef = useRef<number>(0);
  const resetTimers = () => {
    if (prefillTimerRef.current) window.clearTimeout(prefillTimerRef.current);
    if (tickTimerRef.current) window.clearInterval(tickTimerRef.current);
    prefillTimerRef.current = null;
    tickTimerRef.current = null;
  };
  const handleReset = () => {
    resetTimers();
    setRunState("idle");
    setGeneratedTokens(0);
    setConsoleText("");
    emittedRef.current = 0;
  };
  const handleStop = () => {
    resetTimers();
    setRunState((s) => (s === "idle" ? "idle" : "done"));
  };
  const startStreaming = () => {
    setRunState("streaming");
    streamStartRef.current = performance.now();
    emittedRef.current = 0;
    setGeneratedTokens(0);
    const tickMs = 60;
    tickTimerRef.current = window.setInterval(() => {
      const now = performance.now();
      const elapsedS = (now - streamStartRef.current) / 1000;
      const target = Math.min(outputTokens, Math.floor(elapsedS * estimate.decodeTps));
      const toEmit = Math.max(0, target - emittedRef.current);
      if (toEmit > 0) {
        emittedRef.current += toEmit;
        setGeneratedTokens(emittedRef.current);
        setConsoleText((prev) => {
          const nextChunk = randomWords(Math.min(toEmit, 24));
          const next = prev ? `${prev} ${nextChunk}` : nextChunk;
          return next.length > 5000 ? next.slice(next.length - 5000) : next;
        });
      }
      if (emittedRef.current >= outputTokens) {
        resetTimers();
        setRunState("done");
      }
    }, tickMs);
  };
  const handleStart = () => {
    handleReset();
    setRunState("prefill");
    setConsoleText("processing prompt…");
    const ttftMs = Math.max(0, Math.round(estimate.ttftSeconds * 1000));
    prefillTimerRef.current = window.setTimeout(() => {
      setConsoleText("");
      startStreaming();
    }, ttftMs);
  };
  useEffect(() => () => resetTimers(), []);
  const gpusByTier = useMemo(() => {
    const map: Record<GpuTier, typeof GPU_SPECS> = { consumer: [], workstation: [], datacenter: [] };
    for (const g of GPU_SPECS) map[g.tier].push(g);
    return map;
  }, []);
  const modelsByFamily = useMemo(() => {
    const map: Record<ModelFamily, typeof MODEL_SPECS> = {
      llama: [],
      mistral: [],
      qwen: [],
      deepseek: [],
      other: [],
    };
    for (const m of MODEL_SPECS) map[m.family].push(m);
    return map;
  }, []);
  const conf = confBadge(estimate.confidence);
  const progress = outputTokens > 0 ? (generatedTokens / outputTokens) * 100 : 0;
  const selectedGpu = GPU_SPECS.find((g) => g.id === gpuId);
  const selectedModel = MODEL_SPECS.find((m) => m.id === modelId);
  const vramFits = estimate.vram?.fits ?? true;
  const vramRequired = estimate.vram?.requiredGB;
  const vramAvailable = estimate.vram?.availableGB;
  const disableStart = runState === "prefill" || runState === "streaming" || !vramFits;
  const precisionLabel = precision === "fp16" ? "FP16" : precision === "int8" ? "INT8" : "INT4";

  return (
    <TooltipProvider delayDuration={200}>
      <div className="min-h-screen bg-[#F9F9F9] font-sans text-gray-900 relative overflow-hidden selection:bg-pink-200/50">
        <Background />
        {/* Navbar */}
        <nav className="relative z-50 px-4 py-5 flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-2 font-bold text-lg tracking-tight text-gray-900 cursor-pointer select-none">
            <Cpu className="w-5 h-5 fill-current" />
            <span>AI x Gpu Simulator</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-[14px] font-medium text-gray-600">
            {['Home', 'How it works', 'Formulas', 'GPU Specs', 'Model Specs', 'Benchmarks'].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} className="hover:text-black transition-colors">{item}</a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button className="hidden sm:block px-4 py-2 text-[13px] font-semibold border border-gray-300 rounded-lg hover:bg-white hover:shadow-sm transition-all bg-white/30 backdrop-blur-sm">
              Join Waitlist
            </button>
            <button className="px-4 py-2 text-[13px] font-semibold bg-[#111] text-white rounded-lg hover:bg-black transition-all shadow-md shadow-black/10">
              Contact Us
            </button>
          </div>
        </nav>
        {/* Hero Section */}
        <main className="relative z-10 pt-12 pb-20 flex flex-col items-center justify-center text-center px-4">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/50 border border-white/50 backdrop-blur-md rounded-full text-[13px] font-medium mb-8 shadow-sm text-gray-600 cursor-default hover:shadow-md transition-shadow"
          >
            <span className="text-pink-600 font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-purple-600">10+</span>
            <span>Benchmarks Used Daily</span>
          </motion.div>
{/* Headlines */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center mb-6 text-center"
          >
            {/* Row 1: Animation + "AI vs GPU" */}
            <div className="flex items-center justify-center gap-4 md:gap-5">
              <div className="relative md:top-1">
                <HeaderDotAnimation />
              </div>
              <h1 className="text-4xl md:text-[64px] font-bold tracking-tight text-[#111] leading-[1.1]">
                AI vs GPU
              </h1>
            </div>

            {/* Row 2: "Performance Simulator" */}
            <h1 className="text-4xl md:text-[64px] font-bold tracking-tight text-[#111] leading-[1.1]">
              Performance Simulator
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-500 mb-8 max-w-xl mx-auto leading-relaxed"
          >
            Estimate inference speed for LLMs on different hardware.
          </motion.p>
          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center gap-6"
          >
{/* <button className="relative h-12 overflow-hidden rounded-xl bg-neutral-950 px-5 py-2.5 text-white transition-all duration-300 hover:bg-neutral-800 hover:ring-2 hover:ring-neutral-800 hover:ring-offset-2"><span className="relative">Start Simulating</span></button> */}
                       <SimulatingStatus />

            <div className="flex items-center gap-2 text-[13px] font-medium text-gray-700">
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                <div className="flex -space-x-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star  weight="Bold" size={12} color='#091419' />
                  ))}
                  {[5].map((s) => (
                    <Star  weight="BoldDuotone" size={12} color='#091419' />
                  ))}
                </div>
              </div>
              <span>4.9 rating <span className="text-gray-400 font-normal">Based on 1 User</span></span>
            </div>
          </motion.div>
          {/* Browser Mockup with Simulator Tool */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-16 w-full max-w-7xl mx-auto p-2 bg-gradient-to-b from-white/40 to-transparent rounded-2xl relative z-20"
          >
            <div className="bg-white w-full rounded-xl border border-gray-200/80 shadow-2xl shadow-gray-200/50 overflow-hidden flex flex-col min-h-[600px]">
              {/* Browser Header */}
              <div className="h-11 border-b border-gray-100 flex items-center px-4 gap-4 bg-white sticky top-0 z-30">
                <div className="flex gap-2 group">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F57] border border-black/5" />
                  <div className="w-3 h-3 rounded-full bg-[#FEBC2E] border border-black/5" />
                  <div className="w-3 h-3 rounded-full bg-[#28C840] border border-black/5" />
                </div>
                <div className="flex gap-4 text-gray-300">
                  <PanelLeft size={16} className="text-gray-400" />
                  <ArrowRight size={16} className="rotate-180" />
                  <ArrowRight size={16} />
                </div>
                <div className="flex-1 max-w-lg mx-auto bg-gray-50 rounded-md flex items-center justify-center gap-2 h-7 text-[11px] text-gray-500 font-medium border border-gray-100/50">
                  <span className="opacity-50">🔒</span>
                  aigpusim.vercel.app/
                  <span className="opacity-50 ml-auto mr-2 rotate-45">📎</span>
                </div>
                <div className="flex gap-3 text-gray-400">
                  <Download size={16} />
                  <Plus size={16} />
                </div>
              </div>
              {/* Simulator UI */}
              <div className="flex-1 flex overflow-auto bg-[#FAFAFA]">
                <div className="w-full max-w-7xl mx-auto px-4 py-8">
                  <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
                    {/* Controls */}
                    <section className="space-y-4">
                      <Card className="bg-white/50 backdrop-blur-md shadow-soft">
                        <CardHeader>
                          <CardTitle className="text-gray-900">Simulator</CardTitle>
                          <CardDescription className="text-gray-500">All PC components are fixed; only the GPU changes.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label className="text-gray-900">GPU</Label>
                            <Select value={gpuId} onValueChange={setGpuId}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select GPU" />
                              </SelectTrigger>
                              <SelectContent className="z-50 bg-white/50 backdrop-blur-md">
                                {(Object.keys(gpusByTier) as GpuTier[]).map((tier) => (
                                  <div key={tier} className="px-2 py-1.5">
                                    <div className="px-2 pb-1 text-xs font-medium text-gray-500">{tierLabel(tier)}</div>
                                    <div className="space-y-1">
                                      {gpusByTier[tier].map((g) => (
                                        <SelectItem key={g.id} value={g.id}>
                                          {g.name}
                                        </SelectItem>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </SelectContent>
                            </Select>
                            {selectedGpu && selectedGpu.sources && selectedGpu.sources.length > 0 && (
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <span>
                                  {selectedGpu.vramGB}GB VRAM, {selectedGpu.memoryBandwidthGBs?.toFixed(0)} GB/s
                                </span>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button className="inline-flex items-center text-pink-600 hover:text-pink-800 transition-colors">
                                      <Info className="h-3 w-3" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent side="right" className="max-w-xs bg-white/50 backdrop-blur-md">
                                    <div className="space-y-2">
                                      <div className="font-semibold text-gray-900">GPU Specifications</div>
                                      <div className="space-y-1 text-xs text-gray-500">
                                        <div>VRAM: {selectedGpu.vramGB}GB</div>
                                        <div>Bandwidth: {selectedGpu.memoryBandwidthGBs?.toFixed(1)} GB/s</div>
                                        <div>FP16: {selectedGpu.fp16Tflops?.toFixed(1)} TFLOPS</div>
                                      </div>
                                      <div className="border-t pt-2">
                                        <div className="mb-1 font-semibold text-gray-900">Sources:</div>
                                        {selectedGpu.sources.map((src, i) => (
                                          <a
                                            key={i}
                                            href={src.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1 text-xs text-pink-600 hover:text-pink-800 transition-colors"
                                          >
                                            {src.label}
                                            <ExternalLink className="h-2.5 w-2.5" />
                                          </a>
                                        ))}
                                      </div>
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label className="text-gray-900">Model</Label>
                            <Select value={modelId} onValueChange={setModelId}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select model" />
                              </SelectTrigger>
                              <SelectContent className="z-50 bg-white/50 backdrop-blur-md">
                                {(Object.keys(modelsByFamily) as ModelFamily[]).map((fam) => (
                                  <div key={fam} className="px-2 py-1.5">
                                    <div className="px-2 pb-1 text-xs font-medium text-gray-500">{familyLabel(fam)}</div>
                                    <div className="space-y-1">
                                      {modelsByFamily[fam].map((m) => (
                                        <SelectItem key={m.id} value={m.id}>
                                          {m.name}
                                        </SelectItem>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </SelectContent>
                            </Select>
                            {selectedModel && (
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <span>
                                  {selectedModel.paramsB}B params, {(selectedModel.defaultContext / 1000).toFixed(0)}K context
                                </span>
                                {selectedModel.sources && selectedModel.sources.length > 0 && (
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <button className="inline-flex items-center text-pink-600 hover:text-pink-800 transition-colors">
                                        <Info className="h-3 w-3" />
                                      </button>
                                    </TooltipTrigger>
                                    <TooltipContent side="right" className="max-w-xs bg-white/50 backdrop-blur-md">
                                      <div className="space-y-2">
                                        <div className="font-semibold text-gray-900">Model Details</div>
                                        <div className="space-y-1 text-xs text-gray-500">
                                          <div>Parameters: {selectedModel.paramsB}B</div>
                                          <div>Context: {(selectedModel.defaultContext / 1000).toFixed(0)}K tokens</div>
                                        </div>
                                        <div className="border-t pt-2">
                                          <div className="mb-1 font-semibold text-gray-900">Sources:</div>
                                          {selectedModel.sources.map((src, i) => (
                                            <a
                                              key={i}
                                              href={src.url}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="flex items-center gap-1 text-xs text-pink-600 hover:text-pink-800 transition-colors"
                                            >
                                              {src.label}
                                              <ExternalLink className="h-2.5 w-2.5" />
                                            </a>
                                          ))}
                                        </div>
                                      </div>
                                    </TooltipContent>
                                  </Tooltip>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                              <Label htmlFor="inputTokens" className="text-gray-900">Input tokens</Label>
                              <Input
                                id="inputTokens"
                                type="number"
                                inputMode="numeric"
                                min={1}
                                value={inputTokens}
                                onChange={(e) => setInputTokens(Number(e.target.value))}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="outputTokens" className="text-gray-900">Output tokens</Label>
                              <Input
                                id="outputTokens"
                                type="number"
                                inputMode="numeric"
                                min={1}
                                value={outputTokens}
                                onChange={(e) => setOutputTokens(Number(e.target.value))}
                              />
                            </div>
                          </div>
                          <Collapsible>
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-sm font-medium text-gray-900">Advanced</div>
                                <div className="text-xs text-gray-500">Workload + context assumptions</div>
                              </div>
                              <CollapsibleTrigger asChild>
                                <Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-100">
                                  Toggle
                                </Button>
                              </CollapsibleTrigger>
                            </div>
                            <CollapsibleContent className="mt-4 space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="context" className="text-gray-900">Context length (tokens)</Label>
                                <Input
                                  id="context"
                                  type="number"
                                  min={1024}
                                  step={256}
                                  value={context}
                                  onChange={(e) => setContext(Number(e.target.value))}
                                />
                              </div>
                              <div className="flex items-center justify-between gap-3 rounded-md border border-gray-200 p-3 bg-gray-50">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">Throughput mode</div>
                                  <div className="text-xs text-gray-500">Toggle single-user vs throughput</div>
                                </div>
                                <Switch checked={throughputMode} onCheckedChange={setThroughputMode} />
                              </div>
                              {throughputMode && (
                                <div className="grid grid-cols-2 gap-3">
                                  <div className="space-y-2">
                                    <Label htmlFor="batch" className="text-gray-900">Batch size</Label>
                                    <Input
                                      id="batch"
                                      type="number"
                                      min={1}
                                      max={64}
                                      value={batchSize}
                                      onChange={(e) => setBatchSize(Number(e.target.value))}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="concurrency" className="text-gray-900">Concurrency</Label>
                                    <Input
                                      id="concurrency"
                                      type="number"
                                      min={1}
                                      max={128}
                                      value={concurrency}
                                      onChange={(e) => setConcurrency(Number(e.target.value))}
                                    />
                                  </div>
                                </div>
                              )}
                              <div className="space-y-2">
                                <Label className="text-gray-900">Precision</Label>
                                <Select value={precision} onValueChange={(v) => setPrecision(v as Precision)}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select precision" />
                                  </SelectTrigger>
                                  <SelectContent className="z-50 bg-white/50 backdrop-blur-md">
                                    <SelectItem value="fp16">FP16 / BF16</SelectItem>
                                    <SelectItem value="int8">INT8</SelectItem>
                                    <SelectItem value="int4">INT4</SelectItem>
                                  </SelectContent>
                                </Select>
                                <p className="text-xs text-gray-500">Quantization can improve speed and reduce VRAM needs</p>
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                          <div className="grid grid-cols-3 gap-2">
                            <Button onClick={handleStart} disabled={disableStart} className="bg-[#111] text-white hover:bg-black/90">
                              Start
                            </Button>
                            <Button variant="secondary" onClick={handleStop} disabled={runState === "idle"} className="bg-gray-100 hover:bg-gray-200 text-gray-900">
                              Stop
                            </Button>
                            <Button variant="outline" onClick={handleReset} className="border-gray-300 hover:bg-gray-100 text-gray-900">
                              Reset
                            </Button>
                          </div>
                          {!vramFits && (
                            <Alert className="bg-gray-50 border-gray-200">
                              <AlertTitle className="text-gray-900">VRAM limit</AlertTitle>
                              <AlertDescription className="text-gray-500">
                                This configuration likely won’t run on a single {selectedGpu?.vramGB ?? ""}GB GPU.
                                {typeof vramRequired === "number" && typeof vramAvailable === "number" ? (
                                  <>
                                    {" "}Estimated requirement: ~{vramRequired.toFixed(1)}GB (available: {vramAvailable.toFixed(
                                      1,
                                    )}GB).
                                  </>
                                ) : null}
                                {" "}Try INT8 or INT4, reduce context, or pick a larger-VRAM GPU.
                              </AlertDescription>
                            </Alert>
                          )}
                        </CardContent>
                      </Card>
                      <Card className="bg-white/50 backdrop-blur-md shadow-soft">
                        <CardHeader>
                          <CardTitle className="text-gray-900">Fixed PC baseline</CardTitle>
                          <CardDescription className="text-gray-500">Shown for clarity; not used to differentiate results.</CardDescription>
                        </CardHeader>
                        <CardContent className="text-sm text-gray-500">
                          <ul className="space-y-1">
                            <li>
                              <span className="text-gray-900">CPU:</span> Fixed baseline (no impact)
                            </li>
                            <li>
                              <span className="text-gray-900">RAM:</span> Fixed baseline (no impact)
                            </li>
                            <li>
                              <span className="text-gray-900">OS/Driver:</span> Fixed baseline (no impact)
                            </li>
                          </ul>
                        </CardContent>
                      </Card>
                    </section>
                    {/* Results */}
                    <section className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Card className="bg-white/50 backdrop-blur-md shadow-soft">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base text-gray-900">
                              TTFT
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button className="text-gray-500 hover:text-gray-900">
                                    <Info className="h-4 w-4" />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent className="bg-white/50 backdrop-blur-md">
                                  <div className="space-y-1">
                                    <div className="font-semibold text-gray-900">Time to First Token</div>
                                    <div className="text-xs text-gray-500">How long it takes to process your prompt and generate the first token</div>
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </CardTitle>
                            <CardDescription className="text-gray-500">Time to first token (prompt processing)</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-semibold tabular-nums text-gray-900">{formatSeconds(estimate.ttftSeconds)}</div>
                            <div className="mt-2 text-xs text-gray-500">
                              Prefill: {estimate.prefillTps.toFixed(0)} tok/s
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="bg-white/50 backdrop-blur-md shadow-soft">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base text-gray-900">
                              Decode speed
                              {estimate.citation && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button className="text-pink-600 hover:text-pink-800 transition-colors">
                                      <Info className="h-4 w-4" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-xs bg-white/50 backdrop-blur-md">
                                    <div className="space-y-2">
                                      <div className="font-semibold text-gray-900">Benchmark Source</div>
                                      <a
                                        href={estimate.citation.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-xs text-pink-600 hover:text-pink-800 transition-colors"
                                      >
                                        {estimate.citation.label}
                                        <ExternalLink className="h-3 w-3" />
                                      </a>
                                      {estimate.citation.date && (
                                        <div className="text-xs text-gray-500">Date: {estimate.citation.date}</div>
                                      )}
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              )}
                            </CardTitle>
                            <CardDescription className="text-gray-500">Generation throughput</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-semibold tabular-nums text-gray-900">{estimate.decodeTps.toFixed(1)} tok/s</div>
                            <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                              <span>Confidence</span>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Badge variant={conf.variant} className="cursor-help bg-gray-100 text-gray-600">
                                    {conf.text}
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent className="bg-white/50 backdrop-blur-md">
                                  <div className="space-y-1 text-xs text-gray-500">
                                    {estimate.confidence === "high" && <div>Based on exact benchmark match</div>}
                                    {estimate.confidence === "medium" && <div>Interpolated from similar configurations</div>}
                                    {estimate.confidence === "low" && <div>Estimated from GPU specs and model size</div>}
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      <Card className="bg-white/50 backdrop-blur-md shadow-soft">
                        <CardHeader>
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <CardTitle className="text-gray-900">Total time</CardTitle>
                              <CardDescription className="text-gray-500">TTFT + generation time</CardDescription>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-semibold tabular-nums text-gray-900">{formatSeconds(estimate.totalSeconds)}</div>
                              <div className="mt-1 text-xs text-gray-500">
                                Mode: {throughputMode ? "Throughput" : "Single-user"}
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>
                                Progress: {generatedTokens.toLocaleString()} / {outputTokens.toLocaleString()} tokens
                              </span>
                              <span className={cn("font-medium text-gray-900", runState === "streaming" && "animate-pulse")}>
                                {runState === "idle"
                                  ? "Idle"
                                  : runState === "prefill"
                                    ? "Processing prompt…"
                                    : runState === "streaming"
                                      ? "Streaming…"
                                      : "Done"}
                              </span>
                            </div>
                            <Progress value={clamp(progress, 0, 100)} className="bg-gray-200" />
                          </div>
                          <div className="rounded-md border border-gray-200 bg-gray-50 p-3">
                            <div className="mb-2 text-xs font-medium text-gray-500">Live output</div>
                            <div className="h-[240px] overflow-auto whitespace-pre-wrap break-words font-mono text-xs text-left leading-relaxed text-gray-900">
                              {consoleText || "(press Start to simulate streaming output)"}
                            </div>
                          </div>
                          <div className="text-xs text-gray-500">
                            <div className="font-medium text-gray-900">Assumptions</div>
                            <div className="mt-1">{estimate.rationale}</div>
                            <div className="mt-2">
                              This is a simulation based on public benchmarks + estimation. Real results vary by framework,
                              quantization, KV-cache, drivers, and prompt shape.
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </section>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </main>
        {/* Landing Sections */}
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
              <GpuSpecsTableInline selectedGpuId={gpuId} />
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
              <ModelSpecsTableInline selectedModelId={modelId} />
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
              <BenchmarksTableInline selectedGpuId={gpuId} selectedModelId={modelId} />
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
              description="How we estimate performance when there’s no exact benchmark match."
              variant="c"
              layout="left"
              aside="motif"
              animation="rain"
            >
              <EstimationMethodologyInline />
            </LandingSection>
          </ScrollStack>
        </div>
        <FooterInline />
      </div>
    </TooltipProvider>
  );
}