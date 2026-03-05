"use client";

import { Job } from "@/lib/types";
import { formatRelativeTime, isNew } from "@/lib/utils";
import { useVisited } from "@/lib/useVisited";

export default function JobCard({ job, index = 0 }: { job: Job; index?: number }) {
  const fresh = isNew(job.postedAt);
  const { isVisited, markVisited } = useVisited();
  const visited = isVisited(job.company);

  return (
    <div className={`flex items-center h-[40px] border-b border-[var(--color-border)] -mx-2 px-4 gap-2 sm:gap-6 job-row-wrap ${visited ? "opacity-95" : ""}`}>
      {/* age */}
      <span className="text-[11px] text-[var(--color-text-muted)] w-[32px] shrink-0 hidden sm:block font-mono">
        {formatRelativeTime(job.postedAt)}
      </span>

      {/* title + new dot — link to job */}
      <a
        href={job.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => markVisited(job.company)}
        className="flex-1 min-w-0 flex items-center gap-2 h-full"
      >
        <span className={`text-[13px] truncate ${visited ? "text-[var(--color-text-muted)]" : "text-[var(--color-text)]"}`}>
          {job.title}
        </span>
        {fresh && (
          <span
            className="shrink-0 w-1.5 h-1.5 bg-[var(--color-accent)] rounded-full animate-rec"
            style={{
              animationDuration: `${3 + (index % 5) * 0.7}s`,
              animationDelay: `${((index * 1.7) % 4).toFixed(1)}s`,
            }}
          />
        )}
      </a>

      {/* company */}
      <a
        href={job.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => markVisited(job.company)}
        className="w-[96px] sm:w-[160px] shrink-0 flex items-center justify-end h-full"
      >
        <span className={`text-[13px] truncate ${visited ? "text-[var(--color-text-muted)]" : "text-[var(--color-text)]"}`}>
          {job.company}
        </span>
      </a>

      {/* type */}
      <span className="text-[11px] text-[var(--color-text-muted)] w-[80px] shrink-0 hidden lg:block font-mono text-right">
        {job.category}
      </span>
    </div>
  );
}
