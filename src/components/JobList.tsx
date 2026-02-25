import { Job } from "@/lib/types";
import { groupJobsByDate } from "@/lib/utils";
import JobCard from "./JobCard";

interface JobListProps {
  jobs: Job[];
  title?: string;
  subtitle?: string;
}

export default function JobList({ jobs, title, subtitle }: JobListProps) {
  if (jobs.length === 0) {
    return (
      <div className="py-24">
        <p className="text-[12px] text-[var(--color-text-muted)]">
          no jobs found. check back tomorrow.
        </p>
      </div>
    );
  }

  const sortedJobs = [...jobs].sort((a, b) => {
    const aTime = new Date(a.postedAt).getTime();
    const bTime = new Date(b.postedAt).getTime();
    return bTime - aTime;
  });

  const dateGroups = groupJobsByDate(sortedJobs);
  const openCount = jobs.filter((j) => !j.expired).length;

  return (
    <div>
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
            {openCount} vacancies
          </p>
        </div>
      )}

      {/* column headers */}
      <div className="h-[32px] flex items-center border-b border-[var(--color-text)] text-[10px] text-[var(--color-text-muted)] font-mono">
        <span className="w-[80px] shrink-0 hidden sm:block text-right">age</span>
        <span className="flex-1 px-4">position</span>
        <span className="w-[120px] shrink-0 text-right px-4">company</span>
        <span className="w-[72px] shrink-0 hidden lg:block">type</span>
      </div>

      {/* jobs */}
      <div className="stagger-children">
        {dateGroups.map((group) => (
          <div key={group.label}>
            {sortedJobs
              .slice(group.startIndex, group.endIndex)
              .map((job, i) => (
                <JobCard key={job.id} job={job} index={group.startIndex + i} />
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}
