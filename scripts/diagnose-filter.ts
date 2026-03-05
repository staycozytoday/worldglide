#!/usr/bin/env npx tsx
/**
 * Diagnostic: scrape a sample of companies and log WHY jobs get rejected.
 * Shows location values that aren't matching the worldwide filter.
 */

import { REMOTE_COMPANIES } from "../src/lib/companies";
import { fetchWithRetry } from "../src/lib/fetch-retry";
import { isWorldwideRemote } from "../src/lib/filter";
import { categorizeJob } from "../src/lib/categorize";

interface RejectedJob {
  title: string;
  company: string;
  location: string;
  reason: string;
  ats: string;
}

const rejected: RejectedJob[] = [];
const locationCounts = new Map<string, number>();

async function scrapeGreenhouseSample() {
  const companies = REMOTE_COMPANIES.filter(c => c.atsType === "greenhouse" && c.atsSlug).slice(0, 50);
  let total = 0;

  for (let i = 0; i < companies.length; i += 10) {
    const batch = companies.slice(i, i + 10);
    const results = await Promise.allSettled(
      batch.map(async (c) => {
        const res = await fetchWithRetry(
          `https://boards-api.greenhouse.io/v1/boards/${c.atsSlug}/jobs?content=true`,
          { headers: { "User-Agent": "worldglide-diag/1.0" }, timeoutMs: 15000 }
        );
        if (!res.ok) return [];
        const data = await res.json();
        return (data.jobs || []).map((j: any) => ({
          ...j,
          _company: c.name,
          _ats: "greenhouse",
        }));
      })
    );

    for (const r of results) {
      if (r.status === "fulfilled") {
        for (const item of r.value) {
          total++;
          const loc = item.location?.name || "";
          locationCounts.set(loc, (locationCounts.get(loc) || 0) + 1);

          const filterInput = {
            title: item.title,
            description: item.content || "",
            location: loc,
          };

          const passes = isWorldwideRemote(filterInput);
          const hasCategory = categorizeJob(item.title);

          if (!passes && loc.toLowerCase().includes("remote")) {
            rejected.push({
              title: item.title,
              company: item._company,
              location: loc,
              reason: "filter_rejected",
              ats: "greenhouse",
            });
          }
        }
      }
    }
    if (i + 10 < companies.length) await new Promise(r => setTimeout(r, 300));
  }
  console.log(`[greenhouse] scanned ${total} jobs from ${companies.length} companies`);
}

async function scrapeAshbySample() {
  const companies = REMOTE_COMPANIES.filter(c => c.atsType === "ashby" && c.atsSlug).slice(0, 50);
  let total = 0;

  for (let i = 0; i < companies.length; i += 10) {
    const batch = companies.slice(i, i + 10);
    const results = await Promise.allSettled(
      batch.map(async (c) => {
        const res = await fetchWithRetry(
          `https://api.ashbyhq.com/posting-api/job-board/${c.atsSlug}`,
          { method: "GET", headers: { "Accept": "application/json", "User-Agent": "worldglide-diag/1.0" }, timeoutMs: 15000 }
        );
        if (!res.ok) return [];
        const data = await res.json();
        return (data.jobs || []).map((j: any) => ({
          ...j,
          _company: c.name,
          _ats: "ashby",
        }));
      })
    );

    for (const r of results) {
      if (r.status === "fulfilled") {
        for (const item of r.value) {
          total++;
          const locationParts: string[] = [];
          if (item.location) locationParts.push(item.location);
          if (Array.isArray(item.secondaryLocations)) {
            for (const loc of item.secondaryLocations) {
              if (typeof loc === "string") locationParts.push(loc);
            }
          }
          const loc = locationParts.join(", ");
          locationCounts.set(loc, (locationCounts.get(loc) || 0) + 1);

          if (!item.isRemote) continue;

          const filterInput = {
            title: item.title,
            description: item.descriptionHtml ? item.descriptionHtml.replace(/<[^>]*>/g, " ") : "",
            location: loc,
          };

          const passes = isWorldwideRemote(filterInput);

          if (!passes && loc.toLowerCase().includes("remote")) {
            rejected.push({
              title: item.title,
              company: item._company,
              location: loc,
              reason: "filter_rejected",
              ats: "ashby",
            });
          }
        }
      }
    }
    if (i + 10 < companies.length) await new Promise(r => setTimeout(r, 300));
  }
  console.log(`[ashby] scanned ${total} jobs from ${companies.length} companies`);
}

async function main() {
  console.log("=== FILTER DIAGNOSIS ===\n");

  await Promise.all([scrapeGreenhouseSample(), scrapeAshbySample()]);

  // Show top rejected location patterns
  console.log("\n=== REJECTED REMOTE JOBS (sample) ===");
  console.log(`Total rejected with "remote" in location: ${rejected.length}\n`);

  // Group by location pattern
  const byLocation = new Map<string, RejectedJob[]>();
  for (const r of rejected) {
    const key = r.location.toLowerCase();
    if (!byLocation.has(key)) byLocation.set(key, []);
    byLocation.get(key)!.push(r);
  }

  // Sort by frequency
  const sorted = [...byLocation.entries()].sort((a, b) => b[1].length - a[1].length);

  for (const [loc, jobs] of sorted.slice(0, 30)) {
    console.log(`  [${jobs.length}x] "${loc}"`);
    console.log(`       e.g. ${jobs[0].title} @ ${jobs[0].company}`);
  }

  // Show top location values overall
  console.log("\n=== TOP LOCATION VALUES (all jobs) ===");
  const topLocs = [...locationCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 20);
  for (const [loc, count] of topLocs) {
    console.log(`  [${count}x] "${loc}"`);
  }
}

main().catch(console.error);
