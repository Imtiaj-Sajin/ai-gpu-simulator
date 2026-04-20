'use client';

import { useEffect, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Cpu } from "lucide-react";
import { Background } from "@/components/theme/Background";
import { HeaderDotAnimation } from "@/components/animator/HeaderDotAnimation";
import { Footer } from "@/components/simulator/Footer";
import { cn } from "@/lib/utils";

export type LegalSection = {
  title: string;
  body: ReactNode;
};

export type LegalPageProps = {
  /** Monospace eyebrow label shown above the title (e.g. "Legal · Privacy"). */
  eyebrow: string;
  /** Large H1 shown in the hero (e.g. "Privacy Policy"). */
  title: string;
  /** One-sentence description under the title. */
  subtitle: string;
  /** ISO date — e.g. "2026-04-20". */
  updated: string;
  /** Human-friendly updated date — e.g. "April 20, 2026". */
  updatedLabel: string;
  /** Section blocks rendered as glass-morphism cards. */
  sections: LegalSection[];
  /** Cross-link shown at the bottom to the *other* legal page. */
  otherPage: { to: string; label: string };
  /** JSON-LD schema for this page. */
  schema: Record<string, unknown>;
  /** Per-page SEO overrides. */
  seo: {
    title: string;
    description: string;
    url: string;
  };
};

function setMeta(name: string, content: string, attr: "name" | "property" = "name") {
  let tag = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, name);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function setCanonical(href: string) {
  let tag = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!tag) {
    tag = document.createElement("link");
    tag.setAttribute("rel", "canonical");
    document.head.appendChild(tag);
  }
  tag.setAttribute("href", href);
}

export function LegalPage({
  eyebrow,
  title,
  subtitle,
  updated,
  updatedLabel,
  sections,
  otherPage,
  schema,
  seo,
}: LegalPageProps) {
  useEffect(() => {
    const prevTitle = document.title;
    const canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    const prevCanonical = canonicalEl?.getAttribute("href") ?? "https://aigpusim.vercel.app/";

    document.title = seo.title;
    setMeta("description", seo.description);
    setMeta("robots", "index, follow, max-image-preview:large, max-snippet:-1");
    setMeta("og:title", seo.title, "property");
    setMeta("og:description", seo.description, "property");
    setMeta("og:url", seo.url, "property");
    setMeta("twitter:title", seo.title);
    setMeta("twitter:description", seo.description);
    setCanonical(seo.url);

    window.scrollTo(0, 0);

    return () => {
      document.title = prevTitle;
      setCanonical(prevCanonical);
    };
  }, [seo.title, seo.description, seo.url]);

  return (
    <main className="relative min-h-screen bg-[#F9F9F9] font-sans text-gray-900 overflow-hidden selection:bg-pink-200/50">
      <Background />

      {/* === Top Nav (consistent, minimal) === */}
      <div className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
        <Link
          to="/"
          aria-label="AI GPU Simulator home"
          className="inline-flex items-center gap-2 rounded-full border border-gray-200/80 bg-white/60 px-3 py-1.5 text-xs font-semibold tracking-tight text-gray-900 shadow-sm backdrop-blur-md transition-colors hover:bg-white"
        >
          <Cpu className="h-3.5 w-3.5" />
          AI × GPU Simulator
        </Link>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 rounded-full border border-gray-200/80 bg-white/60 px-3 py-1.5 text-xs font-medium text-gray-600 shadow-sm backdrop-blur-md transition-colors hover:bg-white hover:text-gray-900"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to simulator
        </Link>
      </div>

      {/* === Breadcrumb (crawlable) === */}
      <nav
        aria-label="Breadcrumb"
        className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-4"
      >
        <ol className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-gray-400">
          <li>
            <Link to="/" className="hover:text-gray-900 transition-colors">Home</Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-gray-900">{eyebrow.split("·").pop()?.trim() ?? title}</li>
        </ol>
      </nav>

      {/* === Hero === */}
      <header className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-10 pb-14 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mx-auto flex flex-col items-center gap-6"
        >
          {/* Eyebrow with pulsing dot + animation */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-black/5 bg-black/5 px-3 py-1">
              <div className="h-2 w-2 animate-pulse rounded-full bg-black" />
              <span className="text-[10px] font-mono font-medium uppercase tracking-widest text-gray-500">
                {eyebrow}
              </span>
            </div>
            <div aria-hidden="true" className="hidden sm:block">
              <HeaderDotAnimation />
            </div>
          </div>

          <h1 className="text-4xl font-bold tracking-tight leading-[1.1] text-[#111] md:text-6xl">
            {title}
          </h1>

          <p className="max-w-2xl text-base leading-relaxed text-gray-500 md:text-lg">
            {subtitle}
          </p>

          <div className="inline-flex items-center gap-2 rounded-full border border-gray-200/80 bg-white/60 px-3 py-1 text-xs text-gray-600 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-pink-500" />
            Last updated
            <time dateTime={updated} className="font-medium text-gray-900">{updatedLabel}</time>
          </div>
        </motion.div>
      </header>

      {/* === Sections === */}
      <section
        aria-label={title}
        className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pb-20"
      >
        <div className="space-y-6">
          {sections.map((s, i) => (
            <motion.article
              key={s.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.35, delay: Math.min(i * 0.03, 0.2) }}
              className={cn(
                "group relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white/60 p-6 shadow-soft backdrop-blur-md transition-shadow hover:shadow-md sm:p-8"
              )}
            >
              <div className="flex items-start gap-4">
                <span
                  aria-hidden="true"
                  className="shrink-0 rounded-md border border-gray-200 bg-gray-50 px-2 py-0.5 font-mono text-[10px] font-semibold tracking-widest text-gray-500"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold tracking-tight text-gray-900 md:text-xl">
                    {s.title}
                  </h2>
                  <div className="mt-3 space-y-3 text-sm leading-relaxed text-gray-600 md:text-[15px] [&_a]:text-pink-600 [&_a:hover]:text-pink-800 [&_a]:underline-offset-2 [&_a:hover]:underline [&_code]:rounded [&_code]:bg-gray-100 [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.85em] [&_code]:text-gray-900 [&_strong]:font-semibold [&_strong]:text-gray-900 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5 [&_em]:italic">
                    {s.body}
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* === Cross-link CTA === */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.35 }}
          className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl border border-gray-200/80 bg-white/60 p-6 shadow-soft backdrop-blur-md sm:flex-row sm:p-8"
        >
          <div className="text-center sm:text-left">
            <p className="text-[10px] font-mono font-medium uppercase tracking-widest text-gray-500">
              Also relevant
            </p>
            <p className="mt-1 text-sm font-medium text-gray-900 md:text-base">
              Read our {otherPage.label}
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-gray-700 shadow-sm transition-colors hover:border-gray-300 hover:text-gray-900"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to simulator
            </Link>
            <Link
              to={otherPage.to}
              className="inline-flex items-center gap-1.5 rounded-full bg-black px-4 py-2 text-xs font-medium text-white shadow-sm transition-opacity hover:opacity-90"
            >
              {otherPage.label}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </main>
  );
}
