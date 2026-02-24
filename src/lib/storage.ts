import { Job, JobSubmission, JOB_EXPIRY_MS } from "./types";
import { SAMPLE_JOBS } from "./sample-data";
import fs from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "src", "data");
const JOBS_FILE = path.join(DATA_DIR, "jobs.json");
const SUBMISSIONS_FILE = path.join(DATA_DIR, "submissions.json");

/**
 * In development: reads/writes local JSON files
 * In production: will use Vercel Blob (swapped later)
 */

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {}
}

// ============ JOBS ============

export async function getJobs(): Promise<Job[]> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(JOBS_FILE, "utf-8");
    const jobs: Job[] = JSON.parse(data);
    return markExpired(jobs);
  } catch {
    // If no jobs file exists, return sample data
    return markExpired(SAMPLE_JOBS);
  }
}

export async function getJobsByCategory(
  category: Job["category"]
): Promise<Job[]> {
  const allJobs = await getJobs();
  return allJobs.filter((job) => job.category === category);
}

export async function saveJobs(jobs: Job[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(JOBS_FILE, JSON.stringify(jobs, null, 2), "utf-8");
}

// ============ SUBMISSIONS ============

export async function getSubmissions(): Promise<JobSubmission[]> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(SUBMISSIONS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function saveSubmission(
  submission: JobSubmission
): Promise<void> {
  await ensureDataDir();
  const existing = await getSubmissions();
  existing.push(submission);
  await fs.writeFile(
    SUBMISSIONS_FILE,
    JSON.stringify(existing, null, 2),
    "utf-8"
  );
}

export async function approveSubmission(id: string): Promise<boolean> {
  const submissions = await getSubmissions();
  const idx = submissions.findIndex((s) => s.id === id);
  if (idx === -1) return false;

  submissions[idx].approved = true;
  await fs.writeFile(
    SUBMISSIONS_FILE,
    JSON.stringify(submissions, null, 2),
    "utf-8"
  );
  return true;
}

export async function rejectSubmission(id: string): Promise<boolean> {
  const submissions = await getSubmissions();
  const filtered = submissions.filter((s) => s.id !== id);
  await fs.writeFile(
    SUBMISSIONS_FILE,
    JSON.stringify(filtered, null, 2),
    "utf-8"
  );
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

// ============ HELPERS ============

function markExpired(jobs: Job[]): Job[] {
  const now = Date.now();

  return jobs.map((job) => ({
    ...job,
    expired: now - new Date(job.postedAt).getTime() > JOB_EXPIRY_MS,
  }));
}
