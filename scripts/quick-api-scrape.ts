import { runApiAggregator } from "../src/lib/api-aggregator";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { isExpired } from "../src/lib/utils";
import { Job } from "../src/lib/types";

async function main() {
  console.log("[quick-api] running API scrapers only...");
  const { jobs: apiJobs, sources } = await runApiAggregator();
  
  for (const s of sources) {
    console.log(`  ${s.name}: ${s.jobs} jobs (${s.rawCount} raw)${s.error ? " ERROR: " + s.error : ""}`);
  }

  const existing: Job[] = JSON.parse(readFileSync(join(process.cwd(), "public/data/jobs.json"), "utf8"));
  const existingNonApi = existing.filter(j =>
    !["himalayas","jobicy","arbeitnow","hn","hn-whoishiring"].includes(j.source)
  );
  
  const merged = [...existingNonApi, ...apiJobs].filter(j => !isExpired(j.postedAt));
  const seen = new Set<string>();
  const deduped = merged.filter(j => { if (seen.has(j.id)) return false; seen.add(j.id); return true; });
  deduped.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());

  writeFileSync(join(process.cwd(), "public/data/jobs.json"), JSON.stringify(deduped, null, 2));
  writeFileSync(join(process.cwd(), "public/data/stats.json"), JSON.stringify({
    rawJobsScanned: 0,
    creativeJobs: deduped.length,
    companiesScraped: existingNonApi.length,
    lastUpdated: new Date().toISOString(),
  }, null, 2));

  console.log(`[quick-api] ${apiJobs.length} API jobs + ${existingNonApi.length} ATS jobs = ${deduped.length} total`);
}

main().catch(console.error);
