// src\lib\sim\randomText.ts
const WORDS = [
  "token",
  "stream",
  "latency",
  "throughput",
  "batch",
  "context",
  "cache",
  "decode",
  "prefill",
  "scheduler",
  "kernel",
  "bandwidth",
  "attention",
  "quant",
  "pipeline",
  "tensor",
  "warp",
  "memory",
  "compute",
  "estimate",
  "benchmark",
  "runtime",
  "profile",
  "queue",
  "model",
  "gpu",
  "vram",
  "core",
  "Hi there!",
];

export function randomWords(count: number): string {
  let out = "";
  for (let i = 0; i < count; i++) {
    const w = WORDS[Math.floor(Math.random() * WORDS.length)] ?? "token";
    out += (out ? " " : "") + w;
  }
  return out;
}
