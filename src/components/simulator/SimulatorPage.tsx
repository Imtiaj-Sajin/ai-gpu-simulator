// src/components/simulator/SimulatorPage.tsx
'use client';

import { useEffect, useMemo, useState } from "react";
import { estimatePerformance, type Precision, type WorkloadMode } from "@/lib/sim/estimator";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HeroSection } from "./HeroSection";
import { LandingSections } from "./LandingSections";
import { Footer } from "./Footer"; // Import the new Footer
import { FaqSection } from "./FaqSection";

// --- Background Component ---
const Background = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-[#F9F9F9]">
      {/* Left Wing */}
      <div
        className="absolute top-0 left-0 h-full w-[28vw] flex"
        style={{
          maskImage: 'radial-gradient(ellipse at 0% 0%, black 42%, transparent 72%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 0% 0%, black 42%, transparent 72%)',
        }}
      >
        {['#EFEFEF', '#F2F2F2', '#F5F5F5', '#F7F7F7', '#F9F9F9', '#FBFBFB'].map((color, i) => (
          <div key={i} className="flex-1" style={{ backgroundColor: color }} />
        ))}
      </div>
      {/* Right Wing */}
      <div
        className="absolute top-0 right-0 h-full w-[28vw] flex"
        style={{
          maskImage: 'radial-gradient(ellipse at 100% 0%, black 42%, transparent 72%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 100% 0%, black 42%, transparent 72%)',
        }}
      >
        {['#EADCF5', '#E6C6E8', '#E6B2D6', '#F2B0B0', '#F4BABA', '#F7CACA'].map((color, i) => (
          <div key={i} className="flex-1" style={{ backgroundColor: color }} />
        ))}
      </div>
      {/* Noise */}
      <div
        className="absolute inset-0 opacity-[0.12] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          maskComposite: 'add',
          WebkitMaskComposite: 'add',
        }}
      />
    </div>
  );
};

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
      <main
        id="simulator"
        className="min-h-screen bg-[#F9F9F9] font-sans text-gray-900 relative overflow-hidden selection:bg-pink-200/50"
      >
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
                <FaqSection />

        <SeoContent />

        <Footer />
      </main>
    </TooltipProvider>
  );
}

/**
 * Keyword-rich, crawlable content block.
 * Collapsed by default for a clean UI — uses native <details> so the full
 * text is still in the DOM and indexed by Googlebot, ChatGPT, Perplexity, etc.
 * Google has publicly confirmed content inside <details> is fully indexed.
 */
function SeoContent() {
  return (
    <section
      aria-labelledby="seo-guide-heading"
      className="relative z-10 mx-auto max-w-7xl px-4 pb-16 text-gray-700"
    >
      <details className="group rounded-2xl border border-gray-200 bg-white/60 backdrop-blur-sm shadow-sm transition-all open:shadow-md">
        <summary
          className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-2xl px-5 py-4 hover:bg-gray-50/80 [&::-webkit-details-marker]:hidden"
        >
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono font-medium tracking-widest uppercase text-gray-500">
              Guide
            </span>
            <h2 id="seo-guide-heading" className="text-base md:text-lg font-semibold tracking-tight text-gray-900">
              Choosing the right GPU for local LLM inference in 2026
            </h2>
          </div>
          <span
            aria-hidden="true"
            className="shrink-0 rounded-full border border-gray-200 px-2 py-0.5 text-xs text-gray-500 transition-transform group-open:rotate-180"
          >
            ▾
          </span>
        </summary>

        <article className="prose prose-sm md:prose-base max-w-none px-5 pb-6 pt-2 prose-headings:text-gray-900 prose-a:text-pink-600">
        <p>
          Picking the right GPU for running large language models locally is less about raw compute
          and more about <strong>memory bandwidth</strong> and <strong>VRAM capacity</strong>. Token
          generation is memory-bound: the GPU spends most of its time streaming model weights from
          VRAM, not doing math. That is why an RTX 4090 at INT4 quantization can outrun an A100 FP16
          on small models — and why an H100 80&nbsp;GB still wins for large-batch serving.
        </p>

        <h3>How much VRAM do you actually need?</h3>
        <p>
          Our simulator estimates VRAM as <em>weights + KV-cache + activation overhead</em>. A rough
          rule of thumb for a 4&nbsp;K context window:
        </p>
        <ul>
          <li><strong>Llama 3.1 8B</strong> — ~16&nbsp;GB FP16, ~9&nbsp;GB INT8, ~6&nbsp;GB INT4.</li>
          <li><strong>Mistral 7B / Qwen 2.5 7B</strong> — ~14&nbsp;GB FP16, ~8&nbsp;GB INT8, ~5&nbsp;GB INT4.</li>
          <li><strong>Mixtral 8x7B</strong> — ~90&nbsp;GB FP16, ~48&nbsp;GB INT8, ~26&nbsp;GB INT4.</li>
          <li><strong>Llama 3.1 70B</strong> — ~140&nbsp;GB FP16, ~75&nbsp;GB INT8, ~40&nbsp;GB INT4.</li>
          <li><strong>Qwen 2.5 72B</strong> — similar to Llama 70B.</li>
        </ul>
        <p>
          Long contexts (32&nbsp;K, 64&nbsp;K, 128&nbsp;K) add significant KV-cache pressure — sometimes
          more than the weights themselves — so the simulator also recalculates VRAM as you raise the
          context window.
        </p>

        <h3>Best GPUs for local LLMs at each budget tier</h3>
        <ul>
          <li><strong>$800–$1,200 (used)</strong> — RTX 3090 (24&nbsp;GB). Still the sweet spot for
            running 30B-class models at INT4 on a single card.</li>
          <li><strong>$1,600–$2,000 (new)</strong> — RTX 4090 (24&nbsp;GB). Faster memory bandwidth,
            higher FP16 TFLOPs, better for batched serving.</li>
          <li><strong>$2,500+ (new)</strong> — RTX 5090 (32&nbsp;GB). Roughly 72% faster decode than
            the 4090 in our benchmark dataset for 7B-class models at INT4.</li>
          <li><strong>Dual-GPU builds</strong> — 2× RTX 3090 (48&nbsp;GB combined) or 2× RTX 4090
            (48&nbsp;GB combined) — enable 70B-class models at INT4 without datacenter hardware.</li>
          <li><strong>Datacenter</strong> — H100 SXM 80&nbsp;GB for production serving; A100 80&nbsp;GB
            for cost-sensitive training/inference; L40S for balanced deployments.</li>
        </ul>

        <h3>Quantization is the highest-leverage knob</h3>
        <p>
          Moving from FP16 to INT4 (via GPTQ or AWQ) typically cuts VRAM in half and can
          <strong> double or triple decode throughput</strong> because the model becomes easier to
          stream out of VRAM. Accuracy loss on well-calibrated INT4 weights is small — usually a
          fraction of a point on standard benchmarks — and for most chat/coding workloads it is
          imperceptible.
        </p>

        <h3>TTFT vs tokens/sec — which matters?</h3>
        <p>
          <strong>Time-to-first-token (TTFT)</strong> is prefill latency — how long before the first
          token appears. It is compute-bound and scales with your prompt length. <strong>Decode
          tokens/sec</strong> is the streaming rate after that. Chat UX is dominated by TTFT; batch
          summarization and agent loops are dominated by decode throughput. Our simulator reports both
          so you can tune the right one.
        </p>

        <h3>Methodology &amp; data sources</h3>
        <p>
          Benchmarks in this tool come from vLLM release notes, NVIDIA TensorRT-LLM benchmarks, Meta
          Llama, Mistral and Qwen model cards, TechPowerUp GPU specs, and reproducible community
          studies. Where a datapoint is missing, we scale from the closest match using a conservative
          memory-bandwidth-limited model, then clamp with size-based ceilings to avoid unrealistic
          numbers. Confidence is surfaced per result as <em>high</em>, <em>medium</em>, or <em>low</em>.
        </p>

        <p className="text-xs text-gray-500">
          This page is maintained by <a href="https://imtiaj-sajin.github.io/" rel="author">Imtiaj Sajin</a>.
          Contributions and corrections are welcome on{" "}
          <a href="https://github.com/Imtiaj-Sajin/ai-gpu-simulator" rel="noopener noreferrer">GitHub</a>.
        </p>
        </article>
      </details>
    </section>
  );
}