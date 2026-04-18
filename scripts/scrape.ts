#!/usr/bin/env npx tsx
/**
 * Standalone scraper — runs outside Next.js.
 * Calls the same scrapeAllSources() used by the Vercel cron,
 * then writes static JSON files for the GitHub Pages build.
 *
 * Usage:  npx tsx scripts/scrape.ts
 * CI:     node --import tsx scripts/scrape.ts
 */

import { scrapeAllSources } from "../src/lib/scraper";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

async function main() {
  const startTime = Date.now();
  console.log("[scrape] starting standalone scrape...");

  const { jobs: allJobs, report } = await scrapeAllSources();

  // v6: hard-cut to global-only. Non-WW jobs are never persisted.
  // See docs/plans/2026-04-15-global-only-pivot-design.md.
  const jobs = allJobs.filter((j) => j.region === "ww");
  const dropped = allJobs.length - jobs.length;

  // write to public/data/ so Next.js static export includes them
  const outDir = join(process.cwd(), "public", "data");
  mkdirSync(outDir, { recursive: true });

  writeFileSync(
    join(outDir, "jobs.json"),
    JSON.stringify(jobs, null, 2)
  );

  const stats = {
    rawJobsScanned: report.rawJobsTotal,
    creativeJobs: jobs.length,
    companiesScraped: report.companies,
    lastUpdated: new Date().toISOString(),
  };

  writeFileSync(
    join(outDir, "stats.json"),
    JSON.stringify(stats, null, 2)
  );

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`[scrape] done in ${elapsed}s`);
  console.log(`[scrape] ${jobs.length} worldwide jobs from ${report.companies} companies (dropped ${dropped} non-WW)`);
  console.log(`[scrape] ${report.rawJobsTotal} total jobs scanned → ${allJobs.length} passed filter → ${jobs.length} global-only`);
  if (report.failed > 0) {
    console.log(`[scrape] ${report.failed} companies failed`);
  }
  console.log(`[scrape] written to ${outDir}/`);
}

main().catch((err) => {
  console.error("[scrape] fatal error:", err);
  process.exit(1);
});
