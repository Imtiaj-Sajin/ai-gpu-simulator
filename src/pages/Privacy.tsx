import { useEffect } from "react";
import { Link } from "react-router-dom";

const TITLE = "Privacy Policy | AI GPU Simulator";
const DESC =
  "Privacy policy for AI GPU Simulator (aigpusim.vercel.app). Learn what data we collect, how analytics (Google Analytics 4) is used, and your privacy rights.";
const URL = "https://aigpusim.vercel.app/privacy";
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

export default function Privacy() {
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
          <span aria-current="page" className="text-gray-900">Privacy</span>
        </nav>

        <header className="mb-10">
          <p className="text-[10px] font-mono tracking-widest uppercase text-gray-500">Legal</p>
          <h1 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-gray-500">
            Last updated: <time dateTime={UPDATED}>April 20, 2026</time>
          </p>
        </header>

        <section className="prose prose-sm md:prose-base max-w-none prose-headings:text-gray-900 prose-a:text-pink-600">
          <p>
            This Privacy Policy describes how <strong>AI GPU Simulator</strong> (&ldquo;the Service,&rdquo; &ldquo;we,&rdquo;
            &ldquo;us&rdquo;), available at{" "}
            <a href="https://aigpusim.vercel.app/">aigpusim.vercel.app</a>, handles information when you
            use our free LLM GPU performance simulator. The Service is an open-source tool maintained by{" "}
            <a href="https://imtiaj-sajin.github.io/" rel="author">Imtiaj Sajin</a>.
          </p>

          <h2>1. Information we do NOT collect</h2>
          <p>
            AI GPU Simulator does not require an account, does not ask for personal information, and does
            not sell or share personal data. We do not store the GPU, model, precision, or token
            configurations you enter into the simulator on any server — all calculations run entirely in
            your browser.
          </p>

          <h2>2. Analytics (Google Analytics 4)</h2>
          <p>
            We use <strong>Google Analytics 4</strong> (measurement ID <code>G-FTSJB308BM</code>) to
            understand aggregate traffic patterns — which pages are visited, referring sources, approximate
            country, and device type. IP addresses are anonymised
            (<code>anonymize_ip: true</code>) before they reach Google&apos;s servers.
          </p>
          <p>
            Google Analytics sets first-party cookies (for example <code>_ga</code>, <code>_ga_*</code>)
            in your browser. You can block these by using browser privacy settings, a tracker-blocking
            extension, or by opting out via Google&apos;s{" "}
            <a href="https://tools.google.com/dlpage/gaoptout" rel="noopener noreferrer">
              Analytics opt-out add-on
            </a>.
          </p>

          <h2>3. Hosting &amp; logs</h2>
          <p>
            The Service is hosted on <a href="https://vercel.com/" rel="noopener noreferrer">Vercel</a>.
            Vercel may collect standard HTTP request logs (IP address, user-agent, timestamp, requested
            URL) for security, abuse prevention, and performance monitoring. See Vercel&apos;s own privacy
            policy for details.
          </p>

          <h2>4. Cookies</h2>
          <p>
            The only cookies set by AI GPU Simulator are the Google Analytics cookies described above.
            We do not use advertising cookies, cross-site tracking cookies, or remarketing pixels.
          </p>

          <h2>5. Third-party links</h2>
          <p>
            The Service links to external data sources (NVIDIA, TechPowerUp, vLLM, Meta Llama, Qwen,
            Mistral, GitHub, and similar). We are not responsible for the privacy practices of those
            third-party sites.
          </p>

          <h2>6. Data retention</h2>
          <p>
            Since we do not collect personal data directly, we do not retain any. Google Analytics data is
            retained per Google&apos;s default settings (we use the standard retention window).
          </p>

          <h2>7. Children&apos;s privacy</h2>
          <p>
            AI GPU Simulator is a technical tool intended for developers, engineers, and researchers. It
            is not directed at children under 13, and we do not knowingly collect information from them.
          </p>

          <h2>8. Your rights</h2>
          <p>
            Depending on your jurisdiction (EU/UK GDPR, California CCPA, etc.), you may have rights to
            access, correct, or delete personal data held about you. Since we do not directly store
            personal data, such requests should be directed to Google for analytics data. Contact us if
            you believe we hold information about you.
          </p>

          <h2>9. Changes to this policy</h2>
          <p>
            We may update this Privacy Policy as the Service evolves. Material changes will update the
            &ldquo;Last updated&rdquo; date above. Continued use of the Service after changes constitutes
            acceptance of the updated policy.
          </p>

          <h2>10. Contact</h2>
          <p>
            Questions about this policy? Email{" "}
            <a href="mailto:imtiajsajin@gmail.com">imtiajsajin@gmail.com</a> or open an issue on the{" "}
            <a href="https://github.com/Imtiaj-Sajin/ai-gpu-simulator" rel="noopener noreferrer">
              GitHub repository
            </a>.
          </p>
        </section>

        <footer className="mt-12 flex items-center justify-between border-t border-gray-200 pt-6 text-sm">
          <Link to="/" className="text-pink-600 hover:text-pink-800">← Back to the LLM GPU Simulator</Link>
          <Link to="/terms" className="text-gray-500 hover:text-gray-900">Terms of Service →</Link>
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
                { "@type": "ListItem", position: 2, name: "Privacy Policy", item: URL },
              ],
            },
          }),
        }}
      />
    </main>
  );
}
