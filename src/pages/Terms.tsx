import { LegalPage, type LegalSection } from "@/components/legal/LegalPage";
import { storySection } from "@/components/legal/storySection";

const URL = "https://aigpusim.vercel.app/terms";
const UPDATED = "2026-04-20";
const UPDATED_LABEL = "April 20, 2026";

const SEO = {
  title: "Terms of Service | AI GPU Simulator",
  description:
    "Terms of Service for AI GPU Simulator (aigpusim.vercel.app). Usage terms, disclaimers, warranty limitations, and intellectual property for the LLM GPU performance simulator.",
  url: URL,
};

const SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${URL}#webpage`,
  name: SEO.title,
  url: URL,
  description: SEO.description,
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
};

const SECTIONS: LegalSection[] = [
  {
    title: "What the Service is",
    body: (
      <p>
        AI GPU Simulator is a free, open-source web tool that estimates LLM inference performance —
        including VRAM usage, tokens per second, time-to-first-token (TTFT), and decode throughput —
        for language models like Llama 3, Qwen 2.5, Mixtral, and DeepSeek on NVIDIA GPUs such as
        the RTX 5090, RTX 4090, H100, and A100. It is an <em>estimator</em>, not a guarantee.
      </p>
    ),
  },
  {
    title: "Free to use",
    body: (
      <p>
        The Service is provided free of charge and requires no account. You may use it for
        personal, educational, research, and commercial purposes, subject to these Terms.
      </p>
    ),
  },
  {
    title: "No warranty — estimates only",
    body: (
      <>
        <p>
          All performance numbers (VRAM, tokens/sec, TTFT, decode speed) are engineering estimates
          based on published benchmarks (vLLM, NVIDIA TensorRT-LLM, Meta, Mistral, Qwen, community
          studies) and conservative spec-based models. Real-world results depend on drivers,
          framework versions, CPU, cooling, quantization method, and other factors outside our
          control.
        </p>
        <p>
          <strong>
            The Service is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without
            warranties of any kind, express or implied, including merchantability, fitness for a
            particular purpose, accuracy, or non-infringement.
          </strong>
        </p>
      </>
    ),
  },
  {
    title: "Limitation of liability",
    body: (
      <>
        <p>
          To the maximum extent permitted by law, the Service, its author, and contributors shall
          not be liable for any direct, indirect, incidental, consequential, or special damages —
          including hardware purchase decisions, lost profits, business interruption, or data loss
          — arising out of or in connection with your use of the Service or reliance on any
          estimate it produces.
        </p>
        <p>
          <strong>
            Always verify critical hardware decisions against your own benchmarks before purchase.
          </strong>
        </p>
      </>
    ),
  },
  {
    title: "Acceptable use",
    body: (
      <>
        <p>You agree not to:</p>
        <ul>
          <li>
            Attempt to disrupt, overload, or compromise the Service or its hosting infrastructure.
          </li>
          <li>Scrape or re-host the Service in a way that misrepresents it as your own.</li>
          <li>Use the Service for any unlawful purpose or to violate third-party rights.</li>
        </ul>
      </>
    ),
  },
  {
    title: "Intellectual property & open source",
    body: (
      <p>
        The AI GPU Simulator codebase is available on GitHub at{" "}
        <a href="https://github.com/Imtiaj-Sajin/ai-gpu-simulator" rel="noopener noreferrer">
          github.com/Imtiaj-Sajin/ai-gpu-simulator
        </a>{" "}
        under the license specified in the repository. Third-party names and trademarks (NVIDIA,
        RTX, Llama, Qwen, Mixtral, etc.) are the property of their respective owners and are used
        here for identification only.
      </p>
    ),
  },
  {
    title: "External links & data sources",
    body: (
      <p>
        The Service references and links to external data sources including NVIDIA datasheets,
        TechPowerUp, vLLM benchmarks, Meta Llama, Mistral, Qwen, and academic papers. We are not
        responsible for the accuracy, availability, or terms of those third-party sources.
      </p>
    ),
  },
  {
    title: "Changes to the Service",
    body: (
      <p>
        We may add, remove, or modify GPUs, models, formulas, datasets, or UI features at any time
        to improve accuracy or keep up with new hardware. Breaking changes will be reflected in the
        repository&rsquo;s changelog.
      </p>
    ),
  },
  {
    title: "Changes to these Terms",
    body: (
      <p>
        These Terms may be updated from time to time. The &ldquo;Last updated&rdquo; date above
        reflects the latest revision. Continued use after changes constitutes acceptance.
      </p>
    ),
  },
  {
    title: "Governing law",
    body: (
      <p>
        These Terms and any dispute arising out of them are governed by the laws of the
        jurisdiction in which the author resides, without regard to conflict-of-law rules. Where
        local consumer protection law grants stronger rights, those rights prevail.
      </p>
    ),
  },
  storySection,
  {
    title: "Contact",
    body: (
      <p>
        Questions about these Terms? Email{" "}
        <a href="mailto:imtiajsajin@gmail.com">imtiajsajin@gmail.com</a>, reach out on{" "}
        <a
          href="https://www.linkedin.com/in/imtiaj-sajin/"
          target="_blank"
          rel="author noopener noreferrer"
        >LinkedIn</a>, or open an issue on the{" "}
        <a href="https://github.com/Imtiaj-Sajin/ai-gpu-simulator" rel="noopener noreferrer">
          GitHub repository
        </a>.
      </p>
    ),
  },
];

export default function Terms() {
  return (
    <LegalPage
      eyebrow="Legal · Terms"
      title="Terms of Service"
      subtitle="How AI GPU Simulator can be used, what we promise, and what we don't — in plain language."
      updated={UPDATED}
      updatedLabel={UPDATED_LABEL}
      sections={SECTIONS}
      otherPage={{ to: "/privacy", label: "Privacy Policy" }}
      schema={SCHEMA}
      seo={SEO}
    />
  );
}
