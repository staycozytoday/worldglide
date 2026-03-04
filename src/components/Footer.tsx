import { SCRAPED_COMPANY_COUNT } from "@/lib/companies";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] mt-16">
      <div className="max-w-[960px] mx-auto px-8">
        <div className="flex flex-col sm:flex-row sm:items-center py-[16px] sm:py-0 sm:h-[48px] gap-[8px] sm:gap-0">
          <p className="text-[10px] text-[var(--color-text-muted)] font-mono">
            <span className="hidden sm:inline">sourced from top {SCRAPED_COMPANY_COUNT} global remote-first companies.</span>
            <span className="sm:hidden">sourced from top {SCRAPED_COMPANY_COUNT} remote-first companies.</span>
          </p>

          <a
            href="https://staycozy.today"
            target="_blank"
            rel="noopener noreferrer"
            className="sm:ml-auto text-[12px] text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
          >
            stay cozy &amp; co.
          </a>
        </div>
      </div>
    </footer>
  );
}
