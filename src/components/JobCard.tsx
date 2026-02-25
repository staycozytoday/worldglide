import { Job } from "@/lib/types";
import { formatRelativeTime, isExpired, isNew } from "@/lib/utils";

export default function JobCard({ job, index = 0 }: { job: Job; index?: number }) {
  const expired = isExpired(job.postedAt);
  const fresh = isNew(job.postedAt);

  if (expired) {
    return (
      <div className="job-expired">
        <div className="h-[40px] border-b border-[var(--color-border)] flex items-center">
          <span className="text-[11px] text-[var(--color-text-muted)] w-[80px] shrink-0 hidden sm:block font-mono text-right">
            expired
          </span>
          <span className="text-[13px] text-[var(--color-text-muted)] flex-1 min-w-0 truncate px-4">
            {job.title}
          </span>
          <span className="text-[12px] text-[var(--color-text-muted)] w-[120px] shrink-0 truncate text-right px-4">
            {job.company}
          </span>
          <span className="text-[11px] text-[var(--color-text-muted)] w-[72px] shrink-0 hidden lg:block font-mono">
            {job.category}
          </span>
        </div>
      </div>
    );
  }

  return (
    <a
      href={job.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
    >
      <div className="h-[40px] border-b border-[var(--color-border)] flex items-center transition-colors group-hover:bg-[var(--color-bg-hover)] -mx-2 px-2">
        {/* age — fixed 80px, right-aligned */}
        <span className="text-[11px] text-[var(--color-text-muted)] w-[80px] shrink-0 hidden sm:block font-mono text-right">
          {formatRelativeTime(job.postedAt)}
        </span>

        {/* title + dot + arrow — flex wrapper so dot stays snug to text */}
        <span className="flex-1 min-w-0 flex items-center px-4 gap-2">
          <span className="text-[13px] text-[var(--color-text)] truncate">
            {job.title}
          </span>
          {fresh && (
            <span
              className="shrink-0 w-1.5 h-1.5 bg-[#FF6432] rounded-full animate-rec"
              style={{
                animationDuration: `${3 + (index % 5) * 0.7}s`,
                animationDelay: `${((index * 1.7) % 4).toFixed(1)}s`,
              }}
            />
          )}
        </span>

        {/* company — fixed 120px */}
        <span className="text-[12px] text-[var(--color-text-secondary)] w-[120px] shrink-0 truncate text-right px-4">
          {job.company}
        </span>

        {/* category — fixed 72px, flush right */}
        <span className="text-[11px] text-[var(--color-text-muted)] w-[72px] shrink-0 hidden lg:block font-mono">
          {job.category}
        </span>
      </div>
    </a>
  );
}
