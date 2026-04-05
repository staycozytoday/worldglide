"use client";

import { Job } from "@/lib/types";
import { formatRelativeTime, isNew } from "@/lib/utils";
import { useVisited } from "@/lib/useVisited";
import { useFavorites } from "@/lib/useFavorites";

export default function JobCard({ job, index = 0 }: { job: Job; index?: number }) {
  const fresh = isNew(job.postedAt);
  const { isVisited, markVisited } = useVisited();
  const { isFavorited, toggleFavorite } = useFavorites();
  const visited = isVisited(job.id);
  const faved = isFavorited(job.id);

  return (
    <div className={`group relative flex items-center h-[40px] border-b border-[var(--color-border)] -mx-2 px-4 gap-2 sm:gap-6 job-row-wrap ${visited ? "opacity-[0.98]" : ""}`}>
      {/* age */}
      <span className="text-[11px] text-[var(--color-text-muted)] w-[32px] shrink-0 hidden sm:block font-mono">
        {formatRelativeTime(job.postedAt)}
      </span>

      {/* title + new dot — link to job */}
      <a
        href={job.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => markVisited(job.id)}
        className="flex-1 min-w-0 flex items-center gap-2 h-full"
      >
        <span className={`text-[13px] truncate ${visited ? "text-[var(--color-text-muted)]" : "text-[var(--color-text)]"}`}>
          {job.title}
        </span>
        {fresh && (
          <span
            className={`shrink-0 w-1.5 h-1.5 bg-[var(--color-accent)] rounded-full animate-rec ${visited ? "opacity-40" : ""}`}
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
        onClick={() => markVisited(job.id)}
        className="w-[96px] sm:w-[160px] shrink-0 flex items-center justify-end h-full"
      >
        <span className={`text-[13px] truncate ${visited ? "text-[var(--color-text-muted)]" : "text-[var(--color-text)]"}`}>
          {job.company}
        </span>
      </a>

      {/* region */}
      <span className="text-[11px] text-[var(--color-text-muted)] w-[80px] shrink-0 hidden lg:block font-mono text-right">
        {job.region}
      </span>

      {/* fav — absolute overlay, no layout impact */}
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(job.id); }}
        className={`absolute left-[52px] top-1/2 -translate-x-1/2 -translate-y-1/2 text-[14px] hidden sm:block ${
          faved
            ? "text-[var(--color-text)]"
            : "text-[var(--color-text-muted)] opacity-0 group-hover:opacity-100"
        }`}
        aria-label={faved ? "remove from favorites" : "add to favorites"}
      >
        ❋
      </button>
    </div>
  );
}
