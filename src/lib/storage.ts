import { Job, JobSubmission, JOB_EXPIRY_MS } from "./types";
import { SAMPLE_JOBS } from "./sample-data";

const isProduction = process.env.NODE_ENV === "production";

// ============ BLOB HELPERS (production) ============

// Derive the public blob store URL from the token to avoid list() calls
// Token format: vercel_blob_rw_<storeId>_<rest>
// Public URL: https://<storeId>.public.blob.vercel-storage.com
function getBlobBaseUrl(): string | null {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return null;
  const match = token.match(/^vercel_blob_rw_([a-zA-Z0-9]+)_/);
  return match ? `https://${match[1]}.public.blob.vercel-storage.com` : null;
}

async function blobGet<T>(filename: string, fallback: T): Promise<T> {
  try {
    // Direct fetch → no list() call → no "advanced operation" cost
    const base = getBlobBaseUrl();
    if (!base) return fallback;

    const res = await fetch(`${base}/${filename}`, { cache: "no-store" });
    if (!res.ok) return fallback;
    return await res.json();
  } catch (err) {
    console.error(`[storage] blobGet "${filename}" failed:`, err);
    return fallback;
  }
}

async function blobPut(filename: string, data: unknown): Promise<void> {
  const { put } = await import("@vercel/blob");
  await put(filename, JSON.stringify(data, null, 2), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

// ============ LOCAL FILE HELPERS (development) ============

async function localGet<T>(filepath: string, fallback: T): Promise<T> {
  try {
    const fs = await import("fs/promises");
    const path = await import("path");
    const fullPath = path.join(process.cwd(), "src", "data", filepath);
    const data = await fs.readFile(fullPath, "utf-8");
    return JSON.parse(data);
  } catch {
    return fallback;
  }
}

async function localPut(filepath: string, data: unknown): Promise<void> {
  const fs = await import("fs/promises");
  const path = await import("path");
  const dir = path.join(process.cwd(), "src", "data");
  await fs.mkdir(dir, { recursive: true });
  const fullPath = path.join(dir, filepath);
  await fs.writeFile(fullPath, JSON.stringify(data, null, 2), "utf-8");
}

// ============ UNIFIED STORAGE ============

async function getData<T>(filename: string, fallback: T): Promise<T> {
  return isProduction ? blobGet(filename, fallback) : localGet(filename, fallback);
}

async function putData(filename: string, data: unknown): Promise<void> {
  return isProduction ? blobPut(filename, data) : localPut(filename, data);
}

// ============ JOBS ============

export async function getJobs(): Promise<Job[]> {
  const jobs = await getData<Job[]>("jobs.json", SAMPLE_JOBS);
  return markExpired(jobs);
}

export async function getJobsByCategory(
  category: Job["category"]
): Promise<{ jobs: Job[]; totalCount: number }> {
  const allJobs = await getJobs();
  const activeJobs = allJobs.filter((j) => !j.expired);
  return {
    jobs: activeJobs.filter((job) => job.category === category),
    totalCount: activeJobs.length,
  };
}

export async function saveJobs(jobs: Job[]): Promise<void> {
  await putData("jobs.json", jobs);
}

// ============ SUBMISSIONS ============

export async function getSubmissions(): Promise<JobSubmission[]> {
  return getData<JobSubmission[]>("submissions.json", []);
}

export async function saveSubmission(
  submission: JobSubmission
): Promise<void> {
  const existing = await getSubmissions();
  existing.push(submission);
  await putData("submissions.json", existing);
}

export async function approveSubmission(id: string): Promise<boolean> {
  const submissions = await getSubmissions();
  const idx = submissions.findIndex((s) => s.id === id);
  if (idx === -1) return false;

  const sub = submissions[idx];
  sub.approved = true;
  await putData("submissions.json", submissions);

  // immediately publish to jobs.json so it appears on the board
  const jobs = await getData<Job[]>("jobs.json", []);
  if (!jobs.some((j) => j.id === sub.id)) {
    jobs.push({
      id: sub.id,
      title: sub.title,
      company: sub.company,
      category: sub.category,
      url: sub.url,
      source: "user-submitted" as const,
      tags: [],
      postedAt: sub.submittedAt,
      scrapedAt: sub.submittedAt,
      isWorldwide: true,
    });
    await saveJobs(jobs);
  }

  return true;
}

export async function rejectSubmission(id: string): Promise<boolean> {
  const submissions = await getSubmissions();
  const idx = submissions.findIndex((s) => s.id === id);
  if (idx === -1) return false;

  submissions[idx].rejected = true;
  await putData("submissions.json", submissions);

  // remove from jobs.json if it was published
  const jobs = await getData<Job[]>("jobs.json", []);
  const filtered = jobs.filter((j) => j.id !== id);
  if (filtered.length !== jobs.length) await saveJobs(filtered);

  return true;
}

export async function resurrectSubmission(id: string): Promise<boolean> {
  const submissions = await getSubmissions();
  const idx = submissions.findIndex((s) => s.id === id);
  if (idx === -1) return false;

  submissions[idx].approved = false;
  submissions[idx].rejected = false;
  submissions[idx].submittedAt = new Date().toISOString(); // reset 14-day clock
  await putData("submissions.json", submissions);

  // remove from jobs.json (it goes back to pending, not live)
  const jobs = await getData<Job[]>("jobs.json", []);
  const filtered = jobs.filter((j) => j.id !== id);
  if (filtered.length !== jobs.length) await saveJobs(filtered);

  return true;
}

export async function deleteSubmission(id: string): Promise<boolean> {
  const submissions = await getSubmissions();
  const filtered = submissions.filter((s) => s.id !== id);
  if (filtered.length === submissions.length) return false;

  await putData("submissions.json", filtered);

  // also remove from jobs.json if present
  const jobs = await getData<Job[]>("jobs.json", []);
  const filteredJobs = jobs.filter((j) => j.id !== id);
  if (filteredJobs.length !== jobs.length) await saveJobs(filteredJobs);

  return true;
}

/**
 * Get approved submissions as Job objects (to display alongside scraped jobs)
 */
export async function getApprovedSubmissionsAsJobs(): Promise<Job[]> {
  const submissions = await getSubmissions();
  return submissions
    .filter((s) => s.approved)
    .map((s) => ({
      id: s.id,
      title: s.title,
      company: s.company,
      category: s.category,
      url: s.url,
      source: "user-submitted" as const,
      tags: [],
      postedAt: s.submittedAt,
      scrapedAt: s.submittedAt,
      isWorldwide: true,
    }));
}

// ============ SCRAPE STATS ============

export interface ScrapeStats {
  rawJobsScanned: number;
  worldwideJobs: number;
  companiesScraped: number;
  lastUpdated: string;
}

export async function getStats(): Promise<ScrapeStats | null> {
  return getData<ScrapeStats | null>("stats.json", null);
}

export async function saveStats(stats: ScrapeStats): Promise<void> {
  await putData("stats.json", stats);
}

// ============ HELPERS ============

function markExpired(jobs: Job[]): Job[] {
  const now = Date.now();

  return jobs.map((job) => ({
    ...job,
    expired: now - new Date(job.postedAt).getTime() > JOB_EXPIRY_MS,
  }));
}
