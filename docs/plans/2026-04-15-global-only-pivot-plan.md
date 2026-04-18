# Worldglide v6 — Global-Only Pivot Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Pivot worldglide.careers from a multi-region creative board to a single-direction global-only creative board. Strip regional UI, narrow the category filter, hard-cut non-WW jobs at scrape time, and heavily expand sourcing (new aggregators + ATS whitelist).

**Architecture:** The hard cut happens at scrape-write time in `scripts/scrape.ts` (single choke point). Filter and classifier keep their existing logic — we only drop the non-WW output. UI simplification removes vestigial regional affordances. Sourcing expansion adds 5+ new scrapers and 30+ new companies.

**Tech Stack:** Next.js 16.1.6 (static export), TypeScript, Tailwind, Node/tsx scrapers, GitHub Pages + GitHub Actions cron, Formspree submissions.

**Reference:** Design doc at [2026-04-15-global-only-pivot-design.md](./2026-04-15-global-only-pivot-design.md).

---

## Phase 1 — Categorizer pruning

### Task 1: Drop non-tech creative patterns from categorizer

**Files:**
- Modify: `src/lib/categorize.ts:164-208`

**Step 1: Remove these patterns from `CREATIVE_PATTERNS`**

Delete the following regex entries (preserve array syntax, remove the lines):
```
/\bmotion\s+design/i,
/\bmotion\s+graphic/i,
/\banimator\b/i,
/\b3d\s+(artist|designer|generalist)\b/i,
/\billustrat/i,
/\bgame\s+designer?\b/i,
/\bsound\s+designer?\b/i,
/\blearning\s+(experience|design)\b/i,
```

**Step 2: Verify remaining patterns compile**

Run: `npx tsc --noEmit`
Expected: no errors.

**Step 3: Spot-check with node repl**

Run:
```
node --import tsx -e "import('./src/lib/categorize.ts').then(m => {
  console.log('motion designer →', m.categorizeJob('Senior Motion Designer'));
  console.log('3d artist →', m.categorizeJob('3D Artist'));
  console.log('illustrator →', m.categorizeJob('Illustrator'));
  console.log('game designer →', m.categorizeJob('Game Designer'));
  console.log('sound designer →', m.categorizeJob('Sound Designer'));
  console.log('instructional designer →', m.categorizeJob('Instructional Designer'));
  console.log('product designer →', m.categorizeJob('Senior Product Designer'));
  console.log('creative director →', m.categorizeJob('Creative Director'));
  console.log('ux researcher →', m.categorizeJob('Senior UX Researcher'));
  console.log('design engineer →', m.categorizeJob('Design Engineer'));
})"
```
Expected: first 6 print `null`, last 4 print `creative`.

**Step 4: Commit**

```
git add src/lib/categorize.ts
git commit -m "filter: drop non-tech crafts from creative categorizer

Motion, 3D, illustration, game, sound, instructional/learning removed.
Focus narrows to tech design + creative direction per v6 design."
```

---

## Phase 2 — UI simplification

### Task 2: Update hero copy (H1 + subtitle + stats line)

**Files:**
- Modify: `src/app/page.tsx:28-39`

**Step 1: Replace the hero section**

Replace lines 28–40 with:
```tsx
      {/* hero */}
      <section className="pt-16 md:pt-24 pb-16">
        <h1 className="text-[32px] md:text-[40px] font-medium tracking-tight leading-[1.1] text-[var(--color-text)]">
          freshly baked design jobs
          <br />
          for humans without limits.
        </h1>
        <p className="text-[12px] text-[var(--color-text-muted)] mt-4 max-w-[360px] leading-relaxed">
          hand-picked, truly global creative roles. product design, ui, ux, creative direction. open to candidates anywhere in the world. sourced from the world&apos;s best tech companies, startups, &amp; studios.
        </p>
        <p className="text-[10px] text-[var(--color-text-muted)] mt-4 font-mono leading-relaxed max-w-[400px]">
          {stats ? `${displayedJobs.length} global remote design jobs sourced from ${SCRAPED_COMPANY_COUNT} top remote-first companies & ${JOB_BOARD_COUNT} job boards` : "—"}
        </p>
      </section>
```

**Step 2: Add `JOB_BOARD_COUNT` constant**

At the top of `src/lib/companies.ts` (near `SCRAPED_COMPANY_COUNT`), add:
```ts
// Number of external aggregator scrapers we run (keep in sync with api-aggregator.ts).
export const JOB_BOARD_COUNT = 8;
```

**Step 3: Import the constant**

In `src/app/page.tsx:8`, extend the import:
```ts
import { SCRAPED_COMPANY_COUNT, JOB_BOARD_COUNT } from "@/lib/companies";
```

**Step 4: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors.

**Step 5: Commit**

```
git add src/app/page.tsx src/lib/companies.ts
git commit -m "ui: update hero to design-jobs framing w/ board count"
```

---

### Task 3: Remove regional filter logic from home page

**Files:**
- Modify: `src/app/page.tsx:1-47`

**Step 1: Simplify the component**

Replace the entire file with:
```tsx
"use client";

import { useEffect, useState } from "react";
import JobList from "@/components/JobList";
import { getJobs, getStats, ScrapeStats } from "@/lib/storage";
import { Job } from "@/lib/types";
import { SCRAPED_COMPANY_COUNT, JOB_BOARD_COUNT } from "@/lib/companies";

export default function HomePage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [stats, setStats] = useState<ScrapeStats | null>(null);

  useEffect(() => {
    getJobs().then((all) => setJobs(all.filter((j) => !j.expired)));
    getStats().then(setStats);
  }, []);

  return (
    <div className="max-w-[960px] mx-auto px-8">
      <section className="pt-16 md:pt-24 pb-16">
        <h1 className="text-[32px] md:text-[40px] font-medium tracking-tight leading-[1.1] text-[var(--color-text)]">
          freshly baked design jobs
          <br />
          for humans without limits.
        </h1>
        <p className="text-[12px] text-[var(--color-text-muted)] mt-4 max-w-[360px] leading-relaxed">
          hand-picked, truly global creative roles. product design, ui, ux, creative direction. open to candidates anywhere in the world. sourced from the world&apos;s best tech companies, startups, &amp; studios.
        </p>
        <p className="text-[10px] text-[var(--color-text-muted)] mt-4 font-mono leading-relaxed max-w-[400px]">
          {stats ? `${jobs.length} global remote design jobs sourced from ${SCRAPED_COMPANY_COUNT} top remote-first companies & ${JOB_BOARD_COUNT} job boards` : "—"}
        </p>
      </section>

      <section className="pb-24">
        <JobList jobs={jobs} />
      </section>
    </div>
  );
}
```

Key changes vs. Task 2: removed `useSearchParams`, `Region` import, `activeRegion`, `displayedJobs` — every job on the board is now global, so no filter is needed.

**Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors.

**Step 3: Commit**

```
git add src/app/page.tsx
git commit -m "ui: drop region filter from home page"
```

---

### Task 4: Strip regional nav from Header

**Files:**
- Modify: `src/components/Header.tsx`

**Step 1: Replace the component**

Replace the entire file with:
```tsx
"use client";

import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useCallback } from "react";
import ThemeToggle from "./ThemeToggle";
import { useFavorites } from "@/lib/useFavorites";

export default function Header() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { count } = useFavorites();
  const savedActive = searchParams.get("saved") === "1";

  const toggleSaved = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (savedActive) {
      params.delete("saved");
    } else {
      params.set("saved", "1");
    }
    const q = params.toString();
    router.push(pathname + (q ? `?${q}` : ""));
  }, [savedActive, searchParams, pathname, router]);

  return (
    <header className="sticky top-0 z-50 bg-[var(--color-bg)]">
      <div className="max-w-[960px] mx-auto px-8">
        <div className="flex items-center h-[48px]">
          <span className="mr-[8px]">
            <ThemeToggle />
          </span>
          <a href="/" className="text-[14px] font-medium tracking-tight text-[var(--color-text)] no-underline">
            worldglide
          </a>

          <div className="ml-auto flex items-center gap-6">
            {count > 0 && (
              <button
                onClick={toggleSaved}
                className="text-[12px] text-[var(--color-text)]"
                aria-label={savedActive ? "show all jobs" : "show saved jobs"}
              >
                ❋
              </button>
            )}
            <Link
              href="/submit"
              className="text-[12px] text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            >
              post a job
            </Link>
          </div>
        </div>
      </div>
      <div className="h-px bg-[var(--color-border)]" />
    </header>
  );
}
```

Key changes: removed `REGIONS`, `regionLink`, `setRegion`, `activeRegion`, mobile menu dropdown (all elements fit on one line now), and `useState` import.

**Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors.

**Step 3: Commit**

```
git add src/components/Header.tsx
git commit -m "ui: remove regional nav from header"
```

---

### Task 5: Remove region column from JobList

**Files:**
- Modify: `src/components/JobList.tsx:9`, `:21-26`, `:49-63`

**Step 1: Update the `SortColumn` type**

On line 9, change:
```ts
type SortColumn = "age" | "title" | "company" | "type";
```
to:
```ts
type SortColumn = "age" | "title" | "company";
```

**Step 2: Remove the region column from `COLS`**

Replace lines 21–26:
```ts
const COLS: { key: SortColumn; label: string; cls: string; right?: boolean }[] = [
  { key: "age", label: "age", cls: "w-[32px] shrink-0 hidden sm:block text-left" },
  { key: "title", label: "title", cls: "flex-1 text-left" },
  { key: "company", label: "company", cls: "w-[96px] sm:w-[160px] shrink-0 text-right", right: true },
];
```

**Step 3: Remove the `type` case from the sort switch**

In the `sorted` computation, delete the `case "type":` block entirely (lines 58–59).

**Step 4: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors.

**Step 5: Commit**

```
git add src/components/JobList.tsx
git commit -m "ui: drop redundant region column from job table"
```

---

### Task 6: Remove region cell from JobCard

**Files:**
- Modify: `src/components/JobCard.tsx:63-66`

**Step 1: Delete the region span**

Remove lines 63–66 entirely:
```tsx
      {/* region */}
      <span className="text-[11px] text-[var(--color-text-muted)] w-[80px] shrink-0 hidden lg:block font-mono text-right">
        {job.region === "ww" ? "global" : job.region}
      </span>
```

**Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors.

**Step 3: Commit**

```
git add src/components/JobCard.tsx
git commit -m "ui: drop region cell from job card"
```

---

### Task 7: Remove category button from submit form

**Files:**
- Modify: `src/components/SubmitForm.tsx:11`, `:18`, `:34`, `:102-119`

**Step 1: Delete the CATEGORIES constant**

Remove line 11 (`const CATEGORIES = ["creative"] as const;`).

**Step 2: Delete the category state**

Remove line 18 (`const [category, setCategory] = useState<string>("creative");`).

**Step 3: Hardcode the category in form submission**

Replace line 34 (`formData.set("category", category);`) with:
```ts
formData.set("category", "creative");
```

**Step 4: Remove the category button UI**

Delete lines 102–119 entirely (the `<div>` containing the category buttons).

**Step 5: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors.

**Step 6: Commit**

```
git add src/components/SubmitForm.tsx
git commit -m "ui: remove redundant category selector from submit form"
```

---

### Task 8: Update page metadata

**Files:**
- Modify: `src/app/layout.tsx:17-25`

**Step 1: Replace the metadata export**

Replace lines 16–26:
```ts
export const metadata: Metadata = {
  title: "worldglide · design jobs for humans without limits",
  description:
    "hand-picked, truly global creative roles. product design, ui, ux, creative direction. open to candidates anywhere in the world.",
  openGraph: {
    title: "worldglide · design jobs for humans without limits",
    description:
      "hand-picked, truly global creative roles. product design, ui, ux, creative direction. open to candidates anywhere in the world.",
    type: "website",
  },
};
```

**Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors.

**Step 3: Commit**

```
git add src/app/layout.tsx
git commit -m "ui: update page title + og tags to design-jobs framing"
```

---

### Task 9: Preview-verify UI changes

**Step 1: Start dev server** (if not already running)

Use the preview tool: `preview_start`.

**Step 2: Screenshot the home page**

Use `preview_screenshot` at the root URL. Verify:
- Header shows only `worldglide · post a job · theme toggle`.
- Hero shows new H1 "freshly baked design jobs / for humans without limits."
- Subtitle shows the new copy.
- Stats line shows "N global remote design jobs sourced from C top remote-first companies & B job boards."
- Job table has no "region" column header, no region cell per row.

**Step 3: Check the submit page**

Navigate to `/submit`, screenshot. Verify the category button is gone and the form looks clean.

**Step 4: Check console logs**

Use `preview_console_logs` — expect no errors.

**Step 5: If anything looks wrong**

Return to the relevant task, fix, re-verify. Do NOT proceed to Phase 3 until all UI changes visually pass.

---

## Phase 3 — Scraper hard-cut

### Task 10: Drop non-WW jobs at scrape-write time

**Files:**
- Modify: `scripts/scrape.ts:19-45`

**Step 1: Filter jobs before writing**

Replace the body of `main()` (lines 15–50):
```ts
async function main() {
  const startTime = Date.now();
  console.log("[scrape] starting standalone scrape...");

  const { jobs: allJobs, report } = await scrapeAllSources();

  // Hard-cut: only worldwide jobs ship to production.
  // Non-WW jobs are still categorized and logged for visibility, but dropped.
  const jobs = allJobs.filter((j) => j.region === "ww");
  const dropped = allJobs.length - jobs.length;

  const outDir = join(process.cwd(), "public", "data");
  mkdirSync(outDir, { recursive: true });

  writeFileSync(
    join(outDir, "jobs.json"),
    JSON.stringify(jobs, null, 2)
  );

  const stats = {
    rawJobsScanned: report.rawJobsTotal,
    creativeJobs: jobs.length,
    companiesScraped: report.companies,
    lastUpdated: new Date().toISOString(),
  };

  writeFileSync(
    join(outDir, "stats.json"),
    JSON.stringify(stats, null, 2)
  );

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`[scrape] done in ${elapsed}s`);
  console.log(`[scrape] ${jobs.length} global jobs kept, ${dropped} regional jobs dropped`);
  console.log(`[scrape] ${report.rawJobsTotal} total scanned → ${allJobs.length} creative → ${jobs.length} global`);
  if (report.failed > 0) {
    console.log(`[scrape] ${report.failed} companies failed`);
  }
  console.log(`[scrape] written to ${outDir}/`);
}
```

**Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors.

**Step 3: Commit**

```
git add scripts/scrape.ts
git commit -m "scrape: hard-cut to region=ww before writing jobs.json"
```

---

## Phase 4 — Dead ATS slug prune

### Task 11: Identify 404-returning companies

**Step 1: Run a full scrape and capture failures**

Run: `npx tsx scripts/scrape.ts 2>&1 | tee /tmp/scrape-log.txt`

Expected: takes ~2–5 minutes. Completes with a summary line reporting failed companies.

**Step 2: Extract the 404 company list**

Run: `grep -E "(404|not found|NOT FOUND)" /tmp/scrape-log.txt | head -40`

Copy the slugs that are consistently 404-ing.

**Step 3: Spot-verify each 404**

For each suspected 404 slug, curl the endpoint manually. Example for greenhouse:
`curl -I "https://boards-api.greenhouse.io/v1/boards/<slug>/jobs"`

Expected for dead slugs: HTTP 404. Keep only those.

### Task 12: Remove confirmed dead slugs from companies.ts

**Files:**
- Modify: `src/lib/companies.ts`

**Step 1: Delete entries for each confirmed 404**

For each confirmed-dead company, grep for its entry and remove the object from the `REMOTE_COMPANIES` array. If a company is mentioned in the `SCRAPED_COMPANY_COUNT` filter or exports, those will auto-adjust.

**Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors.

**Step 3: Run a quick scrape to confirm no new breakage**

Run: `npx tsx scripts/scrape.ts 2>&1 | tail -20`
Expected: scrape completes, failed-companies count should drop by approximately the number we removed.

**Step 4: Commit**

```
git add src/lib/companies.ts
git commit -m "data: prune dead ATS slugs (confirmed 404s)"
```

---

## Phase 5 — ATS whitelist expansion

### Task 13: Verify candidate companies have live ATS endpoints

**Step 1: For each candidate below, curl the likely endpoint**

Candidates to verify (order of priority):

Remote-first SaaS / dev tools:
- Superlist, Campsite, Tana, Arc, Height, Raycast, Cursor, Mercury, Ramp, Attio, PostHog, Plain, Slite, Fathom Analytics, Zapier, GitLab, Automattic, Buffer, Doist, Baremetrics, Basecamp, Typeform, WorkOS, Tines, Sanity, Chatbase, Clerk, Neon, Turso, Liveblocks, Supabase, Ghost.

AI-native:
- OpenAI, Anthropic, Hugging Face, Replicate, Together AI, Perplexity, ElevenLabs, Pika, Runway, Midjourney, Luma.

For each, test common slugs:
```
curl -sI "https://boards-api.greenhouse.io/v1/boards/<slug>/jobs" | head -1
curl -sI "https://api.ashbyhq.com/posting-api/job-board/<slug>" | head -1
curl -sI "https://api.lever.co/v0/postings/<slug>" | head -1
```

Keep slugs that return HTTP 200.

**Step 2: Make a list of verified entries**

Produce a list like:
```
{ name: "Mercury", domain: "mercury.com", careersUrl: "https://mercury.com/jobs", atsType: "greenhouse", atsSlug: "mercury" }
```

### Task 14: Add verified companies to companies.ts in batches

**Files:**
- Modify: `src/lib/companies.ts`

**Step 1: Add 10 entries per batch**

For each batch of 10 verified companies, add their objects to the `REMOTE_COMPANIES` array. Keep entries grouped alphabetically or by ATS type (match existing file convention).

**Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors.

**Step 3: Run a quick scrape on just the added companies**

(No built-in "single-slug" mode — just run the full scrape and inspect new-company yields in the log.)

Run: `npx tsx scripts/scrape.ts 2>&1 | tail -30`
Expected: the new companies appear in the log; at least a fraction produce creative jobs.

**Step 4: Commit each batch**

```
git add src/lib/companies.ts
git commit -m "data: add N remote-first companies (batch X)"
```

Repeat for batches until ~30–50 new companies are in.

### Task 15: Add new companies to filter.ts trusted whitelist where needed

**Files:**
- Modify: `src/lib/filter.ts` (TRUSTED_COMPANIES constant)

**Step 1: Find the trusted list**

Grep: `grep -n "TRUSTED" src/lib/filter.ts` — it lives in the filter file. Add each new company's slug.

**Step 2: Add new slugs**

For every new company whose jobs should be trusted as worldwide when marked "Remote", add to the whitelist array.

**Step 3: Commit**

```
git add src/lib/filter.ts
git commit -m "filter: extend trusted-company whitelist for new remote-firsts"
```

---

## Phase 6 — New source scrapers

Each new scraper is one task. Template for ALL new scrapers:

### New-scraper template

**Step 1: Manually test the endpoint**

In the terminal, `curl` the RSS/API URL. Confirm:
- Returns 200 OK
- Has parseable structure (RSS XML, JSON)
- Contains worldwide-tagged jobs

If the endpoint is hidden (SPA), inspect browser devtools → Network tab to find it.

**Step 2: Create the scraper file**

Model after `src/lib/scrapers/api-weworkremotely.ts` (for RSS) or `src/lib/scrapers/api-jobicy.ts` (for JSON API). Each exports a `scrape<Source>(): Promise<{jobs: Job[], rawCount: number}>` function.

Key requirements:
- Use `fetchWithRetry` from `../fetch-retry.ts`
- Call `categorizeJob(title)` — reject non-creative
- Set `region: "ww"` only for jobs whose source tagging indicates worldwide
- Use `createJobId(source, sourceUrl)` for the ID
- Include `description` on each job so `analyzeWithRescue` can find rescue signals

**Step 3: Add the source type**

In `src/lib/types.ts`, add the new source to the `Source` union on lines 5–25.

**Step 4: Wire the scraper into the aggregator**

In `src/lib/api-aggregator.ts`, import and call your scraper alongside the existing ones.

**Step 5: Bump `JOB_BOARD_COUNT`**

In `src/lib/companies.ts`, increment `JOB_BOARD_COUNT` by 1.

**Step 6: Verify TypeScript**

Run: `npx tsc --noEmit` → no errors.

**Step 7: Run a scrape to confirm the source produces jobs**

Run: `npx tsx scripts/scrape.ts 2>&1 | grep <source-name>`

**Step 8: Commit**

```
git add src/lib/scrapers/api-<source>.ts src/lib/api-aggregator.ts src/lib/types.ts src/lib/companies.ts
git commit -m "scrape: add <source> as global job source"
```

### Task 16: Remote.co scraper (`api-remotedotco.ts`)
Remote.co publishes RSS feeds by category. Expected endpoint: `https://remote.co/feed/` or category-filtered variants. Follow new-scraper template.

### Task 17: JustRemote scraper (`api-justremote.ts`)
JustRemote has a public API. Probe: `https://justremote.co/api/v1/remote-jobs?category=design&worldwide=1` or similar. Follow new-scraper template.

### Task 18: 4 Day Week scraper (`api-4dayweek.ts`)
4dayweek.io. Check for `/api/jobs` or RSS. Filter to worldwide + design. Follow template.

### Task 19: NoDesk scraper (`api-nodesk.ts`)
NoDesk (nodesk.co/remote-work) — design-focused remote board. Check RSS or HTML scrape. Follow template.

### Task 20: Authentic Jobs scraper (`api-authenticjobs.ts`)
authenticjobs.com — design-heavy. Check API/RSS. Follow template.

### Task 21: The Hub scraper (`api-thehub.ts`)

thehub.io — Nordic/European startup jobs with remote-worldwide tags. Check: `https://thehub.io/api/v1/jobs?remote=true` or similar. Follow new-scraper template.

### Task 22 (optional): Dynamite Jobs scraper (`api-dynamitejobs.ts`)

Dynamite Jobs is an SPA. Likely requires either:
- Reverse-engineering the internal `fetch(...)` calls in the browser
- Headless browsing (new dependency — significant scope)

If the internal API is straightforward JSON, proceed. If not, **punt to a future session** — note the attempt in a commit message and move on. Do not block the rest of the plan.

---

## Phase 7 — Final verification

### Task 23: Full scrape + jobs.json sanity check

**Step 1: Run the scrape**

Run: `npx tsx scripts/scrape.ts`
Expected: completes in a few minutes.

**Step 2: Verify jobs.json only contains WW**

Run:
```
node -e "const j=JSON.parse(require('fs').readFileSync('public/data/jobs.json','utf8')); const byR={}; j.forEach(x=>{byR[x.region||'?']=(byR[x.region||'?']||0)+1}); console.log(byR);"
```
Expected: `{ ww: N }` only (no other regions).

**Step 3: Verify job count reasonable**

Compare to pre-session baseline: 35 WW jobs. Post-session should be ≥ 35 (sourcing expansion should offset categorizer cuts).

### Task 24: Preview verification

**Step 1: Start preview server**

`preview_start` (if not already running from Task 9).

**Step 2: Reload and screenshot**

`preview_eval: window.location.reload()` → `preview_screenshot`.

Verify every item in the "Success criteria" section of the design doc.

**Step 3: Check console for errors**

`preview_console_logs` → no red errors.

### Task 25: Push and deploy

**Step 1: Ensure all commits are landed on branch**

`git log --oneline -20` → confirm all tasks committed.

**Step 2: Run type-check one last time**

`npx tsc --noEmit` → zero errors.

**Step 3: Push the branch**

`git push -u origin claude/wizardly-hodgkin`

**Step 4: Open the PR for review (or merge directly per your preference)**

Use `gh pr create ...` or merge locally. Live site updates on next GitHub Actions deploy.

---

## Appendix — Known risks / escape hatches

- **Thin board on day one.** If the board drops below ~20 jobs after Task 10 and before Phase 6 completes, proceed with Phase 6 before publicly deploying.
- **New scraper fails.** Any new-scraper task that can't produce a working endpoint within one reasonable attempt should be punted — commit a stub with a TODO and move on.
- **Type drift.** If `Source` union expansions don't propagate, use `grep -rn "source:" src/lib/scrapers/` to cross-check.
- **Ambiguous-WW fallback false positives.** If post-deploy you see non-worldwide jobs slipping through, revisit [filter.ts:944](../../src/lib/filter.ts:944) (the "benefit of the doubt" branch) and tighten.

---

## Postmortem — Phases 5 & 6 findings (2026-04-18)

### Phase 5 (ATS whitelist expansion) — 0 net adds

Out of the 30+ candidates listed in Task 13, 27 are **already in `companies.ts`**:
GitLab, Mercury, Typeform, Anthropic, Supabase, Neon, PostHog, Cursor, Clerk, WorkOS, Zapier, Buffer, Ramp, OpenAI, ElevenLabs, Ghost, Automattic, Basecamp, Raycast, Plain, Sanity, Perplexity, Pika, Tines, Attio, Fathom, Hugging Face.

Of the 17 remaining candidates probed against Greenhouse + Ashby + Lever APIs:
- **Only 2 return HTTP 200**: `chatbase` (Ashby) and `togetherai` (Greenhouse)
- Inspected manually: Chatbase = 100% on-site NYC; Together AI = 1/51 remote jobs, none creative
- Cross-probed Workable / SmartRecruiters / Breezy: Midjourney + Arc appeared as 200s on Breezy but returned empty `[]` arrays

**Conclusion:** Small remote-first startups predominantly use ATS we don't support (Gem, Pinpoint, Rippling, Teamtailor) or custom careers pages. Bulk-slug-guessing across big-3 ATS is low-yield. Skipping Tasks 13–15 with zero additions.

### Phase 6 (new source scrapers) — 0 net adds

Every planned source probed and rejected:

| Source | Endpoint | Outcome |
|--------|----------|---------|
| Remote.co | `/feed/` etc | Cloudflare HTTP/2 INTERNAL_ERROR — blocked |
| JustRemote | `/api/jobs` | Returns HTML (SPA shell), no JSON API |
| 4dayweek.io | `/api/jobs` | Clean JSON but only 2/100 design jobs have 5+ country allowlists, 0 worldwide |
| NoDesk | /rss, /feed, /api/jobs | All 404 |
| Authentic Jobs | /api/*, /feed, /rss | All 301 to root (legacy site) |
| The Hub (thehub.io) | `/api/jobs?isRemote=true` | Works but 77 total remote jobs, 0 design in first page — Nordic-scoped |
| Remote Rocketship | /api/*, /feed, /rss | All 403 |
| Flexjobs | /remote-jobs/design-jobs, /feed | Connection refused (000) |

**Conclusion:** The 8 existing boards (WWR, Himalayas, RemoteOK, Remotive, Jobicy, Arbeitnow, HN, Working Nomads) already cover the worldwide-tagged niche. New sources that exist EITHER require headless browsing OR don't have worldwide-specific tagging. Future high-leverage sourcing work should focus on:

1. **Reverse-engineering SPA boards** (Dynamite Jobs, JustRemote) with a headless step
2. **Tuning existing filters** to catch "open to any country" phrasing more reliably
3. **Hand-curating** 10-20 truly-worldwide companies from portfolio boards (ADPList, Read CV), not ATS bulk-add

Skipping Tasks 16–21 with zero additions. Proceeding to final verification + deploy.
