"use client";

import { useState } from "react";

interface StatsPanelProps {
  dailyCounts: { date: string; count: number }[];
  categories: { label: string; count: number }[];
  total: number;
  companies: number;
}

export default function StatsPanel({
  dailyCounts,
  categories,
  total,
  companies,
}: StatsPanelProps) {
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  const [hoveredCat, setHoveredCat] = useState<string | null>(null);

  const maxCount = Math.max(...dailyCounts.map((d) => d.count), 1);
  const catTotal = categories.reduce((sum, c) => sum + c.count, 0);

  return (
    <div className="flex flex-col">
      {/* sparkline — scrubbable timeline, hover to reveal day data */}
      <div className="flex items-end gap-[2px] h-[48px]">
        {dailyCounts.map(({ count }, i) => (
          <div
            key={i}
            className="flex-1 bg-[var(--color-text)]"
            style={{
              height: count > 0 ? `${Math.max((count / maxCount) * 100, 8)}%` : "2px",
              opacity:
                hoveredDay === i
                  ? 0.7
                  : hoveredDay !== null
                    ? 0.05
                    : count > 0
                      ? 0.18
                      : 0.04,
              transition: "opacity 150ms",
            }}
            onMouseEnter={() => setHoveredDay(i)}
            onMouseLeave={() => setHoveredDay(null)}
          />
        ))}
      </div>

      {/* readout — single line: date range or hover detail left, totals right */}
      <div className="mt-2 flex items-baseline justify-between text-[10px] font-mono text-[var(--color-text-muted)]">
        <span
          className="tabular-nums"
          style={{
            color: hoveredDay !== null ? "var(--color-text)" : undefined,
            transition: "color 150ms",
          }}
        >
          {hoveredDay !== null
            ? `${dailyCounts[hoveredDay].date} → ${dailyCounts[hoveredDay].count} jobs`
            : `${dailyCounts[0]?.date} → ${dailyCounts[dailyCounts.length - 1]?.date}`}
        </span>
        <span className="tabular-nums">
          {total} jobs from {companies} companies
        </span>
      </div>

      {/* category breakdown */}
      <div className="mt-4 flex items-baseline justify-between text-[10px] font-mono text-[var(--color-text-muted)]">
        {categories.map((c) => (
          <span
            key={c.label}
            className=""
            style={{
              opacity: hoveredCat && hoveredCat !== c.label ? 0.3 : 1,
              color: hoveredCat === c.label ? "var(--color-text)" : undefined,
              transition: "opacity 200ms, color 200ms",
            }}
            onMouseEnter={() => setHoveredCat(c.label)}
            onMouseLeave={() => setHoveredCat(null)}
          >
            {c.count} {c.label}
          </span>
        ))}
      </div>

      {/* segmented ratio bar */}
      <div className="flex h-[2px] mt-2 gap-px">
        {categories.map((c) => (
          <div
            key={c.label}
            className="bg-[var(--color-text)]"
            style={{
              width: catTotal > 0 ? `${(c.count / catTotal) * 100}%` : "0%",
              opacity:
                hoveredCat === c.label
                  ? 0.7
                  : hoveredCat
                    ? 0.05
                    : 0.18,
              transition: "opacity 200ms",
            }}
            onMouseEnter={() => setHoveredCat(c.label)}
            onMouseLeave={() => setHoveredCat(null)}
          />
        ))}
      </div>
    </div>
  );
}
