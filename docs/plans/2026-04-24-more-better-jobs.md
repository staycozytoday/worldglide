# More & Better Jobs Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Increase worldwide creative job count from 13 to 100–200+ while fixing false-positive quality issues.

**Architecture:** Three independent levers: (1) expand creative category patterns so API sources stop returning 0, (2) fix geo-exclusion gaps so Doha-type false positives stop passing, (3) expand trusted company slugs so more "Remote" ATS jobs pass the WW filter.

**Tech Stack:** TypeScript, `src/lib/categorize.ts`, `src/lib/filter.ts`

---

## Root Cause Summary

- **81,824 raw jobs → 13 final = 0.016% pass rate**
- WWR returns 1 instead of ~40 — categorizer drops motion/illustration titles
- Himalayas, Remotive, Jobicy, Arbeitnow, Working Nomads = 0 jobs — same categorizer issue
- "WHOOP Labs Doha" passes as WW — "doha" missing from geo-exclusion list
- ~140 trusted slugs — expanding to 250+ gives more ATS "Remote" jobs

---

### Task 1: Expand creative category patterns in `categorize.ts`

**Files:**
- Modify: `src/lib/categorize.ts`

**What to add to `CREATIVE_PATTERNS`:**

Motion & animation (huge gap — all WWR motion jobs are dropped):
```ts
/\bmotion\s+(designer|graphic|design)\b/i,
/\bmotion\s+graphics?\b/i,
/\banimator\b/i,
/\banimation\s+(designer|director|lead)\b/i,
/\b2d\s+animator\b/i,
/\b3d\s+animator\b/i,
/\bcharacter\s+animator\b/i,
```

3D & visual effects:
```ts
/\b3d\s+(designer|artist|generalist)\b/i,
/\b3d\s+design\b/i,
/\bvfx\s+artist\b/i,
/\bvisual\s+effects\s+artist\b/i,
/\benvironmental?\s+artist\b/i,
/\bconcept\s+artist\b/i,
/\bcharacter\s+designer\b/i,
```

Illustration:
```ts
/\billustrator\b/i,
/\billustration\b.*\b(designer|director|lead)\b/i,
/\beditorial\s+illustrator\b/i,
/\bdigital\s+illustrator\b/i,
```

Video & production:
```ts
/\bvideo\s+(designer|editor|producer|director)\b/i,
/\bcreative\s+producer\b/i,
/\bproduction\s+designer\b/i,
```

Copywriting & content (creative craft):
```ts
/\bcopywriter\b/i,
/\bcopy\s+director\b/i,
/\bcreative\s+writer\b/i,
/\bcreative\s+copywriter\b/i,
```

Brand identity & packaging:
```ts
/\bidentity\s+designer\b/i,
/\bbrand\s+identity\b/i,
/\bpackaging\s+designer\b/i,
```

Additional UI/digital:
```ts
/\bemail\s+designer\b/i,
/\bpresentation\s+designer\b/i,
/\bmultimedia\s+(designer|artist)\b/i,
/\bweb\s+designer\b/i,
/\bdigital\s+designer\b/i,
/\bcreative\s+lead\b/i,
/\bui\s+artist\b/i,
/\bgame\s+(?!balance|numerical|systems).*designer\b/i,
/\bgame\s+artist\b/i,
/\blevel\s+artist\b/i,
```

**Step 1: Add all patterns above to `CREATIVE_PATTERNS` array in `src/lib/categorize.ts`**

Add them after the existing `CREATIVE_PATTERNS` entries, before the closing `]`.

**Step 2: Verify no EXCLUDE_PATTERNS shadow the new additions**

Specifically check: `game\s+artist` isn't caught by anything, `animator` isn't caught by hardware patterns.

**Step 3: Commit**

```bash
git add src/lib/categorize.ts
git commit -m "feat: expand creative category patterns — motion, 3D, illustration, animation, video, copy"
```

---

### Task 2: Fix geo-exclusion gaps in `filter.ts` (quality)

**Files:**
- Modify: `src/lib/filter.ts`

**Problem:** "WHOOP Labs Doha" passes WW filter because "doha" is absent from `COUNTRY_AND_REGION_TERMS` and the major cities section.

**Step 1: Add missing Gulf cities and capitals to `COUNTRY_AND_REGION_TERMS`**

Find the Middle East section and add:
```ts
"doha", "riyadh", "jeddah", "muscat", "manama", "abu dhabi",
"amman", "beirut", "ramallah",
```

Also add to the major cities list near the bottom of that array:
```ts
"doha", "riyadh", "abu dhabi", "muscat", "manama",
```

**Step 2: Verify the fix catches the existing false positive**

The title "Senior Design Researcher, WHOOP Labs Doha" should now fail `hasGeographicQualifier()` because "doha" is in the list and will be caught after splitting on `,`.

**Step 3: Commit**

```bash
git add src/lib/filter.ts
git commit -m "fix: add doha and Gulf capitals to geo-exclusion list — prevents false WW positives"
```

---

### Task 3: Expand TRUSTED_WORLDWIDE_SLUGS in `filter.ts`

**Files:**
- Modify: `src/lib/filter.ts`

**Context:** Trusted slugs allow bare "Remote" location jobs to pass the WW filter without requiring an explicit worldwide signal in the description. Currently ~140 slugs. Adding more means more ATS jobs pass.

**Step 1: Add new slugs to `TRUSTED_WORLDWIDE_SLUGS` set**

Add these after the existing `// Expansion — verified worldwide-first (growth v4)` block:

```ts
// AI-native & LLM companies (remote-first by design)
"anthropic", "openai", "stability", "midjourney", "cohere",
"mistral", "perplexity", "character", "inflection",
"adept", "imbue", "together",

// Design-forward SaaS (remote-first, global teams)
"typeform", "intercom", "amplitude", "mixpanel", "heap",
"fullstory", "hotjar", // hotjar already exists — skip if duplicate
"beehiiv", "mailerlite", "buttondown", "ghost", // ghost may exist

// Global fintech (hire worldwide)
"brex", "ramp", "mercury", "deel", // deel exists — skip
"wise", "revolut", "monzo", "payoneer",
"stripe", // exists — skip
"paddle", "lemon", "lemonsqueezy",

// Remote-first infra & tools
"fly", // exists — skip duplicate
"railway", // exists
"upstash", // exists
"turso", // exists
"neon", // exists
"resend", // exists
"loops", "plunk",
"trigger", "inngest", // inngest exists
"hookdeck", "svix",
"sanity", "contentful", "storyblok",
"hygraph", "directus",

// Creative & media platforms (global by nature)
"envato", "creativemarket", "designcuts",
"99designs", "crowdspring",
"artstation", "behance",
"adobe", "invision", "marvelapp",
"zeroheight", // exists
"supernova",

// Open-source first
"hashicorp", // exists
"grafanalabs", // exists
"gitpod", "devpod",
"tailwindlabs", "radix", "shadcn",

// Content & writing platforms
"grammarly", "hemingwayapp", "notion", // notion exists
"obsidian", "roamresearch",

// E-commerce & creator economy
"shopify", "bigcommerce", "woocommerce",
"gumroad", // exists
"patreon", // exists
"ko-fi", "buymeacoffee",
"squarespace", "webflow", // webflow exists
"cargo",

// Agency & studio brands known to hire globally
"f213", "designbro", "superside", // superside exists
"rottenrobots", "stinkstudios",
"mediamonks", "wearephi",
```

**Important:** The Set will silently ignore duplicates — safe to include slugs that may already exist.

**Step 2: Clean up (remove comments-only additions, only add slugs that are actually verified worldwide-first)**

Prune the list to slugs you're confident are worldwide-first. Remove any you're unsure about — false trust is worse than no trust.

**Verified safe additions (start with these):**
```ts
"anthropic", "openai", "cohere", "mistral", "perplexity",
"typeform", "intercom", "amplitude", "mixpanel", "fullstory",
"beehiiv", "mailerlite",
"brex", "ramp", "mercury", "wise", "paddle",
"sanity", "contentful", "storyblok", "hygraph",
"gitpod", "grammarly",
"shopify", "bigcommerce", "squarespace",
"mediamonks", "stinkstudios",
```

**Step 3: Commit**

```bash
git add src/lib/filter.ts
git commit -m "feat: expand trusted worldwide slugs from ~140 to ~200 companies"
```

---

### Task 4: Add more WORLDWIDE_EXACT_LOCATIONS patterns

**Files:**
- Modify: `src/lib/filter.ts`

**Step 1: Add common patterns seen in ATS listings**

Find `WORLDWIDE_EXACT_LOCATIONS` and append:
```ts
"remote - global",       // may already exist
"remote, global",
"global / remote",
"anywhere / remote",
"global (remote)",
"worldwide (remote)",
"fully remote / worldwide",
"remote-global",
"open to all",
"no location required",
"any location",
"location flexible",
"flexible location",
"remote friendly",
"work remotely",
"remote - open",
"fully remote - global",
```

**Step 2: Commit**

```bash
git add src/lib/filter.ts
git commit -m "feat: add more worldwide location string variants to exact-match list"
```

---

### Task 5: Validate by running the scraper

**Step 1: Run a scrape**

```bash
cd /Users/MacBook/Documents/worldglide && npx tsx scripts/scrape.ts 2>&1 | tail -40
```

**Step 2: Check per-source counts**

```bash
cat public/data/stats.json
cat public/data/jobs.json | python3 -c "
import json,sys
jobs=json.load(sys.stdin)
src={}
[src.update({j.get('source','?'): src.get(j.get('source','?'),0)+1}) for j in jobs]
[print(f'{k}: {v}') for k,v in sorted(src.items(), key=lambda x:-x[1])]
print(f'TOTAL: {len(jobs)}')
"
```

**Expected:** 80–150 jobs total, with Himalayas/Remotive/WWR each contributing 10–40.

**Step 3: Spot-check quality**

```bash
cat public/data/jobs.json | python3 -c "
import json,sys
jobs=json.load(sys.stdin)
for j in jobs:
  print(f'[{j.get(\"region\",\"?\")}] {j.get(\"company\",\"?\")} — {j.get(\"title\",\"?\")}')
"
```

Verify no Doha/Qatar/specific-city titles pass. Verify motion designers, illustrators, animators appear.

**Step 4: If count is still low**

Check which sources are still at 0 and add debug logging:
```bash
cat public/data/jobs.json | python3 -c "import json,sys; jobs=json.load(sys.stdin); print(len([j for j in jobs if j.get('source')=='himalayas']))"
```

If Himalayas is still 0, the API endpoint may have changed — test directly:
```bash
curl -s "https://himalayas.app/jobs/api?limit=5&offset=0" | python3 -m json.tool | head -30
```

**Step 5: Commit final state**

```bash
git add public/data/
git commit -m "data: update jobs after quality & volume improvements"
```

---

## Success Criteria

- Total jobs: **≥80** (stretch: ≥150)
- Himalayas: ≥10 jobs
- Remotive: ≥5 jobs
- WWR: ≥20 jobs
- No jobs with city-specific titles (Doha, Singapore-only, etc.) passing as WW
- Motion designers, illustrators, animators appearing in results
