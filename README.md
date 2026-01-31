# AI GPU Simulator

🌐 Live Demo: https://aigpusim.vercel.app/  
🔗 Public Repo: https://github.com/Imtiaj-Sajin/ai-gpu-simulator  

---

## Why This Project Exists

When we were planning to run LLMs locally, the biggest question was simple:

> **"Which GPU will actually give me the speed I need?"**

There were plenty of articles, scattered benchmarks, and spec sheets — but no single tool to simulate performance before investing in expensive hardware.

So I built one.

---

## What is AI GPU Simulator?

AI GPU Simulator is a fully open-source project designed to estimate LLM inference performance across different GPUs.

The goal is transparency — you can verify the simulator’s algorithms, logic, assumptions, and data sources yourself.

No hype numbers.  
No unrealistic token speeds.  
Just practical, conservative estimates.

---

## How It Works (High-Level)

The simulator combines:

✅ GPU specifications  
✅ Model specs  
✅ Real-world benchmark data  
✅ Conservative estimation formulas  

to help answer:

👉 Will the model fit in VRAM?  
👉 How fast will it decode?  
👉 What is the time to first token?  
👉 How long will generation take?

All calculations update dynamically based on your configuration.

---

## Project Goal

To make GPU decision-making easier for developers, researchers, and teams running LLMs locally — removing guesswork before spending thousands on hardware.



## Open Source & Contribution

This is a **fully open-source project** because accuracy matters.

If you:

- enjoy working with AI infrastructure  
- have benchmark data  
- want to improve estimation methods  
- spot incorrect assumptions  
- or simply want to make this tool better  

👉 You are very welcome to contribute.

Let’s build something the AI community can rely on.



## Future Direction

The focus right now is simple:

**Accuracy > Features**

As the dataset grows and the simulator matures, the vision is to make this a trusted performance reference for local AI workloads.



⭐ If you find this useful, consider giving the repo a star!
