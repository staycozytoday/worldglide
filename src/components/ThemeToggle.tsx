"use client";

import { useEffect, useState, useCallback, useRef } from "react";

const GLITCH_CHARS = [
  "◌", "◍", "◎", "●", "○", "◐", "◑", "◒", "◓",
  "☉", "☆", "★", "◇", "◈", "▲", "△", "□", "■",
];

const DOT = "●";

const THEMES = ["light", "dark", "purple", "orange"] as const;
type Theme = (typeof THEMES)[number];

const THEME_META: Record<Theme, { colorScheme: string; themeColor: string; dotColor: string }> = {
  light:  { colorScheme: "light", themeColor: "#e3e5e8", dotColor: "#e85d2c" },
  dark:   { colorScheme: "dark",  themeColor: "#161618", dotColor: "#e85d2c" },
  purple: { colorScheme: "dark",  themeColor: "#6432FF", dotColor: "#FF6432" },
  orange: { colorScheme: "dark",  themeColor: "#FF6432", dotColor: "#6432FF" },
};

function applyTheme(theme: Theme) {
  const { colorScheme, themeColor } = THEME_META[theme];
  document.documentElement.setAttribute("data-theme", theme);
  document.documentElement.style.colorScheme = colorScheme;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", themeColor);
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);
  const [display, setDisplay] = useState(DOT);
  const [glitching, setGlitching] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("theme") as Theme | null;
    let initial: Theme;
    if (stored && THEMES.includes(stored)) {
      initial = stored;
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      initial = "dark";
    } else {
      initial = "light";
    }
    setTheme(initial);
    applyTheme(initial);

    // follow system changes in real time (only when no manual override)
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem("theme")) {
        const next: Theme = e.matches ? "dark" : "light";
        setTheme(next);
        applyTheme(next);
      }
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
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

  // electric shock ripple — spreads outward from the dot
  const shockRipple = useCallback(() => {
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const ox = rect.left + rect.width / 2;
    const oy = rect.top + rect.height / 2;

    // find all visible text-bearing elements
    const els = document.querySelectorAll<HTMLElement>(
      "h1,h2,h3,p,a,span,button,td,th,li,nav,label"
    );
    const maxDist = Math.hypot(window.innerWidth, window.innerHeight);

    els.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      const ex = r.left + r.width / 2;
      const ey = r.top + r.height / 2;
      const dist = Math.hypot(ex - ox, ey - oy);
      const delay = Math.round((dist / maxDist) * 600); // 0-600ms spread
      el.style.setProperty("--shock-delay", `${delay}ms`);
      el.classList.remove("shocking");
      // force reflow so re-adding the class restarts the animation
      void el.offsetWidth;
      el.classList.add("shocking");
    });

    // cleanup after all animations finish
    setTimeout(() => {
      els.forEach((el) => {
        el.classList.remove("shocking");
        el.style.removeProperty("--shock-delay");
      });
    }, 1100);
  }, []);

  // cycle: light → dark → purple → orange → light
  const toggle = useCallback(() => {
    const i = THEMES.indexOf(theme);
    const next = THEMES[(i + 1) % THEMES.length];
    setTheme(next);
    applyTheme(next);
    localStorage.setItem("theme", next);
    shockRipple();
  }, [theme, shockRipple]);

  if (!mounted) return <span className="w-[16px] inline-block" />;

  const { dotColor } = THEME_META[theme];

  return (
    <button
      ref={btnRef}
      onClick={toggle}
      onMouseEnter={startGlitch}
      onMouseLeave={stopGlitch}
      style={{ color: dotColor }}
      className={`w-[16px] text-center text-[14px] font-mono leading-none cursor-pointer select-none ${
        glitching ? "animate-glitch-jitter" : ""
      }`}
      aria-label={`switch theme (current: ${theme})`}
    >
      {display}
    </button>
  );
}
