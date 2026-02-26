import { Job } from "@/lib/types";
import { formatRelativeTime, isNew } from "@/lib/utils";

export default function JobCard({ job, index = 0 }: { job: Job; index?: number }) {
  const fresh = isNew(job.postedAt);

  return (
    <a
      href={job.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
    >
      <div className="h-[40px] border-b border-[var(--color-border)] flex items-center gap-6 transition-colors group-hover:bg-[var(--color-bg-hover)] -mx-2 px-4">
        {/* age */}
        <span className="text-[11px] text-[var(--color-text-muted)] w-[32px] shrink-0 hidden sm:block font-mono">
          {formatRelativeTime(job.postedAt)}
        </span>

        {/* title + dot */}
        <span className="flex-1 min-w-0 flex items-center gap-2">
          <span className="text-[13px] text-[var(--color-text)] truncate">
            {job.title}
          </span>
          {fresh && (
            <span
              className="shrink-0 w-1.5 h-1.5 bg-[var(--color-text)] rounded-full animate-rec"
              style={{
                animationDuration: `${3 + (index % 5) * 0.7}s`,
                animationDelay: `${((index * 1.7) % 4).toFixed(1)}s`,
              }}
            />
          )}
        </span>

        {/* company */}
        <span className="text-[13px] text-[var(--color-text)] w-[120px] shrink-0 truncate text-right">
          {job.company}
        </span>

        {/* type */}
        <span className="text-[11px] text-[var(--color-text-muted)] w-[80px] shrink-0 hidden lg:block font-mono text-right">
          {job.category}
        </span>
      </div>
    </a>
  );
}
