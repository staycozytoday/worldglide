"use client";

import { Job } from "@/lib/types";
import JobCard from "./JobCard";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useFavorites } from "@/lib/useFavorites";

type SortColumn = "age" | "title" | "company" | "type";
type SortDir = "asc" | "desc";

interface JobListProps {
  jobs: Job[];
  title?: string;
  subtitle?: string;
  totalCount?: number;
}

const PAGE_SIZE = 25;

const COLS: { key: SortColumn; label: string; cls: string; right?: boolean }[] = [
  { key: "age", label: "age", cls: "w-[32px] shrink-0 hidden sm:block text-left" },
  { key: "title", label: "title", cls: "flex-1 text-left" },
  { key: "company", label: "company", cls: "w-[96px] sm:w-[160px] shrink-0 text-right", right: true },
  { key: "type", label: "type", cls: "w-[80px] shrink-0 hidden lg:block text-right", right: true },
];

export default function JobList({ jobs, title, subtitle, totalCount }: JobListProps) {
  const [sortCol, setSortCol] = useState<SortColumn>("age");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const searchParams = useSearchParams();
  const { isFavorited } = useFavorites();
  const savedActive = searchParams.get("saved") === "1";

  const filtered = savedActive ? jobs.filter((j) => isFavorited(j.id)) : jobs;
  const isEmpty = filtered.length === 0;

  function handleSort(col: SortColumn) {
    if (sortCol === col) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortCol(col);
      setSortDir("asc");
    }
  }

  const sorted = [...filtered].sort((a, b) => {
    const dir = sortDir === "asc" ? 1 : -1;
    switch (sortCol) {
      case "age":
        return dir * (new Date(a.postedAt).getTime() - new Date(b.postedAt).getTime());
      case "title":
        return dir * a.title.localeCompare(b.title);
      case "company":
        return dir * a.company.localeCompare(b.company);
      case "type":
        return dir * a.category.localeCompare(b.category);
      default:
        return 0;
    }
  });

  const displayed = sorted.slice(0, visibleCount);
  const remaining = sorted.length - visibleCount;
  const openCount = filtered.length;

  return (
    <div className="overflow-hidden">
      {title && (
        <div className="mb-16">
          <h1 className="text-[32px] md:text-[40px] font-medium tracking-tight leading-[1.1] text-[var(--color-text)]">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[12px] text-[var(--color-text-muted)] mt-4 max-w-[320px] leading-relaxed">
              {subtitle}
            </p>
          )}
          <p className="text-[10px] text-[var(--color-text-muted)] mt-4 font-mono">
            {openCount}/{totalCount ?? jobs.length}
          </p>
        </div>
      )}

      {isEmpty ? (
        <p className="text-[12px] text-[var(--color-text-muted)]">
          {savedActive ? "no favorite jobs yet. click ❋ next to the job name to save it." : "no jobs found. check back tomorrow."}
        </p>
      ) : (
        <>
          {/* column headers — clickable to sort */}
          <div className="h-[32px] flex items-center gap-2 sm:gap-6 -mx-2 px-4 border-b border-[var(--color-border)] text-[10px] font-mono">
            {COLS.map(({ key, label, cls, right }) => (
              <button
                key={key}
                onClick={() => handleSort(key)}
                className={`${cls} text-[var(--color-text-muted)]`}
              >
                <span className="hover:text-[var(--color-text)]">
                  {sortCol === key && right && (
                    <span className="mr-0.5">{sortDir === "asc" ? "↑" : "↓"}</span>
                  )}
                  {label}
                  {sortCol === key && !right && (
                    <span className="ml-0.5">{sortDir === "asc" ? "↑" : "↓"}</span>
                  )}
                </span>
              </button>
            ))}
          </div>

          {/* jobs */}
          <div>
            {displayed.map((job, i) => (
              <JobCard key={job.id} job={job} index={i} />
            ))}
          </div>

          {/* view more */}
          {remaining > 0 && (
            <button
              onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
              className="w-full h-[40px] border-b border-[var(--color-border)] flex items-center justify-center text-[11px] font-mono text-[var(--color-text-muted)] hover:text-[var(--color-text)] cursor-pointer job-row-wrap"
            >
              view {remaining} more
            </button>
          )}
        </>
      )}
    </div>
  );
}
