// src/components/simulator/HeroSection.tsx
'use client';

import { useEffect, useMemo, useRef, useState } from "react";
import { GPU_SPECS, MODEL_SPECS, type GpuTier, type ModelFamily } from "@/data/simulatorDataset";
import { estimatePerformance, type Precision } from "@/lib/sim/estimator";
import { randomWords } from "@/lib/sim/randomText";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { motion } from 'framer-motion';
import { HeaderDotAnimation } from "@/components/animator/HeaderDotAnimation";
import { Star } from '@solar-icons/react';
import { SimulatingStatus } from "../animator/SimulatingStatus";

import {
  Cpu,
  Database,
  ExternalLink,
  Info,
  ChevronDown,
  Plus,
  PanelLeft,
  Download,
  Clock,
  Activity,
  Play,
  RotateCcw,
  Zap,
  ArrowRight,
  MemoryStick, Github
} from 'lucide-react';

type RunState = "idle" | "prefill" | "streaming" | "done";

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

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

function familyLabel(f: ModelFamily) {
  switch (f) {
    case "llama": return "Llama";
    case "mistral": return "Mistral / Mixtral";
    case "qwen": return "Qwen2.5";
    case "deepseek": return "DeepSeek";
    default: return "Other";
  }
}

function tierLabel(t: GpuTier) {
  switch (t) {
    case "consumer": return "Consumer";
    case "workstation": return "Workstation";
    case "datacenter": return "Datacenter";
  }
}

export function HeroSection({
  gpuId,
  setGpuId,
  modelId,
  setModelId,
  inputTokens,
  setInputTokens,
  outputTokens,
  setOutputTokens,
  context,
  setContext,
  precision,
  setPrecision,
  throughputMode,
  setThroughputMode,
  batchSize,
  setBatchSize,
  concurrency,
  setConcurrency,
  estimate,
}: {
  gpuId: string;
  setGpuId: (value: string) => void;
  modelId: string;
  setModelId: (value: string) => void;
  inputTokens: number;
  setInputTokens: (value: number) => void;
  outputTokens: number;
  setOutputTokens: (value: number) => void;
  context: number;
  setContext: (value: number) => void;
  precision: Precision;
  setPrecision: (value: Precision) => void;
  throughputMode: boolean;
  setThroughputMode: (value: boolean) => void;
  batchSize: number;
  setBatchSize: (value: number) => void;
  concurrency: number;
  setConcurrency: (value: number) => void;
  estimate: ReturnType<typeof estimatePerformance>;
}) {
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

  // Custom scrollbar classes
  const scrollbarClass = "overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-black/20 hover:[&::-webkit-scrollbar-thumb]:bg-black/40 [&::-webkit-scrollbar-track]:bg-transparent";

  return (
    <>
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
        <a
          href="https://github.com/Imtiaj-Sajin/ai-gpu-simulator"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-gray-800 border border-gray-200 rounded-md bg-white/70 backdrop-blur hover:bg-white hover:border-gray-300 hover:shadow-sm active:scale-[0.98] transition-all duration-200"
        >
          <Github className="w-4 h-4 text-gray-700" />
          GitHub
        </a>


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
          <div className="flex items-center justify-center gap-4 md:gap-5">
            <div className="relative md:top-1">
              <HeaderDotAnimation />
            </div>
            <h1 className="text-4xl md:text-[64px] font-bold tracking-tight text-[#111] leading-[1.1]">
              AI vs GPU
            </h1>
          </div>
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
                {[1, 2, 3, 4, 5].map((s) => <Star key={s} weight="Bold" size={12} color='#091419' />)}
                {[5].map((s) => <Star key={s} weight="BoldDuotone" size={12} color='#091419' />)}
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
            <div className="flex-1 flex overflow-hidden text-left">
              
              {/* LEFT SIDEBAR (Controls) */}
              <div className="w-[340px] border-r border-gray-100 bg-[#FAFAFA] flex flex-col shrink-0">
                <div className={`p-4 border-b border-gray-100/50 flex-1 ${scrollbarClass}`}>
                  <div className="space-y-6">
                    {/* GPU Selection */}
                    <div className="space-y-2">
                      <Label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">GPU</Label>
                      <Select value={gpuId} onValueChange={setGpuId}>
                        <SelectTrigger className="bg-white border-gray-200">
                          <SelectValue placeholder="Select GPU" />
                        </SelectTrigger>
                        <SelectContent className="z-50 bg-white">
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
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                          <span>
                            {selectedGpu.vramGB}GB VRAM, {selectedGpu.memoryBandwidthGBs?.toFixed(0)} GB/s
                          </span>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button className="inline-flex items-center text-pink-600 hover:text-pink-800 transition-colors">
                                <Info className="h-3 w-3" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="max-w-xs bg-white/90 backdrop-blur-md shadow-lg border-gray-200">
                              <div className="space-y-2 p-1">
                                <div className="font-semibold text-gray-900">GPU Specifications</div>
                                <div className="space-y-1 text-xs text-gray-500">
                                  <div>VRAM: {selectedGpu.vramGB}GB</div>
                                  <div>Bandwidth: {selectedGpu.memoryBandwidthGBs?.toFixed(1)} GB/s</div>
                                  <div>FP16: {selectedGpu.fp16Tflops?.toFixed(1)} TFLOPS</div>
                                </div>
                                <div className="border-t pt-2 mt-2">
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

                    {/* Model Selection */}
                    <div className="space-y-2">
                      <Label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Model</Label>
                      <Select value={modelId} onValueChange={setModelId}>
                        <SelectTrigger className="bg-white border-gray-200">
                          <SelectValue placeholder="Select model" />
                        </SelectTrigger>
                        <SelectContent className="z-50 bg-white">
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
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
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
                              <TooltipContent side="right" className="max-w-xs bg-white/90 backdrop-blur-md shadow-lg border-gray-200">
                                <div className="space-y-2 p-1">
                                  <div className="font-semibold text-gray-900">Model Details</div>
                                  <div className="space-y-1 text-xs text-gray-500">
                                    <div>Parameters: {selectedModel.paramsB}B</div>
                                    <div>Context: {(selectedModel.defaultContext / 1000).toFixed(0)}K tokens</div>
                                  </div>
                                  <div className="border-t pt-2 mt-2">
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

                    {/* Parameters with Improved Sliders */}
                    <div className="space-y-6">
                      <Label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Parameters</Label>
                      
                      {/* Input Tokens */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs text-gray-600">Input Tokens</span>
                          <div className="relative">
                            <input
                              type="number"
                              value={inputTokens}
                              onChange={(e) => setInputTokens(Math.max(1, Number(e.target.value)))}
                              className="w-16 text-right text-xs font-mono font-medium bg-white rounded-md border border-gray-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2  p-0.5"
                            />
                          </div>
                        </div>
                        <input 
                          type="range" min="1" max="4096" step="1"
                          value={inputTokens}
                          onChange={(e) => setInputTokens(Number(e.target.value))}
                          className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                        />
                      </div>

                      {/* Output Tokens */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs text-gray-600">Output Tokens</span>
                          <div className="relative">
                            <input
                              type="number"
                              value={outputTokens}
                              onChange={(e) => setOutputTokens(Math.max(1, Number(e.target.value)))}
                              className="w-16 text-right text-xs font-mono font-medium bg-white rounded-md border border-gray-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2  p-0.5"
                            />
                          </div>
                        </div>
                        <input 
                          type="range" min="1" max="4096" step="1"
                          value={outputTokens}
                          onChange={(e) => setOutputTokens(Number(e.target.value))}
                          className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                        />
                      </div>
                    </div>

                    {/* Advanced Settings */}
                    <Collapsible defaultOpen>
                      <div className="flex items-center justify-between group cursor-pointer">
                        <Label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider group-hover:text-gray-600 transition-colors">Advanced</Label>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 text-xs text-gray-400">
                            <ChevronDown className="h-3 w-3" />
                          </Button>
                        </CollapsibleTrigger>
                      </div>
                      <CollapsibleContent className="mt-3 space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="context" className="text-xs text-gray-600">Context length</Label>
                          <Input
                            id="context"
                            type="number"
                            min={1024}
                            step={256}
                            value={context}
                            onChange={(e) => setContext(Number(e.target.value))}
                            className="h-8 text-xs bg-white"
                          />
                        </div>

                        {/* Precision Selector (Buttons) */}
                        <div className="space-y-2">
                          <Label className="text-xs text-gray-600">Precision/Quantization</Label>
                          <div className="grid grid-cols-3 gap-2">
                            {(["fp16", "int8", "int4"] as const).map((p) => (
                              <button
                                key={p}
                                onClick={() => setPrecision(p)}
                                className={cn(
                                  "text-xs py-1.5 rounded-md border transition-all font-medium",
                                  precision === p 
                                    ? "bg-black text-white border-black shadow-sm" 
                                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                )}
                              >
                                {p.toUpperCase()}
                              </button>
                            ))}
                          </div>
                          <p className="text-[10px] text-gray-400 leading-tight">Quantization can improve speed and reduce VRAM.</p>
                        </div>

                        <div className="flex items-center justify-between gap-3 rounded-md border border-gray-200 p-2 bg-white">
                          <div className="text-xs font-medium text-gray-900">Throughput mode</div>
                          <Switch checked={throughputMode} onCheckedChange={setThroughputMode} />
                        </div>
                        
                        {throughputMode && (
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <Label htmlFor="batch" className="text-xs text-gray-600">Batch size</Label>
                              <Input
                                id="batch"
                                type="number"
                                min={1}
                                max={64}
                                value={batchSize}
                                onChange={(e) => setBatchSize(Number(e.target.value))}
                                className="h-8 text-xs bg-white"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor="concurrency" className="text-xs text-gray-600">Concurrency</Label>
                              <Input
                                id="concurrency"
                                type="number"
                                min={1}
                                max={128}
                                value={concurrency}
                                onChange={(e) => setConcurrency(Number(e.target.value))}
                                className="h-8 text-xs bg-white"
                              />
                            </div>
                          </div>
                        )}
                      </CollapsibleContent>
                    </Collapsible>

                    {/* VRAM Alert */}
                    {!vramFits && (
                      <Alert className="bg-red-50 border-red-200 text-left">
                        <AlertTitle className="text-red-900 text-xs font-semibold">VRAM limit</AlertTitle>
                        <AlertDescription className="text-red-700 text-xs mt-1 leading-relaxed">
                          This configuration likely won't run on a single {selectedGpu?.vramGB ?? ""}GB GPU.
                          {typeof vramRequired === "number" && typeof vramAvailable === "number" ? (
                            <>
                              <br/>
                              Estimated: <strong>~{vramRequired.toFixed(1)}GB</strong> (Available: {vramAvailable.toFixed(1)}GB).
                            </>
                          ) : null}
                          <br className="mb-1"/>
                          Try INT8/INT4, reduce context, or pick a larger GPU.
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Fixed PC Baseline Card */}
                    <Card className="bg-white border-gray-100 shadow-sm mt-4">
                      <CardContent className="p-3 text-[11px] text-gray-500 space-y-1">
                        <div className="font-semibold text-gray-900 mb-1">Fixed PC Baseline</div>
                        <div><span className="text-gray-900">CPU/RAM/OS:</span> Fixed baseline (no impact on this sim)</div>
                      </CardContent>
                    </Card>

                  </div>
                </div>
              </div>

              {/* RIGHT CONTENT AREA */}
              <div className="flex-1 flex flex-col bg-white min-w-0">
                
                {/* Toolbar */}
                <div className="h-14 border-b border-gray-100 flex items-center justify-between px-6 bg-white shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-md border border-gray-100">
                      <Database size={14} className="text-gray-500"/>
                      <span className="text-sm font-medium text-gray-700">{selectedGpu?.name}</span>
                    </div>
                    <ArrowRight size={14} className="text-gray-300"/>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-md border border-gray-100">
                      <Cpu size={14} className="text-gray-500"/>
                      <span className="text-sm font-medium text-gray-700">{selectedModel?.name}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button 
                      variant="ghost"
                      size="sm"
                      onClick={handleStop} 
                      disabled={runState === "idle"} 
                      className="text-gray-500 hover:text-red-600"
                    >
                      Stop
                    </Button>
                    <button 
                      onClick={handleReset}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      <RotateCcw size={18} />
                    </button>
                    <button 
                      onClick={handleStart}
                      disabled={disableStart}
                      className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 disabled:pointer-events-none shadow-md shadow-black/20"
                    >
                      <Play size={14} fill="currentColor" />
                      Run Sim
                    </button>
                  </div>
                </div>

                {/* Main Display Area */}
                <div className={`flex-1 overflow-y-auto p-6 bg-[#FAFAFA] ${scrollbarClass}`}>
                  
                  {/* Stats Grid - 4 Columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    
                    {/* Card 1: TTFT */}
                    <Card className="  relative group overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="relative z-10">
                            <div className="flex items-center gap-1.5">
                              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">TTFT</p>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Info className="h-3 w-3 text-gray-300 hover:text-gray-500" />
                                </TooltipTrigger>
                                <TooltipContent className="bg-white border-gray-200 text-gray-700">
                                  Time to First Token (how long to process prompt)
                                </TooltipContent>
                              </Tooltip>
                            </div>
                            <h3 className="text-2xl font-semibold text-gray-900 mt-1 tabular-nums">{formatSeconds(estimate.ttftSeconds)}</h3>
                            <p className="text-xs text-gray-500 mt-1">Prefill: {estimate.prefillTps.toFixed(0)} tok/s</p>
                          </div>
                          <div className="p-2 rounded-lg bg-orange-50 text-orange-600">
                            <Clock size={18} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Card 2: Decode Speed */}
                    <Card className=" ">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Decode Speed</p>
                              {estimate.citation && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button className="text-pink-600 hover:text-pink-800 transition-colors">
                                      <Info className="h-3 w-3" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-xs bg-white border-gray-200">
                                    <div className="space-y-2 p-1">
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
                            </div>
                            <h3 className="text-2xl font-semibold text-gray-900 mt-1 tabular-nums">{estimate.decodeTps.toFixed(1)} T/s</h3>
                            <div className="mt-1 flex items-center gap-2">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Badge variant={conf.variant} className="cursor-help text-[10px] px-1.5 py-0 rounded-sm">
                                    {conf.text} Confidence
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent className="bg-white border-gray-200">
                                  <div className="space-y-1 text-xs text-gray-500 p-1">
                                    {estimate.confidence === "high" && <div>Based on exact benchmark match</div>}
                                    {estimate.confidence === "medium" && <div>Interpolated from similar configurations</div>}
                                    {estimate.confidence === "low" && <div>Estimated from GPU specs and model size</div>}
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          </div>
                          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                            <Activity size={18} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Card 3: VRAM Used (New) */}
                    <Card className=" ">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">VRAM Used</p>
                            <h3 className="text-2xl font-semibold text-gray-900 mt-1 tabular-nums">{estimate.vram?.requiredGB.toFixed(1)} GB</h3>
                            <p className="text-xs text-gray-500 mt-1">
                              of {selectedGpu?.vramGB} GB
                            </p>
                          </div>
                          <div className={cn("p-2 rounded-lg", estimate.vram?.fits ? "bg-blue-50 text-blue-600" : "bg-red-50 text-red-600")}>
                            <MemoryStick size={18} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Card 4: Total Time */}
                    <Card className="   ">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Time</p>
                            <h3 className="text-2xl font-semibold text-gray-900 mt-1 tabular-nums">{formatSeconds(estimate.totalSeconds)}</h3>
                            <p className="text-xs text-gray-500 mt-1">
                              Mode: {throughputMode ? "Throughput" : "Single-user"}
                            </p>
                          </div>
                          <div className="p-2 rounded-lg bg-gray-50 text-gray-600">
                            <Clock size={18} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Terminal / Live Output */}
                  <div className="bg-[#1e1e1e] rounded-xl shadow-lg overflow-hidden flex flex-col h-[450px] border border-gray-800">
                    <div className="h-9 bg-[#2d2d2d] flex items-center px-4 gap-2 border-b border-gray-700 shrink-0 justify-between">
                      <div className="flex gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-gray-500" />
                        <div className="w-2.5 h-2.5 rounded-full bg-gray-500" />
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={cn("text-[10px] font-medium transition-colors", 
                          runState === "streaming" ? "text-emerald-400 animate-pulse" : "text-gray-500"
                        )}>
                          {runState === "idle" ? "Idle" : runState === "prefill" ? "Processing Prompt..." : runState === "streaming" ? "Generating..." : "Done"}
                        </span>
                        <span className="text-[10px] text-gray-500 font-mono border-l border-gray-600 pl-3">
                          {generatedTokens.toLocaleString()} / {outputTokens.toLocaleString()} tokens
                        </span>
                      </div>
                    </div>
                    
                    <div className={`flex-1 p-4 font-mono text-sm text-gray-300 ${scrollbarClass} [&::-webkit-scrollbar-thumb]:bg-white/20 hover:[&::-webkit-scrollbar-thumb]:bg-white/30`}>
                      {consoleText ? (
                        <div className="whitespace-pre-wrap leading-relaxed">
                          {consoleText}
                          {runState === "streaming" && (
                            <span className="inline-block w-2 h-4 bg-gray-400 ml-1 animate-pulse align-middle" />
                          )}
                        </div>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-600 gap-3">
                          <Zap size={32} className="opacity-20" />
                          <p>Ready to simulate. Press Run.</p>
                        </div>
                      )}
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="h-1 bg-gray-800 w-full shrink-0">
                      <div 
                        className="h-full bg-emerald-500 transition-all duration-100 ease-linear"
                        style={{ width: `${clamp(progress, 0, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Footer Info / Assumptions */}
                  <div className="mt-6 space-y-2">
                    <div className="rounded-lg bg-gray-100/50 p-4 border border-gray-100">
                      <h4 className="text-xs font-semibold text-gray-900 mb-1">Assumptions</h4>
                      <p className="text-xs text-gray-600">{estimate.rationale}</p>
                      <p className="text-[11px] text-gray-400 mt-2">
                        This is a simulation based on public benchmarks + GPU Specs & Model wise dynamic calculations. <br /> Real results may vary by framework,
                        quantization, KV-cache, drivers, and prompt shape.
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </>
  );
}