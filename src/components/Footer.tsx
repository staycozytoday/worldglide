import Link from "next/link";
import { SCRAPED_COMPANY_COUNT } from "@/lib/companies";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] mt-16">
      <div className="max-w-[960px] mx-auto px-8">
        <div className="flex flex-col sm:flex-row sm:items-center py-4 sm:py-0 sm:h-[48px] gap-3 sm:gap-6">
          <div className="flex items-center gap-6">
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

          <p className="text-[10px] text-[var(--color-text-muted)] font-mono sm:ml-auto">
            <span className="hidden sm:inline">sourced from top {SCRAPED_COMPANY_COUNT} global remote-first companies.</span>
            <span className="sm:hidden">sourced from top {SCRAPED_COMPANY_COUNT} remote-first companies.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
