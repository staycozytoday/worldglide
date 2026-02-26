"use client";

import { useState, useEffect, useRef } from "react";

const IDLE_TEXT = "close portal";

// scramble characters — mystical feel
const GLYPHS = "⊹⋆✧∘◦⟡⊛⋄∙·.";

function scramble(original: string, progress: number): string {
  return original
    .split("")
    .map((ch, i) => {
      if (ch === " ") return " ";
      // characters dissolve left-to-right based on progress
      const threshold = i / original.length;
      if (progress > threshold) {
        return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      return ch;
    })
    .join("");
}

export default function LogoutButton() {
  const [dissolving, setDissolving] = useState(false);
  const [display, setDisplay] = useState(IDLE_TEXT);
  const frameRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startRef = useRef(0);

  useEffect(() => {
    if (!dissolving) return;

    startRef.current = Date.now();
    const duration = 600; // ms

    frameRef.current = setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      const progress = Math.min(elapsed / duration, 1);

      if (progress >= 1) {
        // fully dissolved → navigate
        if (frameRef.current) clearInterval(frameRef.current);
        setDisplay("· · ·");
        window.location.href = "/api/auth/logout";
        return;
      }

      setDisplay(scramble(IDLE_TEXT, progress));
    }, 50);

    return () => {
      if (frameRef.current) clearInterval(frameRef.current);
    };
  }, [dissolving]);

  return (
    <button
      onClick={() => setDissolving(true)}
      disabled={dissolving}
      className="w-full h-[40px] text-[11px] font-mono border border-transparent text-[var(--color-text-muted)] hover:border-[var(--color-border)] hover:text-[var(--color-text)] transition-all duration-300 cursor-pointer disabled:cursor-not-allowed disabled:hover:border-transparent"
    >
      {display}
    </button>
  );
}
