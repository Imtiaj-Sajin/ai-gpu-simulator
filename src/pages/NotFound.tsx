import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);

    document.title = "404 — Page Not Found | AI GPU Simulator";

    const setMeta = (name: string, content: string, attr: "name" | "property" = "name") => {
      let tag = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attr, name);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    setMeta("robots", "noindex, follow");
    setMeta("description", "The page you requested could not be found on AI GPU Simulator. Return to the homepage to estimate LLM VRAM, tokens/sec, and GPU inference speed.");

    return () => {
      setMeta("robots", "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");
      document.title = "LLM GPU Simulator — Test VRAM, Tokens/sec & Inference Speed Before You Buy";
    };
  }, [location.pathname]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center max-w-md px-6">
        <h1 className="mb-4 text-6xl font-bold">404</h1>
        <p className="mb-2 text-xl text-muted-foreground">Page not found</p>
        <p className="mb-6 text-sm text-muted-foreground">
          The page at <code className="px-1 py-0.5 rounded bg-background">{location.pathname}</code> does not exist on AI GPU Simulator.
        </p>
        <a
          href="/"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-primary-foreground underline-offset-2 hover:underline"
          aria-label="Return to AI GPU Simulator homepage"
        >
          Return to the LLM GPU Simulator
        </a>
      </div>
    </main>
  );
};

export default NotFound;
