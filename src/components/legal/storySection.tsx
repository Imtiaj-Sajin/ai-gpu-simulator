import type { LegalSection } from "./LegalPage";

/**
 * Origin story + open-source collab CTA.
 * Shared between Privacy and Terms so both pages tell the same story
 * and carry the same author citation (Imtiaj Sajin → LinkedIn).
 *
 * Rendered right before the "Contact" section on each legal page.
 */
export const storySection: LegalSection = {
  title: "Why this project exists",
  body: (
    <>
      <p>
        When I — <a
          href="https://www.linkedin.com/in/imtiaj-sajin/"
          target="_blank"
          rel="author noopener noreferrer"
        >Imtiaj Sajin</a> — was planning to run LLMs locally, the biggest question was
        simple: <em>which GPU will actually give me the speed I need?</em> I looked around for a
        decent simulator and could not find anything that felt trustworthy. So I decided to build
        one.
      </p>
      <p>
        Alongside this, I also build{" "}
        <a href="https://chatsby.co" target="_blank" rel="noopener noreferrer">chatsby.co</a> — an
        AI customer-support agent that integrates into a website, tracks visitor engagement, and
        surfaces leads based on what each visitor looks at most. Shipping real AI products like
        that is what pulled me into LLM inference cost and speed questions in the first place, and
        this simulator is where those answers live.
      </p>
      <p>
        I collected and analysed as much as I could from public articles, blog posts, model
        cards, and official data from NVIDIA, Meta, Mistral, Qwen, vLLM, and TechPowerUp. The
        simulator then runs that data through a dynamic, benchmark-first estimator to answer the
        question I originally had: <strong>will this GPU run that model fast enough for me?</strong>
      </p>
      <p>
        There are still plenty of rough edges and missing GPUs, models, and benchmarks. That is on
        purpose — <strong>AI GPU Simulator is fully open-source</strong>, and contributions are
        genuinely welcome. Whether you want to add a new GPU, tune the estimator, correct a
        benchmark, improve the UI, or file an issue, please jump in on{" "}
        <a
          href="https://github.com/Imtiaj-Sajin/ai-gpu-simulator"
          target="_blank"
          rel="noopener noreferrer"
        >GitHub</a>. You can also reach me directly on{" "}
        <a
          href="https://www.linkedin.com/in/imtiaj-sajin/"
          target="_blank"
          rel="author noopener noreferrer"
        >LinkedIn</a> if you want to collaborate.
      </p>
    </>
  ),
};
