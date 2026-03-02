import JobList from "@/components/JobList";
import { getJobs, getStats } from "@/lib/storage";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const allJobs = await getJobs();
  const jobs = allJobs.filter((j) => !j.expired);
  const stats = await getStats();

  const passRate = stats && stats.rawJobsScanned > 0
    ? ((stats.worldwideJobs / stats.rawJobsScanned) * 100).toFixed(1)
    : null;

  return (
    <div className="max-w-[960px] mx-auto px-8">
      {/* hero */}
      <section className="pt-16 md:pt-24 pb-16">
        <h1 className="text-[32px] md:text-[40px] font-medium tracking-tight leading-[1.1] text-[var(--color-text)]">
          careers
          <br />
          without borders
          <br />
          for humans
          <br />
          without limits.
        </h1>
        <p className="text-[12px] text-[var(--color-text-muted)] mt-4 max-w-[320px] leading-relaxed">
          curated remote roles from global, remote‑first teams. no country
          limits, only product, engineering &amp; design work you can do from
          wherever feels like home.
        </p>
        <p className="text-[10px] text-[var(--color-text-muted)] mt-4 font-mono leading-relaxed max-w-[360px]">
          0.1% of remote jobs are actually remote. based on {stats ? `${jobs.length}/${stats.rawJobsScanned.toLocaleString()}` : "—"} scanned. this is la crème de la crème topped with le jus du jus. avec plaisir.
        </p>
      </section>

      {/* job list */}
      <section className="pb-24">
        <JobList jobs={jobs} />
      </section>
    </div>
  );
}
