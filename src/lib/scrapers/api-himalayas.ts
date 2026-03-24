import { Job, getCompanyLogoUrl } from "../types";
import { isWorldwideRemote } from "../filter";
import { categorizeJob } from "../categorize";
import { createJobId } from "../utils";
import { fetchWithRetry } from "../fetch-retry";

export interface HimalayasResult {
  jobs: Job[];
  rawCount: number;
}

interface HimalayasJob {
  guid: string;
  title: string;
  companyName: string;
  companyLogo?: string;
  companySlug?: string;
  locationRestrictions?: string[];
  timezoneRestrictions?: number[];
  description?: string;
  excerpt?: string;
  pubDate?: number; // epoch seconds
  expiryDate?: number;
  categories?: string[];
  parentCategories?: string[];
  seniority?: string[];
  minSalary?: number | null;
  maxSalary?: number | null;
  currency?: string;
  applicationLink?: string;
  employmentType?: string;
}

interface HimalayasResponse {
  jobs: HimalayasJob[];
  totalCount: number;
  offset: number;
  limit: number;
}

const MAX_PAGES = 25; // cap at 500 jobs (25 * 20)
const PAGE_SIZE = 20; // API caps at 20 per request

/**
 * Scrape jobs from Himalayas API.
 * GET https://himalayas.app/jobs/api?limit=20&offset=0
 * Paginated — returns { jobs: [...], totalCount, offset, limit }.
 * The API caps limit at 20 per request.
 * Empty locationRestrictions = worldwide.
 */
export async function scrapeHimalayas(): Promise<HimalayasResult> {
  const allRawJobs: HimalayasJob[] = [];
  let totalCount = 0;

  for (let page = 0; page < MAX_PAGES; page++) {
    const offset = page * PAGE_SIZE;
    const url = `https://himalayas.app/jobs/api?limit=${PAGE_SIZE}&offset=${offset}`;

    try {
      const res = await fetchWithRetry(url, {
        headers: { "User-Agent": "worldglide-jobs/1.0" },
        timeoutMs: 20000,
      });

      if (!res.ok) {
        console.warn(`[himalayas] page ${page} returned ${res.status}, stopping pagination`);
        break;
      }

      const data: HimalayasResponse = await res.json();
      totalCount = data.totalCount || 0;

      if (!data.jobs || data.jobs.length === 0) {
        break;
      }

      allRawJobs.push(...data.jobs);

      // Stop if we've fetched all available jobs
      if (allRawJobs.length >= totalCount) break;

      // Small delay between pages to be respectful
      if (page < MAX_PAGES - 1 && data.jobs.length === PAGE_SIZE) {
        await new Promise((r) => setTimeout(r, 300));
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`[himalayas] page ${page} failed: ${msg}, stopping pagination`);
      break;
    }
  }

  const rawCount = allRawJobs.length;
  const jobs: Job[] = [];

  for (const item of allRawJobs) {
    // Himalayas: empty locationRestrictions = worldwide
    const locationRestrictions = item.locationRestrictions || [];
    const isWorldwide = locationRestrictions.length === 0;

    // Build a location string for the filter
    const location = isWorldwide
      ? "Worldwide"
      : locationRestrictions.join(", ");

    if (
      !isWorldwideRemote({
        title: item.title,
        description: item.description || item.excerpt || "",
        location,
        locationRestrictions,
      })
    ) {
      continue;
    }

    const category = categorizeJob(item.title, item.categories || []);
    if (!category) continue;

    // Build salary string
    let salary: string | undefined;
    if (item.minSalary && item.maxSalary) {
      const currency = item.currency || "USD";
      salary = `${currency} ${formatSalary(item.minSalary)} - ${formatSalary(item.maxSalary)}`;
    }

    // Build job URL — guid is the canonical URL, applicationLink may also exist
    const jobUrl = item.applicationLink || item.guid;

    // Build company logo — prefer Himalayas logo, fallback to Google favicons
    const companyDomain = extractDomain(jobUrl);
    const companyLogo = item.companyLogo || (companyDomain ? getCompanyLogoUrl(companyDomain) : undefined);

    // pubDate is epoch seconds — convert to ISO string
    const postedAt = item.pubDate
      ? new Date(item.pubDate * 1000).toISOString()
      : new Date().toISOString();

    jobs.push({
      id: createJobId("himalayas", item.guid),
      title: item.title,
      company: item.companyName || "Unknown",
      companyLogo,
      category,
      url: jobUrl,
      source: "himalayas",
      tags: item.categories || [],
      salary,
      postedAt,
      scrapedAt: new Date().toISOString(),
      description: (item.excerpt || item.description || "").slice(0, 200),
      region: "ww",
      employmentType: item.employmentType || "Full-time",
    });
  }

  console.log(
    `[himalayas] ${jobs.length} worldwide jobs from ${rawCount} raw (${totalCount} total on API)`
  );

  return { jobs, rawCount };
}

function formatSalary(n: number): string {
  if (n >= 1000) return `${Math.round(n / 1000)}k`;
  return String(n);
}

function extractDomain(url: string): string | undefined {
  try {
    const u = new URL(url);
    // Skip himalayas.app domain — not useful for company logo
    if (u.hostname.includes("himalayas.app")) return undefined;
    return u.hostname.replace("www.", "");
  } catch {
    return undefined;
  }
}
