import { Job, getCompanyLogoUrl } from "../types";
import { isWorldwideRemote } from "../filter";
import { categorizeJob } from "../categorize";
import { createJobId } from "../utils";
import { fetchWithRetry } from "../fetch-retry";

export interface RemoteOKResult {
  jobs: Job[];
  rawCount: number;
}

interface RemoteOKJob {
  id: string;
  epoch?: number;
  date?: string;
  company: string;
  company_logo?: string;
  position: string;
  tags?: string[];
  logo?: string;
  description?: string;
  location?: string;
  salary_min?: number;
  salary_max?: number;
  url?: string;
  apply_url?: string;
  original?: boolean;
}

/**
 * Scrape jobs from RemoteOK API.
 * GET https://remoteok.com/api — returns JSON array.
 * First element is metadata (legal notice), skip it.
 * All RemoteOK jobs are remote by definition.
 */
export async function scrapeRemoteOK(): Promise<RemoteOKResult> {
  let rawJobs: RemoteOKJob[] = [];

  try {
    const res = await fetchWithRetry("https://remoteok.com/api", {
      headers: {
        "User-Agent": "worldglide-jobs/1.0",
        Accept: "application/json",
      },
      timeoutMs: 20000,
    });

    if (!res.ok) {
      console.warn(`[remoteok] API returned ${res.status}`);
      return { jobs: [], rawCount: 0 };
    }

    const data = await res.json();

    if (!Array.isArray(data)) {
      console.warn("[remoteok] unexpected response format (not an array)");
      return { jobs: [], rawCount: 0 };
    }

    // First element is metadata/legal — skip it
    rawJobs = data.slice(1).filter((item: unknown) => {
      return item && typeof item === "object" && "position" in (item as Record<string, unknown>);
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[remoteok] fetch failed: ${msg}`);
    return { jobs: [], rawCount: 0 };
  }

  const rawCount = rawJobs.length;
  const jobs: Job[] = [];

  for (const item of rawJobs) {
    // RemoteOK: all jobs are remote but check location for geo restrictions
    const location = item.location || "Worldwide";

    if (
      !isWorldwideRemote({
        title: item.position,
        description: item.description || "",
        location,
        tags: item.tags,
      })
    ) {
      continue;
    }

    const category = categorizeJob(item.position, item.tags || []);
    if (!category) continue;

    // Build salary string
    let salary: string | undefined;
    if (item.salary_min && item.salary_max) {
      salary = `USD ${formatSalary(item.salary_min)} - ${formatSalary(item.salary_max)}`;
    }

    // Build job URL
    const jobUrl = item.apply_url || item.url || `https://remoteok.com/remote-jobs/${item.id}`;

    // Build posted date
    const postedAt = item.date
      || (item.epoch ? new Date(item.epoch * 1000).toISOString() : new Date().toISOString());

    // Company logo — prefer RemoteOK logo, fallback to Google favicons
    const companyDomain = extractDomain(jobUrl);
    const companyLogo = item.company_logo || item.logo || (companyDomain ? getCompanyLogoUrl(companyDomain) : undefined);

    jobs.push({
      id: createJobId("remoteok", String(item.id)),
      title: item.position,
      company: item.company || "Unknown",
      companyLogo,
      category,
      url: jobUrl,
      source: "remoteok",
      tags: item.tags || [],
      salary,
      postedAt,
      scrapedAt: new Date().toISOString(),
      description: (item.description || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 200),
      isWorldwide: true,
      employmentType: "Full-time",
    });
  }

  console.log(`[remoteok] ${jobs.length} worldwide jobs from ${rawCount} raw`);

  return { jobs, rawCount };
}

function formatSalary(n: number): string {
  if (n >= 1000) return `${Math.round(n / 1000)}k`;
  return String(n);
}

function extractDomain(url: string): string | undefined {
  try {
    const u = new URL(url);
    // Skip remoteok.com domain — not useful for company logo
    if (u.hostname.includes("remoteok.com")) return undefined;
    return u.hostname.replace("www.", "");
  } catch {
    return undefined;
  }
}
