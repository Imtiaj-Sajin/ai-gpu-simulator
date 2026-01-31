# AI GPU Simulator

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)  
[![Open Source](https://img.shields.io/badge/Open%20Source-Yes-black.svg)]()  
[![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)]()  
[![Status](https://img.shields.io/badge/status-active-success.svg)]()  

Live: https://aigpusim.vercel.app/  
Repo: https://github.com/Imtiaj-Sajin/ai-gpu-simulator  




## Why This Exists

When we were planning to run LLMs locally, the biggest question was simple:

"Which GPU will actually give me the speed I need?"

There were articles, random benchmark screenshots, spec sheets everywhere... but no single place to simulate performance before spending serious money on hardware.

So I built this.

Not as a hype tool.  
Not to show unrealistic token numbers.  

Just something practical that developers can actually use before making GPU decisions.




## What This Is

AI GPU Simulator is a fully open-source project that estimates LLM inference performance across GPUs using:

* real benchmark data when available  
* conservative spec-based estimation when benchmarks are missing  
* transparent formulas  
* verifiable assumptions  

You are free to inspect the logic, question it, and improve it.

Accuracy matters here.




## Core Features

* VRAM fit check (weights + KV cache + overhead)
* Decode speed estimation
* Time to first token calculation (TTFT)
* Total generation time
* Quantization-aware simulation
* Context-length impact
* Dynamic configuration
* Benchmark-first methodology
* Batch Size / Concurrency
* 

No magic numbers. No guessing.


## Contributing

If someone in the similar mind you're welcome. Please focus on accuracies first(first priority. Then you can add more features/LLM-GPU models/specs etc.. 

### How To Contribute

1. Fork the repo  
2. Create a feature branch  
3. Make your changes  
4. Open a PR  

If you are adding benchmarks, always include the source.

Transparency > everything.


## Open Source

This project is fully open because the logic should be inspectable by everone. So that people can judge before trust!

If this simulator helps you, consider starring the repo.  
It helps more builders discover it.




## Final Note

Maybe it could help guessing the experience before investing your money on a power hungry (GPU) device!! ^_^ 

If you have ever struggled to estimate LLM performance before buying a GPU, this is for you.


