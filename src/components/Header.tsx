"use client";

import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import ThemeToggle from "./ThemeToggle";
import { useFavorites } from "@/lib/useFavorites";

const REGIONS = [
  { key: null, label: "all" },
  { key: "noam", label: "noam" },
  { key: "eur", label: "eur" },
  { key: "apac", label: "apac" },
  { key: "latam", label: "latam" },
  { key: "mena", label: "mena" },
  { key: "ssa", label: "ssa" },
  { key: "ww", label: "global" },
] as const;

export default function Header() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const { count } = useFavorites();
  const savedActive = searchParams.get("saved") === "1";
  const activeRegion = searchParams.get("region");

  const toggleSaved = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (savedActive) {
      params.delete("saved");
    } else {
      params.set("saved", "1");
    }
    const q = params.toString();
    router.push(pathname + (q ? `?${q}` : ""));
  }, [savedActive, searchParams, pathname, router]);

  const setRegion = useCallback((region: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (region === null || activeRegion === region) {
      params.delete("region");
    } else {
      params.set("region", region);
    }
    router.push(pathname + (params.toString() ? `?${params.toString()}` : ""), { scroll: false });
    setMenuOpen(false);
  }, [activeRegion, searchParams, pathname, router]);

  const regionLink = ({ key, label }: { key: string | null; label: string }) => (
    <button
      key={label}
      onClick={() => setRegion(key)}
      className={`text-[12px] transition-colors ${
        (key === null ? !activeRegion : activeRegion === key)
          ? "text-[var(--color-text)]"
          : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
      }`}
    >
      {label}
    </button>
  );

  return (
    <header className="sticky top-0 z-50 bg-[var(--color-bg)]">
      <div className="max-w-[960px] mx-auto px-8">
        <div className="flex items-center h-[48px]">
          <span className="mr-[8px]">
            <ThemeToggle />
          </span>
          <a href="/" className="text-[14px] font-medium tracking-tight text-[var(--color-text)] no-underline">
            worldglide
          </a>

          {/* desktop nav — region filters */}
          <nav className="hidden sm:flex items-center gap-6 ml-6">
            {REGIONS.map((r) => regionLink(r))}
            {count > 0 && (
              <button
                onClick={toggleSaved}
                className="text-[12px] text-[var(--color-text)]"
              >
                ❋
              </button>
            )}
          </nav>

          {/* post a job — desktop */}
          <Link
            href="/submit"
            className="ml-auto hidden sm:block text-[12px] text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
          >
            post a job
          </Link>

          {/* mobile menu toggle */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="ml-auto sm:hidden w-[32px] h-[32px] flex items-center justify-center text-[14px] font-mono text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            aria-label={menuOpen ? "close menu" : "open menu"}
          >
            {menuOpen ? "−" : "+"}
          </button>
        </div>
      </div>

      {/* mobile dropdown */}
      {menuOpen && (
        <div className="sm:hidden border-t border-[var(--color-border)] bg-[var(--color-bg)]">
          <nav className="max-w-[960px] mx-auto px-8 py-4 flex flex-col gap-4">
            {REGIONS.map((r) => regionLink(r))}
            {count > 0 && (
              <button
                onClick={() => { toggleSaved(); setMenuOpen(false); }}
                className="text-[12px] text-left text-[var(--color-text)]"
              >
                ❋
              </button>
            )}
            <Link
              href="/submit"
              onClick={() => setMenuOpen(false)}
              className="text-[12px] text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            >
              post a job
            </Link>
          </nav>
        </div>
      )}

      <div className="h-px bg-[var(--color-border)]" />
    </header>
  );
}
