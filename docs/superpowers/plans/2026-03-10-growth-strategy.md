# Growth Strategy Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Grow from 67 to 200+ worldwide remote jobs by adding thousands of companies via automated discovery and extracting more signal from existing data via smarter filtering.

**Architecture:** Two standalone scripts (`scripts/audit-filter.ts` and `scripts/discover.ts`) plus improvements to `src/lib/filter.ts`. The audit script reveals what the filter drops so we can tune it. The discovery script finds new ATS slugs from 8 web sources, verifies them, and merges into `companies.ts`. Both run on-demand via `npx tsx`.

**Tech Stack:** TypeScript, tsx, Node.js fetch API, existing `fetchWithRetry` utility

---

## File Structure

| File | Action | Responsibility |
|------|--------|---------------|
| `scripts/audit-filter.ts` | Create | Dry-run scraper that logs rejected jobs with rejection reasons |
| `src/lib/filter.ts` | Modify | Add rejection reason tracking, expand location patterns, description rescue |
| `scripts/discover.ts` | Create | Multi-source ATS slug discovery pipeline |
| `scripts/discover-sources.ts` | Create | Individual source fetchers (YC, GitHub lists, Flexa, etc.) |
| `scripts/verify-slugs.ts` | Create | Batch ATS API verification with rate limiting |
| `scripts/merge-companies.ts` | Create | Merge discovered companies into `companies.ts` |
| `src/lib/companies.ts` | Modify | Receives new companies from merge script |

---

## Chunk 1: Smarter Filtering (C1-C4)

### Task 1: Add rejection reason tracking to filter

**Files:**
- Modify: `src/lib/filter.ts`

The current `isWorldwideRemote` returns a boolean. We need a variant that returns the *reason* for rejection so the audit script can log it.

- [ ] **Step 1: Add `FilterResult` type and `analyzeWorldwideRemote` function**

Add to `src/lib/filter.ts` — a new exported function that wraps the existing logic but returns a reason string instead of just true/false:

```typescript
export interface FilterResult {
  pass: boolean;
  reason: string; // "pass" | "geo_qualifier_location" | "geo_qualifier_title" | "structural_pattern_location" | "structural_pattern_title" | "no_remote_keyword" | "location_restrictions" | "candidate_required_location" | "job_geo" | "restriction_phrase" | "no_worldwide_signal" | "category_rejected"
}

export function analyzeWorldwideRemote(job: FilterableJob): FilterResult {
  // Same logic as isWorldwideRemote but returns { pass, reason } at each rejection point
}
```

Each `return false` in the current `isWorldwideRemote` becomes a `return { pass: false, reason: "..." }`.
The final `return true` becomes `return { pass: true, reason: "pass" }`.

- [ ] **Step 2: Refactor `isWorldwideRemote` to use `analyzeWorldwideRemote`**

```typescript
export function isWorldwideRemote(job: FilterableJob): boolean {
  return analyzeWorldwideRemote(job).pass;
}
```

This keeps all existing call sites working unchanged.

- [ ] **Step 3: Verify existing scraper still works**

Run: `npx tsx scripts/scrape.ts`
Expected: Same 67 jobs (no behavior change, just refactored internals)

- [ ] **Step 4: Commit**

```bash
git add src/lib/filter.ts
git commit -m "refactor: add rejection reason tracking to worldwide filter"
```

---

### Task 2: Build the audit filter script

**Files:**
- Create: `scripts/audit-filter.ts`

This script runs the scraper in dry-run mode, logging every rejected job with its rejection reason.

- [ ] **Step 1: Create `scripts/audit-filter.ts`**

The script imports each ATS scraper's raw fetch logic (or re-fetches a subset of companies) and runs `analyzeWorldwideRemote` + `categorizeJob` on every job, collecting rejection stats.

For efficiency, only sample 50 companies from each ATS (not all 1,265). Focus on companies that have many raw jobs.

```typescript
#!/usr/bin/env npx tsx
/**
 * Audit filter — reveals what the worldwide filter is dropping and why.
 * Samples companies and logs rejected jobs grouped by rejection reason.
 *
 * Usage: npx tsx scripts/audit-filter.ts
 */

import { analyzeWorldwideRemote, FilterResult } from "../src/lib/filter";
import { categorizeJob } from "../src/lib/categorize";
import { REMOTE_COMPANIES } from "../src/lib/companies";
import { fetchWithRetry } from "../src/lib/fetch-retry";

interface RejectedJob {
  title: string;
  company: string;
  location: string;
  reason: string;
  descSnippet: string;
}

async function main() {
  const rejected: RejectedJob[] = [];
  const reasonCounts: Record<string, number> = {};
  let totalScanned = 0;
  let totalPassed = 0;
  let totalCategoryRejected = 0;

  // Sample: first 30 Greenhouse companies (they have the most jobs)
  const ghCompanies = REMOTE_COMPANIES
    .filter(c => c.atsType === "greenhouse" && c.atsSlug)
    .slice(0, 30);

  console.log(`[audit] sampling ${ghCompanies.length} greenhouse companies...`);

  for (const company of ghCompanies) {
    try {
      const res = await fetchWithRetry(
        `https://boards-api.greenhouse.io/v1/boards/${company.atsSlug}/jobs?content=true`,
        { headers: { "User-Agent": "worldglide-audit/1.0" }, timeoutMs: 15000 }
      );
      if (!res.ok) continue;
      const data = await res.json();
      const items = data.jobs || [];

      for (const item of items) {
        totalScanned++;
        const locationName = item.location?.name || "";
        const content = item.content || "";
        const descPlain = content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

        const filterResult = analyzeWorldwideRemote({
          title: item.title,
          description: descPlain,
          location: locationName,
        });

        if (!filterResult.pass) {
          reasonCounts[filterResult.reason] = (reasonCounts[filterResult.reason] || 0) + 1;
          // Keep first 200 rejections for detailed log
          if (rejected.length < 200) {
            rejected.push({
              title: item.title || "",
              company: company.name,
              location: locationName,
              reason: filterResult.reason,
              descSnippet: descPlain.slice(0, 100),
            });
          }
          continue;
        }

        // Filter passed — check category
        const category = categorizeJob(item.title);
        if (!category) {
          totalCategoryRejected++;
          reasonCounts["category_rejected"] = (reasonCounts["category_rejected"] || 0) + 1;
          if (rejected.length < 200) {
            rejected.push({
              title: item.title || "",
              company: company.name,
              location: locationName,
              reason: "category_rejected",
              descSnippet: descPlain.slice(0, 100),
            });
          }
          continue;
        }

        totalPassed++;
      }
    } catch (e) {
      // skip failed companies
    }

    // Rate limit
    await new Promise(r => setTimeout(r, 300));
  }

  // --- Print report ---
  console.log(`\n=== AUDIT REPORT ===`);
  console.log(`Scanned: ${totalScanned} jobs from ${ghCompanies.length} companies`);
  console.log(`Passed: ${totalPassed} (${(totalPassed / totalScanned * 100).toFixed(1)}%)`);
  console.log(`Category rejected: ${totalCategoryRejected}`);
  console.log(`\n--- Rejection Reasons ---`);
  for (const [reason, count] of Object.entries(reasonCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${reason}: ${count} (${(count / totalScanned * 100).toFixed(1)}%)`);
  }

  console.log(`\n--- Sample Rejected Jobs (worldwide filter passed but interesting) ---`);
  const worldwideRejections = rejected.filter(r =>
    r.reason !== "category_rejected" &&
    r.reason !== "no_remote_keyword"
  ).slice(0, 30);
  for (const r of worldwideRejections) {
    console.log(`  [${r.reason}] ${r.title} @ ${r.company} | loc: "${r.location}"`);
  }

  console.log(`\n--- Category Rejections (worldwide passed, category failed) ---`);
  const catRejections = rejected.filter(r => r.reason === "category_rejected").slice(0, 20);
  for (const r of catRejections) {
    console.log(`  ${r.title} @ ${r.company}`);
  }
}

main().catch(err => {
  console.error("[audit] fatal:", err);
  process.exit(1);
});
```

- [ ] **Step 2: Run the audit script**

Run: `npx tsx scripts/audit-filter.ts`
Expected: Report showing rejection reasons breakdown + sample rejected jobs.

Examine the output to identify:
- Location patterns not in `WORLDWIDE_EXACT_LOCATIONS` that should be
- Jobs rejected at "no_worldwide_signal" that have worldwide signals in descriptions
- False negatives from structural patterns

- [ ] **Step 3: Commit**

```bash
git add scripts/audit-filter.ts
git commit -m "feat: add filter audit script to reveal false negatives"
```

---

### Task 3: Improve filter based on audit findings

**Files:**
- Modify: `src/lib/filter.ts`

Based on the audit output, make targeted improvements.

- [ ] **Step 1: Expand `WORLDWIDE_EXACT_LOCATIONS`**

Add patterns discovered from the audit. Common ones likely to appear:
```typescript
// New patterns to add:
"distributed",
"remote-first",
"remote first",
"remote / hq optional",
"remote, flexible",
"no office",
"remote (flexible)",
"remote - flexible location",
"home office",
```

- [ ] **Step 2: Expand worldwide signal keywords for description scanning (Step 5)**

In the `isWorldwideRemote` function, Step 5 checks descriptions when location is empty. Add more signal keywords:

```typescript
const hasWorldwideSignal =
  textToCheck.includes("worldwide") ||
  textToCheck.includes("work from anywhere") ||
  textToCheck.includes("globally") ||
  textToCheck.includes("any location") ||
  textToCheck.includes("no location requirement") ||
  textToCheck.includes("location independent") ||
  // New signals:
  textToCheck.includes("open to candidates globally") ||
  textToCheck.includes("hire from anywhere") ||
  textToCheck.includes("no geographic restriction") ||
  textToCheck.includes("distributed team") ||
  textToCheck.includes("remote friendly") ||
  textToCheck.includes("across the globe");
```

- [ ] **Step 3: Run scraper and compare**

Run: `npx tsx scripts/scrape.ts`
Expected: More than 67 jobs (measuring the delta from filter improvements alone)

- [ ] **Step 4: Commit**

```bash
git add src/lib/filter.ts
git commit -m "feat: expand worldwide location patterns and description signals from audit"
```

---

## Chunk 2: Mass ATS Slug Discovery (Part A)

### Task 4: Build the ATS URL detection and verification utilities

**Files:**
- Create: `scripts/verify-slugs.ts`

Shared utilities for detecting ATS type from URL and verifying slugs against live APIs.

- [ ] **Step 1: Create `scripts/verify-slugs.ts`**

```typescript
/**
 * ATS slug detection and verification utilities.
 * Used by the discovery script to detect ATS type from URLs
 * and verify slugs are alive with active jobs.
 */

export interface DiscoveredCompany {
  name: string;
  domain: string;
  ats: "greenhouse" | "lever" | "ashby" | "workable";
  slug: string;
  jobCount: number;
  source: string;
}

/** Detect ATS type and slug from a careers URL */
export function detectAtsFromUrl(url: string): { ats: string; slug: string } | null {
  const u = url.toLowerCase();

  // Greenhouse: boards.greenhouse.io/{slug} or job-boards.greenhouse.io/{slug}
  let m = u.match(/(?:boards|job-boards)\.greenhouse\.io\/([a-z0-9_-]+)/);
  if (m) return { ats: "greenhouse", slug: m[1] };

  // Lever: jobs.lever.co/{slug}
  m = u.match(/jobs\.lever\.co\/([a-z0-9_.-]+)/);
  if (m) return { ats: "lever", slug: m[1] };

  // Ashby: jobs.ashbyhq.com/{slug}
  m = u.match(/jobs\.ashbyhq\.com\/([a-z0-9_-]+)/);
  if (m) return { ats: "ashby", slug: m[1] };

  // Workable: apply.workable.com/{slug}
  m = u.match(/apply\.workable\.com\/([a-z0-9_-]+)/);
  if (m) return { ats: "workable", slug: m[1] };

  return null;
}

const ATS_API_URLS: Record<string, (slug: string) => string> = {
  greenhouse: (slug) => `https://boards-api.greenhouse.io/v1/boards/${slug}/jobs`,
  lever: (slug) => `https://api.lever.co/v0/postings/${slug}`,
  ashby: (slug) => `https://api.ashbyhq.com/posting-api/job-board/${slug}`,
  workable: (slug) => `https://apply.workable.com/api/v1/widget/accounts/${slug}`,
};

/** Verify a single ATS slug is alive and return job count */
export async function verifySlug(
  ats: string,
  slug: string
): Promise<number | null> {
  const urlFn = ATS_API_URLS[ats];
  if (!urlFn) return null;

  try {
    const res = await fetch(urlFn(slug), {
      headers: { "User-Agent": "worldglide-discover/1.0" },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    // All APIs return { jobs: [...] } or a direct array
    const jobs = Array.isArray(data) ? data : (data.jobs || data.results || []);
    return jobs.length;
  } catch {
    return null;
  }
}

/** Batch verify slugs with rate limiting. Returns only verified ones. */
export async function batchVerify(
  candidates: { name: string; domain: string; ats: string; slug: string; source: string }[],
  concurrency = 10,
  delayMs = 200
): Promise<DiscoveredCompany[]> {
  const verified: DiscoveredCompany[] = [];

  for (let i = 0; i < candidates.length; i += concurrency) {
    const batch = candidates.slice(i, i + concurrency);
    const results = await Promise.allSettled(
      batch.map(async (c) => {
        const count = await verifySlug(c.ats, c.slug);
        return { ...c, jobCount: count };
      })
    );

    for (const r of results) {
      if (r.status === "fulfilled" && r.value.jobCount !== null && r.value.jobCount > 0) {
        verified.push(r.value as DiscoveredCompany);
      }
    }

    if (i + concurrency < candidates.length) {
      await new Promise(r => setTimeout(r, delayMs));
    }

    // Progress
    const done = Math.min(i + concurrency, candidates.length);
    process.stdout.write(`\r  verified ${done}/${candidates.length}...`);
  }
  console.log();

  return verified;
}
```

- [ ] **Step 2: Quick test — verify a known slug**

Run inline test:
```bash
npx tsx -e "import { verifySlug, detectAtsFromUrl } from './scripts/verify-slugs'; async function main() { console.log(detectAtsFromUrl('https://boards.greenhouse.io/gitlab')); console.log(await verifySlug('greenhouse', 'gitlab')); } main();"
```
Expected: `{ ats: 'greenhouse', slug: 'gitlab' }` and a number > 0.

- [ ] **Step 3: Commit**

```bash
git add scripts/verify-slugs.ts
git commit -m "feat: add ATS slug detection and batch verification utilities"
```

---

### Task 5: Build discovery sources

**Files:**
- Create: `scripts/discover-sources.ts`

Each source returns `{ name, domain, ats, slug, source }[]` candidates.

- [ ] **Step 1: Create `scripts/discover-sources.ts` with GitHub awesome-lists source**

Start with the easiest, highest-value source: GitHub awesome-remote-jobs lists.

```typescript
/**
 * Discovery sources — each function fetches a remote company list
 * and returns candidate ATS slugs to verify.
 */
import { detectAtsFromUrl } from "./verify-slugs";

export interface Candidate {
  name: string;
  domain: string;
  ats: string;
  slug: string;
  source: string;
}

/**
 * Source 1: GitHub awesome-remote lists
 * Fetches markdown from curated repos, extracts ATS URLs.
 */
export async function discoverFromGitHubLists(): Promise<Candidate[]> {
  const repos = [
    // remoteintech/remote-jobs — 851 companies in individual markdown files
    "https://api.github.com/repos/remoteintech/remote-jobs/contents/company-profiles",
    // yanirs/established-remote — single README
    "https://raw.githubusercontent.com/yanirs/established-remote/master/README.md",
    // fireball787b/awesome-remote-companies
    "https://raw.githubusercontent.com/fireball787b/awesome-remote-companies/main/README.md",
  ];

  const candidates: Candidate[] = [];

  // --- remoteintech: fetch directory listing, then each file ---
  try {
    console.log("  [github] fetching remoteintech company profiles...");
    const dirRes = await fetch(repos[0], {
      headers: {
        "User-Agent": "worldglide-discover/1.0",
        "Accept": "application/vnd.github.v3+json",
      },
      signal: AbortSignal.timeout(15000),
    });
    if (dirRes.ok) {
      const files: { name: string; download_url: string }[] = await dirRes.json();
      const mdFiles = files.filter(f => f.name.endsWith(".md"));
      console.log(`  [github] found ${mdFiles.length} company files, scanning...`);

      // Batch fetch files
      for (let i = 0; i < mdFiles.length; i += 20) {
        const batch = mdFiles.slice(i, i + 20);
        const results = await Promise.allSettled(
          batch.map(async (f) => {
            const r = await fetch(f.download_url, { signal: AbortSignal.timeout(8000) });
            if (!r.ok) return null;
            return { name: f.name.replace(".md", ""), content: await r.text() };
          })
        );

        for (const r of results) {
          if (r.status !== "fulfilled" || !r.value) continue;
          const { name, content } = r.value;
          // Extract all URLs and check for ATS patterns
          const urls = content.match(/https?:\/\/[^\s)>"]+/g) || [];
          for (const url of urls) {
            const detected = detectAtsFromUrl(url);
            if (detected) {
              // Extract domain from other URLs in the file
              const domainMatch = content.match(/https?:\/\/(www\.)?([a-z0-9.-]+\.[a-z]{2,})/i);
              const domain = domainMatch ? domainMatch[2] : "";
              candidates.push({
                name,
                domain,
                ats: detected.ats,
                slug: detected.slug,
                source: "github-remoteintech",
              });
              break; // one slug per company
            }
          }
        }

        if (i + 20 < mdFiles.length) {
          await new Promise(r => setTimeout(r, 500)); // GitHub rate limit
        }
      }
    }
  } catch (e) {
    console.error("  [github] remoteintech failed:", e);
  }

  // --- Other GitHub lists: fetch README, scan for ATS URLs ---
  for (const url of repos.slice(1)) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
      if (!res.ok) continue;
      const content = await res.text();
      const urls = content.match(/https?:\/\/[^\s)>"]+/g) || [];
      for (const rawUrl of urls) {
        const detected = detectAtsFromUrl(rawUrl);
        if (detected) {
          candidates.push({
            name: detected.slug, // best we have from a README
            domain: "",
            ats: detected.ats,
            slug: detected.slug,
            source: "github-list",
          });
        }
      }
    } catch (e) {
      console.error(`  [github] failed to fetch ${url}`);
    }
  }

  console.log(`  [github] found ${candidates.length} candidates`);
  return candidates;
}

/**
 * Source 2: YC Startup Directory
 * Fetches from YC's public API/page, extracts careers URLs.
 */
export async function discoverFromYC(): Promise<Candidate[]> {
  const candidates: Candidate[] = [];

  try {
    console.log("  [yc] fetching YC startup directory...");
    // YC has a public algolia-powered API
    const res = await fetch(
      "https://45bwzj1sgc-dsn.algolia.net/1/indexes/YCCompany_production/browse?" +
      "attributesToRetrieve=name,website,long_description,one_liner,batch,status,tags,highlight_black" +
      "&filters=highlight_black%3Atrue" +
      "&hitsPerPage=1000",
      {
        headers: {
          "X-Algolia-Application-Id": "45BWZJ1SGC",
          "X-Algolia-API-Key": "MjBjYjRiMzY0NzdhZWY0NjExY2NhZjYxMGIxYjc2MTAwNWFkNTkwNTc4NjgxYjU0YzFhYjQ2NDMzNGU5OTczZXJlc3RyaWN0SW5kaWNlcz0lNUIlMjJZQ0NvbXBhbnlfcHJvZHVjdGlvbiUyMiUyQyUyMllDQ29tcGFueV9CeV9MYXVuY2hfRGF0ZV9wcm9kdWN0aW9uJTIyJTVEJnRhZ0ZpbHRlcnM9JTVCJTIyeWNkY19wdWJsaWMlMjIlNUQmYW5hbHl0aWNzVGFncz0lNUIlMjJ5Y2RjJTIyJTVE",
        },
        signal: AbortSignal.timeout(15000),
      }
    );

    if (res.ok) {
      const data = await res.json();
      const hits = data.hits || [];
      console.log(`  [yc] got ${hits.length} companies, scanning websites...`);

      // For each company, try to find their ATS from website domain
      for (const hit of hits) {
        if (!hit.website) continue;
        const domain = hit.website.replace(/^https?:\/\/(www\.)?/, "").replace(/\/.*/, "");

        // Try common careers URL patterns
        const slugGuesses = [
          domain.replace(/\..*/, ""), // "stripe.com" -> "stripe"
          domain.replace(/\./g, ""), // "cockroachlabs.com" -> "cockroachlabscom"
          hit.name?.toLowerCase().replace(/[^a-z0-9]/g, ""), // "Stripe" -> "stripe"
        ].filter(Boolean);

        // We can't actually check all careers pages — too slow.
        // Instead, try the slug against GH/Lever/Ashby APIs directly.
        for (const slug of slugGuesses) {
          if (slug) {
            candidates.push({
              name: hit.name || slug,
              domain,
              ats: "greenhouse", // we'll try all platforms in verify step
              slug,
              source: "yc-directory",
            });
          }
        }
      }
    }
  } catch (e) {
    console.error("  [yc] failed:", e);
  }

  console.log(`  [yc] generated ${candidates.length} slug guesses`);
  return candidates;
}

/**
 * Source 3: Google search harvest
 * Uses web search to find ATS board URLs.
 */
export async function discoverFromSearchHarvest(): Promise<Candidate[]> {
  // This source is best run manually or via a search API.
  // For now, return empty — can be populated by manual search results.
  console.log("  [search] skipped (requires manual search results)");
  return [];
}
```

- [ ] **Step 2: Commit**

```bash
git add scripts/discover-sources.ts
git commit -m "feat: add discovery sources — GitHub lists + YC directory"
```

---

### Task 6: Build the main discovery orchestrator

**Files:**
- Create: `scripts/discover.ts`

- [ ] **Step 1: Create `scripts/discover.ts`**

```typescript
#!/usr/bin/env npx tsx
/**
 * ATS Slug Discovery Pipeline
 *
 * Discovers new company ATS slugs from multiple web sources,
 * verifies them against live APIs, dedupes against existing companies,
 * and outputs a merge-ready JSON file.
 *
 * Usage:
 *   npx tsx scripts/discover.ts              # discover + verify
 *   npx tsx scripts/discover.ts --merge      # merge into companies.ts
 */

import { REMOTE_COMPANIES } from "../src/lib/companies";
import { DiscoveredCompany, batchVerify, verifySlug } from "./verify-slugs";
import { Candidate, discoverFromGitHubLists, discoverFromYC } from "./discover-sources";
import { writeFileSync, readFileSync, existsSync } from "fs";
import { join } from "path";

const OUTPUT_PATH = join(process.cwd(), "scripts", "discovered-companies.json");

async function discover() {
  console.log("[discover] starting multi-source discovery...\n");

  // --- Step 1: Gather candidates from all sources ---
  const allCandidates: Candidate[] = [];

  const githubResults = await discoverFromGitHubLists();
  allCandidates.push(...githubResults);

  const ycResults = await discoverFromYC();
  allCandidates.push(...ycResults);

  console.log(`\n[discover] total raw candidates: ${allCandidates.length}`);

  // --- Step 2: Dedupe against existing companies ---
  const existingSlugs = new Set(
    REMOTE_COMPANIES.map(c => `${c.atsType}:${c.atsSlug}`)
  );

  // Also dedupe within candidates
  const seen = new Set<string>();
  const newCandidates = allCandidates.filter(c => {
    const key = `${c.ats}:${c.slug}`;
    if (existingSlugs.has(key) || seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  console.log(`[discover] after deduping: ${newCandidates.length} new candidates`);

  // --- Step 3: For YC candidates, try multiple ATS platforms ---
  const expandedCandidates: Candidate[] = [];
  for (const c of newCandidates) {
    if (c.source === "yc-directory") {
      // YC candidates are slug guesses — try all 4 platforms
      for (const ats of ["greenhouse", "lever", "ashby", "workable"] as const) {
        const key = `${ats}:${c.slug}`;
        if (!existingSlugs.has(key) && !seen.has(key)) {
          expandedCandidates.push({ ...c, ats });
          seen.add(key);
        }
      }
    } else {
      expandedCandidates.push(c);
    }
  }

  console.log(`[discover] expanded to ${expandedCandidates.length} candidates (multi-platform for YC)`);

  // --- Step 4: Verify against live APIs ---
  console.log(`[discover] verifying against live APIs...`);
  const verified = await batchVerify(expandedCandidates, 10, 200);

  console.log(`\n[discover] verified: ${verified.length} companies with active jobs`);

  // --- Step 5: Sort by job count and save ---
  verified.sort((a, b) => b.jobCount - a.jobCount);

  writeFileSync(OUTPUT_PATH, JSON.stringify(verified, null, 2));
  console.log(`[discover] saved to ${OUTPUT_PATH}`);

  // Summary
  console.log(`\n=== DISCOVERY SUMMARY ===`);
  console.log(`Sources scanned: 2 (GitHub lists, YC directory)`);
  console.log(`Raw candidates: ${allCandidates.length}`);
  console.log(`After dedup: ${newCandidates.length}`);
  console.log(`Verified with jobs: ${verified.length}`);
  const totalJobs = verified.reduce((sum, c) => sum + c.jobCount, 0);
  console.log(`Total raw jobs across new companies: ${totalJobs}`);
  console.log(`\nTop 20 by job count:`);
  for (const c of verified.slice(0, 20)) {
    console.log(`  ${c.name} (${c.ats}/${c.slug}) — ${c.jobCount} jobs [${c.source}]`);
  }
}

async function merge() {
  if (!existsSync(OUTPUT_PATH)) {
    console.error("[merge] no discovered-companies.json found. Run discover first.");
    process.exit(1);
  }

  const discovered: DiscoveredCompany[] = JSON.parse(readFileSync(OUTPUT_PATH, "utf-8"));
  console.log(`[merge] found ${discovered.length} companies to merge`);

  // Read existing companies.ts
  const companiesPath = join(process.cwd(), "src", "lib", "companies.ts");
  let content = readFileSync(companiesPath, "utf-8");

  // Group by ATS type
  const byAts: Record<string, DiscoveredCompany[]> = {};
  for (const c of discovered) {
    (byAts[c.ats] = byAts[c.ats] || []).push(c);
  }

  const today = new Date().toISOString().split("T")[0];

  for (const [ats, companies] of Object.entries(byAts)) {
    const lines = companies.map(c => {
      const domain = c.domain || `${c.slug}.com`;
      const careersUrl = {
        greenhouse: `https://boards.greenhouse.io/${c.slug}`,
        lever: `https://jobs.lever.co/${c.slug}`,
        ashby: `https://jobs.ashbyhq.com/${c.slug}`,
        workable: `https://apply.workable.com/${c.slug}`,
      }[ats] || "";
      return `  { name: "${c.name}", domain: "${domain}", careersUrl: "${careersUrl}", atsType: "${ats}", atsSlug: "${c.slug}" },`;
    }).join("\n");

    const marker = `// imported ${today} (auto-discovered)\n${lines}`;

    // Insert before the section divider for the NEXT ATS platform
    // For simplicity, append before the closing ];
    content = content.replace(
      /\n\];/,
      `\n\n  ${marker}\n];`
    );
  }

  writeFileSync(companiesPath, content);
  console.log(`[merge] updated ${companiesPath}`);
  console.log(`[merge] added ${discovered.length} companies`);
  console.log(`[merge] run 'npx tsx scripts/scrape.ts' to fetch jobs from new companies`);
}

// --- CLI ---
const args = process.argv.slice(2);
if (args.includes("--merge")) {
  merge().catch(err => { console.error("[merge] fatal:", err); process.exit(1); });
} else {
  discover().catch(err => { console.error("[discover] fatal:", err); process.exit(1); });
}
```

- [ ] **Step 2: Run discovery**

Run: `npx tsx scripts/discover.ts`
Expected: Finds 100+ new verified companies with active jobs. Saves to `scripts/discovered-companies.json`.

- [ ] **Step 3: Review output quality**

Check `scripts/discovered-companies.json` — make sure companies look legitimate and slugs are correct.

- [ ] **Step 4: Commit**

```bash
git add scripts/discover.ts
git commit -m "feat: add main discovery orchestrator with GitHub + YC sources"
```

---

### Task 7: Merge, scrape, and publish

- [ ] **Step 1: Merge discovered companies**

Run: `npx tsx scripts/discover.ts --merge`
Expected: Updates `src/lib/companies.ts` with new entries.

- [ ] **Step 2: Run full scrape**

Run: `npx tsx scripts/scrape.ts`
Expected: Significantly more than 67 worldwide jobs.

- [ ] **Step 3: Build and verify**

Run: `npm run build`
Expected: Clean build with no errors.

Start dev server and spot-check the site — new companies appearing, jobs look correct, no country-specific leaks.

- [ ] **Step 4: Commit and push**

```bash
git add src/lib/companies.ts public/data/jobs.json public/data/stats.json
git commit -m "feat: add auto-discovered companies, scrape with improved filter

discovery found N new companies across greenhouse/lever/ashby/workable.
filter improvements rescued M additional worldwide jobs.
total: X worldwide jobs (up from 67)."
git push origin main
```

- [ ] **Step 5: Verify deployed site**

Wait 2-3 minutes for GitHub Actions deploy, then check worldglide.careers.
Verify: more jobs visible, all genuinely worldwide, no quality regression.
