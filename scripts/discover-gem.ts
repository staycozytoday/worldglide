#!/usr/bin/env npx tsx
/**
 * Discover companies on Gem ATS.
 */
import { REMOTE_COMPANIES } from "../src/lib/companies";

const existingSlugs = new Set(
  REMOTE_COMPANIES.filter(c => c.atsType === "gem" && c.atsSlug)
    .map(c => c.atsSlug!.toLowerCase())
);

const slugs = [
  "figma", "notion", "linear", "vercel", "supabase", "railway",
  "webflow", "framer", "canva", "sketch", "miro", "pitch",
  "runway", "midjourney", "loom", "cal-com", "calcom",
  "raycast", "arc", "browser-company", "browsercompany",
  "stripe", "mercury", "ramp", "brex", "plaid",
  "anthropic", "openai", "mistral", "cohere", "perplexity",
  "deel", "remote", "oyster", "papaya-global",
  "spline", "readymag", "protopie", "principle",
  "ideo", "frog", "pentagram", "ueno", "metalab",
  "coinbase", "phantom", "circle", "chainalysis",
  "warp", "zed", "cursor", "replit",
  "posthog", "gitbook", "ghost", "convertkit",
  "sentry", "datadog", "grafana", "elastic",
  "tailscale", "1password", "bitwarden",
  // More design / creative
  "abstract", "lottiefiles", "rive", "protopie",
  "maze", "usertesting", "optimal-workshop",
  "dovetail", "hotjar", "fullstory", "amplitude",
  "mixpanel", "heap", "pendo", "productboard",
  // AI
  "cerebras", "groq", "together-ai", "togetherai",
  "coreweave", "lambda", "sambanova",
  "elevenlabs", "eleven-labs", "deepgram",
  "langchain", "llamaindex", "pinecone", "weaviate",
  // Crypto
  "alchemy", "consensys", "chainlink", "aave",
  "uniswap", "polygon", "arbitrum", "optimism",
  "eigenlayer", "celestia", "starkware", "starknet",
  "aptos", "aptoslabs", "sui", "mystenlabs",
];

async function main() {
  const deduped = [...new Set(slugs)].filter(s => !existingSlugs.has(s));
  console.log(`Testing ${deduped.length} slugs on Gem (${existingSlugs.size} already exist)...\n`);

  const found: { slug: string; count: number }[] = [];

  for (let i = 0; i < deduped.length; i += 5) {
    const batch = deduped.slice(i, i + 5);
    const results = await Promise.allSettled(batch.map(async slug => {
      try {
        const res = await fetch(`https://api.gem.com/job_board/v0/${slug}/job_posts/`, {
          signal: AbortSignal.timeout(6000),
          headers: { "Accept": "application/json" },
        });
        if (!res.ok) return null;
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          return { slug, count: data.length };
        }
      } catch {}
      return null;
    }));

    for (const r of results) {
      if (r.status === "fulfilled" && r.value) {
        found.push(r.value);
        console.log(`  ✓ ${r.value.slug} → ${r.value.count} jobs`);
      }
    }
    await new Promise(r => setTimeout(r, 300));
  }

  console.log(`\nFound ${found.length} new Gem companies:`);
  found.sort((a, b) => b.count - a.count);
  for (const f of found) {
    console.log(`  { name: "${f.slug}", domain: "${f.slug}.com", careersUrl: "https://jobs.gem.com/${f.slug}", atsType: "gem", atsSlug: "${f.slug}" }, // ${f.count} jobs`);
  }
}

main().catch(console.error);
