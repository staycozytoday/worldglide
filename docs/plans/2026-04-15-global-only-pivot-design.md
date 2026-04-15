# Worldglide v6 — Global-Only Creative Board

**Date:** 2026-04-15
**Status:** Approved — proceeding to implementation plan
**Previous design:** [2026-04-05-v4.4-design.md](2026-04-05-v4.4-design.md)

## Vision

**The freshest, highest-quality creative jobs that any human can take, from anywhere in the world.** No regions. No muddle. Product design and creative direction first.

Worldglide pivots from a multi-region creative board to a single-direction, global-only creative board. "Quality & quality" — stricter editorial line in exchange for a much wider sourcing net.

## Motivation

The user has stated for several sessions that only global/worldwide jobs matter. Regional jobs have consistently felt like noise. The prior design (v4.4 / v5) supported all regions with a selector, but the user never used the other regions. This pivot drops the unused surface area and reinvests the implementation budget into sourcing.

## Scope

### In scope this session
- Hard-cut to `region === "ww"` at scrape time (drop non-WW before persistence)
- Regional nav removal (header simplification)
- Region column removal (job list table)
- Hero copy update
- Categorizer pruning — drop non-tech crafts (motion, 3D, illustration, game, sound, instructional/learning)
- New job sources — 5+ anywhere-tagged aggregators, 1+ design-specific boards
- ATS whitelist expansion — 30–50 new remote-first companies
- Prune 27+ dead ATS slugs (404s)

### Explicitly out of scope
- Role filter pills (UI complexity not justified at current job volume)
- Search/filter box (same reason)
- Category-level editorial sections (too much UI for the volume)
- New verticals (fashion, publishing, film/TV) — stays pending as per memory
- Expanding beyond tech — not this session

## Locked decisions

| Area | Decision |
|---|---|
| **Region** | Only `region === "ww"` jobs are persisted and shown. Non-WW dropped at scrape time. |
| **"work from anywhere" detection** | Covered by existing `analyzeWithRescue` in [filter.ts](../../src/lib/filter.ts) — any job classified as `"ww"` by `getJobRegion()` qualifies. |
| **Category filter** | Current categorizer minus: motion, animator, 3D artist, illustrator, game designer, sound designer, instructional designer, learning experience designer. Everything else (product, UX/UI, visual, graphic, creative direction, design engineer, UX research, UX writing, content design, design systems, design ops, service design, accessibility, AI design, vibe coder) stays. |
| **Regional nav** | Removed. Header: `worldglide · post a job · ❋ · theme` |
| **"region" table column** | Removed. Redundant when every row is global. |
| **Role filter pills** | None. Single flat list. |
| **Job expiry** | 8 days (unchanged). |
| **Hero headline** | `freshly baked design jobs / for humans without limits.` |
| **Hero subtitle** | `hand-picked, truly global creative roles. product design, ui, ux, creative direction. open to candidates anywhere in the world. sourced from the world's best tech companies, startups, & studios.` |
| **Meta tags** | Updated to match on-page copy. |

## Categorizer changes

### Patterns to drop from [src/lib/categorize.ts](../../src/lib/categorize.ts)

```
/\bmotion\s+design/i
/\bmotion\s+graphic/i
/\banimator\b/i
/\b3d\s+(artist|designer|generalist)\b/i
/\billustrat/i
/\bgame\s+designer?\b/i
/\bsound\s+designer?\b/i
/\blearning\s+(experience|design)\b/i
```

### Patterns retained
All other patterns from the current `CREATIVE_PATTERNS` list remain unchanged. All `EXCLUDE_PATTERNS` remain unchanged.

### Expected impact
Of 35 current WW jobs, approximately 2–3 would be newly rejected (sound designer, possibly some motion-titled product roles). The filter becomes more editorial, less permissive.

## UI changes

### Header ([src/components/Header.tsx](../../src/components/Header.tsx))
- Remove `REGIONS` array and `regionLink` helper.
- Remove `setRegion` callback, region-related state.
- Remove desktop region nav.
- Remove mobile region nav from dropdown.
- Keep: logo, saved toggle (`❋`), post-a-job link, theme toggle, mobile hamburger.
- After removal, mobile dropdown may only need `post a job` + `❋` → consider removing dropdown entirely and showing links inline on all widths.

### Home page ([src/app/page.tsx](../../src/app/page.tsx))
- Remove `activeRegion` / region filtering logic.
- Remove region-aware `displayedJobs` computation — all jobs already WW-only after the hard-cut.
- Update hero H1 and subtitle to the approved copy.
- Update job count line: `"{N} creative remote jobs from {X} top remote-first companies"` — simplify if needed.

### Job list ([src/components/JobList.tsx](../../src/components/JobList.tsx))
- Remove `type` column (currently shows region).
- Remove corresponding sort case for region.
- Widen `title` or `company` columns to use the freed space.

### Job card ([src/components/JobCard.tsx](../../src/components/JobCard.tsx))
- Remove the region display cell if present.

### Meta ([src/app/layout.tsx](../../src/app/layout.tsx))
- Update title and description to match new hero copy.

## Data pipeline changes

### Hard-cut at scrape time ([scripts/scrape.ts](../../scripts/scrape.ts) or equivalent)
After all scrapers run and each job is classified via `getJobRegion()`:
1. Filter the job array: `jobs.filter(j => j.region === "ww")`
2. Only these jobs are written to `public/data/jobs.json`.
3. Stats output continues as before, but totals reflect post-filter counts.

This approach:
- Keeps the scraper logic intact (still runs all sources, still classifies)
- Single choke point for the hard cut
- Trivially reversible in git if regions come back

### Non-WW scrape cost
We could skip fetching non-WW jobs entirely, but most APIs/ATSs don't let us filter by "worldwide" server-side. Skipping would require per-source logic and waste implementation effort. **Accept the cost** — scrape everything, classify, drop at write time.

## Sourcing expansion

### A. New anywhere-tagged aggregators (new scrapers in [src/lib/scrapers/](../../src/lib/scrapers/))
1. **Dynamite Jobs** — has "Worldwide" region tag. SPA — needs reverse-engineering of the internal API or a headless fetch.
2. **Remote.co** — RSS/feed available.
3. **JustRemote** — `/api/jobs` endpoint, filterable by region/category.
4. **4 Day Week (4dayweek.io)** — anywhere + ethical filter. Check for a public feed.
5. **NoDesk (nodesk.co/remote-work)** — design-focused. Check for RSS/API.

Each will be vetted for (a) availability of a parseable endpoint, (b) signal density (anywhere-tagged job rate), (c) tolerance to scraping.

### B. Design-specific remote boards (new scrapers)
1. **Authentic Jobs** — check feed availability.
2. **Working Not Working** — may block scraping. Last resort.

### C. ATS whitelist expansion ([src/lib/companies.ts](../../src/lib/companies.ts) + [src/lib/filter.ts](../../src/lib/filter.ts) trusted list)

Candidate companies to add (high-quality, remote-first, design-led):
Superlist, Campsite, Tana, Arc, Height, Raycast, Cursor, Mercury, Ramp, Attio, PostHog, Plain, Slite, Fathom Analytics, Zapier, GitLab, Automattic, Buffer, Doist, Baremetrics, Basecamp, Typeform, WorkOS, Tines, Sanity, Chatbase, Clerk, Neon, Turso, Liveblocks, Supabase, Ghost, OpenAI, Anthropic, Hugging Face, Replicate, Together AI, Perplexity, Elevenlabs, Pika, Runway, Midjourney, Luma.

Each candidate requires:
- Verified ATS slug (greenhouse/ashby/lever/workable/etc.)
- Active careers page
- Creative roles historically posted

### D. Dead slug prune
Per memory, 27+ companies currently return 404. Identify via one scrape run, remove from [companies.ts](../../src/lib/companies.ts). Known 404s from memory: RunwayML, Strapi, Outerbounds, Personio. Confirmed during implementation.

## Implementation order

1. Categorizer prune (smallest, isolated) — verify with unit test
2. Scraper hard-cut to WW-only — run locally, confirm jobs.json shrinks
3. UI simplification: header + hero + job list column — verify in preview
4. ATS whitelist expansion (batches of 10) — run scrape, add verified slugs
5. New aggregator scrapers (one at a time) — test each against live endpoints
6. Dead slug prune — from last scrape log
7. Commit, push, deploy

## Risks

- **Thin board on day one**: 35 → ~26 WW jobs after category prune and pre-source-expansion. The board will feel sparse for a day until new sources backfill. Mitigate by shipping the new scrapers in the same push.
- **New scrapers may have low yield**: NoDesk / 4 Day Week / Authentic Jobs may have few genuine worldwide roles. Budget time, not yield.
- **Dynamite Jobs SPA**: may require more reverse-engineering than time allows. Punt if it's not tractable in a few attempts.
- **"Benefit of the doubt" WW fallback**: [filter.ts:944](../../src/lib/filter.ts:944) classifies truly-ambiguous jobs as WW. With a hard-cut in place, this could let low-signal jobs through. Monitor post-launch.

## Testing

- Unit test: categorizer correctly rejects `motion designer`, `3d artist`, `sound designer`, `illustrator`, `game designer`, `instructional designer`, and accepts the retained patterns.
- Snapshot: `public/data/jobs.json` after scrape contains only `region === "ww"` entries.
- UI: preview server starts; header has no region nav; job table has no region column; hero shows new copy.
- Regression: saved favorites still work; post-a-job flow unchanged.

## Success criteria

- Header nav reduced to brand + essentials.
- Job list contains only global jobs.
- Job count after scrape has grown despite category pruning (sourcing should more than offset editorial cuts).
- Page loads cleanly, no TS/build errors, no console errors in preview.
- User-facing copy consistently emphasizes "global / anywhere / design jobs."

## Follow-ups (next session, not this one)
- Tune ambiguous-WW fallback if noise appears.
- Add role filter pills once job count crosses ~100.
- Expand beyond tech (fashion, publishing, film/TV) — still pending from earlier sessions.
- Investigate frontend relative-date display complaint from memory.
