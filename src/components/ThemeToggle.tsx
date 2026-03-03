"use client";

import { useEffect, useState, useCallback, useRef } from "react";

const GLITCH_CHARS = [
  "◌", "◍", "◎", "●", "○", "◐", "◑", "◒", "◓",
  "☉", "☆", "★", "◇", "◈", "▲", "△", "□", "■",
];

const DOT = "●";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [display, setDisplay] = useState(DOT);
  const [glitching, setGlitching] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("theme");
    const isDark =
      stored === "dark" ||
      (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDark(isDark);
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  }, []);

  const startGlitch = useCallback(() => {
    if (glitching) return;
    setGlitching(true);
    intervalRef.current = setInterval(() => {
      setDisplay(GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]);
    }, 40);
  }, [glitching]);

  const stopGlitch = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    setDisplay(DOT);
    setGlitching(false);
  }, []);

  const toggle = useCallback(() => {
    const next = !dark;
    setDark(next);
    document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
    localStorage.setItem("theme", next ? "dark" : "light");
  }, [dark]);

  if (!mounted) return <span className="w-[16px] inline-block" />;

  return (
    <button
      onClick={toggle}
      onMouseEnter={startGlitch}
      onMouseLeave={stopGlitch}
      className={`w-[16px] text-center text-[14px] font-mono leading-none text-[#e85d2c] hover:text-[#FF6432] transition-colors duration-500 cursor-pointer select-none ${
        glitching ? "animate-glitch-jitter" : ""
      }`}
      aria-label={dark ? "switch to light mode" : "switch to dark mode"}
    >
      {display}
    </button>
  );
}
