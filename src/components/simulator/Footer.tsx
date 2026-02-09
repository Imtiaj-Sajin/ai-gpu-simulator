// src/components/simulator/Footer.tsx
'use client';

import { motion } from "framer-motion";
import { Github, Globe, Mail, Briefcase } from "lucide-react";
import { FlickeringGrid } from "@/components/ui/flickering-grid";

export function Footer() {
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
    <footer className="relative w-full border-t border-gray-200 bg-white overflow-hidden">
      
      {/* 1. The Animated Background Grid */}
      <div className="absolute inset-0 z-0 h-[400px] w-full bottom-0">
        <FlickeringGrid
          className="relative inset-0 size-full"
          squareSize={4}
          gridGap={6}
          color="#60A5FA" // Light blue flicker
          maxOpacity={0.4}
          flickerChance={0.1}
          height={400} // Matches container
          // 2. The Mask: Transparent at top, visible at bottom
          style={{
             maskImage: 'linear-gradient(to bottom, transparent 20%, black 100%)',
             WebkitMaskImage: 'linear-gradient(to bottom, transparent 20%, black 100%)'
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row justify-between items-center gap-10">
          
          {/* LEFT: SEO Description */}
          <div className="max-w-2xl text-center md:text-left">
            <h3 className="font-bold text-lg text-gray-900 mb-3 flex items-center justify-center md:justify-start gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"/>
              AI × GPU Simulator
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Empower your AI research with our comprehensive <strong>GPU Benchmarks</strong> and <strong>VRAM Calculator</strong>. 
              Analyze <span className="text-gray-700 font-medium">Prefill Speed (TTFT)</span>, estimate <span className="text-gray-700 font-medium">Decode Throughput</span>, 
              and calculate <span className="text-gray-700 font-medium">Memory Bandwidth</span> requirements. 
              Access our curated <strong>Model Dataset</strong> and <strong>LLM Formulas</strong> to optimize your inference infrastructure.
            </p>
          </div>

          {/* RIGHT: Contact / Socials */}
          <div className="flex flex-col items-center md:items-end gap-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">Connect</span>
            <div className="flex gap-3">
              {socialLinks.map((link) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className={`p-3 rounded-xl bg-white/80 border border-gray-200 text-gray-400 backdrop-blur-sm transition-all shadow-sm ${link.color}`}
                  whileHover={{ y: -4, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <link.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-12 pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-400">
          <p>© {new Date().getFullYear()} Imtiaj Sajin. All rights reserved.</p>
          <div className="flex gap-4 mt-2 sm:mt-0">
             <span className="hover:text-gray-600 cursor-pointer">Privacy</span>
             <span className="hover:text-gray-600 cursor-pointer">Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
}