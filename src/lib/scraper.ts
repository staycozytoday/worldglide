import { Job } from "./types";
import { deduplicateJobs } from "./deduplicate";
import { scrapeGreenhouse } from "./scrapers/greenhouse";
import { scrapeLever } from "./scrapers/lever";
import { scrapeAshby } from "./scrapers/ashby";

/**
 * Main scraping orchestrator.
 * Scrapes ONLY direct company ATS boards (Greenhouse, Lever, Ashby).
 * No third-party job boards — they're low quality and noisy.
 */
export async function scrapeAllSources(): Promise<Job[]> {
  console.log("[Scraper] Starting scrape — direct ATS only...");
  const startTime = Date.now();

  const [greenhouseJobs, leverJobs, ashbyJobs] = await Promise.allSettled([
    scrapeGreenhouse(),
    scrapeLever(),
    scrapeAshby(),
  ]);

  const allJobs: Job[] = [];

  const sources = [
    { name: "Greenhouse", result: greenhouseJobs },
    { name: "Lever", result: leverJobs },
    { name: "Ashby", result: ashbyJobs },
  ];

  for (const source of sources) {
    if (source.result.status === "fulfilled") {
      allJobs.push(...source.result.value);
      console.log(`[Scraper] ${source.name}: ${source.result.value.length} jobs`);
    } else {
      console.error(`[Scraper] ${source.name} FAILED:`, source.result.reason);
    }
  }

  // Deduplicate
  const dedupedJobs = deduplicateJobs(allJobs);

  // Sort by date (newest first)
  dedupedJobs.sort(
    (a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
  );

  // Keep only last 14 days (2 weeks) — fresher jobs, higher quality
  const cutoff = Date.now() - 14 * 24 * 60 * 60 * 1000;
  const recentJobs = dedupedJobs.filter(
    (job) => new Date(job.postedAt).getTime() > cutoff
  );

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(
    `[Scraper] Done in ${elapsed}s. Total: ${allJobs.length} → Deduped: ${dedupedJobs.length} → Recent (14d): ${recentJobs.length}`
  );

  return recentJobs;
}
