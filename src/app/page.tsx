"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import JobList from "@/components/JobList";
import { getJobs, getStats, ScrapeStats } from "@/lib/storage";
import { Job, Region } from "@/lib/types";
import { SCRAPED_COMPANY_COUNT } from "@/lib/companies";

export default function HomePage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [stats, setStats] = useState<ScrapeStats | null>(null);
  const searchParams = useSearchParams();
  const activeRegion = searchParams.get("region") as Region | null;

  useEffect(() => {
    getJobs().then((all) => setJobs(all.filter((j) => !j.expired)));
    getStats().then(setStats);
  }, []);

  const displayedJobs = activeRegion
    ? jobs.filter((j) => j.region === activeRegion)
    : jobs;

  return (
    <div className="max-w-[960px] mx-auto px-8">
      {/* hero */}
      <section className="pt-16 md:pt-24 pb-16">
        <h1 className="text-[32px] md:text-[40px] font-medium tracking-tight leading-[1.1] text-[var(--color-text)]">
          freshly baked creative jobs
          <br />
          for humans without limits.
        </h1>
        <p className="text-[12px] text-[var(--color-text-muted)] mt-4 max-w-[320px] leading-relaxed">
          hand-picked remote roles for designers, illustrators, motion artists &amp; creative technologists. sourced from the world&apos;s best tech companies, startups &amp; studios.
        </p>
        <p className="text-[10px] text-[var(--color-text-muted)] mt-4 font-mono leading-relaxed max-w-[352px]">
          {stats ? `${displayedJobs.length} creative remote jobs from ${SCRAPED_COMPANY_COUNT} top remote-first companies` : "—"}
        </p>
      </section>

      {/* job list */}
      <section className="pb-24">
        <JobList jobs={displayedJobs} />
      </section>
    </div>
  );
}
