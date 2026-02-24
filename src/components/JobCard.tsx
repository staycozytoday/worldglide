import { Job } from "@/lib/types";
import { formatRelativeTime, isExpired, isNew } from "@/lib/utils";

export default function JobCard({ job }: { job: Job }) {
  const expired = isExpired(job.postedAt);
  const fresh = isNew(job.postedAt);

  if (expired) {
    return (
      <div className="job-expired">
        <div className="h-[40px] border-b border-[var(--color-border)] flex items-center">
          <span className="text-[11px] text-[var(--color-text-muted)] w-[80px] shrink-0 hidden sm:block font-mono">
            expired
          </span>
          <span className="text-[13px] text-[var(--color-text-muted)] flex-1 min-w-0 truncate px-4">
            {job.title}
          </span>
          <span className="text-[12px] text-[var(--color-text-muted)] w-[120px] shrink-0 truncate text-right px-4">
            {job.company}
          </span>
          <span className="text-[11px] text-[var(--color-text-muted)] w-[72px] shrink-0 text-right hidden lg:block font-mono">
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
        {/* time — fixed 80px, flush left */}
        <span className="text-[11px] text-[var(--color-text-muted)] w-[80px] shrink-0 hidden sm:block font-mono">
          {formatRelativeTime(job.postedAt)}
        </span>

        {/* title — flexible, arrow appears on hover */}
        <span className="text-[13px] text-[var(--color-text)] flex-1 min-w-0 truncate px-4">
          {job.title}
          {fresh && (
            <span className="inline-block ml-2 w-1.5 h-1.5 bg-[var(--color-text)] rounded-full align-middle" />
          )}
          <span className="inline-block ml-1.5 text-[11px] text-[var(--color-text-muted)] opacity-0 group-hover:opacity-100 transition-opacity align-middle">↗</span>
        </span>

        {/* company — fixed 120px */}
        <span className="text-[12px] text-[var(--color-text-secondary)] w-[120px] shrink-0 truncate text-right px-4">
          {job.company}
        </span>

        {/* category — fixed 72px, flush right */}
        <span className="text-[11px] text-[var(--color-text-muted)] w-[72px] shrink-0 text-right hidden lg:block font-mono">
          {job.category}
        </span>
      </div>
    </a>
  );
}
