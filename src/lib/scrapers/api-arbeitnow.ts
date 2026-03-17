import { Job, getCompanyLogoUrl } from "../types";
import { isWorldwideRemote } from "../filter";
import { categorizeJob } from "../categorize";
import { createJobId } from "../utils";
import { fetchWithRetry } from "../fetch-retry";

export interface ArbeitnowResult {
  jobs: Job[];
  rawCount: number;
}

interface ArbeitnowJob {
  slug: string;
  title: string;
  company_name: string;
  location?: string;
  url?: string;
  created_at?: string;
  description?: string;
  tags?: string[];
  remote?: boolean;
}

interface ArbeitnowResponse {
  data: ArbeitnowJob[];
  links?: {
    next?: string | null;
  };
}

const MAX_PAGES = 5; // cap pagination

/**
 * Scrape jobs from Arbeitnow API.
 * GET https://www.arbeitnow.com/api/job-board-api — returns { data: [...], links: { next } }.
 * Paginated. Only process items where item.remote === true.
 */
export async function scrapeArbeitnow(): Promise<ArbeitnowResult> {
  const allRawJobs: ArbeitnowJob[] = [];
  let nextUrl: string | null = "https://www.arbeitnow.com/api/job-board-api";

  for (let page = 0; page < MAX_PAGES && nextUrl; page++) {
    try {
      const res = await fetchWithRetry(nextUrl, {
        headers: { "User-Agent": "worldglide-jobs/1.0" },
        timeoutMs: 20000,
      });

      if (!res.ok) {
        console.warn(`[arbeitnow] page ${page} returned ${res.status}, stopping pagination`);
        break;
      }

      const data: ArbeitnowResponse = await res.json();

      if (!data.data || !Array.isArray(data.data) || data.data.length === 0) {
        break;
      }

      // Only keep remote jobs
      const remoteJobs = data.data.filter((item) => item.remote === true);
      allRawJobs.push(...remoteJobs);

      nextUrl = data.links?.next || null;

      // Small delay between pages
      if (nextUrl && page < MAX_PAGES - 1) {
        await new Promise((r) => setTimeout(r, 300));
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`[arbeitnow] page ${page} failed: ${msg}, stopping pagination`);
      break;
    }
  }

  const rawCount = allRawJobs.length;
  const jobs: Job[] = [];

  for (const item of allRawJobs) {
    const location = item.location || "Worldwide";

    if (
      !isWorldwideRemote({
        title: item.title,
        description: item.description || "",
        location,
        tags: item.tags,
      })
    ) {
      continue;
    }

    const category = categorizeJob(item.title, item.tags || []);
    if (!category) continue;

    const jobUrl = item.url || `https://www.arbeitnow.com/view/${item.slug}`;

    const companyDomain = extractDomain(jobUrl);
    const companyLogo = companyDomain ? getCompanyLogoUrl(companyDomain) : undefined;

    jobs.push({
      id: createJobId("arbeitnow", item.slug || String(Date.now())),
      title: item.title,
      company: item.company_name || "Unknown",
      companyLogo,
      category,
      url: jobUrl,
      source: "arbeitnow",
      tags: item.tags || [],
      postedAt: item.created_at || new Date().toISOString(),
      scrapedAt: new Date().toISOString(),
      description: stripHtml(item.description || "").slice(0, 200),
      isWorldwide: true,
      employmentType: "Full-time",
    });
  }

  console.log(`[arbeitnow] ${jobs.length} worldwide jobs from ${rawCount} raw (remote only)`);

  return { jobs, rawCount };
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function extractDomain(url: string): string | undefined {
  try {
    const u = new URL(url);
    if (u.hostname.includes("arbeitnow.com")) return undefined;
    return u.hostname.replace("www.", "");
  } catch {
    return undefined;
  }
}
