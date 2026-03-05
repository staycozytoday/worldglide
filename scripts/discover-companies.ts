/**
 * discover-companies.ts
 * Probes ATS APIs with curated slugs of known remote-first companies.
 * Outputs verified companies ready to paste into companies.ts.
 *
 * Usage: cd /Users/MacBook/Documents/worldglide && npx tsx scripts/discover-companies.ts
 */

const EXISTING_SLUGS = new Set<string>();

// We'll populate this from the actual companies.ts at runtime
import { REMOTE_COMPANIES } from "../src/lib/companies";
for (const c of REMOTE_COMPANIES) {
  EXISTING_SLUGS.add(`${c.atsType}:${c.atsSlug}`);
}

interface Candidate {
  slug: string;
  ats: "greenhouse" | "lever" | "ashby";
  name?: string; // override display name
}

// ─── Curated list of known remote-first companies to probe ───
// These are companies commonly found on remote work databases,
// "awesome remote" lists, and known for worldwide hiring.
const CANDIDATES: Candidate[] = [
  // ══════════════════════════════════════
  // GREENHOUSE candidates
  // ══════════════════════════════════════

  // AI / ML
  { slug: "openai", ats: "greenhouse", name: "OpenAI" },
  { slug: "cohere", ats: "greenhouse", name: "Cohere" },
  { slug: "huggingface", ats: "greenhouse", name: "Hugging Face" },
  { slug: "mistralai", ats: "greenhouse", name: "Mistral AI" },
  { slug: "stability", ats: "greenhouse", name: "Stability AI" },
  { slug: "perplexityai", ats: "greenhouse", name: "Perplexity AI" },
  { slug: "replit", ats: "greenhouse", name: "Replit" },
  { slug: "anyscale", ats: "greenhouse", name: "Anyscale" },
  { slug: "weights", ats: "greenhouse", name: "Weights & Biases" },
  { slug: "wandb", ats: "greenhouse", name: "Weights & Biases" },
  { slug: "deeplearningai", ats: "greenhouse", name: "DeepLearning.AI" },
  { slug: "runwayml", ats: "greenhouse", name: "Runway" },
  { slug: "midjourney", ats: "greenhouse", name: "Midjourney" },
  { slug: "together", ats: "greenhouse", name: "Together AI" },
  { slug: "togetherai", ats: "greenhouse", name: "Together AI" },
  { slug: "modal", ats: "greenhouse", name: "Modal" },
  { slug: "modular", ats: "greenhouse", name: "Modular" },
  { slug: "character", ats: "greenhouse", name: "Character.AI" },
  { slug: "characterai", ats: "greenhouse", name: "Character.AI" },
  { slug: "adept", ats: "greenhouse", name: "Adept AI" },
  { slug: "adeptai", ats: "greenhouse", name: "Adept AI" },
  { slug: "inflection", ats: "greenhouse", name: "Inflection AI" },
  { slug: "inflectionai", ats: "greenhouse", name: "Inflection AI" },
  { slug: "jasper", ats: "greenhouse", name: "Jasper AI" },
  { slug: "jasperai", ats: "greenhouse", name: "Jasper AI" },
  { slug: "scale", ats: "greenhouse", name: "Scale AI" },
  { slug: "scaleai", ats: "greenhouse", name: "Scale AI" },
  { slug: "labelbox", ats: "greenhouse", name: "Labelbox" },
  { slug: "pinecone", ats: "greenhouse", name: "Pinecone" },
  { slug: "weaviate", ats: "greenhouse", name: "Weaviate" },
  { slug: "qdrant", ats: "greenhouse", name: "Qdrant" },
  { slug: "chromadb", ats: "greenhouse", name: "Chroma" },

  // Dev tools & infrastructure
  { slug: "vercel", ats: "greenhouse", name: "Vercel" },
  { slug: "supabase", ats: "greenhouse", name: "Supabase" },
  { slug: "neon", ats: "greenhouse", name: "Neon" },
  { slug: "neondb", ats: "greenhouse", name: "Neon" },
  { slug: "turso", ats: "greenhouse", name: "Turso" },
  { slug: "fly", ats: "greenhouse", name: "Fly.io" },
  { slug: "flyio", ats: "greenhouse", name: "Fly.io" },
  { slug: "railway", ats: "greenhouse", name: "Railway" },
  { slug: "render", ats: "greenhouse", name: "Render" },
  { slug: "deno", ats: "greenhouse", name: "Deno" },
  { slug: "bun", ats: "greenhouse", name: "Bun" },
  { slug: "prisma", ats: "greenhouse", name: "Prisma" },
  { slug: "hasura", ats: "greenhouse", name: "Hasura" },
  { slug: "apollographql", ats: "greenhouse", name: "Apollo GraphQL" },
  { slug: "apollo", ats: "greenhouse", name: "Apollo GraphQL" },
  { slug: "postman", ats: "greenhouse", name: "Postman" },
  { slug: "snyk", ats: "greenhouse", name: "Snyk" },
  { slug: "sonarqube", ats: "greenhouse", name: "SonarQube" },
  { slug: "sonar", ats: "greenhouse", name: "SonarSource" },
  { slug: "sonarsource", ats: "greenhouse", name: "SonarSource" },
  { slug: "sentry", ats: "greenhouse", name: "Sentry" },
  { slug: "pagerduty", ats: "greenhouse", name: "PagerDuty" },
  { slug: "pulumi", ats: "greenhouse", name: "Pulumi" },
  { slug: "terraform", ats: "greenhouse", name: "HashiCorp" },
  { slug: "hashicorp", ats: "greenhouse", name: "HashiCorp" },
  { slug: "docker", ats: "greenhouse", name: "Docker" },
  { slug: "buildkite", ats: "greenhouse", name: "Buildkite" },
  { slug: "github", ats: "greenhouse", name: "GitHub" },
  { slug: "mux", ats: "greenhouse", name: "Mux" },
  { slug: "twilio", ats: "greenhouse", name: "Twilio" },
  { slug: "kong", ats: "greenhouse", name: "Kong" },
  { slug: "konghq", ats: "greenhouse", name: "Kong" },
  { slug: "auth0", ats: "greenhouse", name: "Auth0" },
  { slug: "clerk", ats: "greenhouse", name: "Clerk" },
  { slug: "stytch", ats: "greenhouse", name: "Stytch" },
  { slug: "planetscale", ats: "greenhouse", name: "PlanetScale" },
  { slug: "couchbase", ats: "greenhouse", name: "Couchbase" },
  { slug: "redpanda", ats: "greenhouse", name: "Redpanda" },
  { slug: "redpandadata", ats: "greenhouse", name: "Redpanda" },
  { slug: "confluent", ats: "greenhouse", name: "Confluent" },
  { slug: "materialize", ats: "greenhouse", name: "Materialize" },
  { slug: "timescale", ats: "greenhouse", name: "Timescale" },
  { slug: "yugabyte", ats: "greenhouse", name: "YugabyteDB" },
  { slug: "cockroachlabs", ats: "greenhouse", name: "CockroachDB" },
  { slug: "upstash", ats: "greenhouse", name: "Upstash" },

  // Crypto & Web3
  { slug: "phantom", ats: "greenhouse", name: "Phantom" },
  { slug: "uniswap", ats: "greenhouse", name: "Uniswap" },
  { slug: "uniswaplabs", ats: "greenhouse", name: "Uniswap Labs" },
  { slug: "aave", ats: "greenhouse", name: "Aave" },
  { slug: "chainalysis", ats: "greenhouse", name: "Chainalysis" },
  { slug: "chainlink", ats: "greenhouse", name: "Chainlink" },
  { slug: "chainlinklabs", ats: "greenhouse", name: "Chainlink Labs" },
  { slug: "polygon", ats: "greenhouse", name: "Polygon" },
  { slug: "polygonlabs", ats: "greenhouse", name: "Polygon Labs" },
  { slug: "nearprotocol", ats: "greenhouse", name: "NEAR Protocol" },
  { slug: "near", ats: "greenhouse", name: "NEAR Protocol" },
  { slug: "aptos", ats: "greenhouse", name: "Aptos" },
  { slug: "aptoslabs", ats: "greenhouse", name: "Aptos Labs" },
  { slug: "sui", ats: "greenhouse", name: "Sui" },
  { slug: "mysten", ats: "greenhouse", name: "Mysten Labs" },
  { slug: "mystenlabs", ats: "greenhouse", name: "Mysten Labs" },
  { slug: "celestia", ats: "greenhouse", name: "Celestia" },
  { slug: "eigenlabs", ats: "greenhouse", name: "EigenLayer" },
  { slug: "eigenlayer", ats: "greenhouse", name: "EigenLayer" },
  { slug: "immutable", ats: "greenhouse", name: "Immutable" },
  { slug: "ondo", ats: "greenhouse", name: "Ondo Finance" },
  { slug: "ondofinance", ats: "greenhouse", name: "Ondo Finance" },
  { slug: "anchorage", ats: "greenhouse", name: "Anchorage Digital" },
  { slug: "anchoragedigital", ats: "greenhouse", name: "Anchorage Digital" },
  { slug: "zerion", ats: "greenhouse", name: "Zerion" },
  { slug: "rainbow", ats: "greenhouse", name: "Rainbow" },
  { slug: "starkware", ats: "greenhouse", name: "StarkWare" },
  { slug: "starknet", ats: "greenhouse", name: "StarkNet" },
  { slug: "optimism", ats: "greenhouse", name: "Optimism" },
  { slug: "arbitrum", ats: "greenhouse", name: "Arbitrum" },
  { slug: "offchainlabs", ats: "greenhouse", name: "Offchain Labs" },
  { slug: "dydx", ats: "greenhouse", name: "dYdX" },
  { slug: "makerdao", ats: "greenhouse", name: "MakerDAO" },

  // Fintech & payments
  { slug: "wise", ats: "greenhouse", name: "Wise" },
  { slug: "transferwise", ats: "greenhouse", name: "Wise" },
  { slug: "revolut", ats: "greenhouse", name: "Revolut" },
  { slug: "plaid", ats: "greenhouse", name: "Plaid" },
  { slug: "ramp", ats: "greenhouse", name: "Ramp" },
  { slug: "deel", ats: "greenhouse", name: "Deel" },
  { slug: "remote", ats: "greenhouse", name: "Remote.com" },
  { slug: "remotecom", ats: "greenhouse", name: "Remote.com" },
  { slug: "oyster", ats: "greenhouse", name: "Oyster" },
  { slug: "oystehr", ats: "greenhouse", name: "Oyster HR" },
  { slug: "velocity", ats: "greenhouse", name: "Velocity Global" },
  { slug: "velocityglobal", ats: "greenhouse", name: "Velocity Global" },

  // SaaS & productivity
  { slug: "notion", ats: "greenhouse", name: "Notion" },
  { slug: "linear", ats: "greenhouse", name: "Linear" },
  { slug: "loom", ats: "greenhouse", name: "Loom" },
  { slug: "miro", ats: "greenhouse", name: "Miro" },
  { slug: "canva", ats: "greenhouse", name: "Canva" },
  { slug: "pitch", ats: "greenhouse", name: "Pitch" },
  { slug: "coda", ats: "greenhouse", name: "Coda" },
  { slug: "superhuman", ats: "greenhouse", name: "Superhuman" },
  { slug: "shortcut", ats: "greenhouse", name: "Shortcut" },
  { slug: "clickup", ats: "greenhouse", name: "ClickUp" },
  { slug: "mondaydotcom", ats: "greenhouse", name: "monday.com" },
  { slug: "zapier", ats: "greenhouse", name: "Zapier" },
  { slug: "make", ats: "greenhouse", name: "Make" },
  { slug: "retool", ats: "greenhouse", name: "Retool" },
  { slug: "appsmith", ats: "greenhouse", name: "Appsmith" },
  { slug: "framer", ats: "greenhouse", name: "Framer" },

  // Security
  { slug: "crowdstrike", ats: "greenhouse", name: "CrowdStrike" },
  { slug: "1password", ats: "greenhouse", name: "1Password" },
  { slug: "onepassword", ats: "greenhouse", name: "1Password" },
  { slug: "tailscale", ats: "greenhouse", name: "Tailscale" },
  { slug: "bitwarden", ats: "greenhouse", name: "Bitwarden" },
  { slug: "vanta", ats: "greenhouse", name: "Vanta" },
  { slug: "drata", ats: "greenhouse", name: "Drata" },
  { slug: "lacework", ats: "greenhouse", name: "Lacework" },
  { slug: "wiz", ats: "greenhouse", name: "Wiz" },

  // Commerce & CMS
  { slug: "shopify", ats: "greenhouse", name: "Shopify" },
  { slug: "bigcommerce", ats: "greenhouse", name: "BigCommerce" },
  { slug: "sanity", ats: "greenhouse", name: "Sanity" },
  { slug: "strapi", ats: "greenhouse", name: "Strapi" },
  { slug: "ghost", ats: "greenhouse", name: "Ghost" },

  // Other well-known remote companies
  { slug: "automattic", ats: "greenhouse", name: "Automattic" },
  { slug: "buffer", ats: "greenhouse", name: "Buffer" },
  { slug: "doist", ats: "greenhouse", name: "Doist" },
  { slug: "toggl", ats: "greenhouse", name: "Toggl" },
  { slug: "basecamp", ats: "greenhouse", name: "Basecamp" },
  { slug: "hotjar", ats: "greenhouse", name: "Hotjar" },
  { slug: "datadog", ats: "greenhouse", name: "Datadog" },
  { slug: "elastic", ats: "greenhouse", name: "Elastic" },

  // ══════════════════════════════════════
  // LEVER candidates
  // ══════════════════════════════════════
  { slug: "neon-2", ats: "lever", name: "Neon" },
  { slug: "supabase", ats: "lever", name: "Supabase" },
  { slug: "vercel", ats: "lever", name: "Vercel" },
  { slug: "figma", ats: "lever", name: "Figma" },
  { slug: "linear", ats: "lever", name: "Linear" },
  { slug: "loom", ats: "lever", name: "Loom" },
  { slug: "notion", ats: "lever", name: "Notion" },
  { slug: "framer", ats: "lever", name: "Framer" },
  { slug: "pitch", ats: "lever", name: "Pitch" },
  { slug: "coda", ats: "lever", name: "Coda" },
  { slug: "superhuman", ats: "lever", name: "Superhuman" },
  { slug: "zapier", ats: "lever", name: "Zapier" },
  { slug: "make", ats: "lever", name: "Make" },
  { slug: "retool", ats: "lever", name: "Retool" },
  { slug: "replit", ats: "lever", name: "Replit" },
  { slug: "coinbase", ats: "lever", name: "Coinbase" },
  { slug: "phantom", ats: "lever", name: "Phantom" },
  { slug: "paxos", ats: "lever", name: "Paxos" },
  { slug: "anchorage", ats: "lever", name: "Anchorage Digital" },
  { slug: "kraken", ats: "lever", name: "Kraken" },
  { slug: "bitstamp", ats: "lever", name: "Bitstamp" },
  { slug: "gemini-2", ats: "lever", name: "Gemini" },
  { slug: "blockchain", ats: "lever", name: "Blockchain.com" },
  { slug: "chainalysis", ats: "lever", name: "Chainalysis" },
  { slug: "snyk", ats: "lever", name: "Snyk" },
  { slug: "sentry", ats: "lever", name: "Sentry" },
  { slug: "docker", ats: "lever", name: "Docker" },
  { slug: "postman", ats: "lever", name: "Postman" },
  { slug: "hashicorp", ats: "lever", name: "HashiCorp" },
  { slug: "pulumi", ats: "lever", name: "Pulumi" },
  { slug: "grafana", ats: "lever", name: "Grafana Labs" },
  { slug: "elastic", ats: "lever", name: "Elastic" },
  { slug: "mux", ats: "lever", name: "Mux" },
  { slug: "twilio", ats: "lever", name: "Twilio" },
  { slug: "auth0", ats: "lever", name: "Auth0" },
  { slug: "okta", ats: "lever", name: "Okta" },
  { slug: "1password", ats: "lever", name: "1Password" },
  { slug: "automattic", ats: "lever", name: "Automattic" },
  { slug: "buffer", ats: "lever", name: "Buffer" },
  { slug: "toggl", ats: "lever", name: "Toggl" },
  { slug: "hotjar", ats: "lever", name: "Hotjar" },
  { slug: "toptal", ats: "lever", name: "Toptal" },
  { slug: "doist", ats: "lever", name: "Doist" },
  { slug: "remote", ats: "lever", name: "Remote.com" },
  { slug: "deel", ats: "lever", name: "Deel" },
  { slug: "oyster", ats: "lever", name: "Oyster HR" },
  { slug: "stripe", ats: "lever", name: "Stripe" },
  { slug: "plaid", ats: "lever", name: "Plaid" },
  { slug: "wise", ats: "lever", name: "Wise" },
  { slug: "revolut", ats: "lever", name: "Revolut" },
  { slug: "cloudflare", ats: "lever", name: "Cloudflare" },
  { slug: "fastly", ats: "lever", name: "Fastly" },
  { slug: "netlify", ats: "lever", name: "Netlify" },
  { slug: "fly", ats: "lever", name: "Fly.io" },
  { slug: "railway", ats: "lever", name: "Railway" },
  { slug: "render", ats: "lever", name: "Render" },
  { slug: "sanity-io", ats: "lever", name: "Sanity" },
  { slug: "webflow", ats: "lever", name: "Webflow" },
  { slug: "contentful", ats: "lever", name: "Contentful" },
  { slug: "ghost-foundation", ats: "lever", name: "Ghost" },
  { slug: "canva", ats: "lever", name: "Canva" },
  { slug: "miro", ats: "lever", name: "Miro" },

  // ══════════════════════════════════════
  // ASHBY candidates
  // ══════════════════════════════════════
  { slug: "openai", ats: "ashby", name: "OpenAI" },
  { slug: "vercel", ats: "ashby", name: "Vercel" },
  { slug: "linear", ats: "ashby", name: "Linear" },
  { slug: "supabase", ats: "ashby", name: "Supabase" },
  { slug: "resend", ats: "ashby", name: "Resend" },
  { slug: "cal", ats: "ashby", name: "Cal.com" },
  { slug: "calcom", ats: "ashby", name: "Cal.com" },
  { slug: "neon", ats: "ashby", name: "Neon" },
  { slug: "turso", ats: "ashby", name: "Turso" },
  { slug: "replicate", ats: "ashby", name: "Replicate" },
  { slug: "huggingface", ats: "ashby", name: "Hugging Face" },
  { slug: "cohere", ats: "ashby", name: "Cohere" },
  { slug: "mistral", ats: "ashby", name: "Mistral AI" },
  { slug: "perplexity", ats: "ashby", name: "Perplexity AI" },
  { slug: "cursor", ats: "ashby", name: "Cursor" },
  { slug: "anysphere", ats: "ashby", name: "Anysphere (Cursor)" },
  { slug: "codeium", ats: "ashby", name: "Codeium" },
  { slug: "replit", ats: "ashby", name: "Replit" },
  { slug: "railway", ats: "ashby", name: "Railway" },
  { slug: "render", ats: "ashby", name: "Render" },
  { slug: "fly", ats: "ashby", name: "Fly.io" },
  { slug: "deno", ats: "ashby", name: "Deno" },
  { slug: "bun", ats: "ashby", name: "Bun (Oven)" },
  { slug: "oven", ats: "ashby", name: "Oven (Bun)" },
  { slug: "prisma", ats: "ashby", name: "Prisma" },
  { slug: "clerk", ats: "ashby", name: "Clerk" },
  { slug: "stytch", ats: "ashby", name: "Stytch" },
  { slug: "upstash", ats: "ashby", name: "Upstash" },
  { slug: "inngest", ats: "ashby", name: "Inngest" },
  { slug: "trigger", ats: "ashby", name: "Trigger.dev" },
  { slug: "triggerdev", ats: "ashby", name: "Trigger.dev" },
  { slug: "tinybird", ats: "ashby", name: "Tinybird" },
  { slug: "axiom", ats: "ashby", name: "Axiom" },
  { slug: "highlight", ats: "ashby", name: "Highlight.io" },
  { slug: "posthog", ats: "ashby", name: "PostHog" },
  { slug: "sentry", ats: "ashby", name: "Sentry" },
  { slug: "gitpod", ats: "ashby", name: "Gitpod" },
  { slug: "coder", ats: "ashby", name: "Coder" },
  { slug: "spacelift", ats: "ashby", name: "Spacelift" },
  { slug: "depot", ats: "ashby", name: "Depot" },
  { slug: "buildkite", ats: "ashby", name: "Buildkite" },
  { slug: "planetscale", ats: "ashby", name: "PlanetScale" },
  { slug: "clickhouse", ats: "ashby", name: "ClickHouse" },
  { slug: "timescale", ats: "ashby", name: "Timescale" },
  { slug: "materialize", ats: "ashby", name: "Materialize" },
  { slug: "weaviate", ats: "ashby", name: "Weaviate" },
  { slug: "qdrant", ats: "ashby", name: "Qdrant" },
  { slug: "pinecone", ats: "ashby", name: "Pinecone" },
  { slug: "chroma", ats: "ashby", name: "Chroma" },
  { slug: "milvus", ats: "ashby", name: "Milvus" },
  { slug: "zilliz", ats: "ashby", name: "Zilliz" },
  { slug: "framer", ats: "ashby", name: "Framer" },
  { slug: "webflow", ats: "ashby", name: "Webflow" },
  { slug: "retool", ats: "ashby", name: "Retool" },
  { slug: "appsmith", ats: "ashby", name: "Appsmith" },
  { slug: "1password", ats: "ashby", name: "1Password" },
  { slug: "vanta", ats: "ashby", name: "Vanta" },
  { slug: "drata", ats: "ashby", name: "Drata" },
  { slug: "teleport", ats: "ashby", name: "Teleport" },
  { slug: "tailscale", ats: "ashby", name: "Tailscale" },
  { slug: "phantom", ats: "ashby", name: "Phantom" },
  { slug: "uniswap", ats: "ashby", name: "Uniswap" },
  { slug: "zerion", ats: "ashby", name: "Zerion" },
  { slug: "rainbow", ats: "ashby", name: "Rainbow" },
  { slug: "immutable", ats: "ashby", name: "Immutable" },
  { slug: "celestia", ats: "ashby", name: "Celestia" },
  { slug: "eigenlayer", ats: "ashby", name: "EigenLayer" },
  { slug: "aptos", ats: "ashby", name: "Aptos" },
  { slug: "mystenlabs", ats: "ashby", name: "Mysten Labs" },
  { slug: "starkware", ats: "ashby", name: "StarkWare" },
  { slug: "optimism", ats: "ashby", name: "Optimism" },
  { slug: "arbitrum", ats: "ashby", name: "Arbitrum" },
  { slug: "offchainlabs", ats: "ashby", name: "Offchain Labs" },
  { slug: "dydx", ats: "ashby", name: "dYdX" },
  { slug: "zapier", ats: "ashby", name: "Zapier" },
  { slug: "deel", ats: "ashby", name: "Deel" },
  { slug: "remote", ats: "ashby", name: "Remote.com" },
  { slug: "oyster", ats: "ashby", name: "Oyster HR" },
  { slug: "buffer", ats: "ashby", name: "Buffer" },
  { slug: "toggl", ats: "ashby", name: "Toggl" },
  { slug: "doist", ats: "ashby", name: "Doist" },
  { slug: "hotjar", ats: "ashby", name: "Hotjar" },
  { slug: "toptal", ats: "ashby", name: "Toptal" },
  { slug: "automattic", ats: "ashby", name: "Automattic" },
  { slug: "liveblocks", ats: "ashby", name: "Liveblocks" },
  { slug: "partykit", ats: "ashby", name: "PartyKit" },
  { slug: "convex", ats: "ashby", name: "Convex" },
  { slug: "sanity", ats: "ashby", name: "Sanity" },
  { slug: "ghost", ats: "ashby", name: "Ghost" },
];

// ─── API endpoints ───
function getUrl(ats: string, slug: string): string {
  switch (ats) {
    case "greenhouse":
      return `https://boards-api.greenhouse.io/v1/boards/${slug}/jobs`;
    case "lever":
      return `https://api.lever.co/v0/postings/${slug}?limit=1`;
    case "ashby":
      return `https://api.ashbyhq.com/posting-api/job-board/${slug}`;
    default:
      throw new Error(`Unknown ATS: ${ats}`);
  }
}

function hasJobs(ats: string, data: any): boolean {
  switch (ats) {
    case "greenhouse":
      return Array.isArray(data?.jobs) && data.jobs.length > 0;
    case "lever":
      return Array.isArray(data) && data.length > 0;
    case "ashby":
      return Array.isArray(data?.jobs) && data.jobs.length > 0;
    default:
      return false;
  }
}

function getJobCount(ats: string, data: any): number {
  switch (ats) {
    case "greenhouse":
      return data?.jobs?.length ?? 0;
    case "lever":
      return Array.isArray(data) ? data.length : 0;
    case "ashby":
      return data?.jobs?.length ?? 0;
    default:
      return 0;
  }
}

// ─── Main ───
async function main() {
  // Filter out already-known slugs
  const toProbe = CANDIDATES.filter(
    (c) => !EXISTING_SLUGS.has(`${c.ats}:${c.slug}`)
  );

  console.log(
    `\n🔍 Probing ${toProbe.length} candidates (${CANDIDATES.length - toProbe.length} already in database)\n`
  );

  const verified: {
    name: string;
    slug: string;
    ats: string;
    jobCount: number;
  }[] = [];

  // Batch by ATS to be polite
  const byAts = new Map<string, Candidate[]>();
  for (const c of toProbe) {
    const list = byAts.get(c.ats) || [];
    list.push(c);
    byAts.set(c.ats, list);
  }

  for (const [ats, candidates] of byAts) {
    console.log(`\n── ${ats.toUpperCase()} (${candidates.length} to probe) ──`);

    // Process in batches of 10 with delay
    for (let i = 0; i < candidates.length; i += 10) {
      const batch = candidates.slice(i, i + 10);
      const results = await Promise.allSettled(
        batch.map(async (c) => {
          const url = getUrl(c.ats, c.slug);
          const res = await fetch(url, {
            signal: AbortSignal.timeout(8000),
          });
          if (!res.ok) return null;
          const data = await res.json();
          if (hasJobs(c.ats, data)) {
            const count = getJobCount(c.ats, data);
            return { ...c, jobCount: count };
          }
          return null;
        })
      );

      for (const r of results) {
        if (r.status === "fulfilled" && r.value) {
          const v = r.value;
          verified.push(v);
          console.log(`  ✅ ${v.name || v.slug} (${v.slug}) → ${v.jobCount} jobs`);
        }
      }

      // Be polite: 300ms between batches
      if (i + 10 < candidates.length) {
        await new Promise((r) => setTimeout(r, 300));
      }
    }
  }

  // ─── Output results ───
  console.log(`\n\n═══════════════════════════════════════════`);
  console.log(`✅ VERIFIED: ${verified.length} new companies found`);
  console.log(`═══════════════════════════════════════════\n`);

  // Group by ATS for easy pasting
  const verifiedByAts = new Map<string, typeof verified>();
  for (const v of verified) {
    const list = verifiedByAts.get(v.ats) || [];
    list.push(v);
    verifiedByAts.set(v.ats, list);
  }

  for (const [ats, companies] of verifiedByAts) {
    console.log(`\n  // ── discovered ${new Date().toISOString().slice(0, 10)} — ${ats} ──`);
    for (const c of companies.sort((a, b) =>
      (a.name || a.slug).localeCompare(b.name || b.slug)
    )) {
      const name = c.name || c.slug;
      const pad1 = " ".repeat(Math.max(1, 24 - name.length));
      const domain = `${c.slug}.com`;
      const pad2 = " ".repeat(Math.max(1, 28 - domain.length));
      const careersBase =
        ats === "greenhouse"
          ? `https://boards.greenhouse.io/${c.slug}`
          : ats === "lever"
            ? `https://jobs.lever.co/${c.slug}`
            : `https://jobs.ashbyhq.com/${c.slug}`;
      console.log(
        `  { name: "${name}",${pad1}domain: "${domain}",${pad2}careersUrl: "${careersBase}", atsType: "${ats}", atsSlug: "${c.slug}" },`
      );
    }
  }

  console.log(`\n\nTotal new companies: ${verified.length}`);
  console.log(
    `Job count across new companies: ${verified.reduce((s, v) => s + v.jobCount, 0)}`
  );
}

main().catch(console.error);
