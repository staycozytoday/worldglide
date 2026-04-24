"use client";

import { useEffect, useState } from "react";
import JobList from "@/components/JobList";
import { getJobs, getStats, ScrapeStats } from "@/lib/storage";
import { Job } from "@/lib/types";
import { SCRAPED_COMPANY_COUNT, JOB_BOARD_COUNT } from "@/lib/companies";

export default function HomePage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [stats, setStats] = useState<ScrapeStats | null>(null);

  useEffect(() => {
    getJobs().then((all) => setJobs(all.filter((j) => !j.expired)));
    getStats().then(setStats);
  }, []);

  return (
    <div className="max-w-[960px] mx-auto px-8">
      <section className="pt-16 md:pt-24 pb-16">
        <h1 className="text-[32px] md:text-[40px] font-medium tracking-tight leading-[1.1] text-[var(--color-text)]">
          freshly baked design jobs
          <br />
          for humans without limits.
        </h1>
        <p className="text-[12px] text-[var(--color-text-muted)] mt-4 max-w-[360px] leading-relaxed">
          hand-picked, truly global creative roles. product
          <br />
          design, ui, ux, &amp; creative direction. open to candidates
          <br />
          anywhere in the world. sourced from the world&apos;s
          <br />
          top remote companies, startups, &amp; studios.
        </p>
        <p className="text-[10px] text-[var(--color-text-muted)] mt-4 font-mono leading-relaxed max-w-[400px]">
          {stats ? (
            <>
              {jobs.length} global remote design jobs
              <br />
              from {SCRAPED_COMPANY_COUNT.toLocaleString()} companies &amp; {JOB_BOARD_COUNT} job boards.
            </>
          ) : "—"}
        </p>
      </section>

      <section className="pb-24">
        <JobList jobs={jobs} />
      </section>
    </div>
  );
}
