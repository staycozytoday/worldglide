"use client";

import { useState, useRef, useEffect } from "react";

const IDLE_TEXT = "close portal";

// mystical glyphs — heavier symbols early, lighter dots late
const GLYPHS_HEAVY = "⊹⋆✧⟡⊛⋄";
const GLYPHS_LIGHT = "∘◦∙·.";

// seeded jitter per character — deterministic so it doesn't flicker randomly
const JITTER = IDLE_TEXT.split("").map((_, i) => {
  const seed = Math.sin(i * 9301 + 4973) * 10000;
  return (seed - Math.floor(seed)) * 0.15;
});

function easeInQuad(t: number): number {
  return t * t;
}

function easeOutQuad(t: number): number {
  return t * (2 - t);
}

function scramble(original: string, progress: number): string {
  const spaceIdx = original.indexOf(" ");
  return original
    .split("")
    .map((ch, i) => {
      if (ch === " ") return " ";

      let threshold: number;
      if (i < spaceIdx) {
        threshold = i / spaceIdx;
      } else {
        const wordLen = original.length - spaceIdx - 1;
        const posInWord = i - spaceIdx - 1;
        threshold = (wordLen - 1 - posInWord) / wordLen;
      }

      threshold = Math.max(0, Math.min(1, threshold + JITTER[i]));

      if (progress > threshold) {
        const glyphs = progress < 0.6 ? GLYPHS_HEAVY : GLYPHS_LIGHT;
        return glyphs[Math.floor(Math.random() * glyphs.length)];
      }
      return ch;
    })
    .join("");
}

type Phase = "idle" | "dissolving" | "reversing" | "dissolved";

export default function LogoutButton() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [display, setDisplay] = useState(IDLE_TEXT);
  const [fillProgress, setFillProgress] = useState(0);
  const frameRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef(0);

  function stopAnimation() {
    if (frameRef.current) {
      clearInterval(frameRef.current);
      frameRef.current = null;
    }
  }

  function animate(forward: boolean) {
    stopAnimation();
    const duration = 1000;
    const startProgress = progressRef.current;
    const startTime = Date.now();

    // scale duration by how far we need to travel
    const distance = forward ? 1 - startProgress : startProgress;
    const scaledDuration = duration * distance;

    if (scaledDuration < 10) {
      // already at target
      if (forward) {
        finish();
      } else {
        reset();
      }
      return;
    }

    frameRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const rawT = Math.min(elapsed / scaledDuration, 1);

      let progress: number;
      if (forward) {
        progress = startProgress + distance * easeInQuad(rawT);
      } else {
        progress = startProgress - distance * easeOutQuad(rawT);
      }

      progress = Math.max(0, Math.min(1, progress));
      progressRef.current = progress;
      setFillProgress(progress * 100);

      if (forward && rawT >= 1) {
        finish();
        return;
      }

      if (!forward && rawT >= 1) {
        reset();
        return;
      }

      setDisplay(scramble(IDLE_TEXT, progress));
    }, 40);
  }

  function finish() {
    stopAnimation();
    progressRef.current = 1;
    setDisplay("❋");
    setFillProgress(100);
    setPhase("dissolved");

    // hold ❋ briefly, then navigate
    setTimeout(() => {
      window.location.href = "/api/auth/logout";
    }, 400);
  }

  function reset() {
    stopAnimation();
    progressRef.current = 0;
    setDisplay(IDLE_TEXT);
    setFillProgress(0);
    setPhase("idle");
  }

  function handleClick() {
    switch (phase) {
      case "idle":
        setPhase("dissolving");
        animate(true);
        break;
      case "dissolving":
        // cancel → reverse back
        setPhase("reversing");
        animate(false);
        break;
      case "reversing":
        // changed mind again → resume dissolve
        setPhase("dissolving");
        animate(true);
        break;
      case "dissolved":
        // reverse from ❋ back to text
        setPhase("reversing");
        animate(false);
        break;
    }
  }

  useEffect(() => {
    return () => stopAnimation();
  }, []);

  const isAnimating = phase === "dissolving" || phase === "reversing";

  return (
    <button
      onClick={handleClick}
      className="w-full h-[40px] text-[11px] font-mono text-[var(--color-text-muted)] hover:text-[var(--color-text)] border border-transparent hover:border-[var(--color-border)] transition-all duration-300 relative overflow-hidden"
    >
      {/* progress fill — closes inward from both edges (outside-in) */}
      <span
        className="absolute inset-y-0 left-0 bg-[var(--color-text)]"
        style={{
          width: `${fillProgress / 2}%`,
          opacity: isAnimating || phase === "dissolved" ? 0.08 : 0,
          transition: "opacity 300ms",
        }}
      />
      <span
        className="absolute inset-y-0 right-0 bg-[var(--color-text)]"
        style={{
          width: `${fillProgress / 2}%`,
          opacity: isAnimating || phase === "dissolved" ? 0.08 : 0,
          transition: "opacity 300ms",
        }}
      />
      <span className="relative">{display}</span>
    </button>
  );
}
