// src\components\simulator\SimulatorPage.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { GPU_SPECS, MODEL_SPECS, type GpuTier, type ModelFamily } from "@/data/simulatorDataset";
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
import { cn } from "@/lib/utils";

type RunState = "idle" | "prefill" | "streaming" | "done";

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

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
    const p = throughputMode ? precision : precision; // placeholder: same field either way
    return estimatePerformance({
      gpuId,
      modelId,
      inputTokens,
      outputTokens,
      context,
      precision: p,
      mode,
      batchSize: throughputMode ? batchSize : 1,
      concurrency: throughputMode ? concurrency : 1,
    });
  }, [gpuId, modelId, inputTokens, outputTokens, context, precision, mode, batchSize, concurrency, throughputMode]);

  // If user picks INT8 but we have no INT8 datapoint, we still allow it but keep confidence low.
  const showInt8 = true;

  const [runState, setRunState] = useState<RunState>("idle");
  const [generatedTokens, setGeneratedTokens] = useState<number>(0);
  const [consoleText, setConsoleText] = useState<string>("");

  const prefillTimerRef = useRef<number | null>(null);
  const tickTimerRef = useRef<number | null>(null);
  const runStartRef = useRef<number>(0);
  const streamStartRef = useRef<number>(0);
  const lastTickRef = useRef<number>(0);
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
    lastTickRef.current = streamStartRef.current;
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
        // 1 word ~= 1 token for this fake stream.
        setConsoleText((prev) => {
          const nextChunk = randomWords(Math.min(toEmit, 24));
          const next = prev ? `${prev} ${nextChunk}` : nextChunk;
          // Keep console bounded.
          return next.length > 5000 ? next.slice(next.length - 5000) : next;
        });
      }

      if (emittedRef.current >= outputTokens) {
        resetTimers();
        setRunState("done");
      }

      lastTickRef.current = now;
    }, tickMs);
  };

  const handleStart = () => {
    handleReset();
    setRunState("prefill");
    setConsoleText("processing prompt…");
    runStartRef.current = performance.now();

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

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <h1 className="text-2xl font-semibold tracking-tight">AI vs GPU Simulator</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Pick a GPU + model, enter tokens, and simulate TTFT + tokens/sec with a lightweight, data-driven estimator.
          </p>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-4 px-4 py-6 lg:grid-cols-[420px_1fr]">
        {/* Controls */}
        <section className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Simulator</CardTitle>
              <CardDescription>All PC components are fixed; only the GPU changes.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>GPU</Label>
                <Select value={gpuId} onValueChange={setGpuId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select GPU" />
                  </SelectTrigger>
                  <SelectContent className="z-50">
                    {(Object.keys(gpusByTier) as GpuTier[]).map((tier) => (
                      <div key={tier} className="px-2 py-1.5">
                        <div className="px-2 pb-1 text-xs font-medium text-muted-foreground">{tierLabel(tier)}</div>
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
              </div>

              <div className="space-y-2">
                <Label>Model</Label>
                <Select value={modelId} onValueChange={setModelId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent className="z-50">
                    {(Object.keys(modelsByFamily) as ModelFamily[]).map((fam) => (
                      <div key={fam} className="px-2 py-1.5">
                        <div className="px-2 pb-1 text-xs font-medium text-muted-foreground">{familyLabel(fam)}</div>
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
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="inputTokens">Input tokens</Label>
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
                  <Label htmlFor="outputTokens">Output tokens</Label>
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
                    <div className="text-sm font-medium">Advanced</div>
                    <div className="text-xs text-muted-foreground">Workload + context assumptions</div>
                  </div>
                  <CollapsibleTrigger asChild>
                    <Button variant="outline" size="sm">Toggle</Button>
                  </CollapsibleTrigger>
                </div>

                <CollapsibleContent className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="context">Context length (tokens)</Label>
                    <Input
                      id="context"
                      type="number"
                      min={1024}
                      step={256}
                      value={context}
                      onChange={(e) => setContext(Number(e.target.value))}
                    />
                  </div>

                  <div className="flex items-center justify-between gap-3 rounded-md border p-3">
                    <div>
                      <div className="text-sm font-medium">Throughput mode</div>
                      <div className="text-xs text-muted-foreground">Toggle single-user vs throughput assumptions</div>
                    </div>
                    <Switch checked={throughputMode} onCheckedChange={setThroughputMode} />
                  </div>

                  {throughputMode && (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="batch">Batch size</Label>
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
                        <Label htmlFor="concurrency">Concurrency</Label>
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
                    <Label>Precision</Label>
                    <Select value={precision} onValueChange={(v) => setPrecision(v as Precision)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select precision" />
                      </SelectTrigger>
                      <SelectContent className="z-50">
                        <SelectItem value="fp16">FP16 / BF16</SelectItem>
                        {showInt8 && <SelectItem value="int8">INT8</SelectItem>}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">Default FP16; INT8 is shown when available/usable.</p>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <div className="grid grid-cols-3 gap-2">
                <Button onClick={handleStart} disabled={runState === "prefill" || runState === "streaming"}>
                  Start
                </Button>
                <Button variant="secondary" onClick={handleStop} disabled={runState === "idle"}>
                  Stop
                </Button>
                <Button variant="outline" onClick={handleReset}>
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fixed PC baseline</CardTitle>
              <CardDescription>Shown for clarity; not used to differentiate results.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <ul className="space-y-1">
                <li>
                  <span className="text-foreground">CPU:</span> Fixed baseline (TBD)
                </li>
                <li>
                  <span className="text-foreground">RAM:</span> Fixed baseline (TBD)
                </li>
                <li>
                  <span className="text-foreground">OS/Driver:</span> Fixed baseline (TBD)
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Results */}
        <section className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">TTFT</CardTitle>
                <CardDescription>Time to first token (prompt processing)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold tabular-nums">{formatSeconds(estimate.ttftSeconds)}</div>
                <div className="mt-2 text-xs text-muted-foreground">Prefill: {estimate.prefillTps.toFixed(0)} tok/s</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Decode speed</CardTitle>
                <CardDescription>Generation throughput</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold tabular-nums">{estimate.decodeTps.toFixed(1)} tok/s</div>
                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Confidence</span>
                  <Badge variant={conf.variant}>{conf.text}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle>Total time</CardTitle>
                  <CardDescription>TTFT + generation time</CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-semibold tabular-nums">{formatSeconds(estimate.totalSeconds)}</div>
                  <div className="mt-1 text-xs text-muted-foreground">Mode: {throughputMode ? "Throughput" : "Single-user"}</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    Progress: {generatedTokens.toLocaleString()} / {outputTokens.toLocaleString()} tokens
                  </span>
                  <span className={cn("font-medium", runState === "streaming" && "animate-fade-in")}>
                    {runState === "idle"
                      ? "Idle"
                      : runState === "prefill"
                        ? "Processing prompt…"
                        : runState === "streaming"
                          ? "Streaming…"
                          : "Done"}
                  </span>
                </div>
                <Progress value={clamp(progress, 0, 100)} />
              </div>

              <div className="rounded-md border bg-card p-3">
                <div className="mb-2 text-xs font-medium text-muted-foreground">Live output</div>
                <div className="h-[240px] overflow-auto whitespace-pre-wrap break-words font-mono text-xs leading-relaxed text-foreground">
                  {consoleText || "(press Start to simulate streaming output)"}
                </div>
              </div>

              <div className="text-xs text-muted-foreground">
                <div className="font-medium text-foreground">Assumptions</div>
                <div className="mt-1">{estimate.rationale}</div>
                <div className="mt-2">
                  This is a simulation based on public benchmarks + estimation. Real results vary by framework, quantization,
                  KV-cache, drivers, and prompt shape.
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
