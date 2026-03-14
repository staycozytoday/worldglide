#!/usr/bin/env npx tsx
/**
 * ATS slug harvester — find new remote-first companies across ATS platforms.
 *
 * Strategy:
 * 1. Curated list of known remote-first companies not yet in companies.ts
 * 2. Generate slug permutations per name
 * 3. Test each slug against Greenhouse, Lever, Ashby, Workable, SmartRecruiters, Gem
 * 4. Filter out slugs already in companies.ts
 * 5. Sample up to 3 jobs through isWorldwideRemote()
 * 6. Output merge-ready entries sorted by worldwide job count
 *
 * Usage:
 *   npx tsx scripts/harvest-ats.ts
 *   npx tsx scripts/harvest-ats.ts --ats=greenhouse   # single ATS only
 *   npx tsx scripts/harvest-ats.ts --quick             # skip worldwide sampling
 */

import { REMOTE_COMPANIES } from "../src/lib/companies";
import { isWorldwideRemote } from "../src/lib/filter";
import { writeFileSync } from "fs";

// ─── ATS API endpoints ───────────────────────────────────────────────
const ATS_ENDPOINTS: Record<string, { url: (s: string) => string; method?: string; body?: any }> = {
  greenhouse: {
    url: (s) => `https://boards-api.greenhouse.io/v1/boards/${s}/jobs`,
  },
  lever: {
    url: (s) => `https://api.lever.co/v0/postings/${s}?mode=json`,
  },
  ashby: {
    url: (s) => `https://api.ashbyhq.com/posting-api/job-board/${s}`,
  },
  workable: {
    url: (s) => `https://apply.workable.com/api/v3/accounts/${s}/jobs`,
    method: "POST",
    body: JSON.stringify({ query: "", location: [], department: [], worktype: [], remote: [] }),
  },
  smartrecruiters: {
    url: (s) => `https://api.smartrecruiters.com/v1/companies/${s}/postings?limit=10`,
  },
  gem: {
    url: (s) => `https://api.gem.com/job_board/v0/${s}/job_posts/`,
  },
};

const ATS_CAREERS_URLS: Record<string, (slug: string) => string> = {
  greenhouse: (s) => `https://boards.greenhouse.io/${s}`,
  lever: (s) => `https://jobs.lever.co/${s}`,
  ashby: (s) => `https://jobs.ashbyhq.com/${s}`,
  workable: (s) => `https://apply.workable.com/${s}`,
  smartrecruiters: (s) => `https://jobs.smartrecruiters.com/${s}`,
  gem: (s) => `https://jobs.gem.com/${s}`,
};

// ─── Curated candidate list ──────────────────────────────────────────
// Known remote-first companies that should be in our database.
// Format: [name, domain]
const CANDIDATES: [string, string][] = [
  // Design-forward / agencies
  ["Webflow", "webflow.com"],
  ["Abstract", "abstract.com"],
  ["Loom", "loom.com"],
  ["Miro", "miro.com"],
  ["Pitch", "pitch.com"],
  ["Principle", "principle.is"],
  ["Sketch", "sketch.com"],
  ["Framer", "framer.com"],
  ["Canva", "canva.com"],
  ["ReadMe", "readme.com"],
  ["Storyblok", "storyblok.com"],
  ["Contentful", "contentful.com"],
  ["Sanity", "sanity.io"],
  ["Prismic", "prismic.io"],

  // Developer tools / infra
  ["Vercel", "vercel.com"],
  ["Supabase", "supabase.com"],
  ["Railway", "railway.app"],
  ["Render", "render.com"],
  ["Fly.io", "fly.io"],
  ["Neon", "neon.tech"],
  ["Turso", "turso.tech"],
  ["Upstash", "upstash.com"],
  ["Temporal", "temporal.io"],
  ["Dagster", "dagster.io"],
  ["Airbyte", "airbyte.com"],
  ["dbt Labs", "getdbt.com"],
  ["Retool", "retool.com"],
  ["Linear", "linear.app"],
  ["Raycast", "raycast.com"],
  ["Cal.com", "cal.com"],
  ["Resend", "resend.com"],
  ["Mintlify", "mintlify.com"],
  ["Clerk", "clerk.com"],
  ["WorkOS", "workos.com"],
  ["Zed", "zed.dev"],
  ["Warp", "warp.dev"],
  ["Doppler", "doppler.com"],
  ["Depot", "depot.dev"],
  ["Replit", "replit.com"],
  ["Coder", "coder.com"],
  ["GitPod", "gitpod.io"],
  ["Codacy", "codacy.com"],
  ["Snyk", "snyk.io"],
  ["Sentry", "sentry.io"],
  ["LaunchDarkly", "launchdarkly.com"],
  ["Split.io", "split.io"],
  ["Unleash", "getunleash.io"],
  ["Pulumi", "pulumi.com"],
  ["Hasura", "hasura.io"],
  ["Fauna", "fauna.com"],
  ["EdgeDB", "edgedb.com"],

  // Crypto / Web3 (truly remote)
  ["Paradigm", "paradigm.xyz"],
  ["a]16z Crypto", "a16zcrypto.com"],
  ["Alchemy", "alchemy.com"],
  ["Consensys", "consensys.net"],
  ["Chainalysis", "chainalysis.com"],
  ["Fireblocks", "fireblocks.com"],
  ["Anchorage", "anchorage.com"],
  ["Circle", "circle.com"],
  ["Phantom", "phantom.app"],
  ["Solana Labs", "solanalabs.com"],
  ["Aptos", "aptoslabs.com"],
  ["Sui", "sui.io"],
  ["StarkWare", "starkware.co"],
  ["Matter Labs", "matterlabs.dev"],
  ["Offchain Labs", "offchainlabs.com"],
  ["Immutable", "immutable.com"],
  ["Fuel Labs", "fuel.network"],
  ["Celestia", "celestia.org"],
  ["EigenLayer", "eigenlayer.xyz"],
  ["Parity", "parity.io"],
  ["Protocol Labs", "protocol.ai"],

  // SaaS / B2B
  ["Notion", "notion.so"],
  ["Airtable", "airtable.com"],
  ["Loom", "loom.com"],
  ["Calendly", "calendly.com"],
  ["Lattice", "lattice.com"],
  ["Culture Amp", "cultureamp.com"],
  ["Oyster HR", "oysterhr.com"],
  ["Deel", "deel.com"],
  ["Remote.com", "remote.com"],
  ["Papaya Global", "papayaglobal.com"],
  ["Multiplier", "usemultiplier.com"],
  ["Plane", "plane.com"],
  ["Vanta", "vanta.com"],
  ["Drata", "drata.com"],
  ["OneTrust", "onetrust.com"],
  ["Navan", "navan.com"],
  ["Brex", "brex.com"],
  ["Ramp", "ramp.com"],
  ["Mercury", "mercury.com"],
  ["Plaid", "plaid.com"],
  ["Modern Treasury", "moderntreasury.com"],
  ["Column", "column.com"],
  ["Pipe", "pipe.com"],
  ["Checkout.com", "checkout.com"],
  ["Adyen", "adyen.com"],

  // Data / AI / ML
  ["Hugging Face", "huggingface.co"],
  ["Weights & Biases", "wandb.ai"],
  ["Scale AI", "scale.com"],
  ["Cohere", "cohere.com"],
  ["Anthropic", "anthropic.com"],
  ["Mistral", "mistral.ai"],
  ["Perplexity", "perplexity.ai"],
  ["Jasper", "jasper.ai"],
  ["Copy.ai", "copy.ai"],
  ["Deepgram", "deepgram.com"],
  ["Assembly AI", "assemblyai.com"],
  ["Labelbox", "labelbox.com"],
  ["Roboflow", "roboflow.com"],
  ["Modal", "modal.com"],
  ["Anyscale", "anyscale.com"],
  ["Prefect", "prefect.io"],
  ["Great Expectations", "greatexpectations.io"],
  ["Monte Carlo", "montecarlodata.com"],
  ["Fivetran", "fivetran.com"],
  ["Census", "getcensus.com"],
  ["Hex", "hex.tech"],
  ["Observable", "observablehq.com"],
  ["Streamlit", "streamlit.io"],

  // Security
  ["CrowdStrike", "crowdstrike.com"],
  ["SentinelOne", "sentinelone.com"],
  ["Wiz", "wiz.io"],
  ["Lacework", "lacework.com"],
  ["Orca Security", "orca.security"],
  ["Detectify", "detectify.com"],
  ["1Password", "1password.com"],
  ["Bitwarden", "bitwarden.com"],
  ["Tailscale", "tailscale.com"],
  ["WireGuard", "wireguard.com"],

  // Communication / Collaboration
  ["Liveblocks", "liveblocks.io"],
  ["Tiptap", "tiptap.dev"],
  ["Stream", "getstream.io"],
  ["Sendbird", "sendbird.com"],
  ["Twilio", "twilio.com"],
  ["Vonage", "vonage.com"],
  ["MessageBird", "messagebird.com"],

  // E-commerce / Marketplace
  ["Shopify", "shopify.com"],
  ["BigCommerce", "bigcommerce.com"],
  ["Saleor", "saleor.io"],
  ["Medusa", "medusajs.com"],
  ["Printful", "printful.com"],

  // Productivity / remote tools
  ["Twist", "twist.com"],
  ["Basecamp", "basecamp.com"],
  ["Todoist", "todoist.com"],
  ["Krisp", "krisp.ai"],
  ["Around", "around.co"],
  ["Tandem", "tandem.chat"],

  // European remote-first
  ["Pleo", "pleo.io"],
  ["Personio", "personio.com"],
  ["N26", "n26.com"],
  ["Wise", "wise.com"],
  ["Revolut", "revolut.com"],
  ["Monzo", "monzo.com"],
  ["Starling Bank", "starlingbank.com"],
  ["Featurespace", "featurespace.com"],
  ["MessageBird", "messagebird.com"],
  ["Meilisearch", "meilisearch.com"],
  ["Algolia", "algolia.com"],
  ["Datadog", "datadoghq.com"],
  ["Spendesk", "spendesk.com"],
  ["Alan", "alan.com"],
  ["Swile", "swile.co"],
  ["Back Market", "backmarket.com"],
];

// ─── Slug generation ─────────────────────────────────────────────────
function generateSlugs(name: string, domain: string): string[] {
  const slugs = new Set<string>();

  // Name variants
  const nameClean = name.toLowerCase().replace(/[^a-z0-9]+/g, "");
  slugs.add(nameClean);

  const nameHyphen = name.toLowerCase().replace(/[^a-z0-9\s]+/g, "").replace(/\s+/g, "-");
  if (nameHyphen !== nameClean) slugs.add(nameHyphen);

  // Domain prefix
  const domainSlug = domain.split(".")[0].toLowerCase();
  slugs.add(domainSlug);

  // Common suffixes/prefixes
  if (nameClean.endsWith("io") || nameClean.endsWith("ai") || nameClean.endsWith("co")) {
    slugs.add(nameClean.slice(0, -2));
  }
  if (nameClean.endsWith("labs")) {
    slugs.add(nameClean.slice(0, -4));
  }
  if (nameClean.endsWith("hq")) {
    slugs.add(nameClean.slice(0, -2));
  }

  // Try with "hq" suffix
  slugs.add(nameClean + "hq");
  slugs.add(domainSlug + "hq");

  // Try with "inc", "app" suffixes
  slugs.add(nameClean + "inc");
  slugs.add(nameClean + "app");

  // Try "get" prefix
  if (domainSlug.startsWith("get")) {
    slugs.add(domainSlug.slice(3));
  } else {
    slugs.add("get" + nameClean);
  }

  // Try "use" prefix
  if (domainSlug.startsWith("use")) {
    slugs.add(domainSlug.slice(3));
  }

  // Try underscores instead of hyphens
  const nameUnderscore = name.toLowerCase().replace(/[^a-z0-9\s]+/g, "").replace(/\s+/g, "_");
  if (nameUnderscore !== nameClean) slugs.add(nameUnderscore);

  return Array.from(slugs).filter((s) => s.length >= 2 && s.length <= 50);
}

// ─── ATS verification ────────────────────────────────────────────────
interface AtsHit {
  atsType: string;
  slug: string;
  jobCount: number;
  sampleJobs: any[];
}

async function tryAts(atsType: string, slug: string): Promise<{ count: number; sample: any[] }> {
  const ep = ATS_ENDPOINTS[atsType];
  const url = ep.url(slug);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);

  try {
    const opts: RequestInit = {
      method: ep.method || "GET",
      signal: controller.signal,
      headers: {
        "User-Agent": "worldglide-harvest/1.0",
        "Accept": "application/json",
        ...(ep.method === "POST" ? { "Content-Type": "application/json" } : {}),
      },
      ...(ep.body ? { body: ep.body } : {}),
    };

    const res = await fetch(url, opts);
    clearTimeout(timer);

    if (!res.ok) return { count: -1, sample: [] };
    const data = await res.json();

    // Extract job list per ATS
    let jobs: any[] = [];
    if (atsType === "greenhouse") jobs = data.jobs || [];
    else if (atsType === "lever") jobs = Array.isArray(data) ? data : [];
    else if (atsType === "ashby") jobs = data.jobs || [];
    else if (atsType === "workable") jobs = data.results || [];
    else if (atsType === "smartrecruiters") jobs = data.content || [];
    else if (atsType === "gem") jobs = Array.isArray(data) ? data : [];

    return { count: jobs.length, sample: jobs.slice(0, 5) };
  } catch {
    clearTimeout(timer);
    return { count: -1, sample: [] };
  }
}

// ─── Worldwide job sampling ──────────────────────────────────────────
function sampleWorldwide(atsType: string, slug: string, sampleJobs: any[]): number {
  let worldwideCount = 0;

  for (const item of sampleJobs) {
    let title = "";
    let location = "";
    let description = "";

    if (atsType === "greenhouse") {
      title = item.title || "";
      location = item.location?.name || "";
    } else if (atsType === "lever") {
      title = item.text || "";
      location = item.categories?.location || item.workplaceType || "";
      description = item.descriptionPlain || "";
    } else if (atsType === "ashby") {
      title = item.title || "";
      location = item.location || "";
      if (!item.isRemote) continue;
    } else if (atsType === "workable") {
      title = item.title || "";
      location = item.location?.city
        ? `${item.location.city}, ${item.location.country_code}`
        : item.location?.country || "";
    } else if (atsType === "smartrecruiters") {
      title = item.name || "";
      const loc = item.location || {};
      location = loc.remote
        ? `Remote${loc.city ? ` - ${loc.city}` : ""}`
        : [loc.city, loc.region, loc.country].filter(Boolean).join(", ");
    } else if (atsType === "gem") {
      title = item.title || "";
      location = item.location?.name || "";
      if (item.location_type !== "remote") continue;
    }

    const result = isWorldwideRemote({
      title,
      description,
      location,
      companySlug: slug,
    });

    if (result) worldwideCount++;
  }

  return worldwideCount;
}

// ─── Main ────────────────────────────────────────────────────────────
interface VerifiedResult {
  name: string;
  domain: string;
  atsType: string;
  atsSlug: string;
  jobCount: number;
  worldwideJobs: number;
  careersUrl: string;
}

async function main() {
  const args = process.argv.slice(2);
  const atsFilter = args.find((a) => a.startsWith("--ats="))?.split("=")[1];
  const quick = args.includes("--quick");

  // Build set of existing slugs and domains
  const existingSlugs = new Set(
    REMOTE_COMPANIES.map((c) => `${c.atsType}:${c.atsSlug?.toLowerCase()}`).filter(Boolean)
  );
  const existingDomains = new Set(REMOTE_COMPANIES.map((c) => c.domain.toLowerCase()));

  // Deduplicate candidates by domain
  const seen = new Set<string>();
  const uniqueCandidates = CANDIDATES.filter(([, domain]) => {
    const d = domain.toLowerCase();
    if (seen.has(d) || existingDomains.has(d)) return false;
    seen.add(d);
    return true;
  });

  console.error(
    `[harvest] ${CANDIDATES.length} candidates → ${uniqueCandidates.length} new (${CANDIDATES.length - uniqueCandidates.length} already exist or duplicate)`
  );

  const atsTypes = atsFilter
    ? [atsFilter]
    : Object.keys(ATS_ENDPOINTS);

  const verified: VerifiedResult[] = [];
  const BATCH_SIZE = 5;

  for (let i = 0; i < uniqueCandidates.length; i += BATCH_SIZE) {
    const batch = uniqueCandidates.slice(i, i + BATCH_SIZE);

    const batchResults = await Promise.all(
      batch.map(async ([name, domain]) => {
        const slugs = generateSlugs(name, domain);
        let bestHit: AtsHit | null = null;

        // Try each ATS × slug combination, stop at first hit
        for (const atsType of atsTypes) {
          for (const slug of slugs) {
            const key = `${atsType}:${slug}`;
            if (existingSlugs.has(key)) continue;

            const { count, sample } = await tryAts(atsType, slug);
            if (count > 0) {
              // Found a valid board with jobs
              if (!bestHit || count > bestHit.jobCount) {
                bestHit = { atsType, slug, jobCount: count, sampleJobs: sample };
              }
              break; // found it on this ATS, try next ATS for potentially better match
            }
          }
        }

        if (!bestHit) return null;

        // Sample worldwide jobs
        let worldwideJobs = 0;
        if (!quick) {
          worldwideJobs = sampleWorldwide(
            bestHit.atsType,
            bestHit.slug,
            bestHit.sampleJobs
          );
        }

        return {
          name,
          domain,
          atsType: bestHit.atsType,
          atsSlug: bestHit.slug,
          jobCount: bestHit.jobCount,
          worldwideJobs,
          careersUrl: ATS_CAREERS_URLS[bestHit.atsType](bestHit.slug),
        };
      })
    );

    for (const result of batchResults) {
      if (result) {
        verified.push(result);
        existingSlugs.add(`${result.atsType}:${result.atsSlug}`);
        console.error(
          `  ✓ ${result.name} → ${result.atsType}/${result.atsSlug} (${result.jobCount} jobs, ${result.worldwideJobs} worldwide)`
        );
      }
    }

    console.error(
      `[harvest] progress: ${Math.min(i + BATCH_SIZE, uniqueCandidates.length)}/${uniqueCandidates.length}`
    );

    if (i + BATCH_SIZE < uniqueCandidates.length) {
      await new Promise((r) => setTimeout(r, 600));
    }
  }

  // Sort by worldwide jobs descending, then total jobs
  verified.sort((a, b) => b.worldwideJobs - a.worldwideJobs || b.jobCount - a.jobCount);

  console.error(`\n[harvest] ═══════════════════════════════════════`);
  console.error(`[harvest] Found ${verified.length} new companies`);
  console.error(`[harvest] ${verified.filter((v) => v.worldwideJobs > 0).length} have worldwide jobs`);

  // Output as JSON
  console.log(JSON.stringify(verified, null, 2));

  // Also write merge-ready TypeScript entries
  const tsEntries = verified
    .map((v) => {
      const pad = (s: string, len: number) => s.padEnd(len);
      return `  { name: ${pad(`"${v.name}",`, 22)} domain: ${pad(`"${v.domain}",`, 28)} atsType: "${v.atsType}", atsSlug: "${v.atsSlug}" },`;
    })
    .join("\n");

  writeFileSync(
    "scripts/output/harvest-results.ts",
    `// Generated by harvest-ats.ts on ${new Date().toISOString().slice(0, 10)}\n// ${verified.length} companies found\n\n// Greenhouse:\n${verified.filter((v) => v.atsType === "greenhouse").map((v) => `  { name: "${v.name}", domain: "${v.domain}", atsType: "greenhouse", atsSlug: "${v.atsSlug}" }, // ${v.jobCount} jobs, ${v.worldwideJobs} worldwide`).join("\n")}\n\n// Lever:\n${verified.filter((v) => v.atsType === "lever").map((v) => `  { name: "${v.name}", domain: "${v.domain}", atsType: "lever", atsSlug: "${v.atsSlug}" }, // ${v.jobCount} jobs, ${v.worldwideJobs} worldwide`).join("\n")}\n\n// Ashby:\n${verified.filter((v) => v.atsType === "ashby").map((v) => `  { name: "${v.name}", domain: "${v.domain}", atsType: "ashby", atsSlug: "${v.atsSlug}" }, // ${v.jobCount} jobs, ${v.worldwideJobs} worldwide`).join("\n")}\n\n// Workable:\n${verified.filter((v) => v.atsType === "workable").map((v) => `  { name: "${v.name}", domain: "${v.domain}", atsType: "workable", atsSlug: "${v.atsSlug}" }, // ${v.jobCount} jobs, ${v.worldwideJobs} worldwide`).join("\n")}\n\n// SmartRecruiters:\n${verified.filter((v) => v.atsType === "smartrecruiters").map((v) => `  { name: "${v.name}", domain: "${v.domain}", atsType: "smartrecruiters", atsSlug: "${v.atsSlug}" }, // ${v.jobCount} jobs, ${v.worldwideJobs} worldwide`).join("\n")}\n\n// Gem:\n${verified.filter((v) => v.atsType === "gem").map((v) => `  { name: "${v.name}", domain: "${v.domain}", atsType: "gem", atsSlug: "${v.atsSlug}" }, // ${v.jobCount} jobs, ${v.worldwideJobs} worldwide`).join("\n")}\n`
  );

  console.error(`[harvest] Results written to scripts/output/harvest-results.ts`);
}

main().catch((err) => {
  console.error("[harvest] fatal:", err);
  process.exit(1);
});
