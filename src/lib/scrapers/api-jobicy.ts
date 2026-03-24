import { Job, getCompanyLogoUrl } from "../types";
import { isWorldwideRemote } from "../filter";
import { categorizeJob } from "../categorize";
import { createJobId } from "../utils";
import { fetchWithRetry } from "../fetch-retry";

export interface JobicyResult {
  jobs: Job[];
  rawCount: number;
}

interface JobicyJob {
  id: number;
  jobTitle: string;
  companyName: string;
  jobGeo?: string;
  url?: string;
  pubDate?: string;
  jobExcerpt?: string;
  jobIndustry?: string[] | string;
  jobType?: string[] | string;
  companyLogo?: string;
}

interface JobicyResponse {
  success?: boolean;
  error?: string;
  jobs?: JobicyJob[];
}

/**
 * Scrape jobs from Jobicy API.
 * GET https://jobicy.com/api/v2/remote-jobs?count=50
 * Returns { success, jobs: [...] }.
 * Note: do NOT pass geo=anywhere — the API rejects it.
 * Omitting `geo` returns all regions; we filter locally via isWorldwideRemote.
 */
export async function scrapeJobicy(): Promise<JobicyResult> {
  let rawJobs: JobicyJob[] = [];

  try {
    const res = await fetchWithRetry(
      "https://jobicy.com/api/v2/remote-jobs?count=50",
      {
        headers: { "User-Agent": "worldglide-jobs/1.0" },
        timeoutMs: 20000,
      }
    );

    if (!res.ok) {
      console.warn(`[jobicy] API returned ${res.status}`);
      return { jobs: [], rawCount: 0 };
    }

    const data: JobicyResponse = await res.json();

    if (data.success === false) {
      console.warn(`[jobicy] API error: ${data.error || "unknown"}`);
      return { jobs: [], rawCount: 0 };
    }

    if (!data.jobs || !Array.isArray(data.jobs)) {
      console.warn("[jobicy] unexpected response format (no jobs array)");
      return { jobs: [], rawCount: 0 };
    }

    rawJobs = data.jobs;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[jobicy] fetch failed: ${msg}`);
    return { jobs: [], rawCount: 0 };
  }

  const rawCount = rawJobs.length;
  const jobs: Job[] = [];

  for (const item of rawJobs) {
    const location = item.jobGeo || "Anywhere";

    if (
      !isWorldwideRemote({
        title: item.jobTitle,
        description: item.jobExcerpt || "",
        location,
        jobGeo: item.jobGeo,
      })
    ) {
      continue;
    }

    const industries = Array.isArray(item.jobIndustry)
      ? item.jobIndustry
      : item.jobIndustry
        ? [item.jobIndustry]
        : [];
    const category = categorizeJob(item.jobTitle, industries);
    if (!category) continue;

    const jobUrl = item.url || `https://jobicy.com/jobs/${item.id}`;

    const companyDomain = extractDomain(jobUrl);
    const companyLogo = item.companyLogo || (companyDomain ? getCompanyLogoUrl(companyDomain) : undefined);

    // Map job type
    const jobTypes = Array.isArray(item.jobType)
      ? item.jobType
      : item.jobType
        ? [item.jobType]
        : [];
    const employmentType = mapJobType(jobTypes);

    jobs.push({
      id: createJobId("jobicy", String(item.id)),
      title: item.jobTitle,
      company: item.companyName || "Unknown",
      companyLogo,
      category,
      url: jobUrl,
      source: "jobicy",
      tags: industries,
      postedAt: item.pubDate || new Date().toISOString(),
      scrapedAt: new Date().toISOString(),
      description: stripHtml(item.jobExcerpt || "").slice(0, 200),
      region: "ww",
      employmentType,
    });
  }

  console.log(`[jobicy] ${jobs.length} worldwide jobs from ${rawCount} raw`);

  return { jobs, rawCount };
}

function mapJobType(jobTypes: string[]): string {
  const joined = jobTypes.join(" ").toLowerCase();
  if (joined.includes("contract")) return "Contract";
  if (joined.includes("part")) return "Part-time";
  if (joined.includes("freelance")) return "Freelance";
  if (joined.includes("internship")) return "Internship";
  return "Full-time";
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function extractDomain(url: string): string | undefined {
  try {
    const u = new URL(url);
    if (u.hostname.includes("jobicy.com")) return undefined;
    return u.hostname.replace("www.", "");
  } catch {
    return undefined;
  }
}
