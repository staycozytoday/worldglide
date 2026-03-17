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
  id: string;
  title: string;
  companyName: string;
  companyLogo?: string;
  url?: string;
  slug?: string;
  locationRestrictions?: string[];
  description?: string;
  excerpt?: string;
  pubDate?: string;
  publishedDate?: string;
  categories?: string[];
  tags?: string[];
  seniority?: string;
  salary?: string;
  minSalary?: number;
  maxSalary?: number;
  salaryCurrency?: string;
  applicationLink?: string;
  companySlug?: string;
}

interface HimalayasResponse {
  jobs: HimalayasJob[];
  total_count: number;
}

const MAX_PAGES = 10; // cap at 500 jobs to be polite
const PAGE_SIZE = 50;

/**
 * Scrape jobs from Himalayas API.
 * GET https://himalayas.app/jobs/api?limit=50&offset=0
 * Paginated — returns { jobs: [...], total_count }.
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
      totalCount = data.total_count || 0;

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

    const category = categorizeJob(item.title, item.tags || []);
    if (!category) continue;

    // Build salary string
    let salary: string | undefined;
    if (item.minSalary && item.maxSalary) {
      const currency = item.salaryCurrency || "USD";
      salary = `${currency} ${formatSalary(item.minSalary)} - ${formatSalary(item.maxSalary)}`;
    } else if (item.salary) {
      salary = item.salary;
    }

    // Build job URL
    const jobUrl = item.applicationLink
      || item.url
      || (item.companySlug && item.slug
        ? `https://himalayas.app/companies/${item.companySlug}/jobs/${item.slug}`
        : `https://himalayas.app/jobs/${item.id}`);

    // Build company logo — prefer Himalayas logo, fallback to Google favicons
    const companyDomain = extractDomain(jobUrl);
    const companyLogo = item.companyLogo || (companyDomain ? getCompanyLogoUrl(companyDomain) : undefined);

    jobs.push({
      id: createJobId("himalayas", String(item.id)),
      title: item.title,
      company: item.companyName || "Unknown",
      companyLogo,
      category,
      url: jobUrl,
      source: "himalayas",
      tags: item.tags || item.categories || [],
      salary,
      postedAt: item.pubDate || item.publishedDate || new Date().toISOString(),
      scrapedAt: new Date().toISOString(),
      description: (item.excerpt || item.description || "").slice(0, 200),
      isWorldwide: true,
      employmentType: "Full-time",
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
