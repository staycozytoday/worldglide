export default function Loading() {
  return (
    <div className="max-w-[960px] mx-auto px-8 pt-16 pb-24">
      {/* skeleton header — matches JobList column headers */}
      <div className="h-[32px] flex items-center gap-6 -mx-2 px-4 border-b border-[var(--color-text)]">
        <span className="w-[32px] shrink-0 hidden sm:block">
          <span className="block h-[8px] w-[24px] bg-[var(--color-border)] rounded-sm" />
        </span>
        <span className="flex-1">
          <span className="block h-[8px] w-[32px] bg-[var(--color-border)] rounded-sm" />
        </span>
        <span className="w-[120px] shrink-0 flex justify-end">
          <span className="block h-[8px] w-[56px] bg-[var(--color-border)] rounded-sm" />
        </span>
        <span className="w-[80px] shrink-0 hidden lg:block flex justify-end">
          <span className="block h-[8px] w-[32px] bg-[var(--color-border)] rounded-sm ml-auto" />
        </span>
      </div>

      {/* skeleton rows — matches JobCard layout */}
      <div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-[40px] border-b border-[var(--color-border)] flex items-center gap-6 -mx-2 px-4 animate-pulse"
            style={{ animationDelay: `${i * 0.04}s` }}
          >
            <span className="w-[32px] shrink-0 hidden sm:block">
              <span className="block h-[10px] w-[20px] bg-[var(--color-border)] rounded-sm" />
            </span>
            <span className="flex-1 min-w-0">
              <span
                className="block h-[12px] bg-[var(--color-border)] rounded-sm"
                style={{ width: `${30 + i * 8}%` }}
              />
            </span>
            <span className="w-[120px] shrink-0 flex justify-end">
              <span className="block h-[12px] w-[80px] bg-[var(--color-border)] rounded-sm" />
            </span>
            <span className="w-[80px] shrink-0 hidden lg:block">
              <span className="block h-[10px] w-[56px] bg-[var(--color-border)] rounded-sm ml-auto" />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
