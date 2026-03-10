# Growth Strategy: 67 → 200+ Worldwide Jobs

**Date**: 2026-03-10
**Goal**: 3x job count while keeping eng/design/product focus and worldwide-only quality
**Approach**: Mass ATS Slug Discovery (A) + Smarter Filtering (C)

---

## Current State

| Metric | Value |
|--------|-------|
| Companies scraped | 1,265 |
| Raw jobs scanned | 57,343 |
| Worldwide jobs passing filter | 67 |
| Conversion rate | 0.12% |
| ATS platforms | 6 (Greenhouse, Lever, Ashby, Gem, SmartRecruiters, Workable) |
| Categories | 3 (engineering, design, product) |

The bottleneck is the funnel: 99.88% of jobs get rejected by location + category filters.
Growth requires widening the top of the funnel (more companies) AND improving signal extraction (smarter filtering).

---

## Part A: Mass ATS Slug Discovery

### New script: `scripts/discover.ts`

A standalone discovery tool that finds new company ATS slugs from multiple sources, verifies them, and outputs a merge-ready list.

### Discovery Sources (8 total)

| # | Source | Method | Expected Yield |
|---|--------|--------|---------------|
| 1 | YC Startup Directory | Fetch company list, filter Remote tag, parse careers URLs | 300-500 ATS slugs |
| 2 | GitHub awesome-remote lists | Fetch markdown from 6+ repos, extract ATS URLs | 50-100 new slugs |
| 3 | Flexa.careers | Public remote company directory, parse careers links | 100-200 slugs |
| 4 | remote.co | Curated remote company list with careers page links | 50-100 slugs |
| 5 | arc.dev/remote-companies | Remote developer company directory | 50-100 slugs |
| 6 | Crunchbase | Filter: remote-first + funded + has careers page | 100-200 slugs |
| 7 | Wellfound (AngelList) | Remote-first startup listings | 100-200 slugs |
| 8 | Google search harvest | `site:boards.greenhouse.io`, `site:jobs.lever.co` | 100-200 slugs |

### Pipeline

```
Sources → Extract careers URLs → Detect ATS type from URL pattern → Extract slug
    → Dedupe against existing companies.ts
    → Verify slug against live API (batch, rate-limited)
    → Keep only slugs with ≥1 active job
    → Output: scripts/discovered-companies.json
```

### ATS URL Detection Patterns

| ATS | URL Pattern | Slug Extraction |
|-----|-------------|-----------------|
| Greenhouse | `boards.greenhouse.io/{slug}` or `job-boards.greenhouse.io/{slug}` | path segment |
| Lever | `jobs.lever.co/{slug}` | path segment |
| Ashby | `jobs.ashbyhq.com/{slug}` | path segment |
| Workable | `apply.workable.com/{slug}` | path segment |

### Verification Step

For each discovered slug, hit the API to confirm it's alive and has jobs:
- Greenhouse: `GET boards-api.greenhouse.io/v1/boards/{slug}/jobs`
- Lever: `GET api.lever.co/v0/postings/{slug}`
- Ashby: `GET api.ashbyhq.com/posting-api/job-board/{slug}`
- Workable: `GET apply.workable.com/api/v1/widget/accounts/{slug}`

Rate limiting: 10 concurrent requests, 200ms delay between batches.

### Output Format

```json
[
  {
    "name": "Company Name",
    "domain": "company.com",
    "ats": "greenhouse",
    "slug": "companyslug",
    "jobCount": 42,
    "source": "yc-directory"
  }
]
```

### Merge Step

After discovery, a second command merges results into `companies.ts`:
```
npx tsx scripts/discover.ts              # discover + verify
npx tsx scripts/discover.ts --merge      # add to companies.ts
```

---

## Part C: Smarter Filtering

### C1: Rejection Audit Logger

New script: `scripts/audit-filter.ts`

Runs the scraper in dry-run mode but logs every rejected job with:
- Job title
- Company
- Location string
- Rejection reason (which step in `isWorldwideRemote` rejected it)
- First 100 chars of description

Groups rejections by reason, shows top patterns. This reveals false negatives we can fix.

### C2: Expand WORLDWIDE_EXACT_LOCATIONS

Based on audit findings, add patterns like:
- `"remote / hq optional"`, `"remote, flexible"`, `"distributed"`
- `"no office"`, `"remote-first"`, `"work from home"`
- Company-specific location formats

### C3: Description Scanning for Rescue

For jobs where location is missing or ambiguous (not in exact worldwide list, not clearly restricted), scan the first 500 chars of description for worldwide signals:
- "open to candidates globally"
- "we hire from anywhere"
- "no geographic restrictions"
- "distributed team across N countries"
- "work from anywhere in the world"

This rescues jobs that would otherwise be rejected at Step 5 of the filter.

### C4: Better `isRemote` Trust

For Ashby jobs: when `isRemote: true` and location is empty/generic, trust the `isRemote` flag as a positive signal instead of requiring worldwide keywords in description.

---

## Expected Impact

| Change | Estimated Additional Jobs |
|--------|--------------------------|
| A: Mass discovery (+2,000-3,000 companies) | +80-150 |
| C1+C2: Expanded location patterns | +20-40 |
| C3: Description rescue | +10-20 |
| C4: Better isRemote trust | +5-10 |
| **Total estimated** | **+115-220** |
| **New total** | **~180-290 worldwide jobs** |

---

## Implementation Order

1. `scripts/audit-filter.ts` (C1) — understand what's being dropped first
2. Filter improvements (C2, C3, C4) — quick wins from audit findings
3. `scripts/discover.ts` (A) — build discovery pipeline, source by source
4. Merge + scrape — add discovered companies, run full scrape
5. Verify quality — spot-check new jobs, ensure no false positives

---

## Constraints

- No third-party job board scraping (only use directories to discover company ATS slugs)
- Worldwide filter remains opt-IN — jobs must prove they're worldwide
- Categories stay eng/design/product only
- Static export architecture unchanged
- Discovery script runs on-demand, not in cron
