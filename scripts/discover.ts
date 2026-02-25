#!/usr/bin/env npx tsx
/**
 * Company Discovery Script
 *
 * Probes Greenhouse, Lever, and Ashby APIs for each candidate company.
 * Outputs a CSV with ATS type, slug, job counts, and worldwide job counts.
 *
 * Usage: npx tsx scripts/discover.ts
 */

import { writeFileSync, mkdirSync } from "fs";
import { CANDIDATES, type Candidate } from "./candidates";

// Import the existing filter to check worldwide jobs
import { isWorldwideRemote, type FilterableJob } from "../src/lib/filter";

// Import existing companies to detect duplicates
import { REMOTE_COMPANIES } from "../src/lib/companies";

// ─── Config ────────────────────────────────────────────────────────
const BATCH_SIZE = 5;
const BATCH_DELAY_MS = 600;
const REQUEST_TIMEOUT_MS = 10_000;
const MAX_WORLDWIDE_SAMPLE = 10; // Check first N jobs for worldwide signal

// ─── Types ─────────────────────────────────────────────────────────
type ATSType = "greenhouse" | "lever" | "ashby";

interface DiscoveryResult {
  name: string;
  domain: string;
  atsType: ATSType | "";
  atsSlug: string;
  totalJobs: number;
  worldwideJobs: number;
  status: "NEW" | "SKIP_NO_WORLDWIDE" | "NO_ATS_FOUND" | "ALREADY_EXISTS";
  careersUrl: string;
}

// ─── Slug Generation ───────────────────────────────────────────────
function generateSlugs(candidate: Candidate): string[] {
  const slugs = new Set<string>();

  // From explicit hints
  if (candidate.slugHints) {
    for (const hint of candidate.slugHints) {
      slugs.add(hint.toLowerCase());
    }
  }

  // From domain (remove TLD)
  const domainBase = candidate.domain.split(".")[0].toLowerCase();
  slugs.add(domainBase);

  // From name: lowercase, various transforms
  const nameLower = candidate.name.toLowerCase();
  const nameClean = nameLower.replace(/[^a-z0-9\s-]/g, "").trim();

  // "Acme Corp" -> "acmecorp", "acme-corp", "acme"
  slugs.add(nameClean.replace(/\s+/g, ""));
  slugs.add(nameClean.replace(/\s+/g, "-"));
  const firstName = nameClean.split(/\s+/)[0];
  if (firstName && firstName.length > 2) {
    slugs.add(firstName);
  }

  // Handle ".io", ".ai" style companies: "fly.io" -> "flyio"
  const domainNoTLD = candidate.domain.replace(/\./g, "").toLowerCase();
  if (domainNoTLD !== domainBase) {
    slugs.add(domainNoTLD);
  }

  return Array.from(slugs).filter((s) => s.length > 0);
}

// ─── ATS Probing ───────────────────────────────────────────────────

async function fetchWithTimeout(
  url: string,
  timeoutMs: number
): Promise<Response | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
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
  const url = `https://boards-api.greenhouse.io/v1/boards/${slug}/jobs?content=true`;
  const res = await fetchWithTimeout(url, REQUEST_TIMEOUT_MS);
  if (!res || !res.ok) return null;

  try {
    const data = await res.json();
    const jobs = data?.jobs;
    if (!Array.isArray(jobs) || jobs.length === 0) return null;

    let worldwideCount = 0;
    const sample = jobs.slice(0, MAX_WORLDWIDE_SAMPLE);
    for (const job of sample) {
      const filterable: FilterableJob = {
        title: job.title || "",
        location: job.location?.name || "",
        description: (job.content || "").substring(0, 500),
      };
      if (isWorldwideRemote(filterable)) {
        worldwideCount++;
      }
    }

    // Extrapolate worldwide ratio to full list
    const ratio = worldwideCount / sample.length;
    const estimatedWorldwide = Math.round(ratio * jobs.length);

    return {
      atsType: "greenhouse",
      slug,
      totalJobs: jobs.length,
      worldwideJobs: estimatedWorldwide,
      careersUrl: `https://boards.greenhouse.io/${slug}`,
    };
  } catch {
    return null;
  }
}

async function probeLever(slug: string): Promise<ATSProbeResult | null> {
  const url = `https://api.lever.co/v0/postings/${slug}?mode=json`;
  const res = await fetchWithTimeout(url, REQUEST_TIMEOUT_MS);
  if (!res || !res.ok) return null;

  try {
    const jobs = await res.json();
    if (!Array.isArray(jobs) || jobs.length === 0) return null;

    let worldwideCount = 0;
    const sample = jobs.slice(0, MAX_WORLDWIDE_SAMPLE);
    for (const job of sample) {
      const filterable: FilterableJob = {
        title: job.text || "",
        location: job.categories?.location || "",
        description: (job.descriptionPlain || "").substring(0, 500),
      };
      if (isWorldwideRemote(filterable)) {
        worldwideCount++;
      }
    }

    const ratio = worldwideCount / sample.length;
    const estimatedWorldwide = Math.round(ratio * jobs.length);

    return {
      atsType: "lever",
      slug,
      totalJobs: jobs.length,
      worldwideJobs: estimatedWorldwide,
      careersUrl: `https://jobs.lever.co/${slug}`,
    };
  } catch {
    return null;
  }
}

async function probeAshby(slug: string): Promise<ATSProbeResult | null> {
  const url = `https://api.ashbyhq.com/posting-api/job-board/${slug}`;
  const res = await fetchWithTimeout(url, REQUEST_TIMEOUT_MS);
  if (!res || !res.ok) return null;

  try {
    const data = await res.json();
    const jobs = data?.jobs;
    if (!Array.isArray(jobs) || jobs.length === 0) return null;

    let worldwideCount = 0;
    const sample = jobs.slice(0, MAX_WORLDWIDE_SAMPLE);
    for (const job of sample) {
      const locationParts: string[] = [];
      if (job.location) locationParts.push(String(job.location));
      if (Array.isArray(job.secondaryLocations)) {
        for (const loc of job.secondaryLocations) {
          if (typeof loc === "string") locationParts.push(loc);
        }
      }
      const filterable: FilterableJob = {
        title: job.title || "",
        location: locationParts.join(", "),
        description: (job.descriptionHtml || "")
          .replace(/<[^>]*>/g, "")
          .substring(0, 500),
      };
      if (isWorldwideRemote(filterable)) {
        worldwideCount++;
      }
    }

    const ratio = worldwideCount / sample.length;
    const estimatedWorldwide = Math.round(ratio * jobs.length);

    return {
      atsType: "ashby",
      slug,
      totalJobs: jobs.length,
      worldwideJobs: estimatedWorldwide,
      careersUrl: `https://jobs.ashbyhq.com/${slug}`,
    };
  } catch {
    return null;
  }
}

// ─── Main Discovery ────────────────────────────────────────────────

async function discoverCompany(
  candidate: Candidate
): Promise<DiscoveryResult> {
  // Check if already exists in current companies list
  const existingDomains = new Set(REMOTE_COMPANIES.map((c) => c.domain));
  if (existingDomains.has(candidate.domain)) {
    return {
      name: candidate.name,
      domain: candidate.domain,
      atsType: "",
      atsSlug: "",
      totalJobs: 0,
      worldwideJobs: 0,
      status: "ALREADY_EXISTS",
      careersUrl: "",
    };
  }

  const slugs = generateSlugs(candidate);
  let bestResult: ATSProbeResult | null = null;

  // Try each slug against all 3 ATS platforms
  for (const slug of slugs) {
    // Probe all 3 in parallel for each slug
    const [gh, lv, ash] = await Promise.all([
      probeGreenhouse(slug),
      probeLever(slug),
      probeAshby(slug),
    ]);

    // Pick the one with most jobs (likely the real one)
    const results = [gh, lv, ash].filter(Boolean) as ATSProbeResult[];
    for (const r of results) {
      if (!bestResult || r.totalJobs > bestResult.totalJobs) {
        bestResult = r;
      }
    }

    // If we found something with jobs, stop trying more slugs
    if (bestResult && bestResult.totalJobs > 0) break;
  }

  if (!bestResult) {
    return {
      name: candidate.name,
      domain: candidate.domain,
      atsType: "",
      atsSlug: "",
      totalJobs: 0,
      worldwideJobs: 0,
      status: "NO_ATS_FOUND",
      careersUrl: "",
    };
  }

  return {
    name: candidate.name,
    domain: candidate.domain,
    atsType: bestResult.atsType,
    atsSlug: bestResult.slug,
    totalJobs: bestResult.totalJobs,
    worldwideJobs: bestResult.worldwideJobs,
    status: bestResult.worldwideJobs > 0 ? "NEW" : "SKIP_NO_WORLDWIDE",
    careersUrl: bestResult.careersUrl,
  };
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  console.log(`\nDiscovering ATS for ${CANDIDATES.length} candidates...\n`);

  const results: DiscoveryResult[] = [];
  let processed = 0;

  // Process in batches
  for (let i = 0; i < CANDIDATES.length; i += BATCH_SIZE) {
    const batch = CANDIDATES.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.all(batch.map(discoverCompany));
    results.push(...batchResults);

    processed += batch.length;

    // Progress log
    const newCount = batchResults.filter((r) => r.status === "NEW").length;
    const names = batch.map((c) => c.name).join(", ");
    console.log(
      `[${processed}/${CANDIDATES.length}] ${names} → ${newCount} new`
    );

    // Rate limit between batches
    if (i + BATCH_SIZE < CANDIDATES.length) {
      await sleep(BATCH_DELAY_MS);
    }
  }

  // ─── Summary ───────────────────────────────────────────────────
  const newOnes = results.filter((r) => r.status === "NEW");
  const skipped = results.filter((r) => r.status === "SKIP_NO_WORLDWIDE");
  const noAts = results.filter((r) => r.status === "NO_ATS_FOUND");
  const existing = results.filter((r) => r.status === "ALREADY_EXISTS");

  console.log(`\n${"=".repeat(60)}`);
  console.log(`DISCOVERY COMPLETE`);
  console.log(`${"=".repeat(60)}`);
  console.log(`NEW (has worldwide jobs):     ${newOnes.length}`);
  console.log(`SKIP (no worldwide jobs):     ${skipped.length}`);
  console.log(`NO ATS FOUND:                 ${noAts.length}`);
  console.log(`ALREADY EXISTS:               ${existing.length}`);
  console.log(`TOTAL:                        ${results.length}`);

  if (newOnes.length > 0) {
    console.log(`\nNew companies by ATS:`);
    const byAts = { greenhouse: 0, lever: 0, ashby: 0 };
    for (const r of newOnes) {
      if (r.atsType === "greenhouse") byAts.greenhouse++;
      else if (r.atsType === "lever") byAts.lever++;
      else if (r.atsType === "ashby") byAts.ashby++;
    }
    console.log(`  Greenhouse: ${byAts.greenhouse}`);
    console.log(`  Lever:      ${byAts.lever}`);
    console.log(`  Ashby:      ${byAts.ashby}`);

    console.log(`\nTop new companies by worldwide job count:`);
    const sorted = [...newOnes].sort(
      (a, b) => b.worldwideJobs - a.worldwideJobs
    );
    for (const r of sorted.slice(0, 20)) {
      console.log(
        `  ${r.name.padEnd(25)} ${r.atsType.padEnd(12)} ${String(r.worldwideJobs).padStart(3)} worldwide / ${r.totalJobs} total`
      );
    }
  }

  // ─── Write CSV ─────────────────────────────────────────────────
  mkdirSync("scripts/output", { recursive: true });

  const csvHeader =
    "name,domain,atsType,atsSlug,totalJobs,worldwideJobs,status,careersUrl";
  const csvRows = results.map(
    (r) =>
      `"${r.name}","${r.domain}","${r.atsType}","${r.atsSlug}",${r.totalJobs},${r.worldwideJobs},"${r.status}","${r.careersUrl}"`
  );

  const csvContent = [csvHeader, ...csvRows].join("\n");
  const csvPath = "scripts/output/discovered.csv";
  writeFileSync(csvPath, csvContent, "utf-8");
  console.log(`\nCSV written to: ${csvPath}`);

  // Also write a filtered "new only" CSV for easy review
  const newRows = results
    .filter((r) => r.status === "NEW")
    .sort((a, b) => b.worldwideJobs - a.worldwideJobs)
    .map(
      (r) =>
        `"${r.name}","${r.domain}","${r.atsType}","${r.atsSlug}",${r.totalJobs},${r.worldwideJobs},"${r.status}","${r.careersUrl}"`
    );

  const newCsvContent = [csvHeader, ...newRows].join("\n");
  const newCsvPath = "scripts/output/discovered-new.csv";
  writeFileSync(newCsvPath, newCsvContent, "utf-8");
  console.log(`New companies CSV: ${newCsvPath}`);
}

main().catch(console.error);
