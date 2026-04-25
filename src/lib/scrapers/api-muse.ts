import { Job, getCompanyLogoUrl } from "../types";
import { categorizeJob } from "../categorize";
import { createJobId } from "../utils";
import { fetchWithRetry } from "../fetch-retry";

export interface MuseResult {
  jobs: Job[];
  rawCount: number;
}

interface MuseJob {
  id: number;
  name: string;
  contents?: string;
  publication_date?: string;
  short_name?: string;
  locations?: { name: string }[];
  categories?: { name: string }[];
  levels?: { name: string; short_name: string }[];
  tags?: { name: string }[];
  refs?: { landing_page?: string };
  company?: { id: number; short_name?: string; name: string };
}

interface MuseResponse {
  results: MuseJob[];
  total: number;
  page: number;
  page_count: number;
}

const MAX_PAGES = 5;

/**
 * Scrape jobs from The Muse public API.
 * GET https://www.themuse.com/api/public/jobs?category=Design&location=Flexible+%2F+Remote
 * "Flexible / Remote" is The Muse's designation for remote-eligible jobs.
 * Paginated — 20 results per page.
 */
export async function scrapeMuse(): Promise<MuseResult> {
  const allRaw: MuseJob[] = [];

  for (let page = 0; page < MAX_PAGES; page++) {
    const url = `https://www.themuse.com/api/public/jobs?category=Design&location=Flexible+%2F+Remote&page=${page}`;
    try {
      const res = await fetchWithRetry(url, {
        headers: { "User-Agent": "worldglide-jobs/1.0", Accept: "application/json" },
        timeoutMs: 20000,
      });

      if (!res.ok) {
        console.warn(`[muse] page ${page} returned ${res.status}`);
        break;
      }

      const data: MuseResponse = await res.json();
      if (!data.results || data.results.length === 0) break;

      allRaw.push(...data.results);

      if (page >= data.page_count - 1) break;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`[muse] page ${page} failed: ${msg}`);
      break;
    }
  }

  const rawCount = allRaw.length;
  const jobs: Job[] = [];

  for (const item of allRaw) {
    const title = item.name || "";
    const tags = (item.tags || []).map((t) => t.name);
    const category = categorizeJob(title, tags);
    if (!category) continue;

    const url = item.refs?.landing_page || `https://www.themuse.com/jobs/${item.company?.short_name || "unknown"}/${item.short_name || item.id}`;
    const companyName = item.company?.name || "Unknown";
    const companyDomain = extractDomain(url);
    const companyLogo = companyDomain ? getCompanyLogoUrl(companyDomain) : undefined;

    const level = item.levels?.[0]?.short_name || "";
    const employmentType = level === "internship" ? "Internship" : "Full-time";

    const description = stripHtml(item.contents || "").slice(0, 200);

    jobs.push({
      id: createJobId("muse", String(item.id)),
      title,
      company: companyName,
      companyLogo,
      category,
      url,
      source: "muse",
      tags,
      postedAt: item.publication_date || new Date().toISOString(),
      scrapedAt: new Date().toISOString(),
      description,
      region: "ww",
      employmentType,
      isWorldwide: true,
    });
  }

  console.log(`[muse] ${jobs.length} design jobs from ${rawCount} raw`);
  return { jobs, rawCount };
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function extractDomain(url: string): string | undefined {
  try {
    const u = new URL(url);
    if (u.hostname.includes("themuse.com")) return undefined;
    return u.hostname.replace("www.", "");
  } catch {
    return undefined;
  }
}
