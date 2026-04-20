import { useEffect } from "react";
import { Link } from "react-router-dom";

const TITLE = "Terms of Service | AI GPU Simulator";
const DESC =
  "Terms of Service for AI GPU Simulator (aigpusim.vercel.app). Usage terms, disclaimers, warranty limitations, and intellectual property for the LLM GPU performance simulator.";
const URL = "https://aigpusim.vercel.app/terms";
const UPDATED = "2026-04-20";

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

export default function Terms() {
  useEffect(() => {
    const prevTitle = document.title;
    const canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    const prevCanonical = canonicalEl?.getAttribute("href") ?? "https://aigpusim.vercel.app/";

    document.title = TITLE;
    setMeta("description", DESC);
    setMeta("robots", "index, follow, max-image-preview:large, max-snippet:-1");
    setMeta("og:title", TITLE, "property");
    setMeta("og:description", DESC, "property");
    setMeta("og:url", URL, "property");
    setMeta("twitter:title", TITLE);
    setMeta("twitter:description", DESC);
    setCanonical(URL);

    window.scrollTo(0, 0);

    return () => {
      document.title = prevTitle;
      setCanonical(prevCanonical);
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#F9F9F9] text-gray-800">
      <article className="mx-auto max-w-3xl px-6 py-16">
        <nav aria-label="Breadcrumb" className="mb-8 text-xs text-gray-500">
          <Link to="/" className="hover:text-gray-900">Home</Link>
          <span className="mx-2">/</span>
          <span aria-current="page" className="text-gray-900">Terms</span>
        </nav>

        <header className="mb-10">
          <p className="text-[10px] font-mono tracking-widest uppercase text-gray-500">Legal</p>
          <h1 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
            Terms of Service
          </h1>
          <p className="mt-3 text-sm text-gray-500">
            Last updated: <time dateTime={UPDATED}>April 20, 2026</time>
          </p>
        </header>

        <section className="prose prose-sm md:prose-base max-w-none prose-headings:text-gray-900 prose-a:text-pink-600">
          <p>
            These Terms of Service (&ldquo;Terms&rdquo;) govern your use of <strong>AI GPU Simulator</strong>
            (&ldquo;the Service&rdquo;), available at{" "}
            <a href="https://aigpusim.vercel.app/">aigpusim.vercel.app</a>. By using the Service, you agree
            to these Terms. If you do not agree, please do not use the Service.
          </p>

          <h2>1. What the Service is</h2>
          <p>
            AI GPU Simulator is a free, open-source web tool that estimates LLM inference performance —
            including VRAM usage, tokens per second, time-to-first-token (TTFT), and decode throughput —
            for language models like Llama 3, Qwen 2.5, Mixtral, and DeepSeek on NVIDIA GPUs such as the
            RTX 5090, RTX 4090, H100, and A100. It is an <em>estimator</em>, not a guarantee.
          </p>

          <h2>2. Free to use</h2>
          <p>
            The Service is provided free of charge and requires no account. You may use it for personal,
            educational, research, and commercial purposes, subject to these Terms.
          </p>

          <h2>3. No warranty — estimates only</h2>
          <p>
            All performance numbers (VRAM, tokens/sec, TTFT, decode speed) are engineering estimates
            based on published benchmarks (vLLM, NVIDIA TensorRT-LLM, Meta, Mistral, Qwen, community
            studies) and conservative spec-based models. Real-world results depend on drivers, framework
            versions, CPU, cooling, quantization method, and other factors outside our control.
          </p>
          <p>
            THE SERVICE IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT WARRANTIES
            OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO MERCHANTABILITY, FITNESS FOR A
            PARTICULAR PURPOSE, ACCURACY, OR NON-INFRINGEMENT.
          </p>

          <h2>4. Limitation of liability</h2>
          <p>
            To the maximum extent permitted by law, the Service, its author, and contributors shall not
            be liable for any direct, indirect, incidental, consequential, or special damages — including
            hardware purchase decisions, lost profits, business interruption, or data loss — arising out
            of or in connection with your use of the Service or reliance on any estimate it produces.
          </p>
          <p>
            <strong>Always verify critical hardware decisions against your own benchmarks before
            purchase.</strong>
          </p>

          <h2>5. Acceptable use</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Attempt to disrupt, overload, or compromise the Service or its hosting infrastructure.</li>
            <li>Scrape or re-host the Service in a way that misrepresents it as your own.</li>
            <li>Use the Service for any unlawful purpose or to violate third-party rights.</li>
          </ul>

          <h2>6. Intellectual property &amp; open source</h2>
          <p>
            The AI GPU Simulator codebase is available on GitHub at{" "}
            <a href="https://github.com/Imtiaj-Sajin/ai-gpu-simulator" rel="noopener noreferrer">
              github.com/Imtiaj-Sajin/ai-gpu-simulator
            </a>{" "}
            under the license specified in the repository. Third-party names and trademarks (NVIDIA, RTX,
            Llama, Qwen, Mixtral, etc.) are the property of their respective owners and are used here for
            identification only.
          </p>

          <h2>7. External links &amp; data sources</h2>
          <p>
            The Service references and links to external data sources including NVIDIA datasheets,
            TechPowerUp, vLLM benchmarks, Meta Llama, Mistral, Qwen, and academic papers. We are not
            responsible for the accuracy, availability, or terms of those third-party sources.
          </p>

          <h2>8. Changes to the Service</h2>
          <p>
            We may add, remove, or modify GPUs, models, formulas, datasets, or UI features at any time to
            improve accuracy or keep up with new hardware. Breaking changes will be reflected in the
            repository&apos;s changelog.
          </p>

          <h2>9. Changes to these Terms</h2>
          <p>
            These Terms may be updated from time to time. The &ldquo;Last updated&rdquo; date at the top
            reflects the latest revision. Continued use after changes constitutes acceptance.
          </p>

          <h2>10. Governing law</h2>
          <p>
            These Terms and any dispute arising out of them are governed by the laws of the jurisdiction
            in which the author resides, without regard to conflict-of-law rules. Where local consumer
            protection law grants stronger rights, those rights prevail.
          </p>

          <h2>11. Contact</h2>
          <p>
            Questions about these Terms? Email{" "}
            <a href="mailto:imtiajsajin@gmail.com">imtiajsajin@gmail.com</a> or open an issue on the{" "}
            <a href="https://github.com/Imtiaj-Sajin/ai-gpu-simulator" rel="noopener noreferrer">
              GitHub repository
            </a>.
          </p>
        </section>

        <footer className="mt-12 flex items-center justify-between border-t border-gray-200 pt-6 text-sm">
          <Link to="/" className="text-pink-600 hover:text-pink-800">← Back to the LLM GPU Simulator</Link>
          <Link to="/privacy" className="text-gray-500 hover:text-gray-900">Privacy Policy →</Link>
        </footer>
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": `${URL}#webpage`,
            name: TITLE,
            url: URL,
            description: DESC,
            inLanguage: "en-US",
            isPartOf: { "@id": "https://aigpusim.vercel.app/#website" },
            dateModified: UPDATED,
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://aigpusim.vercel.app/" },
                { "@type": "ListItem", position: 2, name: "Terms of Service", item: URL },
              ],
            },
          }),
        }}
      />
    </main>
  );
}
