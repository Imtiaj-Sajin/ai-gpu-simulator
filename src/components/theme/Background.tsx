import React from "react";

export const Background = () => {
  // Inspiration-style: tighter corner wings + corner-only noise.
  // All colors come from CSS variables (HSL) to stay inside the design system.
  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-background">
      {/* ===== LEFT WING (Neutral Pastels) ===== */}
      <div
        className="absolute left-0 top-0 flex h-full w-[28vw]"
        style={{
          maskImage: "radial-gradient(ellipse at 0% 0%, black 42%, transparent 72%)",
          WebkitMaskImage: "radial-gradient(ellipse at 0% 0%, black 42%, transparent 72%)",
        }}
      >
        <div className="flex-1 bg-[hsl(var(--prismo-left-1))]" />
        <div className="flex-1 bg-[hsl(var(--prismo-left-2))]" />
        <div className="flex-1 bg-[hsl(var(--prismo-left-3))]" />
        <div className="flex-1 bg-[hsl(var(--prismo-left-4))]" />
        <div className="flex-1 bg-[hsl(var(--prismo-left-5))]" />
        <div className="flex-1 bg-[hsl(var(--prismo-left-6))]" />
      </div>

      {/* ===== RIGHT WING (Color Pastels) ===== */}
      <div
        className="absolute right-0 top-0 flex h-full w-[28vw]"
        style={{
          maskImage: "radial-gradient(ellipse at 100% 0%, black 42%, transparent 72%)",
          WebkitMaskImage: "radial-gradient(ellipse at 100% 0%, black 42%, transparent 72%)",
        }}
      >
        <div className="flex-1 bg-[hsl(var(--prismo-right-1))]" />
        <div className="flex-1 bg-[hsl(var(--prismo-right-2))]" />
        <div className="flex-1 bg-[hsl(var(--prismo-right-3))]" />
        <div className="flex-1 bg-[hsl(var(--prismo-right-4))]" />
        <div className="flex-1 bg-[hsl(var(--prismo-right-5))]" />
        <div className="flex-1 bg-[hsl(var(--prismo-right-6))]" />
      </div>

      {/* ===== CORNER-ONLY NOISE ===== */}
      <div
        className="absolute inset-0 opacity-[0.12] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          maskImage:
            "radial-gradient(circle at 0% 0%, black 28%, transparent 60%), radial-gradient(circle at 100% 0%, black 28%, transparent 60%)",
          WebkitMaskImage:
            "radial-gradient(circle at 0% 0%, black 28%, transparent 60%), radial-gradient(circle at 100% 0%, black 28%, transparent 60%)",
          maskComposite: "add",
          WebkitMaskComposite: "add",
        }}
      />
    </div>
  );
};