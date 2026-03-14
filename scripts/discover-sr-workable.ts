/**
 * Discover companies on SmartRecruiters and Workable.
 * Tests known remote-first company slugs against both APIs.
 * Filters out companies already in companies.ts.
 */

import { REMOTE_COMPANIES } from "../src/lib/companies";

// Build set of existing slugs
const existingSlugs = new Set(
  REMOTE_COMPANIES
    .filter((c) => c.atsSlug)
    .map((c) => `${c.atsType}:${c.atsSlug!.toLowerCase()}`)
);

// Common slugs to test against SmartRecruiters
const SR_SLUGS = [
  // big tech & SaaS
  "smartrecruiters", "spotify", "visa", "adidas", "bosch", "sap",
  "siemens", "ikea", "philips", "abn-amro", "ing", "ubisoft",
  "docusign", "sketch", "cern", "wolt", "bolt", "samsara",
  "avery-dennison", "equinix", "opentext", "finastra", "temenos",
  "backmarket", "doctolib", "contentstack", "aircall",
  // remote-first
  "automattic", "gitlab", "zapier", "buffer", "doist", "toggl",
  "hotjar", "toptal", "remote-com", "deel", "oyster", "remotecom",
  "velocityglobal", "loom", "notion", "linear",
  // crypto
  "coinbase", "kraken", "bitstamp", "blockchain", "bitpanda",
  // dev tools
  "sentry-io", "auth0", "elastic", "cloudflare", "mongodb",
  "hashicorp", "datadog", "grafana", "snyk", "miro",
  // fintech
  "wise", "revolut", "transferwise", "n26", "klarna", "stripe",
  "checkout-com", "adyen",
  // misc
  "epam", "thoughtworks", "xero", "canva", "atlassian",
  "intercom", "zendesk", "hubspot", "freshworks", "calendly",
  "typeform", "contentful", "algolia", "twilio", "segment",
  "amplitude", "mixpanel", "braze", "iterable",
  // new batch — European + remote-first expansion
  "personio", "pleo", "maze", "pitch", "contentful", "factorial",
  "travelperk", "back-market", "qonto", "sorare", "ledger",
  "scaleway", "ovhcloud", "dataiku", "mistral-ai", "alan",
  "malt", "pennylane", "payfit", "spendesk", "swile",
  "kingfisher", "schneider-electric", "thales", "airbus",
  "dhl", "zalando", "flixbus", "hellofresh", "deliveryhero",
  "delivery-hero", "trade-republic", "wefox", "moonpay",
  "bynder", "miro", "remote", "wikimedia", "mozilla",
  "sketch", "figma", "invision", "abstract", "principle",
  // design & creative
  "metalab", "huge", "designit", "ideo", "frog",
  "pentagram", "instrument", "fantasy", "work-and-co",
  "basic-agency", "basicagency", "ueno", "rally",
];

const WORKABLE_SLUGS = [
  // well-known remote companies
  "automattic", "gitlab-com", "zapier", "buffer", "doist",
  "toggl", "hotjar", "toptal", "remote", "deel", "oyster",
  // dev tools & SaaS
  "sentry", "netlify", "cloudflare", "vercel", "supabase",
  "linear-app", "notion", "figma", "framer", "webflow",
  "retool", "postman", "docker", "github", "mux",
  // crypto
  "coinbase", "kraken", "phantom", "uniswap", "chainalysis",
  "consensys", "alchemy", "thirdweb",
  // fintech
  "wise", "revolut", "stripe", "plaid", "ramp", "mercury",
  "brex", "gusto",
  // AI
  "anthropic", "openai", "cohere", "huggingface", "replicate",
  "runway", "stability-ai", "jasper-ai", "scale-ai",
  // remote infra
  "remotecom", "remote-com", "velocity-global", "papaya-global",
  // misc
  "epam", "thoughtworks", "xero", "canva", "atlassian",
  "intercom", "zendesk", "freshworks", "typeform",
  "contentful", "algolia", "twilio", "amplitude",
  "convertkit", "beehiiv", "substack", "ghost",
  "sanity-io", "strapi", "storyblok",
  // companies likely on Workable
  "taxfix", "bitpanda", "gigs", "leapsome", "personio",
  "babbel", "sumup", "travelperk", "factorial",
  "testgorilla", "remote-health", "omnipresent",
  "letsgoi", "workmotion", "boundlesshq",
  "crossover", "turing", "andela", "codecademy",
  "coursera", "udemy", "datacamp", "pluralsight",
  "brilliant", "duolingo",
  // new batch — European + design
  "pleo", "maze", "pitch", "qonto", "sorare",
  "dataiku", "malt", "pennylane", "payfit",
  "lottiefiles", "storyblok", "strapi", "saleor",
  "medusa", "meilisearch", "appwrite", "nhost",
  "causal", "grain", "krisp", "around",
  "printful", "deel-com", "remote-technology",
  "metalab", "huge", "designit", "ueno",
  "protocol-labs", "protocolai", "chain-io",
  "parity-technologies", "parity-io", "paritytech",
  "immutable-x", "immutablex",
];

interface Result {
  slug: string;
  ats: string;
  name: string;
  jobCount: number;
}

async function probeSR(slug: string): Promise<Result | null> {
  if (existingSlugs.has(`smartrecruiters:${slug}`)) return null;
  try {
    const res = await fetch(
      `https://api.smartrecruiters.com/v1/companies/${slug}/postings?limit=1`,
      { signal: AbortSignal.timeout(6000) }
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (data.totalFound > 0) {
      const compName = data.content?.[0]?.company?.name || slug;
      return { slug, ats: "smartrecruiters", name: compName, jobCount: data.totalFound };
    }
  } catch {}
  return null;
}

async function probeWorkable(slug: string): Promise<Result | null> {
  if (existingSlugs.has(`workable:${slug}`)) return null;
  try {
    const res = await fetch(
      `https://apply.workable.com/api/v3/accounts/${slug}/jobs`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: "", location: [], department: [], worktype: [], remote: [] }),
        signal: AbortSignal.timeout(6000),
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const jobs = data.results || [];
    if (jobs.length > 0) {
      const compName = data.name || slug;
      return { slug, ats: "workable", name: compName, jobCount: jobs.length };
    }
  } catch {}
  return null;
}

async function main() {
  console.log("Discovering SmartRecruiters & Workable companies...\n");

  const srResults: Result[] = [];
  const wbResults: Result[] = [];

  // Dedupe slug lists
  const srUnique = [...new Set(SR_SLUGS)];
  const wbUnique = [...new Set(WORKABLE_SLUGS)];

  // SmartRecruiters
  console.log(`── SMARTRECRUITERS (${srUnique.length} slugs) ──`);
  for (let i = 0; i < srUnique.length; i += 8) {
    const batch = srUnique.slice(i, i + 8);
    const results = await Promise.allSettled(batch.map(probeSR));
    for (const r of results) {
      if (r.status === "fulfilled" && r.value) {
        srResults.push(r.value);
        console.log(`  ✓ ${r.value.name} (${r.value.slug}) → ${r.value.jobCount} jobs`);
      }
    }
    if (i + 8 < srUnique.length) await new Promise((r) => setTimeout(r, 300));
  }

  // Workable
  console.log(`\n── WORKABLE (${wbUnique.length} slugs) ──`);
  for (let i = 0; i < wbUnique.length; i += 5) {
    const batch = wbUnique.slice(i, i + 5);
    const results = await Promise.allSettled(batch.map(probeWorkable));
    for (const r of results) {
      if (r.status === "fulfilled" && r.value) {
        wbResults.push(r.value);
        console.log(`  ✓ ${r.value.name} (${r.value.slug}) → ${r.value.jobCount} jobs`);
      }
    }
    if (i + 5 < wbUnique.length) await new Promise((r) => setTimeout(r, 400));
  }

  // Output
  console.log(`\n═══════════════════════════════════════════`);
  console.log(`SmartRecruiters: ${srResults.length} NEW companies found`);
  console.log(`Workable: ${wbResults.length} NEW companies found`);
  console.log(`═══════════════════════════════════════════\n`);

  // Print companies.ts entries (sorted by job count)
  const all = [...srResults, ...wbResults].sort((a, b) => b.jobCount - a.jobCount);
  console.log("// Merge-ready entries (sorted by job count):");
  for (const r of all) {
    const ats = r.ats;
    const careersBase = ats === "smartrecruiters"
      ? `https://jobs.smartrecruiters.com/${r.slug}`
      : `https://apply.workable.com/${r.slug}`;
    console.log(
      `  { name: "${r.name}", domain: "${r.slug}.com", careersUrl: "${careersBase}", atsType: "${ats}", atsSlug: "${r.slug}" }, // ${r.jobCount} jobs`
    );
  }
}

main().catch(console.error);
