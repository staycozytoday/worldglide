# Growth v2: 80 → 250+ Worldwide Jobs

**Date**: 2026-03-13
**Goal**: 3x+ job count with 5x design jobs, keeping worldwide-only quality
**Priority**: Design supply first, then all categories, then demand

---

## Current State

| Metric | Value |
|--------|-------|
| Companies scraped | 1,267 |
| Raw jobs scanned | 57,495 |
| Worldwide jobs | 80 (0.14% pass rate) |
| By category | eng 60, product 13, design 7 |
| Companies producing jobs | 42 of 1,267 |
| ATS platforms | 6 (Greenhouse, Lever, Ashby, Gem, SmartRecruiters, Workable) |

**Key findings from v1 growth round:**
- Discovery pipeline hit ceiling — public remote lists already covered
- 14 common design titles missed by categorizer (UX Writer, Art Director, Service Designer, etc.)
- Google search harvest never built (was in original spec)
- Trusted company allowlist never built
- Only 5 Workable companies, 6 SmartRecruiters — massively underexplored

---

## Layer 1: Categorizer Overhaul

### Problem
14 design titles return `null` instead of `"design"`. Similar gaps likely exist for eng/product.

### Missing Design Patterns to Add
```
UX Writer, UX Writing Lead, Service Designer, Design Researcher,
Design Ops Manager, Design Operations, Design Technologist,
Art Director, Accessibility Designer, Experience Designer,
Design Strategist, Conversational Designer, Voice Designer,
Sound Designer, Game Designer, Senior Researcher (in design context)
```

### Exclusion Fixes
- Remove `copywriter` from EXCLUDE list — `UX Copywriter` is design
- Add `editor` exclusion to be more specific (keep `copy editor` out, let `UX editor` through)

### Eng/Product Audit
- Run same title gap analysis for engineering and product patterns
- Expected to find 5-10 missed patterns per category

**Expected impact**: +25-35 jobs across all categories, design 7 → 18-22

---

## Layer 2: Design Company Blitz

### Immediate Adds (verified ATS, not in our list)
| Company | ATS | Jobs | Type |
|---------|-----|------|------|
| Maze | ashby/mazedesign | 7 | Design research tool |
| MetaLab | greenhouse/metalab | 11 | Design agency |
| HUGE | greenhouse/hugeinc | 26 | Design agency |
| Instrument | lever/instrument | 3 | Design agency |

### Design-Focused Discovery
Build a targeted discovery sweep for:
- Design tool companies (from Figma plugin directories, design tool comparison sites)
- Design agencies with remote work (from Dribbble hiring, Behance companies)
- Companies with "Design" in their name/domain on supported ATS

**Expected impact**: +10-20 design jobs, +5-10 other categories

---

## Layer 3: Google Search Harvest

### Concept
Programmatically discover ATS slugs by searching:
- `site:boards.greenhouse.io` → extract company slugs from URLs
- `site:jobs.lever.co` → same
- `site:jobs.ashbyhq.com` → same
- `site:apply.workable.com` → same

### Implementation
Use Google Custom Search API (100 free queries/day) or SerpAPI.
Parse result URLs to extract slugs, dedupe against existing companies.
Verify each slug against live ATS API.

### Alternative: Direct ATS enumeration
- Greenhouse has ~10,000+ boards — many discoverable by slug patterns
- Build a slug wordlist from company name databases (Crunchbase, YC, etc.)
- Brute-force verify against ATS APIs in batches

**Expected impact**: +200-800 new companies → +30-80 worldwide jobs

---

## Layer 4: Trusted Company Allowlist

### Concept
Some companies are KNOWN to be worldwide-first. When they post "Remote" with no qualifier, it IS worldwide. No need for description scanning.

### Initial Allowlist
```
GitLab, Automattic, Canonical, Remote, Zapier, Buffer,
Toptal, Doist, InVision, SafetyWing, Hotjar, Close,
Help Scout, Articulate, Toggl, GitBook, PostHog,
Sourcegraph, Mattermost, Ghost
```

### Rules
- Allowlisted companies: location "Remote" (no geo qualifier) → pass
- Still reject if explicit geo qualifier present ("Remote, US")
- Allowlist is manually curated, not auto-generated
- Companies can be removed if they start posting geo-restricted under "Remote"

**Expected impact**: +15-25 jobs from existing companies

---

## Layer 5: Expanded Description Rescue

### Current State
12 description signal phrases. Jobs with ambiguous location + no signal → rejected.

### New Signals to Add (~25 more)
```
"open to all locations", "timezone-flexible", "timezone agnostic",
"we don't restrict by geography", "location-agnostic", "location agnostic",
"work from wherever", "based wherever", "live wherever",
"no location requirements", "all geographies", "every timezone",
"any country", "any timezone", "regardless of location",
"remote without borders", "truly remote", "100% distributed",
"fully distributed", "global workforce", "international team",
"team spans X countries", "colleagues in X+ countries",
"remote-first company", "location is not a factor",
"we hire everywhere"
```

**Expected impact**: +8-15 jobs

---

## Layer 6: Workable + SmartRecruiters Expansion

### Problem
We have scrapers for both but almost no companies:
- Workable: 5 companies
- SmartRecruiters: 6 companies

### Solution
Run discovery specifically for these platforms:
- Use the Google harvest to find `site:apply.workable.com` slugs
- Cross-reference SmartRecruiters company directory
- These ATS platforms are popular with European companies (more likely worldwide)

**Expected impact**: +50-100 new companies → +10-20 worldwide jobs

---

## Combined Expected Impact

| Layer | Design | Eng | Product | Total |
|-------|--------|-----|---------|-------|
| Current | 7 | 60 | 13 | **80** |
| 1: Categorizer | +10 | +15 | +5 | +30 |
| 2: Design companies | +10 | +5 | +3 | +18 |
| 3: Google harvest | +8 | +45 | +12 | +65 |
| 4: Trusted allowlist | +3 | +15 | +4 | +22 |
| 5: Description rescue | +3 | +10 | +2 | +15 |
| 6: Workable/SR expand | +3 | +12 | +3 | +18 |
| **Estimated total** | **~44** | **~162** | **~42** | **~248** |

Design goes from 7 → ~44 (6x). Total goes from 80 → ~248 (3x).

---

## Implementation Order

1. Categorizer overhaul (Layer 1) — fastest impact, zero new infra
2. Design company adds (Layer 2) — 4 verified companies, immediate
3. Trusted allowlist (Layer 4) — curate list, modify filter
4. Description rescue expansion (Layer 5) — add phrases to filter
5. Google harvest / ATS enumeration (Layer 3) — new discovery source
6. Workable/SR expansion (Layer 6) — platform-specific discovery
7. Full scrape + verify + publish

---

## Constraints

- Worldwide filter remains opt-IN (allowlist is the only relaxation)
- No third-party job board scraping
- Categories stay eng/design/product (but design broadened)
- Static export architecture unchanged
- Google search API has 100 free queries/day limit
