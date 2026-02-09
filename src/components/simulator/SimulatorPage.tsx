// src/components/simulator/SimulatorPage.tsx
'use client';
import { useEffect, useMemo, useState } from "react";
import { GPU_SPECS, MODEL_SPECS } from "@/data/simulatorDataset";
import { estimatePerformance, type Precision, type WorkloadMode } from "@/lib/sim/estimator";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HeroSection } from "./HeroSection";
import { LandingSections } from "./LandingSections";

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

function Footer() {
  return (
    <footer className="relative z-10 border-t border-gray-200 bg-white/50 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="text-center text-sm text-gray-600">
          © 2025 AI × GPU Simulator · Built with precision
        </div>
      </div>
    </footer>
  );
}

export default function SimulatorPage() {
  const [gpuId, setGpuId] = useState<string>("rtx-5090");
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

  return (
    <TooltipProvider delayDuration={200}>
      <div className="min-h-screen bg-[#F9F9F9] font-sans text-gray-900 relative overflow-hidden selection:bg-pink-200/50">
        <Background />
        <HeroSection 
          gpuId={gpuId}
          setGpuId={setGpuId}
          modelId={modelId}
          setModelId={setModelId}
          inputTokens={inputTokens}
          setInputTokens={setInputTokens}
          outputTokens={outputTokens}
          setOutputTokens={setOutputTokens}
          context={context}
          setContext={setContext}
          precision={precision}
          setPrecision={setPrecision}
          throughputMode={throughputMode}
          setThroughputMode={setThroughputMode}
          batchSize={batchSize}
          setBatchSize={setBatchSize}
          concurrency={concurrency}
          setConcurrency={setConcurrency}
          estimate={estimate}
        />
        <LandingSections 
          selectedGpuId={gpuId}
          selectedModelId={modelId}
          precision={precision}
          context={context}
          estimate={estimate}
        />
        <Footer />
      </div>
    </TooltipProvider>
  );
}