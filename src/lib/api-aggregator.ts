import { Job } from "./types";
import { scrapeHimalayas } from "./scrapers/api-himalayas";
import { scrapeRemoteOK } from "./scrapers/api-remoteok";
import { scrapeRemotive } from "./scrapers/api-remotive";
import { scrapeJobicy } from "./scrapers/api-jobicy";
import { scrapeArbeitnow } from "./scrapers/api-arbeitnow";
import { scrapeHNWhoIsHiring } from "./scrapers/api-hn";
import { scrapeWeWorkRemotely } from "./scrapers/api-weworkremotely";
import { scrapeWorkingNomads } from "./scrapers/api-workingnomads";

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
 * Orchestrates running external API scrapers sequentially.
 * Sequential to avoid hammering multiple APIs at once and to
 * make debugging easier when an API misbehaves.
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

  // --- RemoteOK ---
  try {
    const result = await scrapeRemoteOK();
    allJobs.push(...result.jobs);
    totalRaw += result.rawCount;
    sources.push({ name: "remoteok", jobs: result.jobs.length, rawCount: result.rawCount });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[api-aggregator] remoteok failed: ${msg}`);
    sources.push({ name: "remoteok", jobs: 0, rawCount: 0, error: msg });
  }

  // --- Remotive ---
  try {
    const result = await scrapeRemotive();
    allJobs.push(...result.jobs);
    totalRaw += result.rawCount;
    sources.push({ name: "remotive", jobs: result.jobs.length, rawCount: result.rawCount });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[api-aggregator] remotive failed: ${msg}`);
    sources.push({ name: "remotive", jobs: 0, rawCount: 0, error: msg });
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

  // --- We Work Remotely (RSS) ---
  try {
    const result = await scrapeWeWorkRemotely();
    allJobs.push(...result.jobs);
    totalRaw += result.rawCount;
    sources.push({ name: "wwr", jobs: result.jobs.length, rawCount: result.rawCount });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[api-aggregator] wwr failed: ${msg}`);
    sources.push({ name: "wwr", jobs: 0, rawCount: 0, error: msg });
  }

  // --- Working Nomads ---
  try {
    const result = await scrapeWorkingNomads();
    allJobs.push(...result.jobs);
    totalRaw += result.rawCount;
    sources.push({ name: "workingnomads", jobs: result.jobs.length, rawCount: result.rawCount });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[api-aggregator] workingnomads failed: ${msg}`);
    sources.push({ name: "workingnomads", jobs: 0, rawCount: 0, error: msg });
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
