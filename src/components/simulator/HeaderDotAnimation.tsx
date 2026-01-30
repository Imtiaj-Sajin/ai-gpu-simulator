"use client";

import { useState } from "react";
import { DotLoader } from "@/components/ui/dot-loader";

// --- 1. THE AI BRAIN (Pulsing Center) ---
const brain = [
    [24], // Core
    [24, 17, 23, 25, 31], // Inner cross
    [17, 23, 25, 31, 10, 16, 18, 22, 26, 30, 32, 38], // Mid ring
    [10, 16, 18, 22, 26, 30, 32, 38, 3, 9, 11, 15, 19, 29, 33, 37, 39, 45], // Outer ring
    [3, 9, 11, 15, 19, 29, 33, 37, 39, 45, 0, 6, 42, 48], // Corners
    [], // Reset
];

// --- 2. THE CAT (Pixel Art Blinking) ---
// 7x7 Grid: 0-48 indices
const catOpen = [
    1, 5, // Ears tip
    7, 8, 9, 10, 11, 12, 13, // Forehead
    14, 16, 18, 20, // Eyes Open (16, 18)
    21, 24, 27, // Nose (24)
    28, 29, 30, 32, 33, 34, // Cheeks
    36, 40, // Chin sides
    44, 45, 46 // Chin bottom
];
const catBlink = [
    1, 5,
    7, 8, 9, 10, 11, 12, 13,
    14, 20, // Eyes "Closed" (removed 16, 18)
    21, 24, 27,
    28, 29, 30, 32, 33, 34,
    36, 40,
    44, 45, 46
];
const catAnimation = [catOpen, catOpen, catBlink, catOpen, catOpen, catOpen];

// --- 3. PROCESSING (Linear Fill) ---
const processing = [
    [24],
    [24, 23, 25],
    [24, 23, 25, 22, 26, 17, 31],
    [24, 23, 25, 22, 26, 17, 31, 21, 27, 16, 18, 30, 32, 10, 38],
    Array.from({ length: 49 }, (_, i) => i).filter(i => i % 2 === 0), // Checkerboard
    Array.from({ length: 49 }, (_, i) => i), // Full fill
    [], // Clear
];

// --- 4. SPACE INVADER (GPU/Gaming Nod) ---
const invaderA = [
    2, 4, // Antenna
    9, 11, // Head
    15, 16, 17, 18, 19, // Eyes row
    21, 22, 24, 26, 27, // Body
    28, 29, 30, 31, 32, 33, 34, // Base
    36, 40, // Legs A
    42, 48 // Feet A
];
const invaderB = [
    2, 4,
    9, 11,
    15, 16, 17, 18, 19,
    21, 22, 24, 26, 27,
    28, 29, 30, 31, 32, 33, 34,
    37, 39, // Legs B (Moved in)
    44, 46 // Feet B (Moved in)
];
const invaderAnimation = [invaderA, invaderB, invaderA, invaderB];

// --- 5. MATRIX RAIN (Digital Fall) ---
const rain = [
    [1, 5, 9, 20, 26, 30, 38],
    [8, 12, 16, 27, 33, 37, 45],
    [15, 19, 23, 34, 40, 44, 4],
    [22, 26, 30, 41, 47, 3, 11],
    [29, 33, 37, 48, 2, 10, 18],
    [36, 40, 44, 1, 9, 17, 25],
    [43, 47, 0, 8, 16, 24, 32],
];

// --- 6. HEARTBEAT (Health/Status) ---
const heart = [
    [],
    [10, 12, 17, 18, 19, 23, 25, 31], // Small Heart
    [9, 11, 13, 16, 20, 22, 26, 30, 32, 38], // Medium Heart
    [2, 4, 8, 14, 15, 21, 22, 26, 28, 34, 36, 40, 44, 46], // Large Outline
    [10, 12, 17, 18, 19, 23, 25, 31], // Small Heart
    [],
];

const searching = [
    [9, 16, 17, 15, 23],
    [10, 17, 18, 16, 24],
    [11, 18, 19, 17, 25],
    [18, 25, 26, 24, 32],
    [25, 32, 33, 31, 39],
    [32, 39, 40, 38, 46],
    [31, 38, 39, 37, 45],
    [30, 37, 38, 36, 44],
    [23, 30, 31, 29, 37],
    [31, 29, 37, 22, 24, 23, 38, 36],
    [16, 23, 24, 22, 30],
];

const heartbit = [
    [], [3], [10, 2, 4, 3], [17, 9, 1, 11, 5, 10, 4, 3, 2],
    [24, 16, 8, 1, 3, 5, 18, 12, 17, 11, 4, 10, 9, 2],
    [31, 23, 15, 8, 10, 2, 4, 12, 25, 19, 24, 18, 11, 17, 16, 9],
    [38, 30, 22, 15, 17, 9, 11, 19, 32, 26, 31, 25, 18, 24, 23, 16],
    [38, 30, 22, 15, 17, 9, 11, 19, 32, 26, 31, 25, 18, 24, 23, 16],
    [38, 30, 22, 17, 9, 11, 19, 32, 26, 31, 25, 18, 24, 23, 16, 45, 37, 29, 21, 14, 8, 15, 12, 20, 27, 33, 39],
    [24],
];

const shadcn = [
    [], [7, 1], [15, 9, 7, 1], [23, 17, 21, 15, 9, 3],
    [31, 25, 29, 23, 17, 11], [39, 33, 37, 31, 25, 19],
    [47, 41, 45, 39, 33, 27], [47, 41, 45, 39, 33, 27],
];



// Define the full sequence
const sequence = [
    { frames: brain, repeat: 2 },        // "Thinking"
    { frames: processing, repeat: 1 },   // "Calculating"
    { frames: catAnimation, repeat: 2 }, // "The AI Cat"
    { frames: invaderAnimation, repeat: 4 }, // "Gaming/GPU"
    { frames: rain, repeat: 3 },         // "Data Stream"
    { frames: heart, repeat: 2 },        // "System Health"
    { frames: searching, repeat: 2 },    // "Searching"
    { frames: heartbit, repeat: 2 },     // "Heartbeat"
    { frames: shadcn, repeat: 1 },       // "shadcn/ui Nod"
    { frames: catAnimation, repeat: 2 }, // "The AI Cat"

];

export const HeaderDotAnimation = () => {
    const [index, setIndex] = useState(0);

    const handleComplete = () => {
        setIndex((prev) => (prev + 1) % sequence.length);
    };

    return (
        <div className="flex items-center justify-center">
            <DotLoader
                frames={sequence[index].frames}
                onComplete={handleComplete}
                repeatCount={sequence[index].repeat}
                duration={150} // 150ms is a good average speed for these
                className="gap-0.5"
                dotClassName="bg-black/5 [&.active]:bg-black/80 size-1"
            />
        </div>
    );
};