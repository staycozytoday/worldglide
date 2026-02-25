"use client";

import { useState } from "react";

interface StatsPanelProps {
  dailyCounts: { date: string; count: number }[];
  categories: { label: string; count: number }[];
  total: number;
}

const CAT_OPACITY: Record<string, number> = {
  engineering: 0.7,
  product: 0.4,
  design: 0.2,
};

export default function StatsPanel({
  dailyCounts,
  categories,
  total,
}: StatsPanelProps) {
  const [hover, setHover] = useState<{
    key: string;
    line1: string;
    line2: string;
  } | null>(null);

  const maxCount = Math.max(...dailyCounts.map((d) => d.count), 1);
  const catTotal = categories.reduce((sum, c) => sum + c.count, 0);

  // extract hovered sparkline bar index (if any)
  const hoveredDayIdx =
    hover?.key.startsWith("day-") ? parseInt(hover.key.split("-")[1]) : null;

  return (
    <div className="flex flex-col">
      {/* sparkline — 14 bars for 14 days, full width */}
      <div className="relative flex items-end gap-[2px] h-[32px]">
        {dailyCounts.map(({ date, count }, i) => (
          <div
            key={i}
            className="flex-1 bg-[var(--color-text)] transition-opacity cursor-default"
            style={{
              height:
                count > 0
                  ? `${Math.max((count / maxCount) * 100, 12)}%`
                  : "2px",
              opacity:
                hover?.key === `day-${i}`
                  ? 0.7
                  : count > 0
                    ? 0.25
                    : 0.06,
            }}
            onMouseEnter={() =>
              setHover({
                key: `day-${i}`,
                line1: date,
                line2: `${count}`,
              })
            }
            onMouseLeave={() => setHover(null)}
          />
        ))}

        {/* hover tooltip — inside the sparkline, over the hovered bar */}
        {hoveredDayIdx !== null && (
          <div
            className="absolute pointer-events-none flex flex-col items-center"
            style={{
              bottom: `calc(100% + 8px)`,
              left: `${(hoveredDayIdx / 14) * 100}%`,
              width: `${100 / 14}%`,
            }}
          >
            <span className="text-[12px] font-mono text-[var(--color-text-muted)] leading-tight whitespace-nowrap">
              {hover?.line1}
            </span>
            <span className="text-[16px] font-medium tracking-tight text-[var(--color-text)] leading-tight whitespace-nowrap">
              {hover?.line2}
            </span>
          </div>
        )}

        {/* category hover — show in top-right of sparkline area */}
        {hover && !hover.key.startsWith("day-") && (
          <div className="absolute top-0 right-0 pointer-events-none flex flex-col items-end">
            <span className="text-[10px] font-mono text-[var(--color-text-muted)] leading-tight">
              {hover.line1}
            </span>
            <span className="text-[10px] font-mono text-[var(--color-text)] leading-tight">
              {hover.line2}
            </span>
          </div>
        )}
      </div>

      {/* stats row — total left, categories + ratio right */}
      <div className="flex justify-between mt-4">
        <div className="flex flex-col">
          <span className="text-[10px] font-mono text-[var(--color-text-muted)] leading-none">
            total
          </span>
          <span className="text-[28px] font-medium tracking-tight tabular-nums leading-none mt-1">
            {total}
          </span>
        </div>
        <div className="flex flex-col">
          <div className="flex gap-8">
            {categories.map((c) => (
              <div
                key={c.label}
                className="flex flex-col cursor-default"
                onMouseEnter={() =>
                  setHover({
                    key: c.label,
                    line1: c.label,
                    line2: `${c.count}`,
                  })
                }
                onMouseLeave={() => setHover(null)}
              >
                <span className="text-[10px] font-mono text-[var(--color-text-muted)] leading-none">
                  {c.label}
                </span>
                <span className="text-[28px] font-medium tracking-tight tabular-nums leading-none mt-1">
                  {c.count}
                </span>
              </div>
            ))}
          </div>
          {/* ratio bar — same width as categories above */}
          <div className="flex h-[4px] gap-[1px] mt-3">
            {categories.map((c) => {
              const base = CAT_OPACITY[c.label] ?? 0.5;
              return (
                <div
                  key={c.label}
                  className="bg-[var(--color-text)] transition-opacity cursor-default"
                  style={{
                    width:
                      catTotal > 0
                        ? `${(c.count / catTotal) * 100}%`
                        : "0%",
                    opacity:
                      hover?.key === c.label
                        ? Math.min(base + 0.3, 1)
                        : base,
                  }}
                  onMouseEnter={() =>
                    setHover({
                      key: c.label,
                      line1: c.label,
                      line2: `${c.count}`,
                    })
                  }
                  onMouseLeave={() => setHover(null)}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
