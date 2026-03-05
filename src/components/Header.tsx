"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import { useFavorites } from "@/lib/useFavorites";

const NAV_ITEMS = [
  { label: "product", href: "/product" },
  { label: "engineering", href: "/engineering" },
  { label: "design", href: "/design" },
];

export default function Header() {
  const pathname = usePathname();
  const { count } = useFavorites();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLink = (item: { label: string; href: string }, mobile = false) => {
    const isActive = item.href === "/saved"
      ? pathname === "/saved"
      : pathname.startsWith(item.href);

    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={() => mobile && setMenuOpen(false)}
        className={`text-[12px] ${
          isActive
            ? "text-[var(--color-text)]"
            : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
        }`}
      >
        {item.label}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-50 bg-[var(--color-bg)]">
      <div className="max-w-[960px] mx-auto px-8">
        <div className="flex items-center h-[48px]">
          <span className="mr-[8px]">
            <ThemeToggle />
          </span>
          <Link href="/" className="text-[14px] font-medium tracking-tight">
            worldglide
          </Link>

          {/* desktop nav — visible sm and up */}
          <nav className="hidden sm:flex items-center gap-6 ml-6">
            {NAV_ITEMS.map((item) => navLink(item))}

            {count > 0 && (
              <Link
                href="/saved"
                className={`text-[12px] flex items-center gap-1 ${
                  pathname === "/saved"
                    ? "text-[var(--color-text)]"
                    : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                }`}
              >
                saved
                <span className="text-[10px] font-mono text-[var(--color-fav)]">
                  {count}
                </span>
              </Link>
            )}
          </nav>

          {/* buy me a pizza — desktop */}
          <a
            href="https://buymeacoffee.com/staycozy"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto hidden sm:block text-[12px] text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
          >
            buy me a pizza
          </a>

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
        <div className="sm:hidden border-t border-[var(--color-border)]">
          <nav className="max-w-[960px] mx-auto px-8 py-4 flex flex-col gap-3">
            {NAV_ITEMS.map((item) => navLink(item, true))}

            {count > 0 && (
              <Link
                href="/saved"
                onClick={() => setMenuOpen(false)}
                className={`text-[12px] flex items-center gap-1 ${
                  pathname === "/saved"
                    ? "text-[var(--color-text)]"
                    : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                }`}
              >
                saved
                <span className="text-[10px] font-mono text-[var(--color-fav)]">
                  {count}
                </span>
              </Link>
            )}

            <a
              href="https://buymeacoffee.com/staycozy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12px] text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            >
              buy me a pizza
            </a>
          </nav>
        </div>
      )}

      <div className="h-px bg-[var(--color-border)]" />
    </header>
  );
}
