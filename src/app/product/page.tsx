"use client";

import JobList from "@/components/JobList";
import { useJobsByCategory } from "@/lib/useJobs";

export default function ProductPage() {
  const { jobs, totalCount } = useJobsByCategory("product");

  return (
    <div className="max-w-[960px] mx-auto px-8 pt-16 md:pt-24 pb-24">
      <JobList
        jobs={jobs}
        totalCount={totalCount}
        title="product"
        subtitle="product roles that blend strategy, growth, analytics, & hands-on execution, from discovery to launch."
      />
    </div>
  );
}
