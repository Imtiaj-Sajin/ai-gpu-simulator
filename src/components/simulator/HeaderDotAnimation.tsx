"use client";

import { useState } from "react";
import { DotLoader } from "@/components/ui/dot-loader";

// We re-use the animation frames here (or you could export them from a shared file)
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

// Define the sequence of animations to loop through
const sequence = [
    { frames: searching, repeat: 2 },
    { frames: shadcn, repeat: 2 },
    { frames: heartbit, repeat: 3 },
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
                duration={120}
                className="gap-1" // Slightly bigger gap for the header
                // Important: Colors for Light Mode (Gray inactive, Black active)
                dotClassName="bg-black/5 [&.active]:bg-black/80 size-1.5"
            />
        </div>
    );
};