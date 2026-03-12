#!/usr/bin/env npx tsx
/**
 * Discovery orchestrator — runs all sources, verifies candidates
 * against ATS APIs, and outputs new companies ready to add.
 *
 * Pipeline: discover-sources → verify against ATS → report
 *
 * Usage: npx tsx scripts/discover.ts
 * Output: scripts/output/discovered-new.csv + companies.ts snippet
 */

import { writeFileSync, mkdirSync } from "fs";
import { discoverAll, type DiscoveredCompany } from "./discover-sources";
import { isWorldwideRemote, type FilterableJob } from "../src/lib/filter";
import { REMOTE_COMPANIES } from "../src/lib/companies";

// ─── Config ────────────────────────────────────────────────────────
const BATCH_SIZE = 5;
const BATCH_DELAY_MS = 500;
const REQUEST_TIMEOUT_MS = 10_000;
const MAX_WORLDWIDE_SAMPLE = 10;

// ─── Types ─────────────────────────────────────────────────────────
type ATSType = "greenhouse" | "lever" | "ashby" | "workable";

interface DiscoveryResult {
  name: string;
  domain: string;
  atsType: ATSType | "";
  atsSlug: string;
  totalJobs: number;
  worldwideJobs: number;
  status: "NEW" | "SKIP_NO_WORLDWIDE" | "NO_ATS_FOUND" | "ALREADY_EXISTS";
  careersUrl: string;
  source: string;
}

// ─── Slug Generation ───────────────────────────────────────────────
function generateSlugs(name: string, domain: string): string[] {
  const slugs = new Set<string>();

  const domainBase = domain.split(".")[0].toLowerCase();
  slugs.add(domainBase);

  const nameLower = name.toLowerCase();
  const nameClean = nameLower.replace(/[^a-z0-9\s-]/g, "").trim();
  slugs.add(nameClean.replace(/\s+/g, ""));
  slugs.add(nameClean.replace(/\s+/g, "-"));

  const firstName = nameClean.split(/\s+/)[0];
  if (firstName && firstName.length > 2) slugs.add(firstName);

  // Handle ".io", ".ai" style companies
  const domainNoTLD = domain.replace(/\./g, "").toLowerCase();
  if (domainNoTLD !== domainBase) slugs.add(domainNoTLD);

  if (nameClean.endsWith("labs")) slugs.add(nameClean.slice(0, -4).replace(/\s+/g, ""));

  return [...slugs].filter(s => s.length >= 2);
}

// ─── ATS Probing ───────────────────────────────────────────────────

async function fetchWithTimeout(url: string, opts?: RequestInit): Promise<Response | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(url, { ...opts, signal: controller.signal });
    clearTimeout(timer);
    return res;
  } catch {
    clearTimeout(timer);
    return null;
  }
}

interface ATSProbeResult {
  atsType: ATSType;
  slug: string;
  totalJobs: number;
  worldwideJobs: number;
  careersUrl: string;
}

async function probeGreenhouse(slug: string): Promise<ATSProbeResult | null> {
  const res = await fetchWithTimeout(
    `https://boards-api.greenhouse.io/v1/boards/${slug}/jobs?content=true`
  );
  if (!res || !res.ok) return null;
  try {
    const data = await res.json();
    const jobs = data?.jobs;
    if (!Array.isArray(jobs) || jobs.length === 0) return null;

    let ww = 0;
    for (const job of jobs.slice(0, MAX_WORLDWIDE_SAMPLE)) {
      const f: FilterableJob = {
        title: job.title || "",
        location: job.location?.name || "",
        description: (job.content || "").replace(/<[^>]*>/g, " ").substring(0, 500),
      };
      if (isWorldwideRemote(f)) ww++;
    }
    const ratio = ww / Math.min(jobs.length, MAX_WORLDWIDE_SAMPLE);
    return {
      atsType: "greenhouse", slug, totalJobs: jobs.length,
      worldwideJobs: Math.round(ratio * jobs.length),
      careersUrl: `https://boards.greenhouse.io/${slug}`,
    };
  } catch { return null; }
}

async function probeLever(slug: string): Promise<ATSProbeResult | null> {
  const res = await fetchWithTimeout(
    `https://api.lever.co/v0/postings/${slug}?mode=json`
  );
  if (!res || !res.ok) return null;
  try {
    const jobs = await res.json();
    if (!Array.isArray(jobs) || jobs.length === 0) return null;

    let ww = 0;
    for (const job of jobs.slice(0, MAX_WORLDWIDE_SAMPLE)) {
      const f: FilterableJob = {
        title: job.text || "",
        location: job.categories?.location || "",
        description: (job.descriptionPlain || "").substring(0, 500),
      };
      if (isWorldwideRemote(f)) ww++;
    }
    const ratio = ww / Math.min(jobs.length, MAX_WORLDWIDE_SAMPLE);
    return {
      atsType: "lever", slug, totalJobs: jobs.length,
      worldwideJobs: Math.round(ratio * jobs.length),
      careersUrl: `https://jobs.lever.co/${slug}`,
    };
  } catch { return null; }
}

async function probeAshby(slug: string): Promise<ATSProbeResult | null> {
  const res = await fetchWithTimeout(
    `https://api.ashbyhq.com/posting-api/job-board/${slug}`
  );
  if (!res || !res.ok) return null;
  try {
    const data = await res.json();
    const jobs = data?.jobs;
    if (!Array.isArray(jobs) || jobs.length === 0) return null;

    let ww = 0;
    for (const job of jobs.slice(0, MAX_WORLDWIDE_SAMPLE)) {
      const locs: string[] = [];
      if (job.location) locs.push(String(job.location));
      if (Array.isArray(job.secondaryLocations)) {
        for (const loc of job.secondaryLocations) {
          if (typeof loc === "string") locs.push(loc);
        }
      }
      const f: FilterableJob = {
        title: job.title || "",
        location: locs.join(", "),
        description: (job.descriptionHtml || "").replace(/<[^>]*>/g, " ").substring(0, 500),
      };
      if (isWorldwideRemote(f)) ww++;
    }
    const ratio = ww / Math.min(jobs.length, MAX_WORLDWIDE_SAMPLE);
    return {
      atsType: "ashby", slug, totalJobs: jobs.length,
      worldwideJobs: Math.round(ratio * jobs.length),
      careersUrl: `https://jobs.ashbyhq.com/${slug}`,
    };
  } catch { return null; }
}

async function probeWorkable(slug: string): Promise<ATSProbeResult | null> {
  const res = await fetchWithTimeout(
    `https://apply.workable.com/api/v3/accounts/${slug}/jobs`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: "", location: [], department: [], worktype: [], remote: [] }),
    }
  );
  if (!res || !res.ok) return null;
  try {
    const data = await res.json();
    const jobs = data?.results;
    if (!Array.isArray(jobs) || jobs.length === 0) return null;

    // Workable results don't include enough for worldwide check in listing
    return {
      atsType: "workable", slug, totalJobs: jobs.length,
      worldwideJobs: 0, // conservative — unknown
      careersUrl: `https://apply.workable.com/${slug}`,
    };
  } catch { return null; }
}

// ─── Main Discovery ────────────────────────────────────────────────

const existingDomains = new Set(REMOTE_COMPANIES.map(c => c.domain.toLowerCase()));
const existingSlugs = new Set(
  REMOTE_COMPANIES.map(c => c.atsSlug?.toLowerCase()).filter(Boolean)
);

async function discoverCompany(candidate: DiscoveredCompany): Promise<DiscoveryResult> {
  if (existingDomains.has(candidate.domain.toLowerCase())) {
    return {
      name: candidate.name, domain: candidate.domain,
      atsType: "", atsSlug: "", totalJobs: 0, worldwideJobs: 0,
      status: "ALREADY_EXISTS", careersUrl: "", source: candidate.source,
    };
  }

  const slugs = generateSlugs(candidate.name, candidate.domain);
  let bestResult: ATSProbeResult | null = null;

  for (const slug of slugs) {
    if (existingSlugs.has(slug)) continue;

    const [gh, lv, ash, wk] = await Promise.all([
      probeGreenhouse(slug),
      probeLever(slug),
      probeAshby(slug),
      probeWorkable(slug),
    ]);

    const results = [gh, lv, ash, wk].filter(Boolean) as ATSProbeResult[];
    for (const r of results) {
      if (!bestResult || r.totalJobs > bestResult.totalJobs) {
        bestResult = r;
      }
    }

    if (bestResult && bestResult.totalJobs > 0) break;
  }

  if (!bestResult) {
    return {
      name: candidate.name, domain: candidate.domain,
      atsType: "", atsSlug: "", totalJobs: 0, worldwideJobs: 0,
      status: "NO_ATS_FOUND", careersUrl: "", source: candidate.source,
    };
  }

  return {
    name: candidate.name, domain: candidate.domain,
    atsType: bestResult.atsType, atsSlug: bestResult.slug,
    totalJobs: bestResult.totalJobs, worldwideJobs: bestResult.worldwideJobs,
    status: bestResult.worldwideJobs > 0 ? "NEW" : "SKIP_NO_WORLDWIDE",
    careersUrl: bestResult.careersUrl, source: candidate.source,
  };
}

async function main() {
  const startTime = Date.now();

  // Step 1: Discover candidates from all sources
  console.log("[orchestrator] step 1: discovering candidates from sources...");
  const candidates = await discoverAll();

  console.log(`[orchestrator] ${candidates.length} candidates to verify\n`);

  // Step 2: Verify in batches
  const results: DiscoveryResult[] = [];
  let processed = 0;

  for (let i = 0; i < candidates.length; i += BATCH_SIZE) {
    const batch = candidates.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.all(batch.map(discoverCompany));
    results.push(...batchResults);
    processed += batch.length;

    const newCount = batchResults.filter(r => r.status === "NEW").length;
    if (processed % 50 === 0 || processed === candidates.length) {
      const totalNew = results.filter(r => r.status === "NEW").length;
      console.log(`[orchestrator] ${processed}/${candidates.length} verified (${totalNew} new found)`);
    }

    if (i + BATCH_SIZE < candidates.length) {
      await new Promise(r => setTimeout(r, BATCH_DELAY_MS));
    }
  }

  // ─── Report ───────────────────────────────────────────────────
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  const newOnes = results.filter(r => r.status === "NEW");
  const skipped = results.filter(r => r.status === "SKIP_NO_WORLDWIDE");
  const noAts = results.filter(r => r.status === "NO_ATS_FOUND");
  const existing = results.filter(r => r.status === "ALREADY_EXISTS");

  console.log(`\n${"=".repeat(60)}`);
  console.log(`DISCOVERY COMPLETE (${elapsed}s)`);
  console.log(`${"=".repeat(60)}`);
  console.log(`NEW (has worldwide jobs):     ${newOnes.length}`);
  console.log(`SKIP (ATS found, no WW):      ${skipped.length}`);
  console.log(`NO ATS FOUND:                 ${noAts.length}`);
  console.log(`ALREADY EXISTS:               ${existing.length}`);
  console.log(`TOTAL:                        ${results.length}`);

  if (newOnes.length > 0) {
    console.log(`\nBy ATS:`);
    const byAts: Record<string, number> = {};
    for (const r of newOnes) byAts[r.atsType] = (byAts[r.atsType] || 0) + 1;
    for (const [ats, count] of Object.entries(byAts).sort((a, b) => b[1] - a[1])) {
      console.log(`  ${ats}: ${count}`);
    }

    console.log(`\nTop 30 new companies by worldwide job count:`);
    const sorted = [...newOnes].sort((a, b) => b.worldwideJobs - a.worldwideJobs);
    for (const r of sorted.slice(0, 30)) {
      console.log(`  ${r.name.padEnd(30)} ${r.atsType.padEnd(12)} ${String(r.worldwideJobs).padStart(3)} ww / ${r.totalJobs} total`);
    }
  }

  // ─── Write output ─────────────────────────────────────────────
  mkdirSync("scripts/output", { recursive: true });

  const csvHeader = "name,domain,atsType,atsSlug,totalJobs,worldwideJobs,status,careersUrl,source";
  const csvRows = results.map(r =>
    `"${r.name}","${r.domain}","${r.atsType}","${r.atsSlug}",${r.totalJobs},${r.worldwideJobs},"${r.status}","${r.careersUrl}","${r.source}"`
  );
  writeFileSync("scripts/output/discovered.csv", [csvHeader, ...csvRows].join("\n"), "utf-8");

  const newRows = [...newOnes]
    .sort((a, b) => b.worldwideJobs - a.worldwideJobs)
    .map(r =>
      `"${r.name}","${r.domain}","${r.atsType}","${r.atsSlug}",${r.totalJobs},${r.worldwideJobs},"${r.status}","${r.careersUrl}","${r.source}"`
    );
  writeFileSync("scripts/output/discovered-new.csv", [csvHeader, ...newRows].join("\n"), "utf-8");

  // Generate companies.ts snippet
  console.log(`\n--- Copy-paste for companies.ts ---`);
  const sorted = [...newOnes].sort((a, b) => b.worldwideJobs - a.worldwideJobs);
  for (const c of sorted) {
    console.log(`  { name: "${c.name}", domain: "${c.domain}", careersUrl: "${c.careersUrl}", atsType: "${c.atsType}", atsSlug: "${c.atsSlug}" },`);
  }

  console.log(`\nCSV: scripts/output/discovered.csv`);
  console.log(`New only: scripts/output/discovered-new.csv`);
}

main().catch(err => {
  console.error("[orchestrator] fatal:", err);
  process.exit(1);
});
