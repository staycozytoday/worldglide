// Run only Greenhouse scraper + merge with existing jobs
import { scrapeGreenhouse } from "../src/lib/scrapers/greenhouse";
import { scrapeAshby } from "../src/lib/scrapers/ashby";
import { scrapeLever } from "../src/lib/scrapers/lever";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { isExpired } from "../src/lib/utils";
import { Job } from "../src/lib/types";

async function main() {
  console.log("[quick-ats] running Greenhouse + Ashby + Lever...");
  const [gh, ab, lv] = await Promise.all([scrapeGreenhouse(), scrapeAshby(), scrapeLever()]);
  console.log(`[greenhouse] ${gh.jobs.length} jobs`);
  console.log(`[ashby] ${ab.jobs.length} jobs`);
  console.log(`[lever] ${lv.jobs.length} jobs`);

  const atsJobs = [...gh.jobs, ...ab.jobs, ...lv.jobs];

  const existing: Job[] = JSON.parse(readFileSync(join(process.cwd(), "public/data/jobs.json"), "utf8"));
  const existingOther = existing.filter(j => !["greenhouse","ashby","lever"].includes(j.source));

  const merged = [...existingOther, ...atsJobs].filter(j => !isExpired(j.postedAt));
  const seen = new Set<string>();
  const deduped = merged.filter(j => { if (seen.has(j.id)) return false; seen.add(j.id); return true; });
  deduped.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());

  writeFileSync(join(process.cwd(), "public/data/jobs.json"), JSON.stringify(deduped, null, 2));
  writeFileSync(join(process.cwd(), "public/data/stats.json"), JSON.stringify({
    rawJobsScanned: gh.report.length + ab.report.length + lv.report.length,
    creativeJobs: deduped.length,
    companiesScraped: gh.report.length + ab.report.length + lv.report.length,
    lastUpdated: new Date().toISOString(),
  }, null, 2));

  console.log(`[quick-ats] done. ${deduped.length} total jobs`);
}

main().catch(console.error);
