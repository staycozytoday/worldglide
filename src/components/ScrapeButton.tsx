"use client";

import { useState, useEffect, useRef } from "react";

interface ScrapeResult {
  success: boolean;
  stats: {
    scraped: number;
    submitted: number;
    total: number;
    elapsed: string;
  };
  report: {
    companies: number;
    succeeded: number;
    failed: number;
    failures?: { company: string; ats: string; error: string }[];
  };
}

type Status = "idle" | "loading" | "done" | "error";

// 1 ✦ travels a 3-step journey outward from "casting" on each side
const SPARKLE_FRAMES = (() => {
  const n = 3;
  const track = (pos: number) => {
    const chars = Array(n).fill("·");
    if (pos >= 0 && pos < n) chars[pos] = "✦";
    return chars.join("");
  };
  // left: sparkle moves right-to-left (inner → outer)
  // right: sparkle moves left-to-right (inner → outer)
  return Array.from({ length: n }, (_, i) => {
    return `${track(n - 1 - i)} casting ${track(i)}`;
  });
})();

export default function ScrapeButton() {
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<ScrapeResult | null>(null);
  const [error, setError] = useState<string>("");
  const [progress, setProgress] = useState(0);
  const [sparkleIdx, setSparkleIdx] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sparkleRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // animated progress bar — fills to ~90% over ~60s, then waits
  useEffect(() => {
    if (status === "loading") {
      setProgress(0);
      intervalRef.current = setInterval(() => {
        setProgress((p) => {
          if (p >= 90) return p;
          const remaining = 90 - p;
          return p + remaining * 0.03;
        });
      }, 500);
      // sparkle animation
      setSparkleIdx(0);
      sparkleRef.current = setInterval(() => {
        setSparkleIdx((i) => (i + 1) % SPARKLE_FRAMES.length);
      }, 300);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (sparkleRef.current) clearInterval(sparkleRef.current);
      if (status === "done") setProgress(100);
      if (status === "error") setProgress(0);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (sparkleRef.current) clearInterval(sparkleRef.current);
    };
  }, [status]);

  function handleClick() {
    if (status === "loading") {
      abortRef.current?.abort();
      abortRef.current = null;
      setStatus("idle");
      return;
    }
    handleScrape();
  }

  async function handleScrape() {
    const controller = new AbortController();
    abortRef.current = controller;
    setStatus("loading");
    setResult(null);
    setError("");

    try {
      const res = await fetch("/api/admin/scrape", { method: "POST", signal: controller.signal });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setStatus("error");
        setError(data.error || `failed with status ${res.status}`);
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) {
        setStatus("error");
        setError("no response stream");
        return;
      }

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop() || "";

        for (const part of parts) {
          const lines = part.split("\n");
          let eventType = "";
          let data = "";

          for (const line of lines) {
            if (line.startsWith("event: ")) eventType = line.slice(7);
            if (line.startsWith("data: ")) data = line.slice(6);
          }

          if (!eventType || !data) continue;

          try {
            const parsed = JSON.parse(data);
            if (eventType === "done") {
              setResult(parsed as ScrapeResult);
              setStatus("done");
            }
            if (eventType === "error") {
              setStatus("error");
              setError(parsed.error || "scraping failed");
            }
          } catch {
            // skip malformed
          }
        }
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setStatus("error");
      setError(err instanceof Error ? err.message : "network error");
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleClick}
        className="w-full h-[40px] text-[11px] font-mono text-[var(--color-text-muted)] hover:text-[var(--color-text)] border border-transparent hover:border-[var(--color-border)] transition-all duration-300 relative overflow-hidden"
      >
        {/* progress fill — grows outward from center (inside-out) */}
        <span
          className="absolute inset-y-0 left-1/2 -translate-x-1/2 bg-[var(--color-text)] transition-all ease-out"
          style={{
            width: `${progress}%`,
            opacity: status === "loading" || (status === "done" && progress > 0) ? 0.08 : 0,
            transitionDuration: status === "done" ? "300ms" : "500ms",
          }}
        />
        <span className="relative">
          {status === "loading"
            ? SPARKLE_FRAMES[sparkleIdx]
            : status === "done"
              ? "cast again"
              : "cast spell"}
        </span>
      </button>

      {status === "done" && result && (
        <div className="text-[10px] text-[var(--color-text-muted)] font-mono leading-relaxed text-center">
          <p>{result.stats.scraped} jobs from {result.report.companies} companies</p>
          <p>{result.report.failed} failures ･ took {result.stats.elapsed}</p>
        </div>
      )}

      {status === "error" && (
        <p className="text-[10px] text-[var(--color-text)] font-mono">✗ {error}</p>
      )}
    </div>
  );
}
