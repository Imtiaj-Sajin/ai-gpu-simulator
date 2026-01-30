"use client";

import { useState } from "react";
import { DotLoader } from "@/components/ui/dot-loader";

// --- THEMES ---

// 1. CHART (Bar graph rising) - For Benchmarks
const chartFrames = [
    [42, 43, 44, 45, 46, 47, 48], // Base line
    [42, 43, 44, 45, 46, 47, 48, 35, 37, 39], // Low bars
    [42, 43, 44, 45, 46, 47, 48, 35, 37, 39, 28, 30], // Mid bars
    [42, 43, 44, 45, 46, 47, 48, 35, 37, 39, 28, 30, 21], // High bars
    [42, 43, 44, 45, 46, 47, 48, 35, 37, 39, 28, 30, 21, 14], // Peak
    [42, 43, 44, 45, 46, 47, 48, 35, 37, 39, 28, 30],
    [42, 43, 44, 45, 46, 47, 48, 35, 37, 39],
];

// 2. CHIP (Processor pulsing) - For GPU Specs
const chipFrames = [
    [24], // Center
    [24, 17, 23, 25, 31], // Inner cross
    [17, 23, 25, 31, 10, 16, 18, 22, 26, 30, 32, 38], // Box
    [24, 17, 23, 25, 31], // Inner cross
];

// 3. MATH (Calculations/Noise) - For Formulas
const mathFrames = [
    [24, 16, 32, 22, 26], // X shape
    [17, 31, 23, 25],     // + shape
    [10, 12, 36, 38, 24], // Corners
    [0, 6, 42, 48, 24],   // Far Corners
];

// 4. NEURAL (Network nodes) - For Models
const neuralFrames = [
    [0, 6, 24, 42, 48],
    [8, 12, 24, 36, 40],
    [16, 18, 24, 30, 32],
    [24],
    [16, 18, 24, 30, 32],
    [8, 12, 24, 36, 40],
];

// 5. SCAN (Searching/Reading) - For Methodology
const scanFrames = [
    [0, 1, 2, 3, 4, 5, 6],
    [7, 8, 9, 10, 11, 12, 13],
    [14, 15, 16, 17, 18, 19, 20],
    [21, 22, 23, 24, 25, 26, 27],
    [28, 29, 30, 31, 32, 33, 34],
    [35, 36, 37, 38, 39, 40, 41],
    [42, 43, 44, 45, 46, 47, 48],
    [],
];

// 6. PROCESS (Steps/Loading) - For How It Works
const processFrames = [
    [0],
    [0, 8],
    [0, 8, 16],
    [0, 8, 16, 24],
    [0, 8, 16, 24, 32],
    [0, 8, 16, 24, 32, 40],
    [0, 8, 16, 24, 32, 40, 48],
    [],
];

export type AnimationType = "chart" | "chip" | "math" | "neural" | "scan" | "process";

const ANIMATIONS: Record<AnimationType, number[][]> = {
    chart: chartFrames,
    chip: chipFrames,
    math: mathFrames,
    neural: neuralFrames,
    scan: scanFrames,
    process: processFrames,
};

export const SectionAnimator = ({ type }: { type: AnimationType }) => {
    const frames = ANIMATIONS[type];
    
    // Simple self-resetting index logic
    const [index, setIndex] = useState(0);
    const handleComplete = () => setIndex((prev) => (prev + 1) % frames.length);

    // If using the DotLoader with internal timer, we can just let it loop if we pass repeatCount={-1}
    // But since our arrays are simple, let's just cycle.

    return (
        <div className="opacity-40 grayscale transition-all duration-500 hover:opacity-100 hover:grayscale-0">
            <DotLoader
                frames={frames}
                isPlaying={true}
                duration={180}
                repeatCount={-1} // Loop forever
                className="gap-0.5"
                dotClassName="bg-black/10 [&.active]:bg-black/60 size-1"
            />
        </div>
    );
};