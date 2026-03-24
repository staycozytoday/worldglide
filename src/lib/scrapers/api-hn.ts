import { Job, getCompanyLogoUrl } from "../types";
import { isWorldwideRemote } from "../filter";
import { categorizeJob } from "../categorize";
import { createJobId } from "../utils";
import { fetchWithRetry } from "../fetch-retry";

export interface HNResult {
  jobs: Job[];
  rawCount: number;
}

interface HNSearchHit {
  objectID: string;
  title: string;
  created_at: string;
}

interface HNItem {
  id: number;
  children?: HNComment[];
}

interface HNComment {
  id: number;
  text?: string | null;
  author?: string;
  created_at_i?: number;
  children?: HNComment[];
}

interface ParsedComment {
  company: string;
  title: string;
  location: string;
  url?: string;
}

/**
 * Role keywords used to identify the "title" segment in a HN comment.
 */
const ROLE_KEYWORDS = [
  "engineer",
  "developer",
  "designer",
  "manager",
  "architect",
  "analyst",
  "scientist",
  "lead",
  "director",
  "vp ",
  "head of",
  "cto",
  "cpo",
  "sre",
  "devops",
  "frontend",
  "backend",
  "fullstack",
  "full-stack",
  "full stack",
  "product",
  "ux",
  "ui",
  "qa",
  "security",
  "data",
  "ml ",
  "machine learning",
  "ai ",
  "platform",
  "infra",
  "mobile",
  "ios",
  "android",
  "writer",
  "researcher",
];

/**
 * Scrape jobs from the latest HN "Who is hiring?" monthly thread.
 *
 * 1. Find the latest monthly thread via Algolia search.
 * 2. Fetch all top-level comments.
 * 3. Parse each comment for company, role, location, and URL.
 * 4. Filter through isWorldwideRemote() and categorizeJob().
 */
export async function scrapeHNWhoIsHiring(): Promise<HNResult> {
  // Step 1: Find the latest "Who is hiring?" thread
  let threadId: string;

  try {
    const searchRes = await fetchWithRetry(
      "https://hn.algolia.com/api/v1/search_by_date?query=%22Ask+HN%3A+Who+is+hiring%22&tags=ask_hn&hitsPerPage=5",
      { headers: { "User-Agent": "worldglide-jobs/1.0" }, timeoutMs: 15000 },
    );

    if (!searchRes.ok) {
      console.warn(`[hn] search API returned ${searchRes.status}`);
      return { jobs: [], rawCount: 0 };
    }

    const searchData = await searchRes.json();
    const hits: HNSearchHit[] = searchData.hits || [];

    // Find the monthly "Who is hiring?" thread (title pattern: "Ask HN: Who is hiring? (Month YYYY)")
    const monthlyThread = hits.find((h) =>
      /who is hiring\?\s*\(/i.test(h.title),
    );
    if (!monthlyThread) {
      console.warn("[hn] no monthly 'Who is hiring' thread found");
      return { jobs: [], rawCount: 0 };
    }

    threadId = monthlyThread.objectID;
    console.log(`[hn] found thread: ${monthlyThread.title} (id=${threadId})`);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[hn] search failed: ${msg}`);
    return { jobs: [], rawCount: 0 };
  }

  // Step 2: Fetch the thread with all comments
  let comments: HNComment[];

  try {
    const itemRes = await fetchWithRetry(
      `https://hn.algolia.com/api/v1/items/${threadId}`,
      { headers: { "User-Agent": "worldglide-jobs/1.0" }, timeoutMs: 30000 },
    );

    if (!itemRes.ok) {
      console.warn(`[hn] items API returned ${itemRes.status}`);
      return { jobs: [], rawCount: 0 };
    }

    const itemData: HNItem = await itemRes.json();
    comments = itemData.children || [];
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[hn] fetch thread failed: ${msg}`);
    return { jobs: [], rawCount: 0 };
  }

  // Step 3: Parse top-level comments only (job postings, not replies)
  const rawCount = comments.length;
  const jobs: Job[] = [];

  for (const comment of comments) {
    if (!comment.text) continue;

    const parsed = parseHNComment(comment.text);
    if (!parsed) continue;

    // Step 4: Filter
    if (
      !isWorldwideRemote({
        title: parsed.title,
        description: comment.text,
        location: parsed.location,
      })
    ) {
      continue;
    }

    const category = categorizeJob(parsed.title, []);
    if (!category) continue;

    // Build posted date from the comment's Unix timestamp
    const postedAt = comment.created_at_i
      ? new Date(comment.created_at_i * 1000).toISOString()
      : new Date().toISOString();

    // Extract company domain for logo
    const companyDomain = parsed.url ? extractDomain(parsed.url) : undefined;
    const companyLogo = companyDomain
      ? getCompanyLogoUrl(companyDomain)
      : undefined;

    // Job URL: prefer parsed URL, fallback to HN comment link
    const jobUrl =
      parsed.url || `https://news.ycombinator.com/item?id=${comment.id}`;

    // Build plain-text description from HTML comment
    const description = stripHtml(comment.text).slice(0, 200);

    jobs.push({
      id: createJobId("hn-whoishiring", String(comment.id)),
      title: parsed.title,
      company: parsed.company,
      companyLogo,
      category,
      url: jobUrl,
      source: "hn-whoishiring",
      tags: [],
      postedAt,
      scrapedAt: new Date().toISOString(),
      description,
      isWorldwide: true,
      employmentType: "Full-time",
    });
  }

  console.log(`[hn] ${jobs.length} worldwide jobs from ${rawCount} comments`);
  return { jobs, rawCount };
}

/**
 * Parse a HN "Who is hiring?" comment into structured fields.
 *
 * Comments typically follow the pattern:
 *   Company Name | Role Title | Location | URL
 * or use newlines instead of pipes. Some comments are discussions
 * and don't match this pattern — we return null for those.
 */
function parseHNComment(html: string): ParsedComment | null {
  const text = stripHtml(html);

  // Try pipe-delimited first (most common format)
  const segments = text.split("|").map((s) => s.trim());

  if (segments.length >= 2) {
    return parseSegments(segments);
  }

  // Fallback: try first line with newline splits
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
  if (lines.length >= 2) {
    // Try the first line as pipe-delimited
    const firstLineSegments = lines[0].split("|").map((s) => s.trim());
    if (firstLineSegments.length >= 2) {
      return parseSegments(firstLineSegments);
    }
  }

  return null;
}

function parseSegments(segments: string[]): ParsedComment | null {
  if (segments.length < 2) return null;

  // First segment is almost always the company name
  const company = segments[0].trim();
  if (!company || company.length > 100) return null;

  // Find segment with role keywords
  let title = "";
  let location = "";
  let url: string | undefined;

  for (let i = 1; i < segments.length; i++) {
    const seg = segments[i].trim();
    const segLower = seg.toLowerCase();

    // Check for URL
    if (/https?:\/\//.test(seg)) {
      const match = seg.match(/https?:\/\/[^\s)]+/);
      if (match) url = match[0];
      continue;
    }

    // Check for role keywords
    if (!title && ROLE_KEYWORDS.some((kw) => segLower.includes(kw))) {
      title = seg;
      continue;
    }

    // Check for location-like keywords
    if (
      !location &&
      /remote|onsite|on-site|hybrid|worldwide|anywhere|visa|intern/i.test(
        segLower,
      )
    ) {
      location = seg;
      continue;
    }

    // If we haven't assigned a title yet, check if it looks like a location
    // (short, contains city/state/country names) — otherwise treat as title
    if (!title && seg.length > 3) {
      title = seg;
    } else if (!location) {
      location = seg;
    }
  }

  // Must have at least a title
  if (!title) return null;

  return { company, title, location: location || "Remote", url };
}

function stripHtml(html: string): string {
  return html
    .replace(/<a[^>]*href="([^"]*)"[^>]*>.*?<\/a>/gi, "$1")
    .replace(/<[^>]*>/g, " ")
    .replace(/&#x27;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x2F;/g, "/")
    .replace(/\s+/g, " ")
    .trim();
}

function extractDomain(url: string): string | undefined {
  try {
    const u = new URL(url);
    return u.hostname.replace("www.", "");
  } catch {
    return undefined;
  }
}
