import { Job, getCompanyLogoUrl } from "../types";
import { categorizeJob } from "../categorize";
import { createJobId } from "../utils";
import { fetchWithRetry } from "../fetch-retry";

export interface WorkingNomadsResult {
  jobs: Job[];
  rawCount: number;
}

interface WNJob {
  url: string;
  title: string;
  description: string;
  company_name: string;
  category_name: string;
  tags: string;
  location: string;
  pub_date: string;
}

/**
 * Scrape jobs from Working Nomads API.
 * GET https://www.workingnomads.com/api/exposed_jobs/ — returns JSON array.
 * Each job has a `location` field that can be "Anywhere in the world",
 * region-specific like "USA only", or timezone-based like "CET (+/- 3 hours)".
 * We only keep jobs where location indicates truly worldwide.
 */
export async function scrapeWorkingNomads(): Promise<WorkingNomadsResult> {
  let rawJobs: WNJob[] = [];

  try {
    const res = await fetchWithRetry("https://www.workingnomads.com/api/exposed_jobs/", {
      headers: {
        "User-Agent": "worldglide-jobs/1.0",
        Accept: "application/json",
      },
      timeoutMs: 15000,
    });

    if (!res.ok) {
      console.warn(`[workingnomads] API returned ${res.status}`);
      return { jobs: [], rawCount: 0 };
    }

    const data = await res.json();
    if (!Array.isArray(data)) {
      console.warn("[workingnomads] unexpected response (not array)");
      return { jobs: [], rawCount: 0 };
    }

    rawJobs = data;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[workingnomads] fetch failed: ${msg}`);
    return { jobs: [], rawCount: 0 };
  }

  const rawCount = rawJobs.length;
  const jobs: Job[] = [];

  for (const item of rawJobs) {
    // Only keep worldwide jobs
    const loc = (item.location || "").toLowerCase().trim();
    if (!isWorldwideLocation(loc)) continue;

    // Must be creative
    const tags = item.tags ? item.tags.split(",").map((t) => t.trim()) : [];
    const category = categorizeJob(item.title, [...tags, item.category_name]);
    if (!category) continue;

    // Clean description
    const cleanDesc = (item.description || "")
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 200);

    const companyDomain = extractDomain(item.url);

    jobs.push({
      id: createJobId("workingnomads", item.url),
      title: item.title,
      company: item.company_name || "Unknown",
      companyLogo: companyDomain ? getCompanyLogoUrl(companyDomain) : undefined,
      category,
      url: item.url,
      source: "remoteok", // reuse existing source type
      tags,
      postedAt: new Date(item.pub_date).toISOString(),
      scrapedAt: new Date().toISOString(),
      description: cleanDesc,
      region: "ww",
      employmentType: "Full-time",
    });
  }

  console.log(`[workingnomads] ${jobs.length} worldwide jobs from ${rawCount} raw`);
  return { jobs, rawCount };
}

function isWorldwideLocation(loc: string): boolean {
  return (
    loc.includes("anywhere") ||
    loc.includes("worldwide") ||
    loc.includes("global") ||
    loc === "remote" ||
    loc === ""
  );
}

function extractDomain(url: string): string | undefined {
  try {
    const u = new URL(url);
    if (u.hostname.includes("workingnomads.com")) return undefined;
    return u.hostname.replace("www.", "");
  } catch {
    return undefined;
  }
}
