#!/usr/bin/env npx tsx
/**
 * Audit filter — reveals what the worldwide filter is dropping and why.
 * Samples companies and logs rejected jobs grouped by rejection reason.
 *
 * Usage: npx tsx scripts/audit-filter.ts
 */

import { analyzeWorldwideRemote } from "../src/lib/filter";
import { categorizeJob } from "../src/lib/categorize";
import { REMOTE_COMPANIES } from "../src/lib/companies";
import { fetchWithRetry } from "../src/lib/fetch-retry";

interface RejectedJob {
  title: string;
  company: string;
  location: string;
  reason: string;
  descSnippet: string;
}

async function main() {
  const rejected: RejectedJob[] = [];
  const reasonCounts: Record<string, number> = {};
  let totalScanned = 0;
  let totalPassed = 0;
  let totalCategoryRejected = 0;

  // Sample: first 30 Greenhouse companies (they have the most jobs)
  const ghCompanies = REMOTE_COMPANIES
    .filter(c => c.atsType === "greenhouse" && c.atsSlug)
    .slice(0, 30);

  console.log(`[audit] sampling ${ghCompanies.length} greenhouse companies...`);

  for (const company of ghCompanies) {
    try {
      const res = await fetchWithRetry(
        `https://boards-api.greenhouse.io/v1/boards/${company.atsSlug}/jobs?content=true`,
        { headers: { "User-Agent": "worldglide-audit/1.0" }, timeoutMs: 15000 }
      );
      if (!res.ok) continue;
      const data = await res.json();
      const items = data.jobs || [];

      for (const item of items) {
        totalScanned++;
        const locationName = item.location?.name || "";
        const content = item.content || "";
        const descPlain = content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

        const filterResult = analyzeWorldwideRemote({
          title: item.title,
          description: descPlain,
          location: locationName,
        });

        if (!filterResult.pass) {
          reasonCounts[filterResult.reason] = (reasonCounts[filterResult.reason] || 0) + 1;
          if (rejected.length < 200) {
            rejected.push({
              title: item.title || "",
              company: company.name,
              location: locationName,
              reason: filterResult.reason,
              descSnippet: descPlain.slice(0, 100),
            });
          }
          continue;
        }

        // Filter passed — check category
        const category = categorizeJob(item.title);
        if (!category) {
          totalCategoryRejected++;
          reasonCounts["category_rejected"] = (reasonCounts["category_rejected"] || 0) + 1;
          if (rejected.length < 200) {
            rejected.push({
              title: item.title || "",
              company: company.name,
              location: locationName,
              reason: "category_rejected",
              descSnippet: descPlain.slice(0, 100),
            });
          }
          continue;
        }

        totalPassed++;
      }
    } catch {
      // skip failed companies
    }

    // Rate limit
    await new Promise(r => setTimeout(r, 300));
  }

  // --- Print report ---
  console.log(`\n=== AUDIT REPORT ===`);
  console.log(`Scanned: ${totalScanned} jobs from ${ghCompanies.length} companies`);
  console.log(`Passed: ${totalPassed} (${(totalPassed / totalScanned * 100).toFixed(1)}%)`);
  console.log(`Category rejected: ${totalCategoryRejected}`);
  console.log(`\n--- Rejection Reasons ---`);
  for (const [reason, count] of Object.entries(reasonCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${reason}: ${count} (${(count / totalScanned * 100).toFixed(1)}%)`);
  }

  console.log(`\n--- Sample Rejected Jobs (location-related) ---`);
  const worldwideRejections = rejected.filter(r =>
    r.reason !== "category_rejected" &&
    r.reason !== "no_remote_keyword"
  ).slice(0, 30);
  for (const r of worldwideRejections) {
    console.log(`  [${r.reason}] ${r.title} @ ${r.company} | loc: "${r.location}"`);
  }

  console.log(`\n--- No Worldwide Signal (potential rescues from description) ---`);
  const noSignal = rejected.filter(r => r.reason === "no_worldwide_signal").slice(0, 20);
  for (const r of noSignal) {
    console.log(`  ${r.title} @ ${r.company} | loc: "${r.location}" | desc: "${r.descSnippet}"`);
  }

  console.log(`\n--- Category Rejections (worldwide passed, category failed) ---`);
  const catRejections = rejected.filter(r => r.reason === "category_rejected").slice(0, 20);
  for (const r of catRejections) {
    console.log(`  ${r.title} @ ${r.company}`);
  }
}

main().catch(err => {
  console.error("[audit] fatal:", err);
  process.exit(1);
});
