import { Job, getCompanyLogoUrl } from "../types";
import { categorizeJob } from "../categorize";
import { createJobId } from "../utils";
import { fetchWithRetry } from "../fetch-retry";

export interface WWRResult {
  jobs: Job[];
  rawCount: number;
}

/**
 * WWR RSS feeds by category — each contains worldwide-tagged jobs.
 * The main feed (/remote-jobs.rss) doesn't include all categories,
 * so we scrape each category feed individually.
 */
const WWR_FEEDS = [
  "https://weworkremotely.com/categories/remote-design-jobs.rss",
  "https://weworkremotely.com/categories/remote-product-jobs.rss",
  "https://weworkremotely.com/categories/remote-sales-and-marketing-jobs.rss",
  "https://weworkremotely.com/categories/remote-full-stack-programming-jobs.rss",
  "https://weworkremotely.com/categories/remote-front-end-programming-jobs.rss",
  "https://weworkremotely.com/categories/all-other-remote-jobs.rss",
  "https://weworkremotely.com/remote-jobs.rss",
];

interface RSSItem {
  title: string;
  region: string;
  category: string;
  type: string;
  description: string;
  pubDate: string;
  link: string;
  guid: string;
}

/**
 * Scrape jobs from We Work Remotely RSS feeds.
 * WWR tags every job with a region field — "Anywhere in the World"
 * means genuinely worldwide. We only keep those.
 */
export async function scrapeWeWorkRemotely(): Promise<WWRResult> {
  const seenGuids = new Set<string>();
  const allItems: RSSItem[] = [];

  for (const feedUrl of WWR_FEEDS) {
    try {
      const res = await fetchWithRetry(feedUrl, {
        headers: {
          "User-Agent": "worldglide-jobs/1.0",
          Accept: "application/rss+xml, application/xml, text/xml",
        },
        timeoutMs: 15000,
      });

      if (!res.ok) {
        console.warn(`[wwr] ${feedUrl} returned ${res.status}`);
        continue;
      }

      const xml = await res.text();
      const items = parseRSSItems(xml);

      for (const item of items) {
        if (!seenGuids.has(item.guid)) {
          seenGuids.add(item.guid);
          allItems.push(item);
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`[wwr] feed failed: ${msg}`);
    }
  }

  const rawCount = allItems.length;
  const jobs: Job[] = [];

  for (const item of allItems) {
    // Only keep "Anywhere in the World" jobs
    const region = item.region.toLowerCase().trim();
    if (!region.includes("anywhere") && !region.includes("worldwide")) {
      continue;
    }

    // Extract company name from title format "Company: Job Title"
    const colonIdx = item.title.indexOf(":");
    const company = colonIdx > 0 ? item.title.slice(0, colonIdx).trim() : "Unknown";
    const title = colonIdx > 0 ? item.title.slice(colonIdx + 1).trim() : item.title;

    // Must be a creative job
    const category = categorizeJob(title, [item.category]);
    if (!category) continue;

    // Strip HTML from description
    const cleanDesc = item.description
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 200);

    const companyDomain = extractDomainFromLink(item.link);

    jobs.push({
      id: createJobId("wwr", item.guid),
      title,
      company,
      companyLogo: companyDomain ? getCompanyLogoUrl(companyDomain) : undefined,
      category,
      url: item.link,
      source: "wwr",
      tags: [item.category],
      postedAt: new Date(item.pubDate).toISOString(),
      scrapedAt: new Date().toISOString(),
      description: cleanDesc,
      region: "ww",
      employmentType: item.type || "Full-time",
    });
  }

  console.log(`[wwr] ${jobs.length} worldwide jobs from ${rawCount} raw (${WWR_FEEDS.length} feeds)`);
  return { jobs, rawCount };
}

/**
 * Minimal RSS parser — extracts item elements and their child fields.
 * No dependency needed for simple RSS.
 */
function parseRSSItems(xml: string): RSSItem[] {
  const items: RSSItem[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match: RegExpExecArray | null;

  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];
    items.push({
      title: extractTag(block, "title"),
      region: extractTag(block, "region"),
      category: extractTag(block, "category"),
      type: extractTag(block, "type"),
      description: extractTag(block, "description"),
      pubDate: extractTag(block, "pubDate"),
      link: extractTag(block, "link"),
      guid: extractTag(block, "guid") || extractTag(block, "link"),
    });
  }

  return items;
}

function extractTag(xml: string, tag: string): string {
  // Handle CDATA sections
  const cdataRegex = new RegExp(`<${tag}>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*</${tag}>`);
  const cdataMatch = cdataRegex.exec(xml);
  if (cdataMatch) return cdataMatch[1].trim();

  const regex = new RegExp(`<${tag}>(.*?)</${tag}>`, "s");
  const m = regex.exec(xml);
  return m ? m[1].trim() : "";
}

function extractDomainFromLink(url: string): string | undefined {
  try {
    const u = new URL(url);
    if (u.hostname.includes("weworkremotely.com")) return undefined;
    return u.hostname.replace("www.", "");
  } catch {
    return undefined;
  }
}
