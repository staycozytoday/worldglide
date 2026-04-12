export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] mt-16">
      <div className="max-w-[960px] mx-auto px-8">
        <div className="flex items-center py-0 h-[48px]">
          <a
            href="https://staycozy.today"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
          >
            stay cozy &amp; co.
          </a>

          <a
            href="https://buymeacoffee.com/staycozy"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto text-[12px] text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
          >
            buy me a pizza
          </a>
        </div>
      </div>
    </footer>
  );
}
