export default function Loading() {
  return (
    <div className="max-w-[960px] mx-auto px-8 pt-16 pb-24">
      <div className="space-y-0">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-[40px] border-b border-[var(--color-border)] flex items-center animate-pulse"
          >
            <span className="w-[80px] shrink-0 hidden sm:block">
              <span className="block h-[10px] w-[48px] bg-[var(--color-border)] rounded" />
            </span>
            <span className="flex-1 px-4">
              <span className="block h-[12px] bg-[var(--color-border)] rounded" style={{ width: `${40 + i * 7}%` }} />
            </span>
            <span className="w-[120px] shrink-0 px-4 flex justify-end">
              <span className="block h-[10px] w-[72px] bg-[var(--color-border)] rounded" />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
