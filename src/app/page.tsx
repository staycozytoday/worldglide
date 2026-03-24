"use client";

import { useEffect, useState } from "react";
import JobList from "@/components/JobList";
import { getJobs, getStats, ScrapeStats } from "@/lib/storage";
import { Job } from "@/lib/types";

export default function HomePage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [stats, setStats] = useState<ScrapeStats | null>(null);

  useEffect(() => {
    getJobs().then((all) => setJobs(all.filter((j) => !j.expired)));
    getStats().then(setStats);
  }, []);

  return (
    <div className="max-w-[960px] mx-auto px-8">
      {/* hero */}
      <section className="pt-16 md:pt-24 pb-16">
        <h1 className="text-[32px] md:text-[40px] font-medium tracking-tight leading-[1.1] text-[var(--color-text)]">
          creative jobs
          <br />
          for humans
          <br />
          without limits.
        </h1>
        <p className="text-[12px] text-[var(--color-text-muted)] mt-4 max-w-[320px] leading-relaxed">
          hand-picked remote roles for product designers, ux leads, motion artists &amp; creative technologists. sourced from the world&apos;s best tech companies, startups &amp; studios.
        </p>
        <p className="text-[10px] text-[var(--color-text-muted)] mt-4 font-mono leading-relaxed max-w-[352px]">
          {stats ? `${jobs.length} creative remote jobs` : "—"} · ww · noam · eur · apac · latam · mena · ssa
        </p>
      </section>

      {/* job list */}
      <section className="pb-24">
        <JobList jobs={jobs} />
      </section>
    </div>
  );
}
