import { Job } from "./types";
import { scrapeHimalayas } from "./scrapers/api-himalayas";
import { scrapeJobicy } from "./scrapers/api-jobicy";
import { scrapeArbeitnow } from "./scrapers/api-arbeitnow";
import { scrapeHNWhoIsHiring } from "./scrapers/api-hn";

export interface ApiAggregatorResult {
  jobs: Job[];
  rawCount: number;
  sources: ApiSourceResult[];
}

export interface ApiSourceResult {
  name: string;
  jobs: number;
  rawCount: number;
  error?: string;
}

/**
 * Orchestrates running external API scrapers.
 * Only includes sources that provide direct company application URLs.
 * Job board aggregators (RemoteOK, WWR, Remotive, WorkingNomads, Muse)
 * are excluded because they link to the board listing, not the actual job post.
 */
export async function runApiAggregator(): Promise<ApiAggregatorResult> {
  console.log("[api-aggregator] starting external API scrapes...");
  const startTime = Date.now();

  const allJobs: Job[] = [];
  const sources: ApiSourceResult[] = [];
  let totalRaw = 0;

  // --- Himalayas ---
  try {
    const result = await scrapeHimalayas();
    allJobs.push(...result.jobs);
    totalRaw += result.rawCount;
    sources.push({ name: "himalayas", jobs: result.jobs.length, rawCount: result.rawCount });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[api-aggregator] himalayas failed: ${msg}`);
    sources.push({ name: "himalayas", jobs: 0, rawCount: 0, error: msg });
  }

  // --- Jobicy ---
  try {
    const result = await scrapeJobicy();
    allJobs.push(...result.jobs);
    totalRaw += result.rawCount;
    sources.push({ name: "jobicy", jobs: result.jobs.length, rawCount: result.rawCount });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[api-aggregator] jobicy failed: ${msg}`);
    sources.push({ name: "jobicy", jobs: 0, rawCount: 0, error: msg });
  }

  // --- Arbeitnow ---
  try {
    const result = await scrapeArbeitnow();
    allJobs.push(...result.jobs);
    totalRaw += result.rawCount;
    sources.push({ name: "arbeitnow", jobs: result.jobs.length, rawCount: result.rawCount });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[api-aggregator] arbeitnow failed: ${msg}`);
    sources.push({ name: "arbeitnow", jobs: 0, rawCount: 0, error: msg });
  }

  // --- HN Who's Hiring ---
  try {
    const result = await scrapeHNWhoIsHiring();
    allJobs.push(...result.jobs);
    totalRaw += result.rawCount;
    sources.push({ name: "hn-whoishiring", jobs: result.jobs.length, rawCount: result.rawCount });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[api-aggregator] hn-whoishiring failed: ${msg}`);
    sources.push({ name: "hn-whoishiring", jobs: 0, rawCount: 0, error: msg });
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  const totalJobs = allJobs.length;
  const failures = sources.filter((s) => s.error).length;

  console.log(
    `[api-aggregator] done in ${elapsed}s. ${totalJobs} jobs from ${sources.length} APIs (${totalRaw} raw)` +
    (failures ? ` | ${failures} failed` : "")
  );

  return { jobs: allJobs, rawCount: totalRaw, sources };
}
