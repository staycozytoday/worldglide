#!/usr/bin/env node
/**
 * batch-verify-v2.mjs
 *
 * Strategy shift: test EVERY company against ALL 3 ATS types.
 * Ashby and Lever have predictable slugs. Greenhouse is random but worth trying.
 * Also try common Greenhouse slug patterns: company, companyhq, company-io, etc.
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const companiesPath = resolve(__dirname, "../src/lib/companies.ts");

const src = readFileSync(companiesPath, "utf-8");
const existingSlugs = new Set();
const existingNames = new Set();
for (const m of src.matchAll(/atsSlug:\s*"([^"]+)"/g)) existingSlugs.add(m[1]);
for (const m of src.matchAll(/name:\s*"([^"]+)"/g)) existingNames.add(m[1].toLowerCase());

console.log(`existing: ${existingSlugs.size} slugs, ${existingNames.size} names\n`);

const ATS = {
  greenhouse: (slug) => `https://boards-api.greenhouse.io/v1/boards/${slug}/jobs`,
  lever:      (slug) => `https://api.lever.co/v0/postings/${slug}?limit=1`,
  ashby:      (slug) => `https://api.ashbyhq.com/posting-api/job-board/${slug}`,
};

// Known remote-first companies to test against ALL 3 ATS types
// [displayName, domain, slugVariants[]]
const COMPANIES = [
  // ── dev tools & infrastructure ──
  ["Miro", "miro.com", ["miro", "mirohq"]],
  ["Notion", "notion.so", ["notion", "notionhq", "notionlabs"]],
  ["Coda", "coda.io", ["coda", "codainc"]],
  ["Pitch", "pitch.com", ["pitch", "pitchio"]],
  ["Mural", "mural.co", ["mural", "muralhq"]],
  ["Loom", "loom.com", ["loom", "loomhq", "loomsdk"]],
  ["Maze", "maze.co", ["maze", "mazehq", "mazedesign"]],
  ["Webflow", "webflow.com", ["webflow", "webflowinc"]],
  ["Framer", "framer.com", ["framer", "framerbv"]],
  ["ReadMe", "readme.com", ["readme", "readmeinc"]],
  ["Gitpod", "gitpod.io", ["gitpod", "gitpodhq"]],
  ["Render", "render.com", ["render", "renderhq"]],
  ["Railway", "railway.app", ["railway", "railwayhq"]],
  ["Fly.io", "fly.io", ["flyio", "fly"]],
  ["Ngrok", "ngrok.com", ["ngrok", "ngrokinc"]],
  ["Supabase", "supabase.com", ["supabase", "supabaseinc"]],
  ["PlanetScale", "planetscale.com", ["planetscale", "planetscaleinc"]],
  ["Neon", "neon.tech", ["neon", "neondb", "neondatabase"]],
  ["Turso", "turso.tech", ["turso", "tursodb"]],
  ["Upstash", "upstash.com", ["upstash"]],
  ["Xata", "xata.io", ["xata"]],
  ["Convex", "convex.dev", ["convex", "convexdev"]],
  ["Prisma", "prisma.io", ["prisma", "prismahq"]],
  ["Hasura", "hasura.io", ["hasura"]],
  ["Directus", "directus.io", ["directus"]],
  ["Strapi", "strapi.io", ["strapi"]],

  // ── ai/ml ──
  ["Anthropic", "anthropic.com", ["anthropic"]],
  ["Perplexity", "perplexity.ai", ["perplexity", "perplexityai"]],
  ["Mistral AI", "mistral.ai", ["mistralai", "mistral"]],
  ["Cohere", "cohere.com", ["cohere", "cohereinc"]],
  ["Together AI", "together.ai", ["togetherai", "together"]],
  ["ElevenLabs", "elevenlabs.io", ["elevenlabs"]],
  ["Cursor", "cursor.com", ["anysphere", "cursor"]],
  ["Deepgram", "deepgram.com", ["deepgram"]],
  ["AssemblyAI", "assemblyai.com", ["assemblyai"]],
  ["LangChain", "langchain.com", ["langchain"]],
  ["Modal", "modal.com", ["modal", "modallabs"]],
  ["Weights & Biases", "wandb.com", ["wandb"]],
  ["Hugging Face", "huggingface.co", ["huggingface"]],
  ["Replicate", "replicate.com", ["replicate"]],
  ["Stability AI", "stability.ai", ["stabilityai", "stability"]],
  ["Character.ai", "character.ai", ["characterai", "character"]],
  ["Midjourney", "midjourney.com", ["midjourney"]],

  // ── security & compliance ──
  ["Secureframe", "secureframe.com", ["secureframe"]],
  ["Drata", "drata.com", ["drata"]],
  ["Snyk", "snyk.io", ["snyk"]],
  ["Huntress", "huntress.com", ["huntress"]],
  ["Rapid7", "rapid7.com", ["rapid7"]],
  ["CrowdStrike", "crowdstrike.com", ["crowdstrike"]],
  ["1Password", "1password.com", ["1password"]],
  ["Bitwarden", "bitwarden.com", ["bitwarden"]],

  // ── remote work infra ──
  ["Deel", "deel.com", ["deel"]],
  ["Remote.com", "remote.com", ["remote", "remotetechnology"]],
  ["Oyster", "oysterhr.com", ["oyster", "oysterhr"]],
  ["Papaya Global", "papayaglobal.com", ["papayaglobal"]],

  // ── observability & devops ──
  ["Grafana Labs", "grafana.com", ["grafanalabs", "grafana"]],
  ["Sentry", "sentry.io", ["sentry", "sentryio"]],
  ["PostHog", "posthog.com", ["posthog"]],
  ["Honeycomb", "honeycomb.io", ["honeycomb", "honeycombio"]],
  ["Datadog", "datadoghq.com", ["datadog"]],
  ["PagerDuty", "pagerduty.com", ["pagerduty"]],
  ["Chronosphere", "chronosphere.io", ["chronosphere"]],
  ["LogRocket", "logrocket.com", ["logrocket"]],
  ["Cribl", "cribl.io", ["cribl"]],
  ["Pulumi", "pulumi.com", ["pulumi"]],
  ["Dagster Labs", "dagster.io", ["dagsterlabs", "dagster"]],
  ["Rootly", "rootly.com", ["rootly"]],
  ["Statsig", "statsig.com", ["statsig"]],
  ["Eppo", "geteppo.com", ["eppo", "geteppo"]],
  ["incident.io", "incident.io", ["incidentio"]],
  ["Axiom", "axiom.co", ["axiom"]],

  // ── collaboration & productivity ──
  ["Automattic", "automattic.com", ["automattic"]],
  ["Ghost", "ghost.org", ["ghost", "ghostfoundation"]],
  ["Substack", "substack.com", ["substack"]],
  ["Medium", "medium.com", ["medium", "amedium"]],
  ["GitBook", "gitbook.com", ["gitbook"]],
  ["Sanity.io", "sanity.io", ["sanity", "sanityhq"]],
  ["Storyblok", "storyblok.com", ["storyblok"]],
  ["Contentful", "contentful.com", ["contentful"]],
  ["Warp", "warp.dev", ["warp", "warpdev"]],
  ["Raycast", "raycast.com", ["raycast"]],
  ["Mintlify", "mintlify.com", ["mintlify"]],
  ["Doist", "doist.com", ["doist"]],

  // ── fintech (remote-first) ──
  ["Brex", "brex.com", ["brex"]],
  ["Marqeta", "marqeta.com", ["marqeta"]],
  ["Column", "column.com", ["column"]],

  // ── data & analytics ──
  ["Airbyte", "airbyte.com", ["airbyte"]],
  ["Fivetran", "fivetran.com", ["fivetran"]],
  ["Metabase", "metabase.com", ["metabase"]],
  ["dbt Labs", "getdbt.com", ["dbtlabsinc", "dbtlabs"]],
  ["Sigma Computing", "sigmacomputing.com", ["sigmacomputing"]],
  ["Starburst", "starburst.io", ["starburst", "starburstdata"]],

  // ── communication & messaging ──
  ["Liveblocks", "liveblocks.io", ["liveblocks"]],
  ["Loops", "loops.so", ["loops"]],
  ["Resend", "resend.com", ["resend"]],
  ["Customer.io", "customer.io", ["customerio"]],
  ["Mailgun", "mailgun.com", ["mailgun"]],
  ["Postmark", "postmarkapp.com", ["postmark"]],

  // ── e-commerce & marketplace ──
  ["Shopify", "shopify.com", ["shopify"]],
  ["BigCommerce", "bigcommerce.com", ["bigcommerce"]],
  ["Etsy", "etsy.com", ["etsy"]],

  // ── health tech ──
  ["Ro", "ro.co", ["ro"]],
  ["Rula", "rula.com", ["rula"]],
  ["Calm", "calm.com", ["calm"]],
  ["Lyra Health", "lyrahealth.com", ["lyrahealth"]],

  // ── infra api companies ──
  ["Clerk", "clerk.com", ["clerk"]],
  ["Stainless", "stainlessapi.com", ["stainless"]],
  ["Speakeasy", "speakeasyapi.dev", ["speakeasyapi", "speakeasy"]],
  ["Fern", "buildwithfern.com", ["fern"]],
  ["Inngest", "inngest.com", ["inngest"]],
  ["Nango", "nango.dev", ["nango"]],
  ["E2B", "e2b.dev", ["e2b"]],
  ["Helicone", "helicone.ai", ["helicone"]],
  ["Doppler", "doppler.com", ["doppler"]],
  ["Orb", "withorb.com", ["orb"]],
  ["DX", "getdx.com", ["dx", "getdx"]],
  ["Baseten", "baseten.co", ["baseten"]],
  ["Common Room", "commonroom.io", ["commonroom"]],
  ["Cal.com", "cal.com", ["calcom", "cal"]],
  ["Expo", "expo.dev", ["expo"]],
  ["Dagger", "dagger.io", ["dagger"]],
  ["RevenueCat", "revenuecat.com", ["revenuecat"]],
  ["Buildkite", "buildkite.com", ["buildkite"]],

  // ── more remote-only/first ──
  ["Toggl", "toggl.com", ["toggl"]],
  ["Buffer", "buffer.com", ["buffer"]],
  ["Zapier", "zapier.com", ["zapier"]],
  ["InVision", "invisionapp.com", ["invision", "invisionapp"]],
  ["Toptal", "toptal.com", ["toptal"]],
  ["Close", "close.com", ["close", "closeio"]],
  ["Help Scout", "helpscout.com", ["helpscout", "helpscoutinc"]],
  ["Articulate", "articulate.com", ["articulate"]],
  ["DuckDuckGo", "duckduckgo.com", ["duckduckgo"]],
  ["Kickstarter", "kickstarter.com", ["kickstarter"]],
  ["Khan Academy", "khanacademy.org", ["khanacademy"]],
  ["Wikimedia", "wikimediafoundation.org", ["wikimedia", "wikimediafoundation"]],
  ["YNAB", "ynab.com", ["ynab"]],
  ["Discourse", "discourse.org", ["discourse"]],
  ["Hotjar", "hotjar.com", ["hotjar"]],
  ["CircleCI", "circleci.com", ["circleci"]],
  ["Calendly", "calendly.com", ["calendly"]],
  ["Vimeo", "vimeo.com", ["vimeo", "vimeoinc"]],
  ["Udemy", "udemy.com", ["udemy"]],
  ["Doximity", "doximity.com", ["doximity"]],
  ["Culture Amp", "cultureamp.com", ["cultureamp"]],
  ["Oscar Health", "hioscar.com", ["oscarhealth"]],
  ["Typeform", "typeform.com", ["typeform"]],
  ["Canonical", "canonical.com", ["canonical"]],
  ["Elastic", "elastic.co", ["elastic", "elasticco"]],
  ["Okta", "okta.com", ["okta"]],

  // ── more dev/api tools ──
  ["Sonar", "sonarsource.com", ["sonarsource"]],
  ["Fleet", "fleetdm.com", ["fleetdm"]],
  ["Deno", "deno.com", ["denoland", "deno"]],
  ["Teleport", "goteleport.com", ["teleport"]],
  ["Octopus Deploy", "octopus.com", ["octopusdeploy"]],
];

// test all ats types per company, deduplicate
async function check(name, domain, slugs, atsType) {
  const url = ATS[atsType](slugs[0]);
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    const ct = res.headers.get("content-type") || "";
    if (!ct.includes("json")) return null;
    const data = await res.json();

    let valid = false;
    if (atsType === "greenhouse") valid = data && typeof data.name === "string";
    if (atsType === "lever") valid = Array.isArray(data);
    if (atsType === "ashby") valid = data && (data.jobs || data.jobPostings || data.data);

    if (valid) return { name, domain, slug: slugs[0], ats: atsType };
  } catch {}

  // try alternate slugs for greenhouse
  if (atsType === "greenhouse" && slugs.length > 1) {
    for (const alt of slugs.slice(1)) {
      try {
        const res2 = await fetch(ATS.greenhouse(alt), { signal: AbortSignal.timeout(8000) });
        if (res2.ok) {
          const d2 = await res2.json();
          if (d2 && typeof d2.name === "string") return { name, domain, slug: alt, ats: "greenhouse" };
        }
      } catch {}
    }
  }
  return null;
}

const BATCH = 10;
const verified = [];
const checked = new Set();

async function testBatch(companies, atsType, label) {
  console.log(`\n── testing ${label} (${companies.length} companies) ──`);
  for (let i = 0; i < companies.length; i += BATCH) {
    const batch = companies.slice(i, i + BATCH);
    const results = await Promise.allSettled(
      batch.map(([name, domain, slugs]) => check(name, domain, slugs, atsType))
    );
    for (const r of results) {
      if (r.status === "fulfilled" && r.value) {
        const v = r.value;
        const key = `${v.ats}/${v.slug}`;
        if (!checked.has(key) && !existingSlugs.has(v.slug)) {
          checked.add(key);
          verified.push(v);
          console.log(`  ✓ ${v.name} → ${v.ats}/${v.slug}`);
        }
      }
    }
    if (i + BATCH < companies.length) await new Promise(r => setTimeout(r, 500));
  }
}

async function run() {
  // filter out companies already in the file
  const fresh = COMPANIES.filter(([name]) => !existingNames.has(name.toLowerCase()));
  console.log(`testing ${fresh.length} companies (after dedup) against all 3 ATS types...\n`);

  // test ashby first (highest hit rate)
  await testBatch(fresh, "ashby", "ashby");
  // then lever
  await testBatch(fresh, "lever", "lever");
  // then greenhouse (lowest hit rate)
  await testBatch(fresh, "greenhouse", "greenhouse");

  console.log(`\n${"═".repeat(60)}`);
  console.log(`TOTAL VERIFIED: ${verified.length} new companies`);
  console.log(`${"═".repeat(60)}\n`);

  if (verified.length > 0) {
    // group by ats
    const byAts = { ashby: [], lever: [], greenhouse: [] };
    for (const v of verified) (byAts[v.ats] ||= []).push(v);

    console.log("// ── paste into companies.ts ──\n");
    for (const [ats, items] of Object.entries(byAts)) {
      if (items.length === 0) continue;
      console.log(`  // ${ats} — batch verified (remote-first)`);
      for (const v of items) {
        const cu = ats === "lever"
          ? `https://jobs.lever.co/${v.slug}`
          : ats === "ashby"
          ? `https://jobs.ashbyhq.com/${v.slug}`
          : `https://boards.greenhouse.io/${v.slug}`;
        console.log(`  { name: "${v.name}", domain: "${v.domain}", careersUrl: "${cu}", atsType: "${ats}", atsSlug: "${v.slug}" },`);
      }
    }
  }
}

run();
