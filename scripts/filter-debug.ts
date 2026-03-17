#!/usr/bin/env npx tsx
/**
 * Diagnostic: show jobs from trusted companies that FAIL the worldwide filter.
 * For each rejected job, fetch full description and check for worldwide signals.
 * This helps us see what we're missing.
 */

import { REMOTE_COMPANIES } from "../src/lib/companies";
import { analyzeWorldwideRemote } from "../src/lib/filter";
import { categorizeJob } from "../src/lib/categorize";
import { fetchWithRetry } from "../src/lib/fetch-retry";

const TRUSTED_SLUGS = new Set([
  "gitlab", "canonical", "remote", "zapier", "buffer",
  "toptal", "safetywing", "hotjar", "close", "helpscout",
  "articulate", "toggl", "gitbook", "posthog", "sourcegraph91",
  "mattermost", "ghost", "doist", "automattic", "superside",
  "wikimedia", "mozilla", "elastic", "testgorilla", "oyster",
  "grafanalabs", "cockroachlabs", "honeycomb", "netlify",
  "circleci", "planetscale", "cribl", "hashicorp",
  "sentry", "snyk", "datadog", "cloudflare",
  "dbtlabsinc", "airbyte", "temporal", "dagster",
  "supabase", "neon", "turso", "fly",
  "1password", "tailscale", "bitwarden",
  "runwayml", "huggingface", "wandb",
  "deel", "velocityglobal", "omnipresent",
  "printful", "convertkit", "lottiefiles",
  "webflow", "framer", "sketch", "miro",
  "metalab", "hugeinc", "instrument", "mazedesign",
]);

const WORLDWIDE_SIGNALS = [
  "worldwide", "work from anywhere", "globally", "any location",
  "location independent", "open to candidates globally",
  "hire from anywhere", "no geographic restriction",
  "distributed team", "remote friendly", "across the globe",
  "open to all locations", "timezone-flexible", "timezone agnostic",
  "location-agnostic", "location agnostic", "any country",
  "regardless of location", "truly remote", "100% distributed",
  "fully distributed", "global workforce", "remote-first",
  "we hire everywhere", "remote without borders", "any timezone",
  "no location restrictions", "all geographies",
];

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function findWorldwideSignals(text: string): string[] {
  const lower = text.toLowerCase();
  return WORLDWIDE_SIGNALS.filter((s) => lower.includes(s));
}

async function main() {
  const trustedGreenhouse = REMOTE_COMPANIES.filter(
    (c) => c.atsType === "greenhouse" && c.atsSlug && TRUSTED_SLUGS.has(c.atsSlug)
  );

  console.log(`Scanning ${trustedGreenhouse.length} trusted Greenhouse companies...\n`);

  let totalRaw = 0;
  let totalRejected = 0;
  let rescuable = 0;
  const examples: { company: string; title: string; location: string; reason: string; signals: string[] }[] = [];

  for (const company of trustedGreenhouse) {
    try {
      const res = await fetchWithRetry(
        `https://boards-api.greenhouse.io/v1/boards/${company.atsSlug}/jobs?content=true`,
        { headers: { "User-Agent": "worldglide-debug/1.0" }, timeoutMs: 15000 }
      );
      if (!res.ok) continue;

      const data = await res.json();
      const items = data.jobs || [];
      totalRaw += items.length;

      for (const item of items) {
        const location = item.location?.name || "";
        const fullDesc = stripHtml(item.content || "");
        const category = categorizeJob(item.title);
        if (!category) continue; // skip non-engineering/product/design

        const result = analyzeWorldwideRemote({
          title: item.title,
          description: fullDesc.slice(0, 200), // current truncated behavior
          location,
          companySlug: company.atsSlug!,
        });

        if (!result.pass) {
          totalRejected++;

          // Now check full description for worldwide signals
          const signals = findWorldwideSignals(fullDesc);
          if (signals.length > 0) {
            rescuable++;
            examples.push({
              company: company.name,
              title: item.title,
              location,
              reason: result.reason,
              signals,
            });
          }
        }
      }
    } catch {
      // skip failed companies
    }
  }

  console.log("═══════════════════════════════════════════════════");
  console.log(`Total raw jobs (eng/product/design): ${totalRaw}`);
  console.log(`Rejected by current filter: ${totalRejected}`);
  console.log(`Rescuable (worldwide signal in full desc): ${rescuable}`);
  console.log("═══════════════════════════════════════════════════\n");

  if (examples.length > 0) {
    console.log("RESCUABLE JOBS (rejected but have worldwide signals in description):\n");
    for (const ex of examples.slice(0, 30)) {
      console.log(`  ${ex.company} — ${ex.title}`);
      console.log(`    location: "${ex.location}"`);
      console.log(`    rejected: ${ex.reason}`);
      console.log(`    signals:  ${ex.signals.join(", ")}`);
      console.log();
    }
    if (examples.length > 30) {
      console.log(`  ... and ${examples.length - 30} more`);
    }
  } else {
    console.log("No rescuable jobs found.");
  }
}

main().catch(console.error);
