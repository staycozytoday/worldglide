import { Job } from "./types";

/**
 * Remove duplicate jobs that appear across multiple sources.
 * Keeps the first occurrence (prioritizes sources with more data like logos/salary).
 */
export function deduplicateJobs(jobs: Job[]): Job[] {
  const seen = new Map<string, Job>();

  for (const job of jobs) {
    const fingerprint = createFingerprint(job.title, job.company);

    if (!seen.has(fingerprint)) {
      seen.set(fingerprint, job);
    } else {
      // Keep the one with more data (logo, salary, description)
      const existing = seen.get(fingerprint)!;
      const existingScore = dataScore(existing);
      const newScore = dataScore(job);

      if (newScore > existingScore) {
        seen.set(fingerprint, job);
      }
    }
  }

  return Array.from(seen.values());
}

function createFingerprint(title: string, company: string): string {
  const normalizedTitle = title
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .trim();

  const normalizedCompany = company
    .toLowerCase()
    .replace(/\b(inc|ltd|llc|corp|co|gmbh|ag|sa|bv)\b/g, "")
    .replace(/[^a-z0-9]/g, "")
    .trim();

  return `${normalizedCompany}::${normalizedTitle}`;
}

function dataScore(job: Job): number {
  let score = 0;
  if (job.companyLogo) score += 2;
  if (job.salary) score += 2;
  if (job.description && job.description.length > 50) score += 1;
  if (job.tags && job.tags.length > 0) score += 1;
  if (job.employmentType) score += 1;
  return score;
}
