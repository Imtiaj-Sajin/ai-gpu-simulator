'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, Search, LayoutGrid, CheckCircle2, ChevronDown, 
  ArrowRight, PanelLeft, Bell, Filter, Layout, Play, RotateCcw, 
  Cpu, Database, Box, Clock, Activity, Download, Plus 
} from 'lucide-react';
import { Background } from '@/components/theme/Background';
import { cn } from '@/lib/utils';

// --- Import your data/logic --- 
// (Assuming these paths exist based on your provided code. If not, adjust paths)
import { GPU_SPECS, MODEL_SPECS, type GpuTier, type ModelFamily } from "@/data/simulatorDataset";
import { estimatePerformance, type Precision, type WorkloadMode } from "@/lib/sim/estimator";
import { randomWords } from "@/lib/sim/randomText";

// --- Types ---
type RunState = "idle" | "prefill" | "streaming" | "done";

// --- Components ---

const SidebarItem = ({ icon: Icon, label, active, onClick, value, subLabel }: any) => (
  <div 
    onClick={onClick}
    className={cn(
      "flex flex-col px-3 py-2 rounded-lg group cursor-pointer transition-all border border-transparent",
      active ? "bg-white shadow-sm border-gray-200 text-gray-900" : "text-gray-500 hover:bg-gray-100/50"
    )}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {Icon && <Icon size={16} className={active ? "text-indigo-600" : "text-gray-400"} />}
        <span className="text-[13px] font-medium">{label}</span>
      </div>
      {active && <CheckCircle2 size={12} className="text-indigo-600" />}
    </div>
    {subLabel && (
      <div className="pl-6 text-[11px] text-gray-400 truncate max-w-[140px]">{subLabel}</div>
    )}
  </div>
);

const StatCard = ({ label, value, sub, icon: Icon, colorClass }: any) => (
  <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-start justify-between hover:shadow-md transition-shadow">
    <div>
      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
      <h3 className="text-2xl font-semibold text-gray-900 mt-1">{value}</h3>
      <p className="text-xs text-gray-500 mt-1">{sub}</p>
    </div>
    <div className={cn("p-2 rounded-lg", colorClass)}>
      <Icon size={18} className="opacity-80" />
    </div>
  </div>
);

const BentoCard = ({ title, desc, children, className }: any) => (
  <div className={cn("bg-white/60 backdrop-blur-md border border-white/60 shadow-sm rounded-2xl p-6 flex flex-col hover:bg-white/80 transition-colors", className)}>
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
    </div>
    <div className="flex-1">
      {children}
    </div>
  </div>
);

// --- Main Page ---

export default function SimulatorPage() {
  // --- State ---
  const [gpuId, setGpuId] = useState<string>("rtx-4090");
  const [modelId, setModelId] = useState<string>("llama-3-1-8b");
  const [inputTokens, setInputTokens] = useState<number>(512);
  const [outputTokens, setOutputTokens] = useState<number>(256);
  const [precision, setPrecision] = useState<Precision>("fp16");
  
  // Logic State
  const [runState, setRunState] = useState<RunState>("idle");
  const [generatedTokens, setGeneratedTokens] = useState<number>(0);
  const [consoleText, setConsoleText] = useState<string>("");

  // Refs for animation
  const prefillTimerRef = useRef<any>(null);
  const tickTimerRef = useRef<any>(null);
  const streamStartRef = useRef<number>(0);
  const emittedRef = useRef<number>(0);

  // Derived Data
  const selectedGpu = GPU_SPECS.find((g) => g.id === gpuId);
  const selectedModel = MODEL_SPECS.find((m) => m.id === modelId);

  const estimate = useMemo(() => {
    return estimatePerformance({
      gpuId, modelId, inputTokens, outputTokens,
      context: 4096, precision, mode: "single", batchSize: 1, concurrency: 1,
    });
  }, [gpuId, modelId, inputTokens, outputTokens, precision]);

  // --- Handlers ---

  const handleReset = () => {
    if (prefillTimerRef.current) clearTimeout(prefillTimerRef.current);
    if (tickTimerRef.current) clearInterval(tickTimerRef.current);
    setRunState("idle");
    setGeneratedTokens(0);
    setConsoleText("");
    emittedRef.current = 0;
  };

  const handleStart = () => {
    handleReset();
    setRunState("prefill");
    setConsoleText("> Initializing CUDA context...\n> Loading weights...\n> Processing prompt...");

    const ttftMs = Math.max(0, Math.round(estimate.ttftSeconds * 1000));
    
    prefillTimerRef.current = setTimeout(() => {
      setRunState("streaming");
      setConsoleText((prev) => prev + "\n> Generating:\n\n");
      streamStartRef.current = performance.now();
      
      const tickMs = 60; // Update UI every 60ms
      tickTimerRef.current = setInterval(() => {
        const now = performance.now();
        const elapsedS = (now - streamStartRef.current) / 1000;
        // Calculate how many tokens *should* be done by now
        const target = Math.min(outputTokens, Math.floor(elapsedS * estimate.decodeTps));
        const toEmit = Math.max(0, target - emittedRef.current);

        if (toEmit > 0) {
          emittedRef.current += toEmit;
          setGeneratedTokens(emittedRef.current);
          setConsoleText((prev) => {
             // Add random fake text
             const words = randomWords(Math.min(toEmit, 5)); 
             return prev + " " + words;
          });
        }

        if (emittedRef.current >= outputTokens) {
          clearInterval(tickTimerRef.current);
          setRunState("done");
          setConsoleText((prev) => prev + "\n\n> [COMPLETED]");
        }
      }, tickMs);
    }, ttftMs);
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] font-sans text-gray-900 relative selection:bg-purple-200/50">
      <Background />

      {/* Navbar */}
      <nav className="relative z-50 px-4 py-5 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2 font-bold text-lg tracking-tight text-gray-900 select-none">
          <Zap className="w-5 h-5 fill-indigo-500 text-indigo-500" />
          <span>Simul<span className="text-gray-400">Bench</span></span>
        </div>
        <div className="hidden md:flex items-center gap-1">
             <span className="px-3 py-1 bg-white/50 border border-gray-200 rounded-full text-[11px] font-medium text-gray-500">v2.4.0</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="hidden sm:block px-4 py-2 text-[13px] font-semibold border border-gray-300 rounded-lg hover:bg-white transition-all bg-white/30 backdrop-blur-sm">
            Dataset
          </button>
          <button className="px-4 py-2 text-[13px] font-semibold bg-[#111] text-white rounded-lg hover:bg-black transition-all shadow-lg shadow-black/10">
            Export Report
          </button>
        </div>
      </nav>

      <main className="relative z-10 pt-8 pb-20 flex flex-col items-center px-4">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
           <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#111] mb-3">
             Inference Speed Simulator
           </h1>
           <p className="text-gray-500 text-lg">Compare GPUs vs LLMs with benchmark-backed data.</p>
        </motion.div>

        {/* --- APP MOCKUP CONTAINER --- */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="w-full max-w-[1200px] mx-auto p-1 bg-gradient-to-b from-white/40 to-transparent rounded-2xl relative z-20"
        >
          <div className="bg-white w-full rounded-xl border border-gray-200/80 shadow-2xl shadow-gray-200/50 flex flex-col h-[750px] overflow-hidden relative">
            
            {/* Browser Header */}
            <div className="h-11 border-b border-gray-100 flex items-center px-4 gap-4 bg-white sticky top-0 z-30 shrink-0">
              <div className="flex gap-2 group">
                <div className="w-3 h-3 rounded-full bg-[#FF5F57] border border-black/5" />
                <div className="w-3 h-3 rounded-full bg-[#FEBC2E] border border-black/5" />
                <div className="w-3 h-3 rounded-full bg-[#28C840] border border-black/5" />
              </div>
              <div className="flex-1 max-w-lg mx-auto bg-gray-50 rounded-md flex items-center justify-center gap-2 h-7 text-[11px] text-gray-500 font-medium border border-gray-100/50">
                <span className="opacity-50">🔒</span> simulator.local
              </div>
              <div className="flex gap-3 text-gray-400">
                <Download size={16} />
                <Plus size={16} />
              </div>
            </div>

            {/* App Body */}
            <div className="flex-1 flex overflow-hidden">
              
              {/* SIDEBAR (Controls) */}
              <div className="w-[300px] border-r border-gray-100 bg-[#FAFAFA] flex flex-col hidden md:flex shrink-0">
                <div className="p-4 border-b border-gray-100/50">
                    <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Hardware</div>
                    <div className="space-y-1 h-[180px] overflow-y-auto scrollbar-thin pr-1">
                        {GPU_SPECS.map(gpu => (
                            <SidebarItem 
                                key={gpu.id} 
                                icon={Cpu} 
                                label={gpu.name} 
                                subLabel={`${gpu.vramGB}GB VRAM`}
                                active={gpuId === gpu.id}
                                onClick={() => setGpuId(gpu.id)}
                            />
                        ))}
                    </div>
                </div>

                <div className="p-4 border-b border-gray-100/50 flex-1">
                    <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Model</div>
                    <div className="space-y-1 h-[200px] overflow-y-auto scrollbar-thin pr-1">
                         {MODEL_SPECS.map(model => (
                            <SidebarItem 
                                key={model.id} 
                                icon={Box} 
                                label={model.name} 
                                subLabel={`${model.paramsB}B Params`}
                                active={modelId === model.id}
                                onClick={() => setModelId(model.id)}
                            />
                        ))}
                    </div>
                </div>

                <div className="p-4 bg-white border-t border-gray-100">
                    <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Parameters</div>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-xs mb-1.5">
                                <span className="text-gray-600">Input Tokens</span>
                                <span className="font-mono text-gray-400">{inputTokens}</span>
                            </div>
                            <input 
                                type="range" min="128" max="4096" step="128"
                                value={inputTokens}
                                onChange={(e) => setInputTokens(Number(e.target.value))}
                                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                            />
                        </div>
                         <div>
                            <div className="flex justify-between text-xs mb-1.5">
                                <span className="text-gray-600">Output Tokens</span>
                                <span className="font-mono text-gray-400">{outputTokens}</span>
                            </div>
                            <input 
                                type="range" min="64" max="2048" step="64"
                                value={outputTokens}
                                onChange={(e) => setOutputTokens(Number(e.target.value))}
                                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                            />
                        </div>
                    </div>
                </div>
              </div>

              {/* MAIN CONTENT (Display) */}
              <div className="flex-1 flex flex-col bg-white min-w-0 relative">
                
                {/* Toolbar */}
                <div className="h-14 border-b border-gray-100 flex items-center justify-between px-6 bg-white sticky top-0 z-20">
                    <div className="flex items-center gap-3">
                         <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-md border border-gray-100">
                             <Database size={14} className="text-gray-500"/>
                             <span className="text-sm font-medium text-gray-700">{selectedGpu?.name}</span>
                         </div>
                         <ArrowRight size={14} className="text-gray-300"/>
                         <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-md border border-gray-100">
                             <Box size={14} className="text-gray-500"/>
                             <span className="text-sm font-medium text-gray-700">{selectedModel?.name}</span>
                         </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button 
                            onClick={handleReset}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                        >
                            <RotateCcw size={18} />
                        </button>
                        <button 
                            onClick={handleStart}
                            disabled={runState === 'streaming' || runState === 'prefill'}
                            className="flex items-center gap-2 bg-black text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 disabled:pointer-events-none shadow-md shadow-black/20"
                        >
                            <Play size={14} fill="currentColor" />
                            Run Sim
                        </button>
                    </div>
                </div>

                {/* Dashboard Grid */}
                <div className="flex-1 overflow-y-auto p-6 bg-[#FAFAFA]">
                    
                    {/* Stats Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                        <StatCard 
                            label="Time to First Token" 
                            value={`${(estimate.ttftSeconds * 1000).toFixed(0)} ms`}
                            sub="Prompt Processing"
                            icon={Clock}
                            colorClass="bg-orange-100 text-orange-600"
                        />
                        <StatCard 
                            label="Generation Speed" 
                            value={`${estimate.decodeTps.toFixed(1)} T/s`}
                            sub="Decode Throughput"
                            icon={Activity}
                            colorClass="bg-emerald-100 text-emerald-600"
                        />
                         <StatCard 
                            label="Memory Used" 
                            value={`${estimate.vram?.requiredGB.toFixed(1)} GB`}
                            sub={`of ${selectedGpu?.vramGB} GB Available`}
                            icon={Database}
                            colorClass={cn("text-blue-600", estimate.vram?.fits ? "bg-blue-100" : "bg-red-100 text-red-600")}
                        />
                    </div>

                    {/* Terminal / Visualization */}
                    <div className="bg-[#1e1e1e] rounded-xl shadow-lg overflow-hidden flex flex-col h-[400px] border border-gray-800">
                        <div className="h-9 bg-[#2d2d2d] flex items-center px-4 gap-2 border-b border-gray-700">
                            <div className="w-2.5 h-2.5 rounded-full bg-gray-500" />
                            <div className="w-2.5 h-2.5 rounded-full bg-gray-500" />
                            <span className="ml-auto text-[10px] text-gray-500 font-mono">bash — 80x24</span>
                        </div>
                        <div className="flex-1 p-4 font-mono text-sm text-gray-300 overflow-y-auto scrollbar-thin">
                            {consoleText ? (
                                <div className="whitespace-pre-wrap leading-relaxed">
                                    {consoleText}
                                    <span className="inline-block w-2 h-4 bg-gray-400 ml-1 animate-pulse align-middle" />
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-gray-600 gap-3">
                                    <Zap size={32} className="opacity-20" />
                                    <p>Ready to simulate. Press Run.</p>
                                </div>
                            )}
                        </div>
                        {/* Progress Bar */}
                        {(runState === 'streaming' || runState === 'done') && (
                            <div className="h-1 bg-gray-800 w-full">
                                <motion.div 
                                    className="h-full bg-emerald-500"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(generatedTokens / outputTokens) * 100}%` }}
                                    transition={{ type: 'tween', ease: 'linear', duration: 0.1 }}
                                />
                            </div>
                        )}
                    </div>

                    {/* Footer Info */}
                    <div className="mt-4 flex items-center justify-between text-xs text-gray-400 px-1">
                        <div>Methodology: vLLM Benchmark Data + Interpolation</div>
                        <div className="flex items-center gap-2">
                             <div className={`w-2 h-2 rounded-full ${estimate.confidence === 'high' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                             {estimate.confidence === 'high' ? 'High Confidence' : 'Estimated'}
                        </div>
                    </div>

                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* --- SHOWCASE SECTION (Redesigned) --- */}
        <div className="w-full max-w-[1200px] mx-auto mt-24 mb-20">
             <div className="text-center mb-12">
                <span className="text-purple-600 font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500 text-sm tracking-widest uppercase">Under the Hood</span>
                <h2 className="text-3xl font-bold text-gray-900 mt-2">How we calculate performance</h2>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Feature 1 */}
                <BentoCard 
                    title="Real Benchmarks" 
                    desc="We don't just guess. We rely on a database of over 500+ real-world benchmark runs from vLLM, TGI, and TensorRT-LLM."
                >
                     <div className="mt-4 space-y-2">
                        {[
                            { label: "RTX 4090 / Llama 3 8B", val: "135 t/s" },
                            { label: "H100 / Mixtral 8x7B", val: "320 t/s" },
                            { label: "A100 / Qwen 72B", val: "45 t/s" },
                        ].map((i,k) => (
                            <div key={k} className="flex justify-between items-center text-xs p-2 bg-gray-50 rounded border border-gray-100">
                                <span className="font-mono text-gray-500">{i.label}</span>
                                <span className="font-bold text-gray-900">{i.val}</span>
                            </div>
                        ))}
                     </div>
                </BentoCard>

                {/* Feature 2 */}
                <BentoCard 
                    title="Memory Physics" 
                    desc="We simulate the VRAM impact of KV-Cache size, Model Weights (based on quantization), and CUDA overhead."
                    className="md:col-span-2 lg:col-span-1"
                >
                    <div className="mt-6 flex items-center justify-center gap-1">
                        <div className="h-16 w-8 bg-blue-200 rounded-l-md border-r border-white/50 flex items-center justify-center text-[10px] text-blue-800 font-bold writing-v">KV</div>
                        <div className="h-16 w-24 bg-indigo-200 border-r border-white/50 flex items-center justify-center text-[10px] text-indigo-800 font-bold">Weights</div>
                        <div className="h-16 w-4 bg-gray-200 rounded-r-md flex items-center justify-center text-[10px] text-gray-500 writing-v">OS</div>
                    </div>
                    <div className="text-center text-[10px] text-gray-400 mt-2">Visual representation of VRAM allocation</div>
                </BentoCard>

                {/* Feature 3 (Wide) */}
                <BentoCard 
                    title="Specs Database" 
                    desc="Full specifications for all major Consumer and Datacenter GPUs."
                    className="md:col-span-2 lg:col-span-3"
                >
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                        {[
                            { t: "RTX 4090", d: "24GB G6X" },
                            { t: "RTX 5090", d: "32GB G7 (Est)" },
                            { t: "H100 SXM", d: "80GB HBM3" },
                            { t: "A100 PCIe", d: "80GB HBM2e" },
                        ].map((g,i) => (
                            <div key={i} className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl border border-gray-100/50 hover:bg-white hover:shadow-md transition-all cursor-default">
                                <Cpu className="text-gray-400 mb-2" size={20} />
                                <div className="font-bold text-sm text-gray-800">{g.t}</div>
                                <div className="text-xs text-gray-400">{g.d}</div>
                            </div>
                        ))}
                    </div>
                </BentoCard>
             </div>
        </div>

        {/* Footer */}
        <div className="mt-12 mb-4 text-[11px] text-gray-400 flex items-center gap-2">
            <span>Designed for builders.</span>
            <div className="w-1 h-1 bg-gray-300 rounded-full" />
            <span>SimulBench © 2024</span>
        </div>

      </main>
    </div>
  );
}