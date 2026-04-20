import { LegalPage, type LegalSection } from "@/components/legal/LegalPage";
import { storySection } from "@/components/legal/storySection";

const URL = "https://aigpusim.vercel.app/privacy";
const UPDATED = "2026-04-20";
const UPDATED_LABEL = "April 20, 2026";

const SEO = {
  title: "Privacy Policy | AI GPU Simulator",
  description:
    "Privacy policy for AI GPU Simulator (aigpusim.vercel.app). Learn what data we collect, how analytics (Google Analytics 4) is used, and your privacy rights.",
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
      { "@type": "ListItem", position: 2, name: "Privacy Policy", item: URL },
    ],
  },
};

const SECTIONS: LegalSection[] = [
  {
    title: "Information we do NOT collect",
    body: (
      <p>
        AI GPU Simulator does not require an account, does not ask for personal information, and
        does not sell or share personal data. We do not store the GPU, model, precision, or token
        configurations you enter into the simulator on any server — all calculations run entirely
        in your browser.
      </p>
    ),
  },
  {
    title: "Analytics (Google Analytics 4)",
    body: (
      <>
        <p>
          We use <strong>Google Analytics 4</strong> (measurement ID <code>G-FTSJB308BM</code>) to
          understand aggregate traffic patterns — which pages are visited, referring sources,
          approximate country, and device type. IP addresses are anonymised
          (<code>anonymize_ip: true</code>) before they reach Google&rsquo;s servers.
        </p>
        <p>
          Google Analytics sets first-party cookies (for example <code>_ga</code>,{" "}
          <code>_ga_*</code>) in your browser. You can block these via browser privacy settings, a
          tracker-blocking extension, or Google&rsquo;s{" "}
          <a href="https://tools.google.com/dlpage/gaoptout" rel="noopener noreferrer">
            Analytics opt-out add-on
          </a>.
        </p>
      </>
    ),
  },
  {
    title: "Hosting & logs",
    body: (
      <p>
        The Service is hosted on <a href="https://vercel.com/" rel="noopener noreferrer">Vercel</a>.
        Vercel may collect standard HTTP request logs (IP address, user-agent, timestamp, requested
        URL) for security, abuse prevention, and performance monitoring. See Vercel&rsquo;s own
        privacy policy for details.
      </p>
    ),
  },
  {
    title: "Cookies",
    body: (
      <p>
        The only cookies set by AI GPU Simulator are the Google Analytics cookies described above.
        We do not use advertising cookies, cross-site tracking cookies, or remarketing pixels.
      </p>
    ),
  },
  {
    title: "Third-party links",
    body: (
      <p>
        The Service links to external data sources (NVIDIA, TechPowerUp, vLLM, Meta Llama, Qwen,
        Mistral, GitHub, and similar). We are not responsible for the privacy practices of those
        third-party sites.
      </p>
    ),
  },
  {
    title: "Data retention",
    body: (
      <p>
        Since we do not collect personal data directly, we do not retain any. Google Analytics data
        is retained per Google&rsquo;s default settings (we use the standard retention window).
      </p>
    ),
  },
  {
    title: "Children's privacy",
    body: (
      <p>
        AI GPU Simulator is a technical tool intended for developers, engineers, and researchers.
        It is not directed at children under 13, and we do not knowingly collect information from
        them.
      </p>
    ),
  },
  {
    title: "Your rights",
    body: (
      <p>
        Depending on your jurisdiction (EU/UK GDPR, California CCPA, etc.), you may have rights to
        access, correct, or delete personal data held about you. Since we do not directly store
        personal data, such requests should be directed to Google for analytics data. Contact us if
        you believe we hold information about you.
      </p>
    ),
  },
  {
    title: "Changes to this policy",
    body: (
      <p>
        We may update this Privacy Policy as the Service evolves. Material changes will update the
        &ldquo;Last updated&rdquo; date above. Continued use of the Service after changes
        constitutes acceptance of the updated policy.
      </p>
    ),
  },
  storySection,
  {
    title: "Contact",
    body: (
      <p>
        Questions about this policy? Email{" "}
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

export default function Privacy() {
  return (
    <LegalPage
      eyebrow="Legal · Privacy"
      title="Privacy Policy"
      subtitle="What we collect, what we don't, and how analytics is handled on AI GPU Simulator."
      updated={UPDATED}
      updatedLabel={UPDATED_LABEL}
      sections={SECTIONS}
      otherPage={{ to: "/terms", label: "Terms of Service" }}
      schema={SCHEMA}
      seo={SEO}
    />
  );
}
