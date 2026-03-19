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

/**
 * Two tiers of signals:
 * - STRONG: tight signals currently used by the rescue filter (high confidence)
 * - WEAK: broader signals useful for discovery but too noisy for auto-rescue
 */
const STRONG_SIGNALS = [
  "work from anywhere in the world",
  "open to candidates worldwide",
  "open to candidates globally",
  "open to candidates from anywhere",
  "hire from anywhere in the world",
  "we hire everywhere in the world",
  "regardless of location",
  "no geographic restriction",
  "no location restrictions",
  "location is not a factor",
  "remote without borders",
  "any country in the world",
  "anywhere in the world",
  "from anywhere in the world",
  "based anywhere in the world",
  "live and work anywhere in the world",
  "open to all locations worldwide",
  "all countries are welcome",
  "this role is open globally",
  "this position is open globally",
  "can be performed from anywhere",
  "can be done from anywhere",
];

const WEAK_SIGNALS = [
  "worldwide", "work from anywhere", "globally", "any location",
  "location independent", "distributed team", "remote friendly",
  "across the globe", "timezone-flexible", "timezone agnostic",
  "location-agnostic", "any country", "truly remote",
  "100% distributed", "fully distributed", "global workforce",
  "remote-first", "we hire everywhere", "any timezone",
  "all geographies",
];

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function findSignals(text: string): { strong: string[]; weak: string[] } {
  const lower = text.toLowerCase();
  return {
    strong: STRONG_SIGNALS.filter((s) => lower.includes(s)),
    weak: WEAK_SIGNALS.filter((s) => lower.includes(s)),
  };
}

async function main() {
  const trustedGreenhouse = REMOTE_COMPANIES.filter(
    (c) => c.atsType === "greenhouse" && c.atsSlug && TRUSTED_SLUGS.has(c.atsSlug)
  );

  console.log(`Scanning ${trustedGreenhouse.length} trusted Greenhouse companies...\n`);

  let totalRaw = 0;
  let totalRejected = 0;
  let rescuableStrong = 0;
  let rescuableWeak = 0;
  const strongExamples: { company: string; title: string; location: string; reason: string; signals: string[] }[] = [];
  const weakExamples: { company: string; title: string; location: string; reason: string; signals: string[] }[] = [];

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

          // Check full description for worldwide signals (both tiers)
          const { strong, weak } = findSignals(fullDesc);
          if (strong.length > 0) {
            rescuableStrong++;
            strongExamples.push({
              company: company.name,
              title: item.title,
              location,
              reason: result.reason,
              signals: strong,
            });
          } else if (weak.length > 0) {
            rescuableWeak++;
            weakExamples.push({
              company: company.name,
              title: item.title,
              location,
              reason: result.reason,
              signals: weak,
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
  console.log(`Rescuable (STRONG signals): ${rescuableStrong}`);
  console.log(`Rescuable (weak signals only): ${rescuableWeak}`);
  console.log("═══════════════════════════════════════════════════\n");

  if (strongExamples.length > 0) {
    console.log("🟢 STRONG SIGNAL JOBS (would be rescued by current filter):\n");
    for (const ex of strongExamples.slice(0, 20)) {
      console.log(`  ${ex.company} — ${ex.title}`);
      console.log(`    location: "${ex.location}"`);
      console.log(`    rejected: ${ex.reason}`);
      console.log(`    signals:  ${ex.signals.join(", ")}`);
      console.log();
    }
    if (strongExamples.length > 20) {
      console.log(`  ... and ${strongExamples.length - 20} more`);
    }
  } else {
    console.log("🟢 No STRONG signal rescues found.\n");
  }

  if (weakExamples.length > 0) {
    console.log("🟡 WEAK SIGNAL JOBS (need manual review to promote signals):\n");
    for (const ex of weakExamples.slice(0, 15)) {
      console.log(`  ${ex.company} — ${ex.title}`);
      console.log(`    location: "${ex.location}"`);
      console.log(`    rejected: ${ex.reason}`);
      console.log(`    signals:  ${ex.signals.join(", ")}`);
      console.log();
    }
    if (weakExamples.length > 15) {
      console.log(`  ... and ${weakExamples.length - 15} more`);
    }
  } else {
    console.log("🟡 No weak signal jobs found.");
  }
}

main().catch(console.error);
