#!/usr/bin/env node
/**
 * batch-verify.mjs
 *
 * Tests hundreds of remote-first company slugs against Greenhouse, Lever, and Ashby APIs.
 * Deduplicates against existing companies.ts entries.
 * Outputs verified new companies ready to paste into companies.ts.
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const companiesPath = resolve(__dirname, "../src/lib/companies.ts");

// ── extract existing slugs from companies.ts ──
const src = readFileSync(companiesPath, "utf-8");
const existingSlugs = new Set();
const existingNames = new Set();
for (const m of src.matchAll(/atsSlug:\s*"([^"]+)"/g)) existingSlugs.add(m[1]);
for (const m of src.matchAll(/name:\s*"([^"]+)"/g)) existingNames.add(m[1].toLowerCase());

console.log(`existing: ${existingSlugs.size} slugs, ${existingNames.size} names\n`);

// ── ATS endpoints ──
const ATS = {
  greenhouse: (slug) => `https://boards-api.greenhouse.io/v1/boards/${slug}/jobs`,
  lever:      (slug) => `https://api.lever.co/v0/postings/${slug}?limit=1`,
  ashby:      (slug) => `https://api.ashbyhq.com/posting-api/job-board/${slug}`,
};

// ── candidates: remote-first companies NOT already in the file ──
// format: [name, domain, slug (or slug guess), atsType]
const CANDIDATES = [
  // ─── greenhouse candidates ───
  ["Abnormal Security", "abnormalsecurity.com", "abnormalsecurity", "greenhouse"],
  ["AllTrails", "alltrails.com", "alltrails", "greenhouse"],
  ["Bitwarden", "bitwarden.com", "bitwarden", "greenhouse"],
  ["Calendly", "calendly.com", "calendly", "greenhouse"],
  ["Chronosphere", "chronosphere.io", "chronosphere", "greenhouse"],
  ["Cockroach Labs", "cockroachlabs.com", "cockroachlabs", "greenhouse"],
  ["Contentful", "contentful.com", "contentful", "greenhouse"],
  ["Cribl", "cribl.io", "cribl", "greenhouse"],
  ["Culture Amp", "cultureamp.com", "cultureamp", "greenhouse"],
  ["Deepgram", "deepgram.com", "deepgram", "greenhouse"],
  ["Descript", "descript.com", "descript", "greenhouse"],
  ["Fastly", "fastly.com", "fastly", "greenhouse"],
  ["Flock Safety", "flocksafety.com", "flocksafety", "greenhouse"],
  ["FreshBooks", "freshbooks.com", "freshbooks", "greenhouse"],
  ["G2", "g2.com", "g2crowd", "greenhouse"],
  ["GoodRx", "goodrx.com", "goodrx", "greenhouse"],
  ["Handshake", "joinhandshake.com", "handshake", "greenhouse"],
  ["Huntress", "huntress.com", "huntress", "greenhouse"],
  ["IronClad", "ironcladhq.com", "ironclad", "greenhouse"],
  ["Jasper AI", "jasper.ai", "jasperai", "greenhouse"],
  ["Kajabi", "kajabi.com", "kajabi", "greenhouse"],
  ["Marqeta", "marqeta.com", "marqeta", "greenhouse"],
  ["Miro", "miro.com", "miro", "greenhouse"],
  ["OpenPhone", "openphone.com", "openphone", "greenhouse"],
  ["Oscar Health", "hioscar.com", "oscarhealth", "greenhouse"],
  ["Rapid7", "rapid7.com", "rapid7", "greenhouse"],
  ["Sentry", "sentry.io", "sentry", "greenhouse"],
  ["SimplePractice", "simplepractice.com", "simplepractice", "greenhouse"],
  ["Sysdig", "sysdig.com", "sysdig", "greenhouse"],
  ["Typeform", "typeform.com", "typeform", "greenhouse"],
  ["Vimeo", "vimeo.com", "vimeo", "greenhouse"],
  ["Webflow", "webflow.com", "webflow", "greenhouse"],
  ["WorkOS", "workos.com", "workos", "greenhouse"],
  ["Articulate", "articulate.com", "articulate", "greenhouse"],
  ["Close", "close.com", "close", "greenhouse"],
  ["Customer.io", "customer.io", "customerio", "greenhouse"],
  ["DuckDuckGo", "duckduckgo.com", "duckduckgo", "greenhouse"],
  ["Fleetio", "fleetio.com", "fleetio", "greenhouse"],
  ["Help Scout", "helpscout.com", "helpscout", "greenhouse"],
  ["Honeycomb", "honeycomb.io", "honeycomb", "greenhouse"],
  ["Iterable", "iterable.com", "iterable", "greenhouse"],
  ["Khan Academy", "khanacademy.org", "khanacademy", "greenhouse"],
  ["Kickstarter", "kickstarter.com", "kickstarter", "greenhouse"],
  ["Loom", "loom.com", "loom", "greenhouse"],
  ["Metabase", "metabase.com", "metabase", "greenhouse"],
  ["PagerDuty", "pagerduty.com", "pagerduty", "greenhouse"],
  ["Postman", "postman.com", "postman", "greenhouse"],
  ["Scribd", "scribd.com", "scribd", "greenhouse"],
  ["Splice", "splice.com", "splice", "greenhouse"],
  ["Stitch Fix", "stitchfix.com", "stitchfix", "greenhouse"],
  ["Superside", "superside.com", "superside", "greenhouse"],
  ["Talkdesk", "talkdesk.com", "talkdesk", "greenhouse"],
  ["TaskRabbit", "taskrabbit.com", "taskrabbit", "greenhouse"],
  ["Thumbtack", "thumbtack.com", "thumbtack", "greenhouse"],
  ["Udemy", "udemy.com", "udemy", "greenhouse"],
  ["VSCO", "vsco.co", "vsco", "greenhouse"],
  ["Wistia", "wistia.com", "wistia", "greenhouse"],
  ["YNAB", "ynab.com", "ynab", "greenhouse"],
  ["CircleCI", "circleci.com", "circleci", "greenhouse"],
  ["Coda", "coda.io", "coda", "greenhouse"],
  ["Doximity", "doximity.com", "doximity", "greenhouse"],
  ["Front", "front.com", "front", "greenhouse"],
  ["LogRocket", "logrocket.com", "logrocket", "greenhouse"],
  ["Mural", "mural.co", "mural", "greenhouse"],
  ["Ngrok", "ngrok.com", "ngrok", "greenhouse"],
  ["Olo", "olo.com", "olo", "greenhouse"],
  ["Opendoor", "opendoor.com", "opendoor", "greenhouse"],
  ["Paddle", "paddle.com", "paddle", "greenhouse"],
  ["Persona", "withpersona.com", "persona", "greenhouse"],
  ["PostHog", "posthog.com", "posthog", "greenhouse"],
  ["ReadMe", "readme.com", "readme", "greenhouse"],
  ["Secureframe", "secureframe.com", "secureframe", "greenhouse"],
  ["ShipBob", "shipbob.com", "shipbob", "greenhouse"],
  ["Sigma Computing", "sigmacomputing.com", "sigmacomputing", "greenhouse"],
  ["Sonatype", "sonatype.com", "sonatype", "greenhouse"],
  ["Supabase", "supabase.com", "supabase", "greenhouse"],
  ["Tines", "tines.com", "tines", "greenhouse"],
  ["Betterment", "betterment.com", "betterment", "greenhouse"],
  ["Bonusly", "bonusly.com", "bonusly", "greenhouse"],
  ["CaptivateIQ", "captivateiq.com", "captivateiq", "greenhouse"],
  ["ChowNow", "chownow.com", "chownow", "greenhouse"],
  ["Cypress.io", "cypress.io", "cypressio", "greenhouse"],
  ["EasyPost", "easypost.com", "easypost", "greenhouse"],
  ["Fly.io", "fly.io", "flyio", "greenhouse"],
  ["Heap", "heap.io", "heap", "greenhouse"],
  ["LivePerson", "liveperson.com", "liveperson", "greenhouse"],
  ["Maze", "maze.co", "maze", "greenhouse"],
  ["Plotly", "plotly.com", "plotly", "greenhouse"],
  ["Vidyard", "vidyard.com", "vidyard", "greenhouse"],
  ["Whoop", "whoop.com", "whoop", "greenhouse"],
  ["Zipline", "flyzipline.com", "zipline", "greenhouse"],
  ["Remote.com", "remote.com", "remote", "greenhouse"],
  ["Wikimedia Foundation", "wikimediafoundation.org", "wikimedia", "greenhouse"],
  ["Apollo GraphQL", "apollographql.com", "apollographql", "greenhouse"],
  ["Appcues", "appcues.com", "appcues", "greenhouse"],
  ["Datavant", "datavant.com", "datavant", "greenhouse"],
  ["Matillion", "matillion.com", "matillion", "greenhouse"],
  ["Rocket Money", "rocketmoney.com", "rocketmoney", "greenhouse"],
  ["SafetyCulture", "safetyculture.com", "safetyculture", "greenhouse"],

  // ─── lever candidates ───
  ["1Password", "1password.com", "1password", "lever"],
  ["Automattic", "automattic.com", "automattic", "lever"],
  ["Buildkite", "buildkite.com", "buildkite", "lever"],
  ["Canonical", "canonical.com", "canonical", "lever"],
  ["Deno", "deno.com", "denoland", "lever"],
  ["Fleet", "fleetdm.com", "fleetdm", "lever"],
  ["Ghost", "ghost.org", "ghost", "lever"],
  ["GitBook", "gitbook.com", "gitbook", "lever"],
  ["Glean", "glean.com", "glean", "lever"],
  ["Hasura", "hasura.io", "hasura", "lever"],
  ["Hotjar", "hotjar.com", "hotjar", "lever"],
  ["Kandji", "kandji.io", "kandji", "lever"],
  ["MailerLite", "mailerlite.com", "mailerlite", "lever"],
  ["NuBank", "nubank.com.br", "nubank", "lever"],
  ["Prisma", "prisma.io", "prisma", "lever"],
  ["Pulumi", "pulumi.com", "pulumi", "lever"],
  ["RevenueCat", "revenuecat.com", "revenuecat", "lever"],
  ["Sanity.io", "sanity.io", "sanity", "lever"],
  ["Storyblok", "storyblok.com", "storyblok", "lever"],
  ["Substack", "substack.com", "substack", "lever"],
  ["Teleport", "goteleport.com", "teleport", "lever"],
  ["Toptal", "toptal.com", "toptal", "lever"],
  ["Warp", "warp.dev", "warp", "lever"],
  ["Immutable", "immutable.com", "immutable", "lever"],
  ["Protocol Labs", "protocol.ai", "protocollabs", "lever"],
  ["IOG (Input Output)", "iohk.io", "iohk", "lever"],
  ["Lucid Software", "lucid.co", "lucidsoftware", "lever"],
  ["Octopus Deploy", "octopus.com", "octopusdeploy", "lever"],
  ["Sonar", "sonarsource.com", "sonarsource", "lever"],
  ["Anyscale", "anyscale.com", "anyscale", "lever"],
  ["Embark Studios", "embark-studios.com", "embarkstudios", "lever"],
  ["Gather", "gather.town", "gather", "lever"],
  ["Pitch", "pitch.com", "pitch", "lever"],
  ["Railway", "railway.app", "railway", "lever"],
  ["Brex", "brex.com", "brex", "lever"],
  ["Velocity Global", "velocityglobal.com", "velocityglobal", "lever"],

  // ─── ashby candidates ───
  ["Airbyte", "airbyte.com", "airbyte", "ashby"],
  ["Anthropic", "anthropic.com", "anthropic", "ashby"],
  ["Cal.com", "cal.com", "calcom", "ashby"],
  ["Clerk", "clerk.com", "clerk", "ashby"],
  ["Cohere", "cohere.com", "cohere", "ashby"],
  ["Convex", "convex.dev", "convex", "ashby"],
  ["Cursor", "cursor.com", "anysphere", "ashby"],
  ["Dagster Labs", "dagster.io", "dagsterlabs", "ashby"],
  ["Drata", "drata.com", "drata", "ashby"],
  ["ElevenLabs", "elevenlabs.io", "elevenlabs", "ashby"],
  ["Expo", "expo.dev", "expo", "ashby"],
  ["Firecrawl", "firecrawl.dev", "firecrawl", "ashby"],
  ["Grafana Labs", "grafana.com", "grafanalabs", "ashby"],
  ["LangChain", "langchain.com", "langchain", "ashby"],
  ["Linear", "linear.app", "linear", "ashby"],
  ["Liveblocks", "liveblocks.io", "liveblocks", "ashby"],
  ["Mintlify", "mintlify.com", "mintlify", "ashby"],
  ["Mistral AI", "mistral.ai", "mistralai", "ashby"],
  ["Modal", "modal.com", "modal", "ashby"],
  ["Neon", "neon.tech", "neon", "ashby"],
  ["Perplexity", "perplexity.ai", "perplexity", "ashby"],
  ["Pinecone", "pinecone.io", "pinecone", "ashby"],
  ["Raycast", "raycast.com", "raycast", "ashby"],
  ["Resend", "resend.com", "resend", "ashby"],
  ["Rootly", "rootly.com", "rootly", "ashby"],
  ["Statsig", "statsig.com", "statsig", "ashby"],
  ["Stainless", "stainlessapi.com", "stainless", "ashby"],
  ["Synthesia", "synthesia.io", "synthesia", "ashby"],
  ["Together AI", "together.ai", "togetherai", "ashby"],
  ["Upstash", "upstash.com", "upstash", "ashby"],
  ["Doppler", "doppler.com", "doppler", "ashby"],
  ["Eppo", "geteppo.com", "eppo", "ashby"],
  ["Flatfile", "flatfile.com", "flatfile", "ashby"],
  ["Inngest", "inngest.com", "inngest", "ashby"],
  ["Loops", "loops.so", "loops", "ashby"],
  ["Orb", "withorb.com", "orb", "ashby"],
  ["Speakeasy", "speakeasyapi.dev", "speakeasyapi", "ashby"],
  ["Fern", "buildwithfern.com", "fern", "ashby"],
  ["E2B", "e2b.dev", "e2b", "ashby"],
  ["Helicone", "helicone.ai", "helicone", "ashby"],
  ["Browserbase", "browserbase.com", "browserbase", "ashby"],
  ["Common Room", "commonroom.io", "commonroom", "ashby"],
  ["Nango", "nango.dev", "nango", "ashby"],
  ["DX", "getdx.com", "dx", "ashby"],
  ["Axiom", "axiom.co", "axiom", "ashby"],
  ["Dagger", "dagger.io", "dagger", "ashby"],
  ["Baseten", "baseten.co", "baseten", "ashby"],
];

// ── filter out already-existing ──
const toTest = CANDIDATES.filter(([name, , slug]) => {
  if (existingSlugs.has(slug)) return false;
  if (existingNames.has(name.toLowerCase())) return false;
  return true;
});

console.log(`candidates: ${CANDIDATES.length} total, ${toTest.length} after dedup\n`);

// ── verify in batches ──
const BATCH = 15;
const DELAY = 600;
const verified = [];
const failed = [];

async function check(name, domain, slug, ats) {
  const url = ATS[ats](slug);
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) { failed.push(`✗ ${name} (${ats}/${slug}) → ${res.status}`); return; }
    const ct = res.headers.get("content-type") || "";
    if (!ct.includes("json")) { failed.push(`✗ ${name} (${ats}/${slug}) → not JSON`); return; }
    const data = await res.json();

    // validate: must have at least structure indicating a real board
    let valid = false;
    if (ats === "greenhouse") valid = data && typeof data.name === "string";
    if (ats === "lever") valid = Array.isArray(data);
    if (ats === "ashby") valid = data && (data.jobs || data.jobPostings || data.data);

    if (valid) {
      verified.push({ name, domain, slug, ats });
      console.log(`  ✓ ${name} → ${ats}/${slug}`);
    } else {
      failed.push(`✗ ${name} (${ats}/${slug}) → empty/invalid`);
    }
  } catch (e) {
    failed.push(`✗ ${name} (${ats}/${slug}) → ${e.message?.slice(0, 40)}`);
  }
}

async function run() {
  for (let i = 0; i < toTest.length; i += BATCH) {
    const batch = toTest.slice(i, i + BATCH);
    console.log(`batch ${Math.floor(i / BATCH) + 1}/${Math.ceil(toTest.length / BATCH)} (${batch.length} companies)...`);
    await Promise.allSettled(batch.map(([n, d, s, a]) => check(n, d, s, a)));
    if (i + BATCH < toTest.length) await new Promise((r) => setTimeout(r, DELAY));
  }

  console.log(`\n${"═".repeat(60)}`);
  console.log(`VERIFIED: ${verified.length} new companies`);
  console.log(`FAILED:   ${failed.length}`);
  console.log(`${"═".repeat(60)}\n`);

  if (verified.length > 0) {
    console.log("// ── paste into companies.ts ──\n");
    for (const v of verified) {
      const careersUrl = v.ats === "lever"
        ? `https://jobs.lever.co/${v.slug}`
        : v.ats === "ashby"
        ? `https://jobs.ashbyhq.com/${v.slug}`
        : `https://boards.greenhouse.io/${v.slug}`;
      console.log(
        `  { name: "${v.name}", domain: "${v.domain}", careersUrl: "${careersUrl}", atsType: "${v.ats}", atsSlug: "${v.slug}" },`
      );
    }
  }

  if (failed.length > 0) {
    console.log("\n// ── failed (first 30) ──");
    for (const f of failed.slice(0, 30)) console.log(`  ${f}`);
    if (failed.length > 30) console.log(`  ... and ${failed.length - 30} more`);
  }
}

run();
