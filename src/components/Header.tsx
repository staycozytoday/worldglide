"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "product", href: "/product" },
  { label: "engineering", href: "/engineering" },
  { label: "design", href: "/design" },
  { label: "post a job", href: "/submit" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-[var(--color-bg)]">
      <div className="max-w-[960px] mx-auto px-8">
        <div className="flex items-center h-[48px]">
          <Link href="/" className="text-[14px] font-medium tracking-tight">
            worldglide
          </Link>

          <nav className="flex items-center gap-4 sm:gap-6 ml-auto sm:ml-6">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-[12px] transition-colors ${
                    isActive
                      ? "text-[var(--color-text)]"
                      : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
      <div className="h-px bg-[var(--color-border)]" />
    </header>
  );
}
