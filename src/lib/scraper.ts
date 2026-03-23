import { Job, JOB_EXPIRY_DAYS } from "./types";
import { deduplicateJobs } from "./deduplicate";
import { scrapeGreenhouse } from "./scrapers/greenhouse";
import { scrapeLever } from "./scrapers/lever";
import { scrapeAshby } from "./scrapers/ashby";
import { scrapeGem } from "./scrapers/gem";
import { scrapeSmartRecruiters } from "./scrapers/smartrecruiters";
import { scrapeWorkable } from "./scrapers/workable";
import { scrapePersonio } from "./scrapers/personio";
import { scrapeBreezyHR } from "./scrapers/breezyhr";
import { scrapePinpoint } from "./scrapers/pinpoint";
import { runApiAggregator } from "./api-aggregator";
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

  const [gh, lv, ab, gm, sr, wb, ps, bz, pp] = await Promise.allSettled([
    scrapeGreenhouse(),
    scrapeLever(),
    scrapeAshby(),
    scrapeGem(),
    scrapeSmartRecruiters(),
    scrapeWorkable(),
    scrapePersonio(),
    scrapeBreezyHR(),
    scrapePinpoint(),
  ]);

  const allJobs: Job[] = [];
  const allReport: CompanyResult[] = [];

  const sources = [
    { name: "greenhouse", result: gh },
    { name: "lever", result: lv },
    { name: "ashby", result: ab },
    { name: "gem", result: gm },
    { name: "smartrecruiters", result: sr },
    { name: "workable", result: wb },
    { name: "personio", result: ps },
    { name: "breezyhr", result: bz },
    { name: "pinpoint", result: pp },
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

  // --- Phase 2: External API aggregation ---
  console.log("[scraper] starting external API aggregation...");
  try {
    const apiResult = await runApiAggregator();
    allJobs.push(...apiResult.jobs);

    // Add API sources to report as pseudo-company entries
    for (const src of apiResult.sources) {
      allReport.push({
        company: `api:${src.name}`,
        ats: src.name,
        slug: src.name,
        jobs: src.jobs,
        rawJobs: src.rawCount,
        error: src.error,
      });
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[scraper] API aggregation failed entirely: ${msg}`);
  }

  // deduplicate
  const dedupedJobs = deduplicateJobs(allJobs);

  // sort by date (newest first)
  dedupedJobs.sort(
    (a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
  );

  // keep only last N days (configured in types.ts)
  const cutoff = Date.now() - JOB_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
  const recentJobs = dedupedJobs.filter(
    (job) => new Date(job.postedAt).getTime() > cutoff
  );

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  const failures = allReport.filter((r) => r.error);

  console.log(
    `[scraper] done in ${elapsed}s. total: ${allJobs.length} → deduped: ${dedupedJobs.length} → recent (${JOB_EXPIRY_DAYS}d): ${recentJobs.length}` +
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
