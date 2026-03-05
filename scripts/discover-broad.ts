/**
 * discover-broad.ts
 * Broader ATS discovery: probes hundreds of common slug patterns
 * across Greenhouse, Lever, and Ashby.
 *
 * Strategy: tech companies often use simple, lowercase slugs.
 * We probe common words from tech/startup vocabulary.
 *
 * Usage: cd /Users/MacBook/Documents/worldglide && npx tsx scripts/discover-broad.ts
 */

import { REMOTE_COMPANIES } from "../src/lib/companies";

const EXISTING = new Set<string>();
for (const c of REMOTE_COMPANIES) {
  EXISTING.add(`${c.atsType}:${c.atsSlug}`);
}

// Common tech/startup slug words to probe
const SLUG_WORDS = [
  // AI & ML
  "anthropic", "openai", "cohere", "mistral", "stability", "perplexity",
  "replicate", "huggingface", "wandb", "anyscale", "modal", "modular",
  "together", "togetherai", "adept", "inflection", "jasper", "scale",
  "scaleai", "labelbox", "pinecone", "weaviate", "qdrant", "chroma",
  "cursor", "anysphere", "codeium", "tabnine", "sourcegraph",
  "deepgram", "assembly", "assemblyai", "elevenabs", "elevenlabs",
  "midjourney", "runway", "runwayml", "pika", "character", "characterai",
  "llamaindex", "langchain", "fixie", "dust", "dify", "voiceflow",
  "roboflow", "clarifai", "determined", "determined-ai", "mosaic",
  "mosaicml", "databricks", "datarobot", "h2o", "h2oai", "snorkel",
  "snorkelai", "tecton", "feast", "featureform",

  // Dev tools & infra
  "vercel", "supabase", "neon", "neondb", "turso", "fly", "flyio",
  "railway", "render", "deno", "bun", "oven", "prisma", "hasura",
  "apollo", "apollographql", "postman", "snyk", "sentry", "pagerduty",
  "pulumi", "hashicorp", "docker", "buildkite", "github", "gitlab",
  "mux", "twilio", "kong", "konghq", "auth0", "clerk", "stytch",
  "couchbase", "redpanda", "redpandadata", "confluent", "materialize",
  "timescale", "upstash", "planetscale", "cockroachlabs",
  "gitpod", "coder", "spacelift", "depot", "nx", "turborepo",
  "stackblitz", "codesandbox", "replit", "glitch", "codepen",
  "netlify", "cloudflare", "fastly", "akamai", "bunny", "bunnycdn",
  "resend", "postmark", "sendgrid", "mailgun", "loops",
  "inngest", "trigger", "triggerdev", "temporal", "prefect", "dagster",
  "tinybird", "axiom", "highlight", "posthog", "plausible", "fathom",
  "amplitude", "mixpanel", "segment", "rudderstack", "heap",
  "launchdarkly", "split", "statsig", "flagsmith", "unleash",
  "liveblocks", "partykit", "convex", "sanity", "strapi", "ghost",
  "contentful", "storyblok", "hygraph", "payload", "keystone",
  "zod", "trpc", "honojs",

  // Crypto & Web3
  "phantom", "uniswap", "uniswaplabs", "aave", "chainalysis", "chainlink",
  "chainlinklabs", "polygon", "polygonlabs", "near", "nearprotocol",
  "aptos", "aptoslabs", "sui", "mysten", "mystenlabs", "celestia",
  "eigenlabs", "eigenlayer", "immutable", "ondo", "ondofinance",
  "anchorage", "anchoragedigital", "zerion", "rainbow", "starkware",
  "starknet", "optimism", "arbitrum", "offchainlabs", "dydx",
  "makerdao", "compound", "lido", "lidofinance", "rocket", "rocketpool",
  "gmx", "synthetix", "yearn", "curve", "curvefi", "balancer",
  "sushiswap", "pancakeswap", "zapper", "debank", "nansen",
  "dune", "duneanalytics", "messari", "theblock", "blockworks",
  "kraken", "bitstamp", "gemini", "blockchain", "paxos",
  "fireblocks", "copper", "copperco", "cobo", "safeheron",
  "thirdweb", "alchemy", "infura", "quicknode", "moralis",
  "tenderly", "hardhat", "foundry", "openzeppelin",
  "worldcoin", "worldcoinorg", "wormhole", "wormholefoundation",
  "layerzero", "layerzerolabs", "axelar", "socket", "sockettech",
  "across", "acrossprotocol", "hop", "hopprotocol", "bridge",
  "magic", "magiceden", "opensea", "blur", "blurexchange",
  "tensor", "metaplex", "jupiter", "jupiterexchange", "raydium",
  "marinade", "drift", "driftprotocol", "pyth", "pythnetwork",
  "helium", "hivemapper", "render-network", "rendernetwork",
  "filecoin", "arweave", "ceramic", "textile", "fleek",

  // Fintech & payments
  "wise", "transferwise", "revolut", "plaid", "ramp", "deel",
  "remote", "remotecom", "oyster", "oystehr", "velocityglobal",
  "mercury", "brex", "gusto", "rippling", "justworks",
  "wave", "paystack", "flutterwave", "chipper", "mono", "stitch",
  "swan", "treezor", "marqeta", "lithic", "privacy", "privacycom",
  "column", "moov", "moderntreasury", "modern-treasury", "increase",
  "unit", "unitco", "bondai", "synapse", "synapsefi",
  "nuvei", "checkout", "adyen", "worldpay", "aci",

  // SaaS & productivity
  "notion", "linear", "loom", "miro", "canva", "pitch", "coda",
  "superhuman", "shortcut", "clickup", "zapier", "make", "retool",
  "appsmith", "framer", "grammarly", "aha", "calendly", "clockwise",
  "reclaim", "akiflow", "todoist", "asana", "monday", "mondaydotcom",
  "wrike", "teamwork", "basecamp", "twist", "threads", "lark",
  "slite", "nuclino", "tettra", "guru", "swimm", "readme",
  "gitbook", "mintlify", "docusaurus", "nextra",
  "intercom", "zendesk", "freshworks", "crisp", "helpscout",
  "hubspot", "salesforce", "pipedrive", "close", "closecrm",
  "attio", "folk", "affinity", "copper", "coppercrm",

  // Security
  "crowdstrike", "1password", "onepassword", "bitwarden", "vanta",
  "drata", "lacework", "wiz", "orca", "orcasecurity", "snyk",
  "aquasecurity", "aqua", "sysdig", "falco", "tenable",
  "sonarqube", "sonar", "sonarsource", "checkmarx", "veracode",
  "tailscale", "teleport", "strongdm", "boundary",
  "crowdsec", "signal-sciences", "wallarm", "imperva",

  // Remote-first pioneers
  "automattic", "buffer", "doist", "toggl", "hotjar", "toptal",
  "gitlab", "invision", "invsn", "zapier", "trello",
  "articulate", "aha", "lullabot", "elastic", "wikimedia",
  "mozilla", "ifixit", "knack", "articulate", "basecamp",
  "10up", "xwp", "developer",
  "sourcegraph", "gitpod", "sentry", "auth0", "netlify",
  "cloudflare", "digitalocean", "linode", "hetzner",
  "ionic", "expo", "callstack",

  // Healthcare & biotech
  "tempus", "flatiron", "flatironhealth", "ro", "hims",
  "cerebral", "spring", "springhealth", "headway",
  "ginger", "lyra", "lyrahealth", "virta", "virtahealth",
  "olive", "oliveai", "akasa", "notable", "notablehealth",

  // Education
  "coursera", "udemy", "edx", "codecademy", "datacamp",
  "pluralsight", "egghead", "frontendmasters", "brilliant",
  "duolingo", "cambly", "preply", "italki",

  // Gaming
  "roblox", "epicgames", "epic", "unity", "unitytech",
  "supercell", "king", "zynga", "niantic", "scopely",
  "playtika", "innersloth", "mojang",

  // Media & communications
  "spotify", "discord", "zoom", "hopin", "streamyard",
  "restream", "riverside", "descript", "transistor",
  "substack", "ghost", "beehiiv", "convertkit", "buttondown",
  "revue", "mailchimp", "campaignmonitor",
];

// Deduplicate slugs
const uniqueSlugs = [...new Set(SLUG_WORDS)];

interface Result {
  slug: string;
  ats: string;
  name: string;
  jobCount: number;
}

async function probe(
  ats: "greenhouse" | "lever" | "ashby",
  slug: string
): Promise<Result | null> {
  const key = `${ats}:${slug}`;
  if (EXISTING.has(key)) return null;

  const urls: Record<string, string> = {
    greenhouse: `https://boards-api.greenhouse.io/v1/boards/${slug}/jobs`,
    lever: `https://api.lever.co/v0/postings/${slug}?limit=1`,
    ashby: `https://api.ashbyhq.com/posting-api/job-board/${slug}`,
  };

  try {
    const res = await fetch(urls[ats], {
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return null;
    const data = await res.json();

    let count = 0;
    if (ats === "greenhouse" && Array.isArray(data?.jobs) && data.jobs.length > 0) {
      count = data.jobs.length;
      // Try to get company name from first job
      const compName = data.jobs[0]?.company?.name || slug;
      return { slug, ats, name: compName, jobCount: count };
    }
    if (ats === "lever" && Array.isArray(data) && data.length > 0) {
      count = data.length;
      return { slug, ats, name: slug, jobCount: count };
    }
    if (ats === "ashby" && Array.isArray(data?.jobs) && data.jobs.length > 0) {
      count = data.jobs.length;
      return { slug, ats, name: slug, jobCount: count };
    }
  } catch {
    // timeout or network error
  }
  return null;
}

async function main() {
  console.log(`\n🔍 Broad discovery: ${uniqueSlugs.length} slugs × 3 ATS = ${uniqueSlugs.length * 3} probes\n`);
  console.log(`Existing companies: ${REMOTE_COMPANIES.length}`);
  console.log(`Existing slug+ats combos: ${EXISTING.size}\n`);

  const allResults: Result[] = [];
  const atsTypes: ("greenhouse" | "lever" | "ashby")[] = ["greenhouse", "lever", "ashby"];

  for (const ats of atsTypes) {
    console.log(`\n── ${ats.toUpperCase()} ──`);
    const slugsToProbe = uniqueSlugs.filter((s) => !EXISTING.has(`${ats}:${s}`));
    console.log(`  ${slugsToProbe.length} slugs to probe (${uniqueSlugs.length - slugsToProbe.length} already known)`);

    // Batch of 15 concurrent with 200ms between batches
    for (let i = 0; i < slugsToProbe.length; i += 15) {
      const batch = slugsToProbe.slice(i, i + 15);
      const results = await Promise.allSettled(
        batch.map((slug) => probe(ats, slug))
      );

      for (const r of results) {
        if (r.status === "fulfilled" && r.value) {
          allResults.push(r.value);
          const v = r.value;
          console.log(`  ✅ ${v.name} (${v.slug}) → ${v.jobCount} jobs`);
        }
      }

      if (i + 15 < slugsToProbe.length) {
        await new Promise((r) => setTimeout(r, 200));
      }
    }
  }

  // ─── Output ───
  console.log(`\n\n═══════════════════════════════════════════`);
  console.log(`✅ TOTAL NEW: ${allResults.length} companies verified`);
  console.log(`═══════════════════════════════════════════\n`);

  // Group by ATS
  const byAts = new Map<string, Result[]>();
  for (const r of allResults) {
    const list = byAts.get(r.ats) || [];
    list.push(r);
    byAts.set(r.ats, list);
  }

  for (const [ats, results] of byAts) {
    console.log(`\n  // ── discovered ${new Date().toISOString().slice(0, 10)} — ${ats} ──`);
    for (const c of results.sort((a, b) => a.name.localeCompare(b.name))) {
      const name = c.name;
      const pad1 = " ".repeat(Math.max(1, 28 - name.length));
      const careersBase =
        ats === "greenhouse"
          ? `https://boards.greenhouse.io/${c.slug}`
          : ats === "lever"
            ? `https://jobs.lever.co/${c.slug}`
            : `https://jobs.ashbyhq.com/${c.slug}`;
      const pad2 = " ".repeat(Math.max(1, 55 - careersBase.length));
      console.log(
        `  { name: "${name}",${pad1}domain: "${c.slug}.com",  careersUrl: "${careersBase}",${pad2}atsType: "${ats}", atsSlug: "${c.slug}" },`
      );
    }
  }

  console.log(`\nTotal job openings across new companies: ${allResults.reduce((s, r) => s + r.jobCount, 0)}`);
}

main().catch(console.error);
