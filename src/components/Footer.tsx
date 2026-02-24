import Link from "next/link";
import { REMOTE_COMPANIES } from "@/lib/companies";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] mt-16">
      <div className="max-w-[960px] mx-auto px-8">
        <div className="flex items-center h-[48px] gap-6">
          <p className="text-[10px] text-[var(--color-text-muted)] font-mono">
            sourced directly from top {REMOTE_COMPANIES.length} remote-first company career pages.
          </p>

          <div className="flex items-center gap-6 ml-auto shrink-0">
            <Link
              href="/submit"
              className="text-[12px] text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
            >
              post a job
            </Link>
            <a
              href="https://www.buymeacoffee.com/staycozy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12px] text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
            >
              buy me a pizza
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
