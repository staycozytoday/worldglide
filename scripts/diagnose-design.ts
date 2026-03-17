#!/usr/bin/env npx tsx
/**
 * Diagnostic: Find all design-titled jobs across ALL companies,
 * show which pass/fail the worldwide filter and why.
 * Goal: identify where design jobs are being lost.
 */

import { REMOTE_COMPANIES } from "../src/lib/companies";
import { analyzeWorldwideRemote } from "../src/lib/filter";
import { categorizeJob } from "../src/lib/categorize";

interface DesignJob {
  title: string;
  company: string;
  slug: string;
  ats: string;
  location: string;
  filterPass: boolean;
  filterReason: string;
}

const designJobs: DesignJob[] = [];

async function scrapeAts(
  atsType: string,
  slug: string,
  companyName: string,
  getJobs: (data: any) => any[],
  getFields: (item: any) => { title: string; location: string; description: string },
) {
  const endpoints: Record<string, string> = {
    greenhouse: `https://boards-api.greenhouse.io/v1/boards/${slug}/jobs?content=true`,
    lever: `https://api.lever.co/v0/postings/${slug}?mode=json`,
    ashby: `https://api.ashbyhq.com/posting-api/job-board/${slug}`,
  };

  const url = endpoints[atsType];
  if (!url) return;

  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(12000),
      headers: { "User-Agent": "worldglide-diag/1.0", "Accept": "application/json" },
    });
    if (!res.ok) return;
    const data = await res.json();
    const jobs = getJobs(data);

    for (const item of jobs) {
      const fields = getFields(item);
      const cat = categorizeJob(fields.title);
      if (cat !== "design") continue;

      const result = analyzeWorldwideRemote({
        title: fields.title,
        description: fields.description,
        location: fields.location,
        companySlug: slug,
      });

      designJobs.push({
        title: fields.title,
        company: companyName,
        slug,
        ats: atsType,
        location: fields.location || "(none)",
        filterPass: result.pass,
        filterReason: result.reason,
      });
    }
  } catch {}
}

async function main() {
  console.error("[diag] scanning all companies for design jobs...\n");

  const ghCompanies = REMOTE_COMPANIES.filter((c) => c.atsType === "greenhouse" && c.atsSlug);
  const leverCompanies = REMOTE_COMPANIES.filter((c) => c.atsType === "lever" && c.atsSlug);
  const ashbyCompanies = REMOTE_COMPANIES.filter((c) => c.atsType === "ashby" && c.atsSlug);

  // Greenhouse — batch of 10
  for (let i = 0; i < ghCompanies.length; i += 10) {
    const batch = ghCompanies.slice(i, i + 10);
    await Promise.allSettled(
      batch.map((c) =>
        scrapeAts("greenhouse", c.atsSlug!, c.name, (d) => d.jobs || [], (item) => ({
          title: item.title || "",
          location: item.location?.name || "",
          description: item.content || "",
        }))
      )
    );
    if (i % 100 === 0) console.error(`  [gh] ${i}/${ghCompanies.length}`);
    await new Promise((r) => setTimeout(r, 300));
  }

  // Lever — batch of 3
  for (let i = 0; i < leverCompanies.length; i += 3) {
    const batch = leverCompanies.slice(i, i + 3);
    await Promise.allSettled(
      batch.map((c) =>
        scrapeAts("lever", c.atsSlug!, c.name, (d) => (Array.isArray(d) ? d : []), (item) => ({
          title: item.text || "",
          location: item.categories?.location || item.workplaceType || "",
          description: item.descriptionPlain || "",
        }))
      )
    );
    if (i % 30 === 0) console.error(`  [lever] ${i}/${leverCompanies.length}`);
    await new Promise((r) => setTimeout(r, 500));
  }

  // Ashby — batch of 10
  for (let i = 0; i < ashbyCompanies.length; i += 10) {
    const batch = ashbyCompanies.slice(i, i + 10);
    await Promise.allSettled(
      batch.map((c) =>
        scrapeAts("ashby", c.atsSlug!, c.name, (d) => (d.jobs || []).filter((j: any) => j.isRemote), (item) => {
          const locs: string[] = [];
          if (item.location) locs.push(item.location);
          if (Array.isArray(item.secondaryLocations)) {
            for (const l of item.secondaryLocations) {
              if (typeof l === "string") locs.push(l);
            }
          }
          return {
            title: item.title || "",
            location: locs.join(", "),
            description: item.descriptionHtml ? item.descriptionHtml.replace(/<[^>]*>/g, " ") : "",
          };
        })
      )
    );
    if (i % 100 === 0) console.error(`  [ashby] ${i}/${ashbyCompanies.length}`);
    await new Promise((r) => setTimeout(r, 300));
  }

  // Results
  const passed = designJobs.filter((j) => j.filterPass);
  const rejected = designJobs.filter((j) => !j.filterPass);

  console.log(`\n═══════════════════════════════════════════`);
  console.log(`DESIGN JOBS DIAGNOSTIC`);
  console.log(`═══════════════════════════════════════════`);
  console.log(`Total design-titled jobs found: ${designJobs.length}`);
  console.log(`  ✓ Pass worldwide filter: ${passed.length}`);
  console.log(`  ✗ Rejected: ${rejected.length}`);
  console.log();

  // Group rejected by reason
  const byReason = new Map<string, DesignJob[]>();
  for (const j of rejected) {
    if (!byReason.has(j.filterReason)) byReason.set(j.filterReason, []);
    byReason.get(j.filterReason)!.push(j);
  }

  console.log(`REJECTED BY REASON:`);
  for (const [reason, jobs] of [...byReason.entries()].sort((a, b) => b[1].length - a[1].length)) {
    console.log(`  [${jobs.length}x] ${reason}`);
    for (const j of jobs.slice(0, 5)) {
      console.log(`       ${j.title} @ ${j.company} — loc: "${j.location}"`);
    }
    if (jobs.length > 5) console.log(`       ... and ${jobs.length - 5} more`);
  }

  console.log(`\nPASSED (${passed.length}):`);
  for (const j of passed) {
    console.log(`  ✓ ${j.title} @ ${j.company} — ${j.filterReason}`);
  }
}

main().catch(console.error);
