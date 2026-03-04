"use client";

import JobList from "@/components/JobList";
import { useJobsByCategory } from "@/lib/useJobs";

export default function EngineeringPage() {
  const { jobs, totalCount } = useJobsByCategory("engineering");

  return (
    <div className="max-w-[960px] mx-auto px-8 pt-16 md:pt-24 pb-24">
      <JobList
        jobs={jobs}
        totalCount={totalCount}
        title="engineering"
        subtitle="engineering roles across frontend, backend, full-stack, devops, mobile, data, ml, & infrastructure."
      />
    </div>
  );
}
