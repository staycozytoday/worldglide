import JobList from "@/components/JobList";
import { getJobs } from "@/lib/storage";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const jobs = await getJobs();

  return (
    <div className="max-w-[960px] mx-auto px-8">
      {/* hero */}
      <section className="pt-16 md:pt-24 pb-16">
        <h1 className="text-[32px] md:text-[40px] font-medium tracking-tight leading-[1.1] text-[var(--color-text)]">
          remote jobs.
          <br />
          any location.
          <br />
          one internet.
        </h1>
        <p className="text-[12px] text-[var(--color-text-muted)] mt-4 max-w-[320px] leading-relaxed">
          curated remote roles from global, remote‑first teams. no country
          limits, only product, engineering &amp; design work you can do from
          wherever feels like home.
        </p>
        <div className="flex items-center gap-1.5 mt-4 text-[10px] text-[var(--color-text-muted)] font-mono">
          <span>quality over quantity ･ updated daily</span>
        </div>
      </section>

      {/* job list */}
      <section className="pb-24">
        <JobList jobs={jobs} />
      </section>
    </div>
  );
}
