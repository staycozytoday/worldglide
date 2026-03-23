#!/usr/bin/env npx tsx
/**
 * Automated company discovery pipeline.
 *
 * Sources:
 *   1. GitHub "awesome-remote-job" lists (parses markdown for company names)
 *   2. YC Company Directory (Algolia search API)
 *   3. Feedback loop from jobs.json (API-sourced companies not in companies.ts)
 *   4. a16z portfolio (HTML page with embedded JSON)
 *   5. Sequoia Capital portfolio (WP REST API)
 *   6. HN Who's Hiring threads (Firebase HN API)
 *
 * For each discovered company name:
 *   - Generate ATS slug permutations
 *   - Test slugs against Greenhouse, Lever, Ashby, Personio
 *   - Sample jobs through isWorldwideRemote() for quality check
 *   - Output verified companies as JSON
 *
 * Usage:
 *   npx tsx scripts/discover-companies.ts
 *   npx tsx scripts/discover-companies.ts --source=github     # only GitHub lists
 *   npx tsx scripts/discover-companies.ts --source=yc          # only YC directory
 *   npx tsx scripts/discover-companies.ts --source=feedback    # only jobs.json feedback
 *   npx tsx scripts/discover-companies.ts --source=a16z        # only a16z portfolio
 *   npx tsx scripts/discover-companies.ts --source=sequoia     # only Sequoia portfolio
 *   npx tsx scripts/discover-companies.ts --source=hn          # only HN Who's Hiring
 *   npx tsx scripts/discover-companies.ts --dry-run            # skip ATS probing
 *   npx tsx scripts/discover-companies.ts --limit=20           # cap candidates
 */

import { REMOTE_COMPANIES } from "../src/lib/companies";
import { isWorldwideRemote } from "../src/lib/filter";
import { writeFileSync, readFileSync, existsSync } from "fs";
import { resolve } from "path";

// ─── Configuration ────────────────────────────────────────────────────
const BATCH_SIZE = 5;
const REQUEST_TIMEOUT = 8000;
const BATCH_DELAY = 600;
const MAX_CANDIDATES_DEFAULT = 100;

// ─── ATS endpoints ────────────────────────────────────────────────────
const ATS_ENDPOINTS: Record<string, { url: (slug: string) => string; method?: string; body?: string }> = {
  greenhouse: {
    url: (s) => `https://boards-api.greenhouse.io/v1/boards/${s}/jobs`,
  },
  lever: {
    url: (s) => `https://api.lever.co/v0/postings/${s}?mode=json`,
  },
  ashby: {
    url: (s) => `https://api.ashbyhq.com/posting-api/job-board/${s}`,
  },
  personio: {
    url: (s) => `https://${s}.jobs.personio.de/xml`,
  },
};

// ─── Build existing slugs/names from companies.ts ─────────────────────
const existingSlugs = new Set(
  REMOTE_COMPANIES.map((c) => `${c.atsType}:${c.atsSlug?.toLowerCase()}`).filter(Boolean)
);
const existingNames = new Set(
  REMOTE_COMPANIES.map((c) => c.name.toLowerCase())
);
const existingDomains = new Set(
  REMOTE_COMPANIES.map((c) => c.domain.toLowerCase())
);

// ─── Types ────────────────────────────────────────────────────────────
interface DiscoveredCompany {
  name: string;
  slug: string;
  atsType: string;
  domain: string;
  worldwideJobCount: number;
  totalJobCount: number;
  source: string;
}

// ─── Source 1: GitHub awesome-remote-job lists ─────────────────────────
async function fetchGitHubLists(): Promise<{ name: string; source: string }[]> {
  const urls = [
    {
      url: "https://raw.githubusercontent.com/lukasz-madon/awesome-remote-job/master/README.md",
      label: "awesome-remote-job",
    },
    {
      url: "https://raw.githubusercontent.com/remoteintech/remote-jobs/main/README.md",
      label: "remoteintech",
    },
  ];

  const companies: { name: string; source: string }[] = [];

  for (const { url, label } of urls) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 15000);
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timer);

      if (!res.ok) {
        console.error(`  [github] Failed to fetch ${label}: HTTP ${res.status}`);
        continue;
      }

      const md = await res.text();

      // Parse markdown links: [Company Name](url)
      // Capture company names from link text in list items
      const linkPattern = /^\s*[-*]\s*\[([^\]]+)\]\(([^)]+)\)/gm;
      let match;
      while ((match = linkPattern.exec(md)) !== null) {
        const name = match[1].trim();
        // Skip non-company entries (section headers, generic text, etc.)
        if (
          name.length < 2 ||
          name.length > 50 ||
          name.startsWith("http") ||
          /^(a|an|the|and|or|but|for|with)\s/i.test(name) ||
          /\d{4}/.test(name) || // years
          name.includes("awesome") ||
          name.toLowerCase() === "back to top" ||
          name.toLowerCase().includes("license") ||
          name.toLowerCase().includes("contributing")
        ) {
          continue;
        }
        companies.push({ name, source: `github:${label}` });
      }

      console.error(`  [github] Parsed ${companies.length} company names from ${label}`);
    } catch (err: any) {
      console.error(`  [github] Error fetching ${label}: ${err.message}`);
    }
  }

  return companies;
}

// ─── Source 2: YC Company Directory ───────────────────────────────────
async function fetchYCDirectory(): Promise<{ name: string; source: string }[]> {
  const companies: { name: string; source: string }[] = [];

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);

    const res = await fetch(
      "https://45bwzj1sgc-dsn.algolia.net/1/indexes/*/queries",
      {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          "x-algolia-application-id": "45BWZJ1SGC",
          "x-algolia-api-key":
            "MjBjYjRiMzY0NzdhZWY0NjExY2NhZjYxMGIxYjc2MTAwNWFkNTkwNTc4NjgxYjU0YzFhYTY2ZGEzMGUxYzg5ZGZiYTAyMWZhNmMwMmQwMzQ5NDcwMjhjMzQ1NjI3MzU2YjM0OTRkYWIzMGUzODA5ZjI3MzA0OGRmYzI5YjdhOWYK",
        },
        body: JSON.stringify({
          requests: [
            {
              indexName: "YCCompany_production",
              params: "hitsPerPage=100&page=0&query=remote",
            },
          ],
        }),
      }
    );
    clearTimeout(timer);

    if (!res.ok) {
      console.error(`  [yc] Failed to fetch YC directory: HTTP ${res.status}`);
      return companies;
    }

    const data = await res.json();
    const hits = data?.results?.[0]?.hits || [];

    for (const hit of hits) {
      const name = hit.name?.trim();
      if (!name || name.length < 2) continue;
      companies.push({ name, source: "yc-directory" });
    }

    console.error(`  [yc] Found ${companies.length} companies from YC directory`);
  } catch (err: any) {
    console.error(`  [yc] Error fetching YC directory: ${err.message}`);
  }

  return companies;
}

// ─── Source 3: Feedback loop from jobs.json ───────────────────────────
function extractFeedbackCompanies(): { name: string; source: string }[] {
  const companies: { name: string; source: string }[] = [];
  const jobsPath = resolve(__dirname, "../public/data/jobs.json");

  if (!existsSync(jobsPath)) {
    console.error("  [feedback] jobs.json not found, skipping");
    return companies;
  }

  try {
    const data = JSON.parse(readFileSync(jobsPath, "utf-8"));
    const jobs: any[] = Array.isArray(data) ? data : data.jobs || [];

    // API sources whose companies are NOT already tracked via ATS
    const apiSources = new Set([
      "himalayas",
      "remoteok",
      "remotive",
      "jobicy",
      "arbeitnow",
    ]);

    const seenCompanies = new Set<string>();

    for (const job of jobs) {
      if (!apiSources.has(job.source)) continue;
      const company = job.company?.trim();
      if (!company || company.length < 2) continue;

      const key = company.toLowerCase();
      if (seenCompanies.has(key)) continue;
      if (existingNames.has(key)) continue;
      seenCompanies.add(key);

      companies.push({ name: company, source: `feedback:${job.source}` });
    }

    console.error(
      `  [feedback] Found ${companies.length} new companies from jobs.json`
    );
  } catch (err: any) {
    console.error(`  [feedback] Error reading jobs.json: ${err.message}`);
  }

  return companies;
}

// ─── Source 4: a16z Portfolio ────────────────────────────────────────
async function fetchA16zPortfolio(): Promise<{ name: string; source: string }[]> {
  const companies: { name: string; source: string }[] = [];

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 20000);
    const res = await fetch("https://a16z.com/portfolio/", {
      signal: controller.signal,
      headers: { "User-Agent": "worldglide-discover/1.0" },
    });
    clearTimeout(timer);

    if (!res.ok) {
      console.error(`  [a16z] Failed to fetch portfolio page: HTTP ${res.status}`);
      return companies;
    }

    const html = await res.text();

    // a16z embeds portfolio data as HTML-encoded JSON in Alpine.js components
    // Pattern: &quot;name&quot;:&quot;CompanyName&quot;
    const namePattern = /&quot;name&quot;:&quot;([^&]+)&quot;/g;
    const seen = new Set<string>();
    const skip = new Set([
      "andreessen horowitz",
      "portfolio | andreessen horowitz",
    ]);

    let match;
    while ((match = namePattern.exec(html)) !== null) {
      // Decode HTML entities
      const raw = match[1]
        .replace(/&#039;/g, "'")
        .replace(/&amp;/g, "&")
        .replace(/&#x2F;/g, "/")
        .trim();

      if (!raw || raw.length < 2 || raw.length > 60) continue;
      const key = raw.toLowerCase();
      if (skip.has(key) || seen.has(key)) continue;
      // Skip internal/person names (often lowercase single words without capitals)
      if (/^[a-z]+$/.test(raw) && raw.length < 4) continue;
      seen.add(key);
      companies.push({ name: raw, source: "vc:a16z" });
    }

    console.error(`  [a16z] Parsed ${companies.length} portfolio companies`);
  } catch (err: any) {
    console.error(`  [a16z] Error fetching portfolio: ${err.message}`);
  }

  return companies;
}

// ─── Source 5: Sequoia Capital Portfolio ─────────────────────────────
async function fetchSequoiaPortfolio(): Promise<{ name: string; source: string }[]> {
  const companies: { name: string; source: string }[] = [];

  try {
    // Sequoia exposes a WP REST API for their company custom post type
    // Paginate through all results (max 100 per page)
    const perPage = 100;
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 15000);
      const url = `https://sequoiacap.com/wp-json/wp/v2/company?per_page=${perPage}&page=${page}&_fields=title`;
      const res = await fetch(url, {
        signal: controller.signal,
        headers: { "User-Agent": "worldglide-discover/1.0" },
      });
      clearTimeout(timer);

      if (!res.ok) {
        if (res.status === 400) break; // Past last page
        console.error(`  [sequoia] Failed page ${page}: HTTP ${res.status}`);
        break;
      }

      const data: any[] = await res.json();
      if (data.length === 0) break;

      for (const item of data) {
        const name = item.title?.rendered?.trim();
        if (!name || name.length < 2 || name.length > 60) continue;
        companies.push({ name, source: "vc:sequoia" });
      }

      // Check if there are more pages
      const totalPages = parseInt(res.headers.get("x-wp-totalpages") || "1", 10);
      hasMore = page < totalPages;
      page++;

      // Small delay between pages
      if (hasMore) await new Promise((r) => setTimeout(r, 300));
    }

    console.error(`  [sequoia] Fetched ${companies.length} portfolio companies (${page - 1} pages)`);
  } catch (err: any) {
    console.error(`  [sequoia] Error fetching portfolio: ${err.message}`);
  }

  return companies;
}

// ─── Source 6: HN Who's Hiring threads ──────────────────────────────
async function fetchHNWhoIsHiring(): Promise<{ name: string; source: string }[]> {
  const companies: { name: string; source: string }[] = [];

  try {
    // Get the latest submissions from the "whoishiring" user
    const controller1 = new AbortController();
    const timer1 = setTimeout(() => controller1.abort(), 10000);
    const userRes = await fetch(
      "https://hacker-news.firebaseio.com/v0/user/whoishiring.json",
      { signal: controller1.signal }
    );
    clearTimeout(timer1);

    if (!userRes.ok) {
      console.error(`  [hn] Failed to fetch whoishiring user: HTTP ${userRes.status}`);
      return companies;
    }

    const userData = await userRes.json();
    const submissions: number[] = userData.submitted?.slice(0, 6) || [];

    // Find the most recent "Who is hiring?" thread(s)
    const hiringThreadIds: number[] = [];
    for (const id of submissions) {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 8000);
      const itemRes = await fetch(
        `https://hacker-news.firebaseio.com/v0/item/${id}.json`,
        { signal: ctrl.signal }
      );
      clearTimeout(t);

      if (!itemRes.ok) continue;
      const item = await itemRes.json();
      if (item.title?.includes("Who is hiring?")) {
        hiringThreadIds.push(id);
        if (hiringThreadIds.length >= 2) break; // Latest 2 months
      }
    }

    if (hiringThreadIds.length === 0) {
      console.error("  [hn] No Who is hiring? threads found");
      return companies;
    }

    // Fetch comments from the threads (sample up to 100 comments per thread)
    for (const threadId of hiringThreadIds) {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 10000);
      const threadRes = await fetch(
        `https://hacker-news.firebaseio.com/v0/item/${threadId}.json`,
        { signal: ctrl.signal }
      );
      clearTimeout(t);

      if (!threadRes.ok) continue;
      const thread = await threadRes.json();
      const kids: number[] = (thread.kids || []).slice(0, 100);

      // Fetch comments in batches of 10
      for (let i = 0; i < kids.length; i += 10) {
        const batch = kids.slice(i, i + 10);
        const results = await Promise.all(
          batch.map(async (commentId) => {
            try {
              const c = new AbortController();
              const tt = setTimeout(() => c.abort(), 8000);
              const r = await fetch(
                `https://hacker-news.firebaseio.com/v0/item/${commentId}.json`,
                { signal: c.signal }
              );
              clearTimeout(tt);
              if (!r.ok) return null;
              return r.json();
            } catch {
              return null;
            }
          })
        );

        for (const comment of results) {
          if (!comment?.text) continue;
          const text: string = comment.text;

          // HN Who's Hiring format: "CompanyName | url | role | location..."
          // Extract company name from the first pipe-separated segment
          const pipeMatch = text.match(/^([^|<]+)\|/);
          if (pipeMatch) {
            let name = pipeMatch[1]
              .replace(/<[^>]*>/g, "") // strip HTML
              .replace(/&#x2F;/g, "/")
              .replace(/&amp;/g, "&")
              .replace(/&#039;/g, "'")
              .replace(/&quot;/g, '"')
              .trim();

            // Clean up common prefixes/suffixes
            name = name.replace(/^\*+|\*+$/g, "").trim();
            name = name.replace(/\(.*?\)\s*$/, "").trim();

            if (
              name.length >= 2 &&
              name.length <= 60 &&
              !/^https?:/.test(name) &&
              !/hiring|remote|engineer/i.test(name)
            ) {
              companies.push({ name, source: "hn-hiring" });
            }
          }
        }

        // Rate limit HN API
        if (i + 10 < kids.length) {
          await new Promise((r) => setTimeout(r, 200));
        }
      }
    }

    // Deduplicate within source
    const seen = new Set<string>();
    const unique = companies.filter((c) => {
      const key = c.name.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    companies.length = 0;
    companies.push(...unique);

    console.error(`  [hn] Extracted ${companies.length} companies from ${hiringThreadIds.length} thread(s)`);
  } catch (err: any) {
    console.error(`  [hn] Error: ${err.message}`);
  }

  return companies;
}

// ─── Slug generation ──────────────────────────────────────────────────
function generateSlugs(name: string): string[] {
  const slugs = new Set<string>();

  // Clean name: lowercase, strip special chars
  const nameClean = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
  if (nameClean.length >= 2) slugs.add(nameClean);

  // Hyphenated version: "Acme Corp" -> "acme-corp"
  const nameHyphen = name
    .toLowerCase()
    .replace(/[^a-z0-9\s]+/g, "")
    .trim()
    .replace(/\s+/g, "-");
  if (nameHyphen.length >= 2 && nameHyphen !== nameClean) slugs.add(nameHyphen);

  // First word only: "Acme Corp" -> "acme"
  const firstWord = name
    .toLowerCase()
    .replace(/[^a-z0-9\s]+/g, "")
    .trim()
    .split(/\s+/)[0];
  if (firstWord && firstWord.length >= 2 && firstWord !== nameClean)
    slugs.add(firstWord);

  // Handle ".io" / ".ai" style names: "Fly.io" -> "fly-io", "flyio", "fly"
  if (/\.(io|ai|co|dev|app|com)$/i.test(name)) {
    const base = name
      .toLowerCase()
      .replace(/\.(io|ai|co|dev|app|com)$/i, "")
      .replace(/[^a-z0-9]+/g, "");
    if (base.length >= 2) {
      slugs.add(base);
      const ext = name.match(/\.(io|ai|co|dev|app|com)$/i)?.[1];
      if (ext) {
        slugs.add(`${base}-${ext}`);
        slugs.add(`${base}${ext}`);
      }
    }
  }

  // Common suffixes
  slugs.add(nameClean + "hq");
  if (nameClean.endsWith("labs")) slugs.add(nameClean.slice(0, -4));
  if (nameClean.endsWith("hq")) slugs.add(nameClean.slice(0, -2));

  return Array.from(slugs).filter((s) => s.length >= 2 && s.length <= 50);
}

// ─── ATS testing ──────────────────────────────────────────────────────
async function tryAts(
  atsType: string,
  slug: string
): Promise<{ count: number; sampleJobs: any[] }> {
  const ep = ATS_ENDPOINTS[atsType];
  const url = ep.url(slug);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const opts: RequestInit = {
      method: ep.method || "GET",
      signal: controller.signal,
      headers: {
        "User-Agent": "worldglide-discover/1.0",
        Accept: atsType === "personio" ? "application/xml" : "application/json",
      },
      ...(ep.body ? { body: ep.body } : {}),
    };

    const res = await fetch(url, opts);
    clearTimeout(timer);

    if (!res.ok) return { count: -1, sampleJobs: [] };

    if (atsType === "personio") {
      // Personio returns XML; just check if response is non-empty
      const text = await res.text();
      const positionMatches = text.match(/<position>/g);
      const count = positionMatches ? positionMatches.length : 0;
      return { count: count > 0 ? count : -1, sampleJobs: [] };
    }

    const data = await res.json();

    let jobs: any[] = [];
    if (atsType === "greenhouse") jobs = data.jobs || [];
    else if (atsType === "lever") jobs = Array.isArray(data) ? data : [];
    else if (atsType === "ashby") jobs = data.jobs || [];

    if (jobs.length === 0) return { count: -1, sampleJobs: [] };

    return { count: jobs.length, sampleJobs: jobs.slice(0, 3) };
  } catch {
    clearTimeout(timer);
    return { count: -1, sampleJobs: [] };
  }
}

// ─── Worldwide job sampling ──────────────────────────────────────────
function sampleWorldwide(
  atsType: string,
  slug: string,
  sampleJobs: any[]
): number {
  let worldwideCount = 0;

  for (const item of sampleJobs) {
    let title = "";
    let location = "";
    let description = "";

    if (atsType === "greenhouse") {
      title = item.title || "";
      location = item.location?.name || "";
    } else if (atsType === "lever") {
      title = item.text || "";
      location = item.categories?.location || item.workplaceType || "";
      description = item.descriptionPlain || "";
    } else if (atsType === "ashby") {
      title = item.title || "";
      location = item.location || "";
      if (!item.isRemote) continue;
    } else {
      continue; // personio XML not sampled
    }

    if (
      isWorldwideRemote({
        title,
        description,
        location,
        companySlug: slug,
      })
    ) {
      worldwideCount++;
    }
  }

  return worldwideCount;
}

// ─── Main pipeline ───────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);
  const sourceFilter = args.find((a) => a.startsWith("--source="))?.split("=")[1];
  const dryRun = args.includes("--dry-run");
  const limitArg = args.find((a) => a.startsWith("--limit="))?.split("=")[1];
  const maxCandidates = limitArg ? parseInt(limitArg, 10) : MAX_CANDIDATES_DEFAULT;

  console.error(`[discover] Automated company discovery pipeline`);
  console.error(
    `[discover] ${REMOTE_COMPANIES.length} companies already in database`
  );
  console.error(
    `[discover] Sources: ${sourceFilter || "all"}, limit: ${maxCandidates}\n`
  );

  // ── Gather candidates from all sources ──
  const allCandidates: { name: string; source: string }[] = [];

  if (!sourceFilter || sourceFilter === "github") {
    console.error("[discover] Fetching GitHub awesome-remote-job lists...");
    const gh = await fetchGitHubLists();
    allCandidates.push(...gh);
  }

  if (!sourceFilter || sourceFilter === "yc") {
    console.error("[discover] Fetching YC Company Directory...");
    const yc = await fetchYCDirectory();
    allCandidates.push(...yc);
  }

  if (!sourceFilter || sourceFilter === "feedback") {
    console.error("[discover] Extracting companies from jobs.json feedback...");
    const fb = extractFeedbackCompanies();
    allCandidates.push(...fb);
  }

  if (!sourceFilter || sourceFilter === "a16z") {
    console.error("[discover] Fetching a16z portfolio...");
    const a16z = await fetchA16zPortfolio();
    allCandidates.push(...a16z);
  }

  if (!sourceFilter || sourceFilter === "sequoia") {
    console.error("[discover] Fetching Sequoia Capital portfolio...");
    const seq = await fetchSequoiaPortfolio();
    allCandidates.push(...seq);
  }

  if (!sourceFilter || sourceFilter === "hn") {
    console.error("[discover] Fetching HN Who's Hiring threads...");
    const hn = await fetchHNWhoIsHiring();
    allCandidates.push(...hn);
  }

  // ── Deduplicate ──
  const seen = new Set<string>();
  const uniqueCandidates = allCandidates.filter((c) => {
    const key = c.name.toLowerCase();
    if (seen.has(key)) return false;
    if (existingNames.has(key)) return false;
    seen.add(key);
    return true;
  });

  console.error(
    `\n[discover] ${allCandidates.length} raw candidates -> ${uniqueCandidates.length} unique new names`
  );

  // Apply limit
  const candidates = uniqueCandidates.slice(0, maxCandidates);
  if (uniqueCandidates.length > maxCandidates) {
    console.error(
      `[discover] Capped to ${maxCandidates} candidates (use --limit=N to adjust)`
    );
  }

  if (dryRun) {
    console.error("\n[discover] --dry-run: listing candidates without probing ATS\n");
    for (const c of candidates) {
      const slugs = generateSlugs(c.name);
      console.log(
        `  ${c.name} [${c.source}] -> slugs: ${slugs.join(", ")}`
      );
    }
    console.error(`\n[discover] ${candidates.length} candidates listed`);
    return;
  }

  // ── Probe ATS endpoints ──
  console.error(`\n[discover] Probing ATS endpoints for ${candidates.length} candidates...\n`);

  const atsTypes = ["greenhouse", "lever", "ashby", "personio"];
  const verified: DiscoveredCompany[] = [];

  for (let i = 0; i < candidates.length; i += BATCH_SIZE) {
    const batch = candidates.slice(i, i + BATCH_SIZE);

    const batchResults = await Promise.all(
      batch.map(async (candidate) => {
        const slugs = generateSlugs(candidate.name);
        let bestHit: {
          atsType: string;
          slug: string;
          count: number;
          sampleJobs: any[];
        } | null = null;

        // Try each ATS x slug combination
        for (const atsType of atsTypes) {
          for (const slug of slugs) {
            const key = `${atsType}:${slug}`;
            if (existingSlugs.has(key)) continue;

            const { count, sampleJobs } = await tryAts(atsType, slug);
            if (count > 0) {
              if (!bestHit || count > bestHit.count) {
                bestHit = { atsType, slug, count, sampleJobs };
              }
              break; // found on this ATS, try next ATS
            }
          }
        }

        if (!bestHit) return null;

        // Sample worldwide jobs
        const worldwideJobCount = sampleWorldwide(
          bestHit.atsType,
          bestHit.slug,
          bestHit.sampleJobs
        );

        // Derive domain from slug (best guess)
        const domain = `${bestHit.slug.replace(/-/g, "")}.com`;

        return {
          name: candidate.name,
          slug: bestHit.slug,
          atsType: bestHit.atsType,
          domain,
          worldwideJobCount,
          totalJobCount: bestHit.count,
          source: candidate.source,
        } satisfies DiscoveredCompany;
      })
    );

    for (const result of batchResults) {
      if (result) {
        verified.push(result);
        existingSlugs.add(`${result.atsType}:${result.slug}`);
        console.error(
          `  + ${result.name} -> ${result.atsType}/${result.slug} (${result.totalJobCount} jobs, ${result.worldwideJobCount} worldwide) [${result.source}]`
        );
      }
    }

    console.error(
      `[discover] progress: ${Math.min(i + BATCH_SIZE, candidates.length)}/${candidates.length}`
    );

    // Rate limiting
    if (i + BATCH_SIZE < candidates.length) {
      await new Promise((r) => setTimeout(r, BATCH_DELAY));
    }
  }

  // ── Sort and output ──
  verified.sort(
    (a, b) => b.worldwideJobCount - a.worldwideJobCount || b.totalJobCount - a.totalJobCount
  );

  // Count by ATS
  const atsCounts = new Map<string, number>();
  for (const v of verified) {
    atsCounts.set(v.atsType, (atsCounts.get(v.atsType) || 0) + 1);
  }
  const atsBreakdown = Array.from(atsCounts.entries())
    .map(([k, v]) => `${k}: ${v}`)
    .join(", ");

  console.error(`\n[discover] ════════════════════════════════════════`);
  console.error(
    `[discover] Found ${verified.length} new companies across ${atsCounts.size} ATS platforms`
  );
  if (atsBreakdown) {
    console.error(`[discover] Breakdown: ${atsBreakdown}`);
  }
  console.error(
    `[discover] ${verified.filter((v) => v.worldwideJobCount > 0).length} have worldwide jobs`
  );
  console.error(`[discover] ════════════════════════════════════════\n`);

  // Print to stdout as JSON
  console.log(JSON.stringify(verified, null, 2));

  // Write results file
  const outputPath = resolve(__dirname, "discovered-companies.json");
  writeFileSync(outputPath, JSON.stringify(verified, null, 2));
  console.error(`[discover] Results written to ${outputPath}`);
}

main().catch((err) => {
  console.error("[discover] fatal:", err);
  process.exit(1);
});
