"use client";

import { useState } from "react";
import { DotLoader } from "@/components/ui/dot-loader";

// --- THEMES ---

// 1. CHART (Bar graph rising) - For Benchmarks
const chartFrames = [
    [42, 44, 46, 48], // Base
    [35, 42, 44, 46, 39, 48],
    [28, 35, 42, 37, 44, 46, 32, 39, 48],
    [21, 28, 35, 42, 30, 37, 44, 46, 25, 32, 39, 48], // High Peak
    [28, 35, 42, 37, 44, 46, 32, 39, 48],
    [35, 42, 30, 37, 44, 39, 46, 48], // Variation
    [42, 23, 30, 37, 44, 46, 32, 39, 48],
    [42, 44, 46, 48], // Reset
];


// 2. CHIP (Processor pulsing) - For GPU Specs
const chipBase = [
    2, 4, 14, 20, 28, 34, 44, 46, // Pins
    10, 11, 12, 16, 22, 18, 26, 30, 32, 36, 37, 38 // Square Body
];
const chipPulse1 = [...chipBase, 24]; // Core light
const chipPulse2 = [...chipBase, 24, 17, 23, 25, 31]; // Inner ring
const chipPulse3 = [...chipBase, 24, 17, 23, 25, 31, 9, 13, 35, 39]; // Outer corners
const chipFrames = [
    chipBase,
    chipPulse1,
    chipPulse2,
    chipPulse3,
    chipPulse2,
    chipPulse1,
];
// 3. MATH (Calculations/Noise) - For Formulas
const mathFrames = [
    [24, 16, 32, 22, 26], // X shape
    [17, 31, 23, 25],     // + shape
    [10, 12, 36, 38, 24], // Corners
    [0, 6, 42, 48, 24],   // Far Corners
];

// --- 4. NEURAL: "The Mind" (AI Thinking) ---
const robotCore = [
  // Antenna
  3,
  10,

  // Head shell
  8, 9, 11, 12,
  15, 19,
  22, 26,
  29, 33,
  36, 37, 38, 39
];

const robotIdle1 = [
  ...robotCore,
  16, 18,
  31
];

const robotIdle2 = [
  ...robotCore,
  16, 18,
  30, 32
];
const robotBlink1 = [
  ...robotCore,
  17,
  31
];

const robotBlink2 = [
  ...robotCore,
  31
];
const robotAntennaPulse1 = [
  ...robotCore,
  16, 18,
  10
];

const robotAntennaPulse2 = [
  ...robotCore,
  16, 18,
  3, 10
];
const robotScanLeft = [
  ...robotCore,
  15,
  31
];

const robotScanRight = [
  ...robotCore,
  19,
  31
];
const robotTalk1 = [
  ...robotCore,
  16, 18,
  31
];

const robotTalk2 = [
  ...robotCore,
  16, 18,
  30, 32
];

const robotTalk3 = [
  ...robotCore,
  16, 18,
  38
];

 
 
// The sequence: Idle -> Blink -> Idle -> Talk -> Scan -> Idle
const neuralFrames = [
  robotIdle1,
  robotIdle2,

  robotBlink1,
  robotBlink2,
  robotIdle1,

  robotAntennaPulse1,
  robotAntennaPulse2,
  robotAntennaPulse1,

  robotScanLeft,
  robotScanRight,
  robotScanLeft,

  robotTalk1,
  robotTalk2,
  robotTalk3,
  robotTalk1,

  robotIdle2,
  robotIdle1,
];


// --- 5. SCAN: "Target Lock" (Methodology) ---
// Corners closing in on a center point, then locking
const scan1 = [0, 6, 42, 48]; // Far corners
const scan2 = [8, 12, 36, 40]; // Mid corners
const scan3 = [16, 18, 30, 32]; // Close corners
const scan4 = [24]; // Center dot
const scanLock = [16, 18, 30, 32, 24]; // Bracket + Center
const scanFrames = [
    scan1, scan2, scan3, scan4, 
    scanLock, [], scanLock, [], scanLock // Blink effect at end
];

// --- 6. PROCESS: "The Pipeline" (Step-by-Step) ---
// A snake/pipeline moving data from top-left to bottom-right
const processFrames = [
    [0],
    [0, 1],
    [1, 2],
    [2, 3, 10],
    [3, 10, 17],
    [10, 17, 24],
    [17, 24, 31, 32],
    [24, 31, 32, 33],
    [31, 32, 33, 40],
    [32, 33, 40, 47],
    [33, 40, 47, 48],
    [40, 47, 48],
    [47, 48],
    [48],
    []
];


// --- 5. MATRIX RAIN (Digital Fall) ---
const rain = [
     [24], // Center dot
    [24, 25], // Sweep starts
    [24, 26, 33], // 3 o'clock
    [24, 27, 34, 41], // 4 o'clock
    [24, 32, 40, 48], // 6 o'clock
    [24, 31, 38, 45], // 7 o'clock
    [24, 30, 36, 42], // 8 o'clock
    [24, 23, 22, 21], // 9 o'clock
    [24, 17, 10, 3], // 12 o'clock (complete)
    [24], 
];

// ==========================   ==========================
// ========more animation library------sajin
// --- CLASSIC MATRIX DIGITAL RAIN (Multiple Streams) ---
const matrixRain = [
    [1, 3, 5, 10, 15, 20, 28, 35],
    [8, 10, 12, 17, 22, 27, 35, 42],
    [15, 17, 19, 24, 29, 34, 42, 0],
    [22, 24, 26, 31, 36, 41, 48, 7],
    [29, 31, 33, 38, 43, 48, 6, 14],
    [36, 38, 40, 45, 1, 5, 13, 21],
    [43, 45, 47, 3, 8, 12, 20, 28],
    [1, 3, 5, 10, 15, 20, 28, 35],
];

// --- RETRO COMPUTER BOOT SEQUENCE ---
const bootSequence = [
    [0], // Start
    [0, 1, 2, 3, 4, 5, 6], // Top line loads
    [0, 1, 2, 3, 4, 5, 6, 7, 14, 21, 28, 35, 42], // Left edge
    [0, 1, 2, 3, 4, 5, 6, 48, 41, 34, 27, 20, 13], // Right edge
    [42, 43, 44, 45, 46, 47, 48], // Bottom line
    Array.from({ length: 49 }, (_, i) => i).filter(i => i % 3 === 0), // Scanlines
    Array.from({ length: 49 }, (_, i) => i), // Full screen
    [24], // Cursor blink
    [],
    [24],
];

// --- SNAKE GAME (Moving Through Grid) ---
const snake = [
    [24, 23, 22], // Start small
    [25, 24, 23, 22],
    [26, 25, 24, 23, 22],
    [33, 26, 25, 24, 23],
    [40, 33, 26, 25, 24],
    [47, 40, 33, 26, 25],
    [46, 47, 40, 33, 26],
    [45, 46, 47, 40, 33],
    [38, 45, 46, 47, 40],
    [31, 38, 45, 46, 47],
    [30, 31, 38, 45, 46],
    [29, 30, 31, 38, 45],
];

// --- RETRO TV STATIC/NOISE ---
const tvStatic = [
    [2, 5, 9, 14, 18, 23, 29, 35, 40, 44],
    [1, 7, 12, 16, 21, 27, 32, 38, 43, 47],
    [3, 8, 11, 19, 24, 28, 34, 39, 42, 46],
    [0, 6, 13, 17, 22, 26, 31, 37, 41, 48],
    [4, 10, 15, 20, 25, 30, 36, 40, 45, 2],
    [5, 9, 14, 19, 23, 33, 38, 42, 1, 7],
];

// --- PACMAN CHASE ---
const pacman = [
    [17, 23, 24, 25, 31], // Pacman facing right (mouth closed)
    [17, 23, 25, 31], // Mouth open
    [18, 24, 25, 26, 32, 34, 35], // Pacman + ghost behind
    [19, 25, 26, 27, 33, 35, 36, 42], // Moving right
    [20, 26, 27, 28, 34, 36, 37, 43], // Keep chasing
    [20, 26, 28, 34], // Caught! (ghost disappears)
    [20, 26, 27, 28, 34], // Pacman alone
];

// --- SPACE INVADERS INVASION (Row March) ---
const invasion = [
    [9, 11, 13], // Top row
    [9, 11, 13, 16, 18, 20], // Two rows
    [2, 4, 6, 9, 11, 13, 16, 18, 20], // Three rows
    [9, 11, 13, 16, 18, 20, 23, 25, 27], // Move down
    [16, 18, 20, 23, 25, 27, 30, 32, 34], // Advance
    [23, 25, 27, 30, 32, 34, 37, 39, 41], // Getting closer
    [30, 32, 34, 37, 39, 41, 44, 46, 48], // Landing!
    [37, 39, 41, 44, 46, 48], // Bottom two rows
];

// --- TETRIS FALLING BLOCKS ---
const tetris = [
    [2, 3, 10], // L-piece top
    [9, 10, 17], // Falling
    [16, 17, 25], // Keep falling
    [23, 24, 32], // Almost down
    [30, 31, 39], // Landing
    [37, 38, 46, 42, 43, 44, 45], // New line appears + base
    [42, 43, 44, 45, 46, 47, 48], // Line complete
    [], // Clear!
];

// --- BREAKOUT/ARKANOID ---
const breakout = [
    [1, 2, 3, 4, 5, 8, 9, 10, 11, 12, 15, 16, 17, 18, 19, 24, 45, 46, 47], // Bricks + paddle + ball
    [1, 2, 3, 4, 5, 8, 9, 10, 11, 12, 15, 16, 17, 18, 19, 31, 44, 45, 46], // Ball moving
    [1, 2, 3, 4, 5, 8, 9, 10, 11, 12, 15, 17, 18, 19, 17, 43, 44, 45], // Hit brick!
    [1, 2, 3, 4, 5, 8, 9, 10, 11, 12, 15, 17, 19, 10, 42, 43, 44], // Another brick
    [1, 2, 3, 4, 5, 8, 9, 10, 11, 12, 15, 19, 3, 41, 42, 43], // Keep going
];

// --- RETRO RADAR SWEEP ---
const radar = [
    [24], // Center dot
    [24, 25], // Sweep starts
    [24, 26, 33], // 3 o'clock
    [24, 27, 34, 41], // 4 o'clock
    [24, 32, 40, 48], // 6 o'clock
    [24, 31, 38, 45], // 7 o'clock
    [24, 30, 36, 42], // 8 o'clock
    [24, 23, 22, 21], // 9 o'clock
    [24, 17, 10, 3], // 12 o'clock (complete)
    [24], // Reset
];

// --- PONG GAME ---
const pong = [
    [7, 14, 21, 24, 41, 48], // Left paddle + ball + right paddle
    [7, 14, 21, 25, 41, 48], // Ball moves right
    [7, 14, 21, 26, 41, 48],
    [7, 14, 21, 33, 41, 48],
    [7, 14, 21, 40, 41, 48], // Ball hits right paddle
    [7, 14, 21, 33, 40, 47], // Bounces back
    [7, 14, 21, 26, 40, 47],
    [7, 14, 21, 25, 40, 47],
    [7, 14, 21, 24, 40, 47], // Back to left
];

// --- LOADING BAR (Retro Style) ---
const loadingBar = [
    [21, 22, 23, 24, 25, 26, 27], // Frame
    [21, 22, 23, 24, 25, 26, 27, 22], // Start fill
    [21, 22, 23, 24, 25, 26, 27, 22, 23],
    [21, 22, 23, 24, 25, 26, 27, 22, 23, 24],
    [21, 22, 23, 24, 25, 26, 27, 22, 23, 24, 25],
    [21, 22, 23, 24, 25, 26, 27, 22, 23, 24, 25, 26], // Almost done
    [21, 22, 23, 24, 25, 26, 27], // Blink complete
    [],
];

// --- CURSOR TYPING EFFECT ---
const typing = [
    [21], // Cursor
    [21, 22], // Type
    [21, 22, 23],
    [21, 22, 23, 24],
    [21, 22, 23, 24, 25],
    [21, 22, 23, 24, 25, 26],
    [21, 22, 23, 24, 25, 26, 27],
    [21, 22, 23, 24, 25, 26, 27], // Hold
    [], // Delete all
    [24], // Cursor blink
];
export type AnimationType = "chart" | "chip" | "math" | "neural" | "scan" | "process" | "rain";

const ANIMATIONS: Record<AnimationType, number[][]> = {
    chart: chartFrames,
    chip: chipFrames,
    math: mathFrames,
    neural: neuralFrames,
    scan: scanFrames,
    process: processFrames,
    rain: rain,
};



export const SectionAnimator = ({ type }: { type: AnimationType }) => {
    const frames = ANIMATIONS[type];
    
    // Simple self-resetting index logic
    const [index, setIndex] = useState(0);
    const handleComplete = () => setIndex((prev) => (prev + 1) % frames.length);

    // If using the DotLoader with internal timer, we can just let it loop if we pass repeatCount={-1}
    // But since our arrays are simple, let's just cycle.

    return (
        <div className="opacity-90 grayscale transition-all duration-500 hover:opacity-100 hover:grayscale-0">
            <DotLoader
                frames={frames}
                isPlaying={true}
                duration={180}
                repeatCount={-1} // Loop forever
                className="gap-0.5"
                dotClassName="bg-black/10 [&.active]:bg-black/70 size-1"
            />
        </div>
    );
};