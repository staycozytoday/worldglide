#!/usr/bin/env node
/**
 * mega-discover.mjs
 *
 * Takes 853 remote company names from remoteintech repo,
 * deduplicates against existing companies.ts,
 * generates smart slug variations,
 * tests against Ashby → Lever → Greenhouse (in hit-rate order).
 *
 * Strategy:
 * - Ashby slugs: company-name (hyphenated) or companyname (joined)
 * - Lever slugs: companyname (joined) or company-name (hyphenated)
 * - Greenhouse: most unpredictable, try both + hq variants
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const companiesPath = resolve(__dirname, "../src/lib/companies.ts");

// ── load existing ──
const src = readFileSync(companiesPath, "utf-8");
const existingSlugs = new Set();
const existingNames = new Set();
for (const m of src.matchAll(/atsSlug:\s*"([^"]+)"/g)) existingSlugs.add(m[1]);
for (const m of src.matchAll(/name:\s*"([^"]+)"/g)) existingNames.add(m[1].toLowerCase().replace(/[^a-z0-9]/g, ""));

// ── load remoteintech names ──
const riNames = readFileSync("/tmp/remoteintech-companies.txt", "utf-8")
  .split("\n")
  .filter(Boolean);

console.log(`existing: ${existingSlugs.size} slugs, ${existingNames.size} names`);
console.log(`remoteintech: ${riNames.length} companies\n`);

// ── ATS endpoints ──
const ATS = {
  ashby:      (s) => `https://api.ashbyhq.com/posting-api/job-board/${s}`,
  lever:      (s) => `https://api.lever.co/v0/postings/${s}?limit=1`,
  greenhouse: (s) => `https://boards-api.greenhouse.io/v1/boards/${s}/jobs`,
};

// ── slug generation ──
function generateSlugs(name) {
  // name comes as "some-company" from the file
  const hyphenated = name; // already hyphenated
  const joined = name.replace(/-/g, ""); // remove hyphens
  const parts = name.split("-");

  const variants = new Set([
    hyphenated,
    joined,
    `${joined}hq`,
    `${hyphenated}-hq`,
  ]);

  // if name has common suffixes like -io, -ai, try without
  if (name.endsWith("-io")) variants.add(name.slice(0, -3));
  if (name.endsWith("-ai")) variants.add(name.slice(0, -3));
  if (name.endsWith("-hq")) variants.add(name.slice(0, -3));

  // try first word only (for multi-word names)
  if (parts.length > 1) variants.add(parts[0]);

  // try with "labs", "inc" removed
  if (name.endsWith("-labs")) variants.add(name.slice(0, -5));
  if (name.endsWith("-inc")) variants.add(name.slice(0, -4));

  return [...variants];
}

// ── dedup ──
const toTest = riNames.filter((name) => {
  const normalized = name.replace(/-/g, "");
  return !existingNames.has(normalized);
});

console.log(`after dedup: ${toTest.length} companies to test\n`);

// ── verify ──
const BATCH = 20;
const DELAY = 400;
const verified = [];
let tested = 0;

async function tryATS(slug, atsType) {
  const url = ATS[atsType](slug);
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
    if (!res.ok) return null;
    const ct = res.headers.get("content-type") || "";
    if (!ct.includes("json")) return null;
    const data = await res.json();

    if (atsType === "ashby" && data && (data.jobs || data.jobPostings || data.data)) return slug;
    if (atsType === "lever" && Array.isArray(data)) return slug;
    if (atsType === "greenhouse" && data && typeof data.name === "string") return slug;
  } catch {}
  return null;
}

async function testCompany(name) {
  const slugs = generateSlugs(name);

  // try ashby first (highest hit rate for predictable slugs)
  for (const slug of slugs) {
    if (existingSlugs.has(slug)) continue;
    const hit = await tryATS(slug, "ashby");
    if (hit) return { name, slug: hit, ats: "ashby" };
  }

  // try lever
  for (const slug of slugs) {
    if (existingSlugs.has(slug)) continue;
    const hit = await tryATS(slug, "lever");
    if (hit) return { name, slug: hit, ats: "lever" };
  }

  // try greenhouse (lowest hit rate, try fewer variants)
  for (const slug of slugs.slice(0, 3)) {
    if (existingSlugs.has(slug)) continue;
    const hit = await tryATS(slug, "greenhouse");
    if (hit) return { name, slug: hit, ats: "greenhouse" };
  }

  return null;
}

async function run() {
  const startTime = Date.now();

  for (let i = 0; i < toTest.length; i += BATCH) {
    const batch = toTest.slice(i, i + BATCH);
    const batchNum = Math.floor(i / BATCH) + 1;
    const totalBatches = Math.ceil(toTest.length / BATCH);

    const results = await Promise.allSettled(
      batch.map(name => testCompany(name))
    );

    for (const r of results) {
      if (r.status === "fulfilled" && r.value) {
        verified.push(r.value);
        console.log(`  ✓ ${r.value.name} → ${r.value.ats}/${r.value.slug}`);
      }
    }

    tested += batch.length;

    // progress every 5 batches
    if (batchNum % 5 === 0 || batchNum === totalBatches) {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log(`  [${tested}/${toTest.length} tested, ${verified.length} found, ${elapsed}s]`);
    }

    if (i + BATCH < toTest.length) await new Promise(r => setTimeout(r, DELAY));
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n${"═".repeat(60)}`);
  console.log(`DONE in ${elapsed}s`);
  console.log(`TESTED: ${tested} companies`);
  console.log(`VERIFIED: ${verified.length} new companies`);
  console.log(`${"═".repeat(60)}\n`);

  if (verified.length > 0) {
    // sort by ats type
    const byAts = { ashby: [], lever: [], greenhouse: [] };
    for (const v of verified) (byAts[v.ats] ||= []).push(v);

    console.log("// ── paste into companies.ts ──\n");
    for (const [ats, items] of Object.entries(byAts)) {
      if (items.length === 0) continue;
      console.log(`  // ${ats} — remoteintech batch`);
      for (const v of items) {
        // clean up display name from slug
        const displayName = v.name.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
        const domain = `${v.name.replace(/-/g, "")}.com`; // rough guess, needs manual review
        const cu = ats === "lever"
          ? `https://jobs.lever.co/${v.slug}`
          : ats === "ashby"
          ? `https://jobs.ashbyhq.com/${v.slug}`
          : `https://boards.greenhouse.io/${v.slug}`;
        console.log(`  { name: "${displayName}", domain: "${domain}", careersUrl: "${cu}", atsType: "${ats}", atsSlug: "${v.slug}" },`);
      }
    }
  }
}

run();
