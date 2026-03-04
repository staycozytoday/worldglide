#!/usr/bin/env node

/**
 * Discover companies with working ATS endpoints.
 * Tests many slug variations against ATS APIs.
 */

const ENDPOINTS = {
  greenhouse: (slug) => `https://boards-api.greenhouse.io/v1/boards/${slug}/jobs`,
  lever: (slug) => `https://api.lever.co/v0/postings/${slug}`,
  ashby: (slug) => `https://api.ashbyhq.com/posting-api/job-board/${slug}`,
};

async function trySlug(atsType, slug) {
  const url = ENDPOINTS[atsType]?.(slug);
  if (!url) return false;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(url, { signal: controller.signal, headers: { Accept: "application/json" } });
    clearTimeout(timeout);
    return res.ok;
  } catch {
    return false;
  }
}

import { readFileSync } from "fs";

// Load existing slugs
const companyFileRaw = readFileSync("/Users/MacBook/Documents/worldglide/src/lib/companies.ts", "utf-8");
const existingSlugs = new Set();
const re = /atsType:\s*"([^"]+)",\s*atsSlug:\s*"([^"]+)"/g;
let m;
while ((m = re.exec(companyFileRaw)) !== null) {
  existingSlugs.add(`${m[1]}:${m[2]}`);
}

// Slugs to test per ATS (excluding already-existing ones)
const GREENHOUSE_SLUGS = [
  "airbnb", "pinterest", "snapchat", "snap", "snapinc",
  "discord", "discord1", "discordinc", "notion",
  "dropbox", "spotify", "twitch", "reddit", "redditinc",
  "lyft", "uber", "uberinc", "instacart", "instacartinc",
  "robinhood", "plaid", "chime", "navan",
  "datadog", "datadoghq", "pagerduty", "twilio", "snyk",
  "hashicorp", "confluent", "vercel",
  "supabase", "postman", "jfrog", "miro", "miro1",
  "sentry", "newrelic", "retool",
  "render", "linear", "loom",
  "zendesk", "okta",
  "snowflakecomputing", "databricks", "fivetran",
  "crowdstrike", "sentinelone", "fullstory",
  "iterable", "customerio", "gorgias", "dialpad",
  "sanity", "storyblok", "kong",
  "shopify", "etsy", "faire", "stockx",
  "clickup", "productboard", "pendo",
  "drata", "orcasecurity", "wiz",
  "harness", "statsig", "posthog", "sprig",
  "anthropic", "openai", "cohere", "anyscale", "replicate",
  "scaleai", "stabilityai", "runwayml", "writer",
  "perplexityai", "characterai", "togetherai", "modal",
  "duolingo", "coursera", "khanacademy", "udemy", "brilliant",
  "ro", "calm", "noom", "swordhealth", "canva",
  "chainalysis", "fireblocks", "circle", "phantom",
  "immutable", "aptoslabs", "offchainlabs", "eigenlabs",
  "waymo", "samsara", "riotgames", "remotecom",
  "andurilindustries", "sezzle", "docusign",
  "zoom", "zoomvideocommunications",
  "box", "atlassian", "unity", "epicgames",
  "roblox", "robloxcorp",
  "bytedance", "tiktok",
  "klarna", "revolut", "n26", "monzo", "nubank",
  "wise", "transferwise",
  "binance", "krakendigital", "gemini",
  "grammarly", "zapier",
  "wolt", "deliveroo", "getir", "glovo",
  "linode", "vultr",
  "palantir", "palantirtechnologies",
  "bolt", "bolteu",
  "razorpay", "coupang", "grab", "gojek",
  "andela", "crossover",
  "wix", "squarespace",
  "doordash", "doordashusa",
  "block", "blockxyz", "squareup",
  "springhealth", "modernhealth",
  "lattice", "cultureamp",
  "benchling", "veeva", "veevaindustries",
  "niantic", "nianticinc",
  "nianticlabs",
  "figma", "github",
  "twilio", "twiliosendbirdgrid",
  // more frontier AI
  "mistralai", "midjourney", "jasper",
  "cerebras", "groq", "lightningai",
  // more gaming
  "supercell", "mojang",
  "bungie", "343industries",
  // more remote-first
  "automattic", "buffer", "doist",
  "helpscout", "close", "closeio",
  "trello", "basecamp",
  // more infra
  "ngrok", "flyio", "railway",
  "aiven", "timescale", "influxdata",
  "couchbase", "neo4j", "mariadb",
  "redis", "redislabs",
  "elastic", "elasticco",
  // more security
  "tessian", "material", "abnormalsecurity",
  "orcasecurity", "lacework",
  "bishopfox",
  // more fintech
  "brex", "mercury", "gusto",
  "carta", "justworks",
  "adyen", "papaya", "papayaglobal",
  "affirm", "afterpay",
  "marqeta", "plaid", "lithic",
  "galileofinancial",
  // more analytics
  "amplitude", "mixpanel", "heap",
  "segment", "rudderstackinc",
  "snowplow", "matomo",
  // more devops
  "circleci", "buildkite",
  "launchdarkly", "split", "flagsmith",
  "saucelabs",
  // more design
  "invisionapp", "sketch", "abstract",
  "zeplin", "maze", "useberry",
  // more e-commerce
  "bigcommerce", "bolt", "boltfinancial",
  "swell", "commercetools",
  // more hr/people
  "rippling", "lattice", "15five",
  "lever", "greenhouse", "ashby",
  "personio", "hibob", "bamboohr",
  // more data
  "prefect", "dagster", "airbyte",
  "materialize", "dbt", "dbtlabs",
  // communications
  "messagebird", "vonage", "bandwidth",
  "ringcentral",
];

const LEVER_SLUGS = [
  "netflix", "grammarly", "zapier", "buffer", "automattic",
  "toptal", "hotjar", "doist", "helpscout", "close.io",
  "articulate", "stitchfix", "nerdwallet", "flexport",
  "nextdoor", "medium", "oscar-health", "outreach",
  "salesloft", "verkada", "cloudinary", "paddle",
  "floqast", "oyster", "deel", "turing",
  "velocityglobal", "remote",
  "theathletic", "owner", "palantir",
  "sprucesystems", "anchorage",
  "bolt", "revolut", "monzo", "klarna", "wise",
  "transferwise", "andela", "crossover",
  "wix", "squarespace", "shopify",
  "databricks", "snowflake", "confluent",
  "hashicorp", "twilio",
  "samsara", "figma", "canva", "miro", "notion",
  "discord", "spotify", "pinterest",
  "stripe", "github", "gitlab",
  "kpmg", "highspot", "walkme",
  "whatfix", "appcues",
  "seismic", "gong", "chorus",
  "clearbit", "6riversystems",
  "optimizely", "recurly", "chartmogul",
  "baremetrics", "flyzipline", "planet",
  "lime", "bird", "ridewithvia",
  "devoted", "alto", "truepill", "cerebral",
  "lempire", "remotecom",
  // more known lever companies
  "sendbird", "yotpo", "appsflyer",
  "ironclad", "vise", "airtable",
  "calm", "headspace",
  "ramp", "brex", "mercury",
  "coinbase", "robinhood",
  "plaid", "chime",
  "lattice", "cultureamp",
  "datadog", "newrelic", "elastic",
  "okta", "auth0",
  "zendesk", "intercom", "drift",
  "segment", "amplitude", "mixpanel",
  "fullstory", "hotjar",
  "contentful", "prismic", "storyblok",
  "vercel", "netlify", "heroku",
  "supabase", "planetscale",
  "temporal", "prefect",
  "snyk", "sonar",
  "cypress", "cypress-io",
  "saucelabs",
  "figma", "sketch", "invision",
  "rippling", "gusto", "justworks",
  "personio", "hibob",
  "deel", "oysterhr", "remote",
  "velocityglobal", "papayaglobal",
  "wise", "revolut",
  "benchling",
  "dutchie", "jane",
];

const ASHBY_SLUGS = [
  "quora", "rula", "sentry", "camunda", "whatnot",
  "vercel", "linear", "retool", "supabase", "resend",
  "calcom", "cal-com", "tinybird", "inngest",
  "trigger-dev", "triggerdev",
  "nango", "deno", "oven", "bun",
  "raycast", "zed-industries", "zedindustries",
  "anysphere", "cursor", "replit", "gitpod",
  "warp", "clerk", "workos", "doppler",
  "pylon", "plain", "fern", "baseten",
  "fireworks-ai", "fireworksai", "pika", "elevenlabs",
  "glean", "hex", "airbyte", "dagster",
  "materialize", "buildkite", "semgrep", "socket",
  "teleport", "strongdm", "coder",
  "notion", "reddit", "deel", "oyster",
  "opendoor", "airtable", "duolingo",
  "flocksafety", "junipersquare",
  "multiverse", "away",
  "posthog", "dbt-labs", "dbtlabs",
  "figma", "canva",
  "anthropic", "openai", "mistral", "cohere",
  "amplitude", "mixpanel", "heap",
  "datadog", "newrelic", "grafanalabs",
  "snyk", "sonar",
  "hashicorp", "netlify", "cloudflare",
  "stripe", "wise", "revolut", "klarna",
  "ramp", "brex", "mercury",
  "gusto", "rippling", "justworks",
  "remote", "remotecom",
  "loom", "pitch", "miro",
  "productboard", "pendo", "fullstory",
  "drata", "vanta", "lacework",
  "crowdstrike", "sentinelone", "wiz",
  "orca-security", "orcasecurity",
  "coalesce", "census", "hightouch",
  "rudderstack", "temporal", "fly-io",
  "coinbase", "kraken", "gemini",
  "grammarly", "zapier", "toptal",
  "automattic", "buffer", "doist",
  // more frontier
  "perplexity", "perplexityai",
  "together", "togetherai",
  "modal", "cerebras", "groq",
  "scale", "scaleai",
  "stability", "stabilityai",
  "huggingface", "hugging-face",
  "replicate", "weights-and-biases", "wandb",
  "runway", "runwayml",
  "midjourney",
  // more devtools
  "turso", "upstash", "novu", "spacelift",
  "grafbase", "meilisearch", "depot",
  "lago", "polar", "airplane",
  "pieces", "propelauth",
];

// Batch test
async function testBatch(atsType, slugs, concurrency = 20) {
  const unique = [...new Set(slugs)].filter(slug => !existingSlugs.has(`${atsType}:${slug}`));
  const verified = [];
  for (let i = 0; i < unique.length; i += concurrency) {
    const batch = unique.slice(i, i + concurrency);
    const results = await Promise.all(batch.map(async slug => {
      const ok = await trySlug(atsType, slug);
      return { slug, ok };
    }));
    const found = results.filter(r => r.ok).map(r => r.slug);
    verified.push(...found);
    const progress = `${Math.min(i + concurrency, unique.length)}/${unique.length}`;
    if (found.length > 0) {
      process.stderr.write(`  [${atsType}] ${progress}: ✓ ${found.join(", ")}\n`);
    }
    if (i + concurrency < unique.length) await new Promise(r => setTimeout(r, 150));
  }
  return verified;
}

console.log("═══ SLUG DISCOVERY ═══\n");

console.log(`Testing ${GREENHOUSE_SLUGS.length} greenhouse, ${LEVER_SLUGS.length} lever, ${ASHBY_SLUGS.length} ashby slugs...\n`);

const [ghV, lvV, abV] = await Promise.all([
  testBatch("greenhouse", GREENHOUSE_SLUGS),
  testBatch("lever", LEVER_SLUGS),
  testBatch("ashby", ASHBY_SLUGS),
]);

console.log(`\n═══ RESULTS ═══`);
console.log(`Greenhouse: ${ghV.length} new`);
console.log(`Lever: ${lvV.length} new`);
console.log(`Ashby: ${abV.length} new`);
console.log(`Total new: ${ghV.length + lvV.length + abV.length}`);

console.log(`\n── GREENHOUSE ──`);
for (const s of ghV) console.log(`  ${s}`);
console.log(`\n── LEVER ──`);
for (const s of lvV) console.log(`  ${s}`);
console.log(`\n── ASHBY ──`);
for (const s of abV) console.log(`  ${s}`);
