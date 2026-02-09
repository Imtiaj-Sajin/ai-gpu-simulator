// src/components/simulator/SimulatorPage.tsx
'use client';
import { useEffect, useMemo, useState } from "react";
import { GPU_SPECS, MODEL_SPECS } from "@/data/simulatorDataset";
import { estimatePerformance, type Precision, type WorkloadMode } from "@/lib/sim/estimator";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HeroSection } from "./HeroSection";
import { LandingSections } from "./LandingSections";
import { motion } from "framer-motion";
import { 
  Github, 
  Globe, 
  Mail, 
  Briefcase, 
  Cpu, 
  Zap, 
  BarChart3, 
  ArrowUpRight 
} from "lucide-react";

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
      {/* ===== CORNER-ONLY NOISE ===== */}
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

// --- New Animated & SEO Friendly Footer ---
function Footer() {
  const socialLinks = [
    { 
      icon: Github, 
      href: "https://github.com/Imtiaj-Sajin", 
      label: "GitHub",
      color: "hover:text-black hover:bg-black/5" 
    },
    { 
      icon: Globe, 
      href: "https://imtiaj-sajin.github.io/", 
      label: "Portfolio",
      color: "hover:text-blue-600 hover:bg-blue-50"
    },
    { 
      icon: Briefcase, 
      href: "https://www.fiverr.com/imtiaj_sajin/", 
      label: "Fiverr",
      color: "hover:text-green-600 hover:bg-green-50"
    },
    { 
      icon: Mail, 
      href: "mailto:imtiajsajin@gmail.com", 
      label: "Email",
      color: "hover:text-red-600 hover:bg-red-50"
    },
  ];

  return (
    <footer className="relative z-10 pt-16 pb-8 border-t border-gray-200/60 bg-white/60 backdrop-blur-xl">
      {/* Decorative Dot Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }} 
      />

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-bold text-lg tracking-tight text-gray-900 select-none">
              <div className="p-1.5 bg-black rounded-lg text-white">
                <Cpu className="w-4 h-4" />
              </div>
              <span>AI x GPU Sim</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              Simulate LLM inference speeds, estimate VRAM usage, and compare GPU benchmarks in real-time.
              Built for researchers and AI engineers.
            </p>
          </div>

          {/* Quick Links (SEO) */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wider">Resources</h3>
            <ul className="space-y-2.5">
              {[
                { label: 'GPU Benchmarks', href: '#' },
                { label: 'LLM Formulas', href: '#' },
                { label: 'VRAM Calculator', href: '#' },
                { label: 'Model Dataset', href: '#' }
              ].map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-sm text-gray-500 hover:text-black transition-colors flex items-center group">
                    {item.label}
                    <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Features (SEO Keywords) */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wider">Capabilities</h3>
            <ul className="space-y-2.5">
              {[
                { label: 'Prefill Speed (TTFT)', icon: Zap },
                { label: 'Decode Throughput', icon: BarChart3 },
                { label: 'Memory Bandwidth', icon: Cpu },
              ].map((item) => (
                <li key={item.label} className="flex items-center text-sm text-gray-500">
                  <item.icon className="w-3.5 h-3.5 mr-2 text-gray-400" />
                  {item.label}
                </li>
              ))}
            </ul>
          </div>

          {/* Developer / Connect */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wider">Developer</h3>
            <div className="flex flex-wrap gap-2">
              {socialLinks.map((link) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className={`p-2.5 rounded-full bg-white border border-gray-200 text-gray-500 transition-all shadow-sm ${link.color}`}
                  whileHover={{ y: -3, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <link.icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
            <div className="mt-4 text-xs text-gray-400">
              Open for collaborations & custom AI development.
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-500">
            © {new Date().getFullYear()} Imtiaj Sajin. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm font-medium text-gray-500">
            <a href="#" className="hover:text-black transition-colors">Privacy</a>
            <a href="#" className="hover:text-black transition-colors">Terms</a>
            <a href="#" className="hover:text-black transition-colors">Sitemap</a>
          </div>
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