/**
 * Discover companies on SmartRecruiters and Workable.
 * Tests known remote-first company slugs against both APIs.
 */

// Common slugs to test against SmartRecruiters and Workable
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
];

interface Result {
  slug: string;
  ats: string;
  name: string;
  jobCount: number;
}

async function probeSR(slug: string): Promise<Result | null> {
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
  try {
    const res = await fetch(
      `https://apply.workable.com/api/v1/widget/accounts/${slug}`,
      { signal: AbortSignal.timeout(6000) }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const jobs = data.jobs || [];
    if (jobs.length > 0) {
      return { slug, ats: "workable", name: slug, jobCount: jobs.length };
    }
  } catch {}
  return null;
}

async function main() {
  console.log("🔍 Discovering SmartRecruiters & Workable companies...\n");

  const srResults: Result[] = [];
  const wbResults: Result[] = [];

  // SmartRecruiters
  console.log(`── SMARTRECRUITERS (${SR_SLUGS.length} slugs) ──`);
  for (let i = 0; i < SR_SLUGS.length; i += 10) {
    const batch = SR_SLUGS.slice(i, i + 10);
    const results = await Promise.allSettled(batch.map(probeSR));
    for (const r of results) {
      if (r.status === "fulfilled" && r.value) {
        srResults.push(r.value);
        console.log(`  ✅ ${r.value.name} (${r.value.slug}) → ${r.value.jobCount} jobs`);
      }
    }
    if (i + 10 < SR_SLUGS.length) await new Promise((r) => setTimeout(r, 200));
  }

  // Workable
  console.log(`\n── WORKABLE (${WORKABLE_SLUGS.length} slugs) ──`);
  for (let i = 0; i < WORKABLE_SLUGS.length; i += 10) {
    const batch = WORKABLE_SLUGS.slice(i, i + 10);
    const results = await Promise.allSettled(batch.map(probeWorkable));
    for (const r of results) {
      if (r.status === "fulfilled" && r.value) {
        wbResults.push(r.value);
        console.log(`  ✅ ${r.value.name} (${r.value.slug}) → ${r.value.jobCount} jobs`);
      }
    }
    if (i + 10 < WORKABLE_SLUGS.length) await new Promise((r) => setTimeout(r, 200));
  }

  // Output
  console.log(`\n═══════════════════════════════════════════`);
  console.log(`SmartRecruiters: ${srResults.length} companies (${srResults.reduce((s, r) => s + r.jobCount, 0)} total jobs)`);
  console.log(`Workable: ${wbResults.length} companies (${wbResults.reduce((s, r) => s + r.jobCount, 0)} total jobs)`);
  console.log(`═══════════════════════════════════════════\n`);

  // Print companies.ts entries
  for (const r of [...srResults, ...wbResults].sort((a, b) => a.ats.localeCompare(b.ats) || a.name.localeCompare(b.name))) {
    const pad = " ".repeat(Math.max(1, 24 - r.name.length));
    const ats = r.ats;
    const careersBase = ats === "smartrecruiters"
      ? `https://jobs.smartrecruiters.com/${r.slug}`
      : `https://apply.workable.com/${r.slug}`;
    console.log(
      `  { name: "${r.name}",${pad}domain: "${r.slug}.com",  careersUrl: "${careersBase}", atsType: "${ats}", atsSlug: "${r.slug}" },`
    );
  }
}

main().catch(console.error);
