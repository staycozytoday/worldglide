"use client";

import JobList from "@/components/JobList";
import { useJobsByCategory } from "@/lib/useJobs";

export default function DesignPage() {
  const { jobs, totalCount } = useJobsByCategory("design");

  return (
    <div className="max-w-[960px] mx-auto px-8 pt-16 md:pt-24 pb-24">
      <JobList
        jobs={jobs}
        totalCount={totalCount}
        title="design"
        subtitle="design roles across product design, ux/ui, brand, motion, design systems, & user research."
      />
    </div>
  );
}
