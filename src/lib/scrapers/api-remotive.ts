import { Job, getCompanyLogoUrl } from "../types";
import { isWorldwideRemote } from "../filter";
import { categorizeJob } from "../categorize";
import { createJobId } from "../utils";
import { fetchWithRetry } from "../fetch-retry";

export interface RemotiveResult {
  jobs: Job[];
  rawCount: number;
}

interface RemotiveJob {
  id: number;
  title: string;
  company_name: string;
  candidate_required_location?: string;
  url?: string;
  publication_date?: string;
  description?: string;
  category?: string;
  job_type?: string;
  salary?: string;
  company_logo?: string;
  tags?: string[];
}

interface RemotiveResponse {
  jobs: RemotiveJob[];
}

/**
 * Scrape jobs from Remotive API.
 * GET https://remotive.com/api/remote-jobs — returns { jobs: [...] }.
 * Max 4 requests/day — single request, no pagination.
 */
export async function scrapeRemotive(): Promise<RemotiveResult> {
  let rawJobs: RemotiveJob[] = [];

  try {
    const res = await fetchWithRetry("https://remotive.com/api/remote-jobs", {
      headers: { "User-Agent": "worldglide-jobs/1.0" },
      timeoutMs: 20000,
    });

    if (!res.ok) {
      console.warn(`[remotive] API returned ${res.status}`);
      return { jobs: [], rawCount: 0 };
    }

    const data: RemotiveResponse = await res.json();

    if (!data.jobs || !Array.isArray(data.jobs)) {
      console.warn("[remotive] unexpected response format (no jobs array)");
      return { jobs: [], rawCount: 0 };
    }

    rawJobs = data.jobs;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[remotive] fetch failed: ${msg}`);
    return { jobs: [], rawCount: 0 };
  }

  const rawCount = rawJobs.length;
  const jobs: Job[] = [];

  for (const item of rawJobs) {
    const location = item.candidate_required_location || "Worldwide";

    if (
      !isWorldwideRemote({
        title: item.title,
        description: item.description || "",
        location,
        candidateRequiredLocation: item.candidate_required_location,
      })
    ) {
      continue;
    }

    const category = categorizeJob(item.title, item.tags || []);
    if (!category) continue;

    const jobUrl = item.url || `https://remotive.com/remote-jobs/${item.id}`;

    const companyDomain = extractDomain(jobUrl);
    const companyLogo = item.company_logo || (companyDomain ? getCompanyLogoUrl(companyDomain) : undefined);

    // Map job_type to employment type
    const employmentType = mapJobType(item.job_type);

    jobs.push({
      id: createJobId("remotive", String(item.id)),
      title: item.title,
      company: item.company_name || "Unknown",
      companyLogo,
      category,
      url: jobUrl,
      source: "remotive",
      tags: item.tags || (item.category ? [item.category] : []),
      salary: item.salary || undefined,
      postedAt: item.publication_date || new Date().toISOString(),
      scrapedAt: new Date().toISOString(),
      description: stripHtml(item.description || "").slice(0, 200),
      isWorldwide: true,
      employmentType,
    });
  }

  console.log(`[remotive] ${jobs.length} worldwide jobs from ${rawCount} raw`);

  return { jobs, rawCount };
}

function mapJobType(jobType?: string): string {
  if (!jobType) return "Full-time";
  const lower = jobType.toLowerCase();
  if (lower.includes("contract")) return "Contract";
  if (lower.includes("part")) return "Part-time";
  if (lower.includes("freelance")) return "Freelance";
  if (lower.includes("internship")) return "Internship";
  return "Full-time";
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function extractDomain(url: string): string | undefined {
  try {
    const u = new URL(url);
    if (u.hostname.includes("remotive.com")) return undefined;
    return u.hostname.replace("www.", "");
  } catch {
    return undefined;
  }
}
