import { Job, JOB_EXPIRY_MS } from "./types";

// ============ SCRAPE STATS ============

export interface ScrapeStats {
  rawJobsScanned: number;
  creativeJobs: number;
  companiesScraped: number;
  lastUpdated: string;
}

// ============ CLIENT-SIDE FETCHERS ============
// Static export → no server runtime. All data lives in /data/*.json
// written by scripts/scrape.ts and committed to the repo.

export async function getJobs(): Promise<Job[]> {
  const res = await fetch("/data/jobs.json");
  if (!res.ok) return [];
  const jobs: Job[] = await res.json();
  return markExpired(jobs);
}

export async function getJobsByRegion(
  region: Job["region"]
): Promise<{ jobs: Job[]; totalCount: number }> {
  const allJobs = await getJobs();
  const activeJobs = allJobs.filter((j) => !j.expired);
  return {
    jobs: activeJobs.filter((job) => job.region === region),
    totalCount: activeJobs.length,
  };
}

export async function getStats(): Promise<ScrapeStats | null> {
  try {
    const res = await fetch("/data/stats.json");
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// ============ HELPERS ============

function markExpired(jobs: Job[]): Job[] {
  const now = Date.now();
  return jobs.map((job) => ({
    ...job,
    expired: now - new Date(job.postedAt).getTime() > JOB_EXPIRY_MS,
  }));
}
