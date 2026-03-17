#!/usr/bin/env npx tsx
/**
 * Quick diagnostic: how many geo_qualifier_location rejections
 * are actually multi-country (available in 4+ countries)?
 */

import { REMOTE_COMPANIES } from "../src/lib/companies";
import { analyzeWorldwideRemote } from "../src/lib/filter";
import { categorizeJob } from "../src/lib/categorize";

interface MultiCountryJob {
  title: string;
  company: string;
  location: string;
  countries: number;
  category: string | null;
}

const multiCountry: MultiCountryJob[] = [];

function countCountries(location: string): number {
  // Count "Remote, XX" patterns or semicolon-separated locations
  const parts = location.split(/[;,]/).map(s => s.trim()).filter(Boolean);
  const countries = new Set<string>();
  for (const part of parts) {
    // "Remote, US" → "US", "Remote" → skip
    const match = part.match(/(?:remote\s*[-–—]?\s*)(.+)/i);
    if (match) {
      countries.add(match[1].trim().toLowerCase());
    } else if (!part.toLowerCase().includes("remote")) {
      countries.add(part.toLowerCase());
    }
  }
  return countries.size;
}

async function scrapeGreenhouse() {
  const companies = REMOTE_COMPANIES.filter(c => c.atsType === "greenhouse" && c.atsSlug);
  for (let i = 0; i < companies.length; i += 10) {
    const batch = companies.slice(i, i + 10);
    await Promise.allSettled(batch.map(async c => {
      try {
        const res = await fetch(
          `https://boards-api.greenhouse.io/v1/boards/${c.atsSlug}/jobs`,
          { signal: AbortSignal.timeout(10000), headers: { "User-Agent": "worldglide-diag/1.0" } }
        );
        if (!res.ok) return;
        const data = await res.json();
        for (const item of data.jobs || []) {
          const loc = item.location?.name || "";
          const result = analyzeWorldwideRemote({ title: item.title, location: loc, companySlug: c.atsSlug });
          if (result.pass) continue; // already passes
          if (result.reason !== "geo_qualifier_location") continue;

          const countries = countCountries(loc);
          if (countries >= 4) {
            multiCountry.push({
              title: item.title,
              company: c.name,
              location: loc,
              countries,
              category: categorizeJob(item.title),
            });
          }
        }
      } catch {}
    }));
    if (i % 100 === 0) console.error(`[gh] ${i}/${companies.length}`);
    await new Promise(r => setTimeout(r, 200));
  }
}

async function scrapeAshby() {
  const companies = REMOTE_COMPANIES.filter(c => c.atsType === "ashby" && c.atsSlug);
  for (let i = 0; i < companies.length; i += 10) {
    const batch = companies.slice(i, i + 10);
    await Promise.allSettled(batch.map(async c => {
      try {
        const res = await fetch(
          `https://api.ashbyhq.com/posting-api/job-board/${c.atsSlug}`,
          { signal: AbortSignal.timeout(10000), headers: { "Accept": "application/json", "User-Agent": "worldglide-diag/1.0" } }
        );
        if (!res.ok) return;
        const data = await res.json();
        for (const item of (data.jobs || [])) {
          if (!item.isRemote) continue;
          const locs: string[] = [];
          if (item.location) locs.push(item.location);
          if (Array.isArray(item.secondaryLocations)) {
            for (const l of item.secondaryLocations) {
              if (typeof l === "string") locs.push(l);
            }
          }
          const loc = locs.join("; ");
          const result = analyzeWorldwideRemote({ title: item.title, location: loc, companySlug: c.atsSlug });
          if (result.pass) continue;
          if (result.reason !== "geo_qualifier_location") continue;

          const countries = countCountries(loc);
          if (countries >= 4) {
            multiCountry.push({
              title: item.title,
              company: c.name,
              location: loc,
              countries,
              category: categorizeJob(item.title),
            });
          }
        }
      } catch {}
    }));
    if (i % 100 === 0) console.error(`[ashby] ${i}/${companies.length}`);
    await new Promise(r => setTimeout(r, 200));
  }
}

async function scrapeLever() {
  const companies = REMOTE_COMPANIES.filter(c => c.atsType === "lever" && c.atsSlug);
  for (let i = 0; i < companies.length; i += 3) {
    const batch = companies.slice(i, i + 3);
    await Promise.allSettled(batch.map(async c => {
      try {
        const res = await fetch(
          `https://api.lever.co/v0/postings/${c.atsSlug}?mode=json`,
          { signal: AbortSignal.timeout(10000), headers: { "User-Agent": "worldglide-diag/1.0" } }
        );
        if (!res.ok) return;
        const data = await res.json();
        if (!Array.isArray(data)) return;
        for (const item of data) {
          const loc = item.categories?.location || item.workplaceType || "";
          const result = analyzeWorldwideRemote({ title: item.text, location: loc, companySlug: c.atsSlug });
          if (result.pass) continue;
          if (result.reason !== "geo_qualifier_location") continue;

          const countries = countCountries(loc);
          if (countries >= 4) {
            multiCountry.push({
              title: item.text,
              company: c.name,
              location: loc,
              countries,
              category: categorizeJob(item.text),
            });
          }
        }
      } catch {}
    }));
    if (i % 30 === 0) console.error(`[lever] ${i}/${companies.length}`);
    await new Promise(r => setTimeout(r, 400));
  }
}

async function main() {
  console.error("[diag] finding multi-country rejected jobs...\n");
  await Promise.all([scrapeGreenhouse(), scrapeAshby(), scrapeLever()]);

  console.log(`\n═══════════════════════════════════════════`);
  console.log(`MULTI-COUNTRY JOBS (4+ countries, currently rejected)`);
  console.log(`═══════════════════════════════════════════`);
  console.log(`Total: ${multiCountry.length}`);

  // By category
  const byCat = new Map<string, number>();
  for (const j of multiCountry) {
    const cat = j.category || "uncategorized";
    byCat.set(cat, (byCat.get(cat) || 0) + 1);
  }
  console.log(`\nBy category:`);
  for (const [cat, count] of [...byCat.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${cat}: ${count}`);
  }

  // By company
  const byCompany = new Map<string, number>();
  for (const j of multiCountry) {
    byCompany.set(j.company, (byCompany.get(j.company) || 0) + 1);
  }
  console.log(`\nTop companies:`);
  for (const [comp, count] of [...byCompany.entries()].sort((a, b) => b[1] - a[1]).slice(0, 20)) {
    console.log(`  ${comp}: ${count}`);
  }

  // Design jobs specifically
  const designJobs = multiCountry.filter(j => j.category === "design");
  console.log(`\nDesign jobs (${designJobs.length}):`);
  for (const j of designJobs.slice(0, 30)) {
    console.log(`  ${j.title} @ ${j.company} (${j.countries} countries)`);
    console.log(`    loc: "${j.location.substring(0, 120)}${j.location.length > 120 ? '...' : ''}"`);
  }
}

main().catch(console.error);
