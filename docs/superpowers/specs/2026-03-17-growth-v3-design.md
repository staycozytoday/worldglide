# Growth v3: 103 → 1,000+ Worldwide Jobs

**Date**: 2026-03-17
**Goal**: 10x job count via external API aggregation, 12 new ATS platforms, exponential discovery loop, expanded categories
**Constraint**: Same strict worldwide filter on ALL sources. 3 categories (eng/design/product) but broadened scope within each.

---

## Current State

| Metric | Value |
|--------|-------|
| Worldwide jobs | 103 |
| Producing companies | 43 of 1,290 |
| ATS platforms | 6 (Greenhouse, Lever, Ashby, Gem, SmartRecruiters, Workable) |
| Categories | 3 (engineering 70, design 14, product 19) |
| Pass rate | 0.17% (103 of ~59K raw jobs) |

---

## Layer 1: External API Aggregation (9 Sources)

Consume free public job APIs. Normalize into FilterableJob, run through same worldwide filter + categorizer. Dedup against ATS-sourced jobs (ATS wins on collision).

| Source | Endpoint | Volume | Auth | Worldwide Data |
|--------|----------|--------|------|----------------|
| Himalayas | `himalayas.app/jobs/api` | 100K+ | None | `locationRestrictions` field |
| RemoteOK | `remoteok.com/api` | 30K+ | None | Tags only |
| Remotive | `remotive.com/api/remote-jobs` | 1,600+ | None | No — needs our filter |
| Jobicy | `jobicy.com/api/v2/remote-jobs` | 1K+ | None | Geo filter param |
| Arbeitnow | `arbeitnow.com/api/job-board-api` | Varies | None | EU-focused |
| Adzuna | `api.adzuna.com` | Multi-country | API key | Structured location |
| The Muse | `themuse.com/api` | US-focused | None | Category/location |
| HN Who's Hiring | Monthly thread scrape | 500+/mo | None | Text parsing |
| Dribbble Jobs | Scrape job listings | 200+ | None | Design-focused |

**Implementation**: New `scripts/scrape-apis.ts` that fetches all sources, normalizes, filters, deduplicates.

**Expected yield**: +200-400 worldwide jobs

---

## Layer 2: New ATS Platforms (12 New = 18 Total)

Each follows existing pattern: public JSON endpoint → fetch jobs → worldwide filter → categorize.

### Tier 1 — High-value, API-friendly

| ATS | API Pattern | Market | Est. Companies |
|-----|-------------|--------|----------------|
| Teamtailor | `{co}.teamtailor.com/jobs` | EU/Nordic | 500+ |
| BambooHR | `{co}.bamboohr.com/careers/list` | US mid-market | 300+ |
| Recruitee | `{co}.recruitee.com/api/offers` | EU startups | 200+ |
| JazzHR | `{co}.applytojob.com/apply` | US SMBs | 200+ |
| Personio | `{co}.jobs.personio.com` | DACH/EU | 200+ |

### Tier 2 — Mid-market

| ATS | API Pattern | Market | Est. Companies |
|-----|-------------|--------|----------------|
| Breezy HR | `{co}.breezy.hr` | US/EU | 150+ |
| Pinpoint | Via API | UK/EU | 100+ |
| Dover | Via API | US startups | 100+ |
| Comeet | Via API | US/Israel | 100+ |
| GoHire | Via API | UK SMBs | 100+ |

### Tier 3 — Additional coverage

| ATS | API Pattern | Market | Est. Companies |
|-----|-------------|--------|----------------|
| Rippling | Via API | US | 100+ |
| Zoho Recruit | Via API | Global SMB | 100+ |

**Expected yield**: +2,000-4,000 new companies → +150-400 worldwide jobs

---

## Layer 3: Exponential Discovery Loop

Currently discovery is manual. New approach: self-reinforcing pipeline that runs weekly.

### Discovery Sources

| Source | What We Extract | Est. Companies |
|--------|----------------|----------------|
| YC directory (Algolia API) | All YC company names | 4,000+ |
| a16z portfolio | Company names | 400+ |
| Sequoia portfolio | Company names | 300+ |
| Accel, Bessemer, Index, Lightspeed | Company names | 1,000+ |
| GitHub `awesome-remote-job` repos (5+) | Company lists | 500+ |
| remote.com company directory | Company names | 300+ |
| RemoteOK company list | Company names | 1,000+ |
| Himalayas 25K companies | Company names | 25,000 |
| Wellfound startup directory | Company names | 10,000+ |
| Dribbble company profiles | Design companies | 500+ |
| Behance company profiles | Design companies | 300+ |

### The Loop

```
Discovery Sources → company names
        ↓
Slug Generator (name → [slug, slug-io, companyhq, ...])
        ↓
Test against 18 ATS platforms
        ↓
Verified companies → add to companies.ts
        ↓
Scrape → worldwide filter → jobs.json
        ↓
Extract new company names from API jobs NOT in companies.ts
        ↓
Feed back into Slug Generator → repeat
```

Each cycle discovers more companies → more jobs → more company names → more companies. Exponential.

**Expected yield**: +500-2,000 companies per cycle → +50-300 jobs per cycle

---

## Layer 4: Category Expansion

Keep 3 categories but broaden what qualifies for each.

### Engineering (add)
- Infrastructure/platform engineering
- Data engineering, ML engineering, ML ops
- QA, SDET, test automation
- Security engineering, AppSec
- Embedded systems, firmware
- Technical support engineering

### Design (add)
- Motion design, animation
- Brand design, visual identity
- Creative director
- Design engineering
- Illustration
- 3D design

### Product (add to include operations)
- Operations, business operations
- Strategy, chief of staff
- Data analyst, business intelligence
- Program management, TPM
- Revenue operations
- People operations (borderline — include if worldwide)

**Expected yield**: +40-80 jobs from existing companies

---

## Full Architecture

```
┌─────────────────────────────────────────────────────┐
│                 DISCOVERY SOURCES                     │
│  VC portfolios, GitHub lists, directories, APIs      │
│  Himalayas 25K co, YC 4K co, awesome-remote          │
└──────────────────────┬──────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│              SLUG GENERATOR                           │
│  company name → [slug, slug-io, companyhq, ...]      │
│  test each against 18 ATS platforms                   │
└──────────────────────┬──────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│              ATS SCRAPERS (18 platforms)              │
│  Greenhouse, Lever, Ashby, Gem, SR, Workable         │
│  + Teamtailor, BambooHR, Recruitee, JazzHR,          │
│    Personio, Breezy, Pinpoint, Dover, Comeet,        │
│    GoHire, Rippling, Zoho                            │
└──────────────────────┬──────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│           EXTERNAL JOB APIs (9 sources)              │
│  Himalayas, RemoteOK, Remotive, Jobicy, Arbeitnow   │
│  Adzuna, The Muse, HN Who's Hiring, Dribbble        │
└──────────────────────┬──────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│              WORLDWIDE FILTER (unchanged)             │
│  Same strict 6-step filter on ALL sources            │
└──────────────────────┬──────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│              CATEGORIZER (expanded)                   │
│  eng (broader), design (broader), product+ops        │
└──────────────────────┬──────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│              DEDUPLICATOR                             │
│  ATS primary > API secondary                         │
│  Fingerprint: normalized title + company             │
└──────────────────────┬──────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│              jobs.json (1,000+ worldwide jobs)        │
└─────────────────────────────────────────────────────┘

FEEDBACK LOOP:
  API jobs → extract company names not in companies.ts
  → slug generate → test 18 ATS → add verified → repeat weekly
```

---

## Projected Growth

| Source | Companies | Est. Worldwide Jobs |
|--------|-----------|-------------------|
| Current ATS (6 platforms, 1,290 co.) | 43 producing | 103 |
| External APIs (9 sources) | — | +200-400 |
| New ATS platforms (12) | +2,000-4,000 | +150-400 |
| VC portfolio discovery | +500-1,000 | +50-150 |
| GitHub/directory discovery | +300-600 | +30-100 |
| Category expansion | existing | +40-80 |
| Feedback loop (cycles 2-3) | +1,000-2,000 | +100-300 |
| **Total after 3 cycles** | **5,000-10,000** | **~700-1,500** |

---

## Implementation Order

1. External API aggregation (fastest yield — Himalayas alone could double us)
2. Category expansion (immediate yield from existing 1,290 companies)
3. New ATS platforms — Tier 1 first (Teamtailor, BambooHR, Recruitee, JazzHR, Personio)
4. Discovery sources (VC portfolios, GitHub lists, directories)
5. Discovery loop automation (weekly auto-discovery)
6. New ATS platforms — Tier 2+3
7. Full scrape + verify + publish

## Constraints

- Worldwide filter unchanged — same strict standard for ALL sources
- 3 categories (eng/design/product) — broadened scope, not new categories
- Static export architecture unchanged
- Attribution required for external APIs (Himalayas, Remotive, RemoteOK)
- Rate limit compliance for all APIs
- ATS primary source wins dedup collisions
