// src/components/simulator/FaqSection.tsx
'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DotLoader } from "@/components/ui/dot-loader";
import { cn } from "@/lib/utils";
import { Plus, Minus } from "lucide-react";

// --- FAQ SPECIFIC ANIMATIONS (7x7 Grid Indices) ---

// 1. QUESTION MARK (The "Ask")
const animQuestion = [
    [10, 11, 12, 16, 20, 25, 31, 38], // ? shape
    [10, 11, 12, 16, 20, 24, 31, 38], // Slight shift
];

// 2. VRAM/CHIP (Memory)
const animVram = [
    [2, 4, 10, 12, 18, 20, 26, 28, 34, 36, 42, 44], // Columns
    [2, 4, 10, 12, 18, 20, 26, 28, 34, 36, 42, 44, 24], // Center flash
];

// 3. SPEED/FAST (Arrow)
const animSpeed = [
    [22, 16, 10, 4], // Tail
    [22, 16, 10, 4, 3, 5], // Arrowhead
    [29, 23, 17, 11, 10, 12], // Moved
];

// 4. MONEY/SAVING ($)
const animMoney = [
    [11, 17, 24, 31, 37, 4, 46], // S shape + line
    [10, 12, 16, 18, 23, 25, 30, 32, 36, 38, 4, 46], // Bolder
];

// 5. SCALE/MULTI (Layers)
const animScale = [
    [42, 43, 44, 45, 46], // Bottom
    [42, 43, 44, 45, 46, 35, 36, 37, 38, 39], // 2 layers
    [42, 43, 44, 45, 46, 35, 36, 37, 38, 39, 28, 29, 30, 31, 32], // 3 layers
];

// 6. TARGET/ACCURACY
const animTarget = [
    [0, 6, 42, 48], // Corners
    [0, 6, 42, 48, 16, 18, 30, 32], // Inner
    [0, 6, 42, 48, 16, 18, 30, 32, 24], // Bullseye
];

const faqs = [
    {
        id: "hardware",
        icon: animQuestion,
        question: "How does this simulator help me?",
        answer: "It allows you to 'test drive' expensive GPUs (RTX 4090, H100) against models like Llama 3 or Mixtral before buying. Avoid spending $2,000+ on a card that runs out of VRAM."
    },
    {
        id: "vram",
        icon: animVram,
        question: "How is VRAM calculated?",
        answer: "We estimate weights (params × precision) + KV-cache (context length) + activation overhead. For example, a 70B model at INT4 needs ~40GB VRAM. Our tool does this math instantly."
    },
    {
        id: "ttft",
        icon: animSpeed,
        question: "TTFT vs Decode Speed?",
        answer: "TTFT (Time To First Token) is responsiveness—how fast the first word appears. Decode Speed is throughput—how fast the rest follows. Chatbots need low TTFT; batch jobs need high Decode."
    },
    {
        id: "quant",
        icon: animMoney,
        question: "Why use Quantization (INT4)?",
        answer: "INT4 reduces memory usage by ~50% vs FP16 with minimal accuracy loss. It often enables running 70B+ models on consumer hardware (like dual 3090s) instead of needing enterprise GPUs."
    },
    {
        id: "acc",
        icon: animTarget,
        question: "Are benchmarks accurate?",
        answer: "They are based on real-world data (vLLM, TensorRT) and theoretical bandwidth limits. While specific drivers or CPU bottlenecks vary, these estimates are reliable 'best-case' ceilings."
    },
    {
        id: "scale",
        icon: animScale,
        question: "Multi-GPU support?",
        answer: "Yes. Use 'Throughput Mode' in Advanced Settings to simulate larger batches. For VRAM, simply ensure your total pool (e.g., 2x 24GB = 48GB) exceeds the 'Required VRAM' figure."
    },
];

export function FaqSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="relative z-10 py-24 px-4 mx-auto max-w-5xl" id="faq">
            
            {/* Section Header with Tech Vibe */}
            <div className="flex flex-col items-center text-center mb-16 space-y-4">
                <div className="flex items-center gap-2 px-3 py-1 bg-black/5 rounded-full border border-black/5">
                    <div className="w-2 h-2 rounded-full bg-black animate-pulse" />
                    <span className="text-[10px] font-mono font-medium tracking-widest uppercase text-gray-500">
                        System.Help
                    </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
                    Frequently Asked Questions
                </h2>
                <p className="text-gray-500 max-w-lg text-sm md:text-base">
                    Understanding hardware bottlenecks is critical. Here is how our simulation engine calculates performance.
                </p>
            </div>

            {/* The "Terminal" Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {faqs.map((faq, idx) => {
                    const isOpen = openIndex === idx;
                    return (
                        <div
                            key={faq.id}
                            onClick={() => setOpenIndex(isOpen ? null : idx)}
                            className={cn(
                                "group cursor-pointer relative overflow-hidden rounded-xl border transition-all duration-300 ease-out",
                                isOpen 
                                    ? "bg-black text-white border-black shadow-xl scale-[1.02]" 
                                    : "bg-white text-gray-900 border-gray-200 hover:border-gray-300 hover:shadow-md"
                            )}
                        >
                            {/* Header Line */}
                            <div className="flex items-start gap-4 p-5">
                                {/* The Pixel Icon */}
                                <div className={cn(
                                    "shrink-0 p-2 rounded-lg transition-colors",
                                    isOpen ? "bg-white/10" : "bg-gray-50 group-hover:bg-gray-100"
                                )}>
                                    <DotLoader 
                                        frames={faq.icon} 
                                        isPlaying={isOpen || undefined} // Always animate if open, else hover triggers via CSS? No, standard logic.
                                        repeatCount={-1} 
                                        duration={200}
                                        className="gap-0.5"
                                        dotClassName={cn(
                                            "size-1 transition-colors duration-300",
                                            isOpen ? "bg-white/20 [&.active]:bg-white" : "bg-black/10 [&.active]:bg-black/80"
                                        )}
                                    />
                                </div>

                                <div className="flex-1 pt-1">
                                    <h3 className={cn(
                                        "text-sm font-semibold tracking-tight transition-colors flex items-center justify-between",
                                        isOpen ? "text-white" : "text-gray-900"
                                    )}>
                                        {faq.question}
                                        {isOpen ? <Minus size={14} className="opacity-50" /> : <Plus size={14} className="opacity-50" />}
                                    </h3>
                                    
                                    <AnimatePresence>
                                        {isOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                                animate={{ height: "auto", opacity: 1, marginTop: 12 }}
                                                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <p className="text-xs leading-relaxed text-gray-400 font-mono">
                                                    {faq.answer}
                                                </p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                            
                            {/* Decorative Corner for Tech Feel */}
                            {isOpen && (
                                <div className="absolute top-0 right-0 p-2">
                                    <div className="w-1.5 h-1.5 bg-white/20 rounded-full" />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Bottom Decor */}
            <div className="mt-16 flex justify-center opacity-30">
                 <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
                    ))}
                 </div>
            </div>

            {/* SEO JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        "mainEntity": faqs.map(f => ({
                            "@type": "Question",
                            "name": f.question,
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": f.answer
                            }
                        }))
                    })
                }}
            />
        </section>
    );
}