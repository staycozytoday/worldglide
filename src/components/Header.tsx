"use client";

import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useCallback } from "react";
import ThemeToggle from "./ThemeToggle";
import { useFavorites } from "@/lib/useFavorites";

export default function Header() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { count } = useFavorites();
  const savedActive = searchParams.get("saved") === "1";

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

          {count > 0 && (
            <button
              onClick={toggleSaved}
              className="ml-6 text-[12px] text-[var(--color-text)]"
              aria-label={savedActive ? "show all jobs" : "show saved jobs"}
            >
              ❋
            </button>
          )}

          <Link
            href="/submit"
            className="ml-auto text-[12px] text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
          >
            post a job
          </Link>
        </div>
      </div>

      <div className="h-px bg-[var(--color-border)]" />
    </header>
  );
}
