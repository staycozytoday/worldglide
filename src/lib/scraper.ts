import { Job } from "./types";
import { deduplicateJobs } from "./deduplicate";
import { scrapeGreenhouse } from "./scrapers/greenhouse";
import { scrapeLever } from "./scrapers/lever";
import { scrapeAshby } from "./scrapers/ashby";
import { scrapeGem } from "./scrapers/gem";
import { CompanyResult, ScrapeReport } from "./fetch-retry";

export interface ScrapeOutput {
  jobs: Job[];
  report: ScrapeReport;
}

/**
 * main scraping orchestrator.
 * scrapes only direct company ats boards (greenhouse, lever, ashby).
 * no third-party job boards — they're low quality and noisy.
 */
export async function scrapeAllSources(): Promise<ScrapeOutput> {
  console.log("[scraper] starting scrape — direct ats only...");
  const startTime = Date.now();

  const [gh, lv, ab, gm] = await Promise.allSettled([
    scrapeGreenhouse(),
    scrapeLever(),
    scrapeAshby(),
    scrapeGem(),
  ]);

  const allJobs: Job[] = [];
  const allReport: CompanyResult[] = [];

  const sources = [
    { name: "greenhouse", result: gh },
    { name: "lever", result: lv },
    { name: "ashby", result: ab },
    { name: "gem", result: gm },
  ] as const;

  for (const source of sources) {
    if (source.result.status === "fulfilled") {
      allJobs.push(...source.result.value.jobs);
      allReport.push(...source.result.value.report);
      console.log(`[scraper] ${source.name}: ${source.result.value.jobs.length} jobs`);
    } else {
      console.error(`[scraper] ${source.name} FAILED entirely:`, source.result.reason);
    }
  }

  // deduplicate
  const dedupedJobs = deduplicateJobs(allJobs);

  // sort by date (newest first)
  dedupedJobs.sort(
    (a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
  );

  // keep only last 14 days
  const cutoff = Date.now() - 14 * 24 * 60 * 60 * 1000;
  const recentJobs = dedupedJobs.filter(
    (job) => new Date(job.postedAt).getTime() > cutoff
  );

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  const failures = allReport.filter((r) => r.error);

  console.log(
    `[scraper] done in ${elapsed}s. total: ${allJobs.length} → deduped: ${dedupedJobs.length} → recent (14d): ${recentJobs.length}` +
    (failures.length ? ` | ${failures.length} companies failed` : "")
  );

  if (failures.length) {
    console.warn(
      `[scraper] failures: ${failures.map((f) => `${f.company} (${f.error})`).join(", ")}`
    );
  }

  const rawJobsTotal = allReport.reduce((sum, r) => sum + (r.rawJobs || 0), 0);

  return {
    jobs: recentJobs,
    report: {
      companies: allReport.length,
      succeeded: allReport.length - failures.length,
      failed: failures.length,
      rawJobsTotal,
      failures,
      elapsed: `${elapsed}s`,
    },
  };
}
