#!/usr/bin/env node

/**
 * Batch-verify ATS slugs against live APIs.
 * Usage: node scripts/verify-companies.mjs
 *
 * Tests each candidate company against its ATS API endpoint.
 * Outputs verified companies in the format needed for companies.ts.
 */

const ENDPOINTS = {
  greenhouse: (slug) => `https://boards-api.greenhouse.io/v1/boards/${slug}/jobs`,
  lever: (slug) => `https://api.lever.co/v0/postings/${slug}`,
  ashby: (slug) => `https://api.ashbyhq.com/posting-api/job-board/${slug}`,
  gem: (slug) => `https://api.gem.com/api/v1/job-boards/${slug}/postings`,
};

async function verify(company) {
  const { name, atsType, atsSlug } = company;
  const url = ENDPOINTS[atsType]?.(atsSlug);
  if (!url) return { ...company, ok: false, error: "unknown ats" };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    clearTimeout(timeout);

    if (res.ok) {
      return { ...company, ok: true, status: res.status };
    }
    return { ...company, ok: false, status: res.status };
  } catch (err) {
    return { ...company, ok: false, error: err.message?.slice(0, 60) };
  }
}

// Batch with concurrency limit
async function batchVerify(companies, concurrency = 15) {
  const results = [];
  for (let i = 0; i < companies.length; i += concurrency) {
    const batch = companies.slice(i, i + concurrency);
    const batchResults = await Promise.all(batch.map(verify));
    results.push(...batchResults);

    const ok = batchResults.filter((r) => r.ok).length;
    const fail = batchResults.filter((r) => !r.ok).length;
    process.stderr.write(
      `  batch ${Math.floor(i / concurrency) + 1}: ${ok} ✓  ${fail} ✗  (${results.length}/${companies.length})\n`
    );

    // small delay between batches
    if (i + concurrency < companies.length) {
      await new Promise((r) => setTimeout(r, 300));
    }
  }
  return results;
}

// ═══════════════════════════════════════════════
// CANDIDATE COMPANIES TO VERIFY
// ═══════════════════════════════════════════════

const CANDIDATES = [
  // ── GREENHOUSE CANDIDATES ──

  // big tech & infrastructure
  { name: "Airbnb", domain: "airbnb.com", atsType: "greenhouse", atsSlug: "airbnb" },
  { name: "Pinterest", domain: "pinterest.com", atsType: "greenhouse", atsSlug: "pinterest" },
  { name: "Snap", domain: "snap.com", atsType: "greenhouse", atsSlug: "snap" },
  { name: "Block", domain: "block.xyz", atsType: "greenhouse", atsSlug: "block" },
  { name: "Square", domain: "squareup.com", atsType: "greenhouse", atsSlug: "squareup" },
  { name: "Discord", domain: "discord.com", atsType: "greenhouse", atsSlug: "discord" },
  { name: "Notion", domain: "notion.so", atsType: "greenhouse", atsSlug: "notion" },
  { name: "Dropbox", domain: "dropbox.com", atsType: "greenhouse", atsSlug: "dropbox" },
  { name: "Spotify", domain: "spotify.com", atsType: "greenhouse", atsSlug: "spotify" },
  { name: "Twitch", domain: "twitch.tv", atsType: "greenhouse", atsSlug: "twitch" },
  { name: "Reddit", domain: "reddit.com", atsType: "greenhouse", atsSlug: "reddit" },
  { name: "Lyft", domain: "lyft.com", atsType: "greenhouse", atsSlug: "lyft" },
  { name: "Uber", domain: "uber.com", atsType: "greenhouse", atsSlug: "uber" },
  { name: "Instacart", domain: "instacart.com", atsType: "greenhouse", atsSlug: "instacart" },
  { name: "Robinhood", domain: "robinhood.com", atsType: "greenhouse", atsSlug: "robinhood" },
  { name: "Plaid", domain: "plaid.com", atsType: "greenhouse", atsSlug: "plaid" },
  { name: "Chime", domain: "chime.com", atsType: "greenhouse", atsSlug: "chime" },
  { name: "Navan", domain: "navan.com", atsType: "greenhouse", atsSlug: "navan" },

  // devtools & cloud
  { name: "Datadog", domain: "datadoghq.com", atsType: "greenhouse", atsSlug: "datadog" },
  { name: "PagerDuty", domain: "pagerduty.com", atsType: "greenhouse", atsSlug: "pagerduty" },
  { name: "Twilio", domain: "twilio.com", atsType: "greenhouse", atsSlug: "twilio" },
  { name: "Snyk", domain: "snyk.io", atsType: "greenhouse", atsSlug: "snyk" },
  { name: "HashiCorp", domain: "hashicorp.com", atsType: "greenhouse", atsSlug: "hashicorp" },
  { name: "Confluent", domain: "confluent.io", atsType: "greenhouse", atsSlug: "confluent" },
  { name: "Vercel", domain: "vercel.com", atsType: "greenhouse", atsSlug: "vercel" },
  { name: "Supabase", domain: "supabase.com", atsType: "greenhouse", atsSlug: "supabase" },
  { name: "Postman", domain: "postman.com", atsType: "greenhouse", atsSlug: "postman" },
  { name: "JFrog", domain: "jfrog.com", atsType: "greenhouse", atsSlug: "jfrog" },
  { name: "Miro", domain: "miro.com", atsType: "greenhouse", atsSlug: "miro" },
  { name: "Sentry", domain: "sentry.io", atsType: "greenhouse", atsSlug: "sentry" },
  { name: "New Relic", domain: "newrelic.com", atsType: "greenhouse", atsSlug: "newrelic" },
  { name: "Segment", domain: "segment.com", atsType: "greenhouse", atsSlug: "segment" },
  { name: "Retool", domain: "retool.com", atsType: "greenhouse", atsSlug: "retool" },
  { name: "Fly.io", domain: "fly.io", atsType: "greenhouse", atsSlug: "flyio" },
  { name: "Render", domain: "render.com", atsType: "greenhouse", atsSlug: "render" },
  { name: "Railway", domain: "railway.app", atsType: "greenhouse", atsSlug: "railway" },
  { name: "Neon", domain: "neon.tech", atsType: "greenhouse", atsSlug: "neondatabase" },
  { name: "Linear", domain: "linear.app", atsType: "greenhouse", atsSlug: "linear" },
  { name: "Loom", domain: "loom.com", atsType: "greenhouse", atsSlug: "loom" },
  { name: "Notion", domain: "notion.so", atsType: "greenhouse", atsSlug: "notion" },
  { name: "Stytch", domain: "stytch.com", atsType: "greenhouse", atsSlug: "stytch" },
  { name: "ngrok", domain: "ngrok.com", atsType: "greenhouse", atsSlug: "ngrok" },
  { name: "Rudderstack", domain: "rudderstack.com", atsType: "greenhouse", atsSlug: "rudderstack" },
  { name: "Prefect", domain: "prefect.io", atsType: "greenhouse", atsSlug: "prefect" },
  { name: "Pulumi", domain: "pulumi.com", atsType: "greenhouse", atsSlug: "pulumi" },
  { name: "Weights & Biases", domain: "wandb.ai", atsType: "greenhouse", atsSlug: "wandb" },
  { name: "Deepgram", domain: "deepgram.com", atsType: "greenhouse", atsSlug: "deepgram" },
  { name: "Weaviate", domain: "weaviate.io", atsType: "greenhouse", atsSlug: "weaviate" },

  // saas & enterprise
  { name: "Zendesk", domain: "zendesk.com", atsType: "greenhouse", atsSlug: "zendesk" },
  { name: "Okta", domain: "okta.com", atsType: "greenhouse", atsSlug: "okta" },
  { name: "Snowflake", domain: "snowflake.com", atsType: "greenhouse", atsSlug: "snowflakecomputing" },
  { name: "Databricks", domain: "databricks.com", atsType: "greenhouse", atsSlug: "databricks" },
  { name: "dbt Labs", domain: "getdbt.com", atsType: "greenhouse", atsSlug: "daboratoriesdbtlabs45" },
  { name: "Fivetran", domain: "fivetran.com", atsType: "greenhouse", atsSlug: "fivetran" },
  { name: "Sigma Computing", domain: "sigmacomputing.com", atsType: "greenhouse", atsSlug: "sigmacomputing" },
  { name: "Census", domain: "getcensus.com", atsType: "greenhouse", atsSlug: "census" },
  { name: "Monte Carlo", domain: "montecarlodata.com", atsType: "greenhouse", atsSlug: "montecarlodata" },
  { name: "Hightouch", domain: "hightouch.com", atsType: "greenhouse", atsSlug: "hightouch" },
  { name: "Observe", domain: "observeinc.com", atsType: "greenhouse", atsSlug: "observeinc" },
  { name: "CrowdStrike", domain: "crowdstrike.com", atsType: "greenhouse", atsSlug: "crowdstrike" },
  { name: "SentinelOne", domain: "sentinelone.com", atsType: "greenhouse", atsSlug: "sentinelone" },
  { name: "Lacework", domain: "lacework.com", atsType: "greenhouse", atsSlug: "lacework" },
  { name: "Sumo Logic", domain: "sumologic.com", atsType: "greenhouse", atsSlug: "sumologic" },
  { name: "UserTesting", domain: "usertesting.com", atsType: "greenhouse", atsSlug: "usertesting" },
  { name: "FullStory", domain: "fullstory.com", atsType: "greenhouse", atsSlug: "fullstory" },
  { name: "Heap", domain: "heap.io", atsType: "greenhouse", atsSlug: "heap" },
  { name: "Iterable", domain: "iterable.com", atsType: "greenhouse", atsSlug: "iterable" },
  { name: "Customer.io", domain: "customer.io", atsType: "greenhouse", atsSlug: "customerio" },
  { name: "Sendoso", domain: "sendoso.com", atsType: "greenhouse", atsSlug: "sendoso" },
  { name: "Gorgias", domain: "gorgias.com", atsType: "greenhouse", atsSlug: "gorgias" },
  { name: "Front", domain: "front.com", atsType: "greenhouse", atsSlug: "frontapp" },
  { name: "Dialpad", domain: "dialpad.com", atsType: "greenhouse", atsSlug: "dialpad" },
  { name: "Mux", domain: "mux.com", atsType: "greenhouse", atsSlug: "maboratory" },
  { name: "imgix", domain: "imgix.com", atsType: "greenhouse", atsSlug: "imgix" },
  { name: "Sanity", domain: "sanity.io", atsType: "greenhouse", atsSlug: "sanity" },
  { name: "Storyblok", domain: "storyblok.com", atsType: "greenhouse", atsSlug: "storyblok" },
  { name: "Prismic", domain: "prismic.io", atsType: "greenhouse", atsSlug: "prismic" },
  { name: "Strapi", domain: "strapi.io", atsType: "greenhouse", atsSlug: "strapi" },
  { name: "Ghost", domain: "ghost.org", atsType: "greenhouse", atsSlug: "ghost" },
  { name: "Kong", domain: "konghq.com", atsType: "greenhouse", atsSlug: "kong" },
  { name: "Postmark", domain: "postmarkapp.com", atsType: "greenhouse", atsSlug: "postmark" },
  { name: "Mailgun", domain: "mailgun.com", atsType: "greenhouse", atsSlug: "mailgun" },
  { name: "Twilio SendGrid", domain: "sendgrid.com", atsType: "greenhouse", atsSlug: "sendgrid" },
  { name: "Auth0", domain: "auth0.com", atsType: "greenhouse", atsSlug: "auth0" },
  { name: "Storybook", domain: "storybook.js.org", atsType: "greenhouse", atsSlug: "storybook" },

  // fintech & crypto
  { name: "Kraken", domain: "kraken.com", atsType: "greenhouse", atsSlug: "kraboratories" },
  { name: "Chainalysis", domain: "chainalysis.com", atsType: "greenhouse", atsSlug: "chainalysis" },
  { name: "Fireblocks", domain: "fireblocks.com", atsType: "greenhouse", atsSlug: "fireblocks" },
  { name: "Circle", domain: "circle.com", atsType: "greenhouse", atsSlug: "circle" },
  { name: "Anchorage Digital", domain: "anchorage.com", atsType: "greenhouse", atsSlug: "anchoragedigital" },
  { name: "Phantom", domain: "phantom.app", atsType: "greenhouse", atsSlug: "phantom" },
  { name: "Dune Analytics", domain: "dune.com", atsType: "greenhouse", atsSlug: "dunelabs" },
  { name: "Uniswap Labs", domain: "uniswap.org", atsType: "greenhouse", atsSlug: "uniswaplabs" },
  { name: "Immutable", domain: "immutable.com", atsType: "greenhouse", atsSlug: "immutable" },
  { name: "Aptos Labs", domain: "aptoslabs.com", atsType: "greenhouse", atsSlug: "aptoslabs" },
  { name: "Sui Foundation", domain: "sui.io", atsType: "greenhouse", atsSlug: "mystenlabs" },
  { name: "Offchain Labs", domain: "offchainlabs.com", atsType: "greenhouse", atsSlug: "offchainlabs" },
  { name: "Matter Labs", domain: "matter-labs.io", atsType: "greenhouse", atsSlug: "matterlabs" },
  { name: "Polygon Labs", domain: "polygon.technology", atsType: "greenhouse", atsSlug: "polygontechnology" },
  { name: "Scroll", domain: "scroll.io", atsType: "greenhouse", atsSlug: "scroll" },
  { name: "StarkWare", domain: "starkware.co", atsType: "greenhouse", atsSlug: "starkware" },
  { name: "Worldcoin", domain: "worldcoin.org", atsType: "greenhouse", atsSlug: "worldcoinorg" },
  { name: "Aave", domain: "aave.com", atsType: "greenhouse", atsSlug: "aave" },
  { name: "Lido", domain: "lido.fi", atsType: "greenhouse", atsSlug: "lido" },
  { name: "EigenLayer", domain: "eigenlayer.xyz", atsType: "greenhouse", atsSlug: "eigenlabs" },
  { name: "Monad", domain: "monad.xyz", atsType: "greenhouse", atsSlug: "monad" },
  { name: "Berachain", domain: "berachain.com", atsType: "greenhouse", atsSlug: "berachain" },

  // AI & ML
  { name: "Anthropic", domain: "anthropic.com", atsType: "greenhouse", atsSlug: "anthropic" },
  { name: "OpenAI", domain: "openai.com", atsType: "greenhouse", atsSlug: "openai" },
  { name: "Cohere", domain: "cohere.com", atsType: "greenhouse", atsSlug: "cohere" },
  { name: "Anyscale", domain: "anyscale.com", atsType: "greenhouse", atsSlug: "anyscale" },
  { name: "Replicate", domain: "replicate.com", atsType: "greenhouse", atsSlug: "replicate" },
  { name: "Hugging Face", domain: "huggingface.co", atsType: "greenhouse", atsSlug: "huggingface" },
  { name: "Scale AI", domain: "scale.com", atsType: "greenhouse", atsSlug: "scaleai" },
  { name: "Stability AI", domain: "stability.ai", atsType: "greenhouse", atsSlug: "stabilityai" },
  { name: "Runway", domain: "runwayml.com", atsType: "greenhouse", atsSlug: "runwayml" },
  { name: "Midjourney", domain: "midjourney.com", atsType: "greenhouse", atsSlug: "midjourney" },
  { name: "Jasper", domain: "jasper.ai", atsType: "greenhouse", atsSlug: "jasper" },
  { name: "Writer", domain: "writer.com", atsType: "greenhouse", atsSlug: "writer" },
  { name: "Perplexity", domain: "perplexity.ai", atsType: "greenhouse", atsSlug: "perplexityai" },
  { name: "Character.AI", domain: "character.ai", atsType: "greenhouse", atsSlug: "characterai" },
  { name: "Inflection AI", domain: "inflection.ai", atsType: "greenhouse", atsSlug: "inflectionai" },
  { name: "Mistral AI", domain: "mistral.ai", atsType: "greenhouse", atsSlug: "mistralai" },
  { name: "Adept", domain: "adept.ai", atsType: "greenhouse", atsSlug: "adept" },
  { name: "Mosaic ML", domain: "mosaicml.com", atsType: "greenhouse", atsSlug: "mosaicml" },
  { name: "Together AI", domain: "together.ai", atsType: "greenhouse", atsSlug: "togetherai" },
  { name: "Modal", domain: "modal.com", atsType: "greenhouse", atsSlug: "modal" },
  { name: "Groq", domain: "groq.com", atsType: "greenhouse", atsSlug: "groq" },
  { name: "Cerebras", domain: "cerebras.net", atsType: "greenhouse", atsSlug: "cerebras" },
  { name: "Lightning AI", domain: "lightning.ai", atsType: "greenhouse", atsSlug: "lightningai" },

  // health & biotech
  { name: "Ro", domain: "ro.co", atsType: "greenhouse", atsSlug: "ro" },
  { name: "Hims & Hers", domain: "forhims.com", atsType: "greenhouse", atsSlug: "himshers" },
  { name: "Noom", domain: "noom.com", atsType: "greenhouse", atsSlug: "noom" },
  { name: "Headspace", domain: "headspace.com", atsType: "greenhouse", atsSlug: "headspace" },
  { name: "Calm", domain: "calm.com", atsType: "greenhouse", atsSlug: "calm" },
  { name: "Tempus", domain: "tempus.com", atsType: "greenhouse", atsSlug: "tempus" },
  { name: "Color Health", domain: "color.com", atsType: "greenhouse", atsSlug: "color" },
  { name: "Sword Health", domain: "swordhealth.com", atsType: "greenhouse", atsSlug: "swordhealth" },
  { name: "Cityblock Health", domain: "cityblock.com", atsType: "greenhouse", atsSlug: "cityblockhealth" },

  // edtech
  { name: "Duolingo", domain: "duolingo.com", atsType: "greenhouse", atsSlug: "duolingo" },
  { name: "Coursera", domain: "coursera.org", atsType: "greenhouse", atsSlug: "coursera" },
  { name: "Khan Academy", domain: "khanacademy.org", atsType: "greenhouse", atsSlug: "khanacademy" },
  { name: "Udemy", domain: "udemy.com", atsType: "greenhouse", atsSlug: "udemy" },
  { name: "Codecademy", domain: "codecademy.com", atsType: "greenhouse", atsSlug: "codecademy" },
  { name: "Brilliant", domain: "brilliant.org", atsType: "greenhouse", atsSlug: "brilliant" },
  { name: "Handshake", domain: "joinhandshake.com", atsType: "greenhouse", atsSlug: "joinhandshake" },

  // e-commerce & consumer
  { name: "Shopify", domain: "shopify.com", atsType: "greenhouse", atsSlug: "shopify" },
  { name: "Etsy", domain: "etsy.com", atsType: "greenhouse", atsSlug: "etsy" },
  { name: "Faire", domain: "faire.com", atsType: "greenhouse", atsSlug: "faire" },
  { name: "Poshmark", domain: "poshmark.com", atsType: "greenhouse", atsSlug: "poshmark" },
  { name: "StockX", domain: "stockx.com", atsType: "greenhouse", atsSlug: "stockx" },
  { name: "Goat", domain: "goat.com", atsType: "greenhouse", atsSlug: "goat" },
  { name: "Whatnot", domain: "whatnot.com", atsType: "greenhouse", atsSlug: "whatnot" },
  { name: "Chewy", domain: "chewy.com", atsType: "greenhouse", atsSlug: "chewy" },
  { name: "Fanatics", domain: "fanatics.com", atsType: "greenhouse", atsSlug: "fanatics" },
  { name: "Convoy", domain: "convoy.com", atsType: "greenhouse", atsSlug: "convoy" },
  { name: "Gopuff", domain: "gopuff.com", atsType: "greenhouse", atsSlug: "gopuff" },

  // more SaaS
  { name: "Canva", domain: "canva.com", atsType: "greenhouse", atsSlug: "canva" },
  { name: "monday.com", domain: "monday.com", atsType: "greenhouse", atsSlug: "mondaydotcom" },
  { name: "ClickUp", domain: "clickup.com", atsType: "greenhouse", atsSlug: "clickup" },
  { name: "Coda", domain: "coda.io", atsType: "greenhouse", atsSlug: "coda" },
  { name: "Liveblocks", domain: "liveblocks.io", atsType: "greenhouse", atsSlug: "liveblocks" },
  { name: "Pitch", domain: "pitch.com", atsType: "greenhouse", atsSlug: "pitch" },
  { name: "Productboard", domain: "productboard.com", atsType: "greenhouse", atsSlug: "productboard" },
  { name: "Pendo", domain: "pendo.io", atsType: "greenhouse", atsSlug: "pendo" },
  { name: "Gainsight", domain: "gainsight.com", atsType: "greenhouse", atsSlug: "gainsight" },
  { name: "ChurnZero", domain: "churnzero.com", atsType: "greenhouse", atsSlug: "churnzero" },
  { name: "Totango", domain: "totango.com", atsType: "greenhouse", atsSlug: "totango" },
  { name: "Drata", domain: "drata.com", atsType: "greenhouse", atsSlug: "drata" },
  { name: "Vanta", domain: "vanta.com", atsType: "greenhouse", atsSlug: "vanta" },
  { name: "Lacework", domain: "lacework.com", atsType: "greenhouse", atsSlug: "lacework" },
  { name: "Abnormal Security", domain: "abnormalsecurity.com", atsType: "greenhouse", atsSlug: "abnormalsecurity" },
  { name: "Tessian", domain: "tessian.com", atsType: "greenhouse", atsSlug: "tessian" },
  { name: "Orca Security", domain: "orca.security", atsType: "greenhouse", atsSlug: "orcasecurity" },
  { name: "Wiz", domain: "wiz.io", atsType: "greenhouse", atsSlug: "wiz" },
  { name: "Cribl", domain: "cribl.io", atsType: "greenhouse", atsSlug: "cribl" },
  { name: "Chronosphere", domain: "chronosphere.io", atsType: "greenhouse", atsSlug: "chronosphere" },
  { name: "Harness", domain: "harness.io", atsType: "greenhouse", atsSlug: "harness" },
  { name: "LaunchDarkly", domain: "launchdarkly.com", atsType: "greenhouse", atsSlug: "launchdarkly" },
  { name: "Split", domain: "split.io", atsType: "greenhouse", atsSlug: "split" },
  { name: "Statsig", domain: "statsig.com", atsType: "greenhouse", atsSlug: "statsig" },
  { name: "Amplitude", domain: "amplitude.com", atsType: "greenhouse", atsSlug: "amplitude" },
  { name: "Heap", domain: "heap.io", atsType: "greenhouse", atsSlug: "heap" },
  { name: "Sprig", domain: "sprig.com", atsType: "greenhouse", atsSlug: "sprig" },
  { name: "PostHog", domain: "posthog.com", atsType: "greenhouse", atsSlug: "posthog" },

  // ── LEVER CANDIDATES ──

  { name: "Netflix", domain: "netflix.com", atsType: "lever", atsSlug: "netflix" },
  { name: "KPMG", domain: "kpmg.com", atsType: "lever", atsSlug: "kpmg" },
  { name: "Netlify", domain: "netlify.com", atsType: "lever", atsSlug: "netlify" },
  { name: "Samsara", domain: "samsara.com", atsType: "lever", atsSlug: "samsara" },
  { name: "Grammarly", domain: "grammarly.com", atsType: "lever", atsSlug: "grammarly" },
  { name: "Zapier", domain: "zapier.com", atsType: "lever", atsSlug: "zapier" },
  { name: "GitBook", domain: "gitbook.com", atsType: "lever", atsSlug: "gitbook" },
  { name: "Remote", domain: "remote.com", atsType: "lever", atsSlug: "remote" },
  { name: "Automattic", domain: "automattic.com", atsType: "lever", atsSlug: "automattic" },
  { name: "Buffer", domain: "buffer.com", atsType: "lever", atsSlug: "buffer" },
  { name: "InVision", domain: "invisionapp.com", atsType: "lever", atsSlug: "invision" },
  { name: "Toptal", domain: "toptal.com", atsType: "lever", atsSlug: "toptal" },
  { name: "Superhuman", domain: "superhuman.com", atsType: "lever", atsSlug: "superhuman" },
  { name: "Stitch Fix", domain: "stitchfix.com", atsType: "lever", atsSlug: "stitchfix" },
  { name: "Compass", domain: "compass.com", atsType: "lever", atsSlug: "compass" },
  { name: "Nerdwallet", domain: "nerdwallet.com", atsType: "lever", atsSlug: "nerdwallet" },
  { name: "Flexport", domain: "flexport.com", atsType: "lever", atsSlug: "flexport" },
  { name: "Cockroach Labs", domain: "cockroachlabs.com", atsType: "lever", atsSlug: "cockroach-labs" },
  { name: "Hinge", domain: "hinge.co", atsType: "lever", atsSlug: "hinge" },
  { name: "Quora", domain: "quora.com", atsType: "lever", atsSlug: "quora" },
  { name: "Nextdoor", domain: "nextdoor.com", atsType: "lever", atsSlug: "nextdoor" },
  { name: "Medium", domain: "medium.com", atsType: "lever", atsSlug: "medium" },
  { name: "Oscar Health", domain: "hioscar.com", atsType: "lever", atsSlug: "oscar-health" },
  { name: "Clara Analytics", domain: "claraanalytics.com", atsType: "lever", atsSlug: "claraanalytics" },
  { name: "Clearbit", domain: "clearbit.com", atsType: "lever", atsSlug: "clearbit" },
  { name: "Gong", domain: "gong.io", atsType: "lever", atsSlug: "gong" },
  { name: "Chorus.ai", domain: "chorus.ai", atsType: "lever", atsSlug: "chorus" },
  { name: "Outreach", domain: "outreach.io", atsType: "lever", atsSlug: "outreach" },
  { name: "Salesloft", domain: "salesloft.com", atsType: "lever", atsSlug: "salesloft" },
  { name: "Highspot", domain: "highspot.com", atsType: "lever", atsSlug: "highspot" },
  { name: "Seismic", domain: "seismic.com", atsType: "lever", atsSlug: "seismic" },
  { name: "6River Systems", domain: "6river.com", atsType: "lever", atsSlug: "6riversystems" },
  { name: "Verkada", domain: "verkada.com", atsType: "lever", atsSlug: "verkada" },
  { name: "Cloudinary", domain: "cloudinary.com", atsType: "lever", atsSlug: "cloudinary" },
  { name: "Optimizely", domain: "optimizely.com", atsType: "lever", atsSlug: "optimizely" },
  { name: "WalkMe", domain: "walkme.com", atsType: "lever", atsSlug: "walkme" },
  { name: "Whatfix", domain: "whatfix.com", atsType: "lever", atsSlug: "whatfix" },
  { name: "Appcues", domain: "appcues.com", atsType: "lever", atsSlug: "appcues" },
  { name: "Recurly", domain: "recurly.com", atsType: "lever", atsSlug: "recurly" },
  { name: "Paddle", domain: "paddle.com", atsType: "lever", atsSlug: "paddle" },
  { name: "ChartMogul", domain: "chartmogul.com", atsType: "lever", atsSlug: "chartmogul" },
  { name: "ProfitWell", domain: "profitwell.com", atsType: "lever", atsSlug: "profitwell" },
  { name: "Baremetrics", domain: "baremetrics.com", atsType: "lever", atsSlug: "baremetrics" },
  { name: "FloQast", domain: "floqast.com", atsType: "lever", atsSlug: "floqast" },
  { name: "Ramp", domain: "ramp.com", atsType: "lever", atsSlug: "ramp" },
  { name: "Zipline", domain: "flyzipline.com", atsType: "lever", atsSlug: "flyzipline" },
  { name: "Planet", domain: "planet.com", atsType: "lever", atsSlug: "planet" },
  { name: "Bird", domain: "bird.co", atsType: "lever", atsSlug: "bird" },
  { name: "Lime", domain: "li.me", atsType: "lever", atsSlug: "lime" },
  { name: "Via", domain: "ridewithvia.com", atsType: "lever", atsSlug: "ridewithvia" },
  { name: "Devoted Health", domain: "devoted.com", atsType: "lever", atsSlug: "devoted" },
  { name: "Alto Pharmacy", domain: "alto.com", atsType: "lever", atsSlug: "alto" },
  { name: "Cerebral", domain: "getcerebral.com", atsType: "lever", atsSlug: "cerebral" },
  { name: "Truepill", domain: "truepill.com", atsType: "lever", atsSlug: "truepill" },
  { name: "Articulate", domain: "articulate.com", atsType: "lever", atsSlug: "articulate" },
  { name: "Doist", domain: "doist.com", atsType: "lever", atsSlug: "doist" },
  { name: "Close", domain: "close.com", atsType: "lever", atsSlug: "close.io" },
  { name: "Help Scout", domain: "helpscout.com", atsType: "lever", atsSlug: "helpscout" },
  { name: "Lempire", domain: "lempire.com", atsType: "lever", atsSlug: "lempire" },
  { name: "Hotjar", domain: "hotjar.com", atsType: "lever", atsSlug: "hotjar" },
  { name: "Oyster", domain: "oysterhr.com", atsType: "lever", atsSlug: "oyster" },
  { name: "Deel", domain: "deel.com", atsType: "lever", atsSlug: "deel" },
  { name: "Turing", domain: "turing.com", atsType: "lever", atsSlug: "turing" },
  { name: "Velocity Global", domain: "velocityglobal.com", atsType: "lever", atsSlug: "velocityglobal" },

  // ── ASHBY CANDIDATES ──

  { name: "Vercel", domain: "vercel.com", atsType: "ashby", atsSlug: "vercel" },
  { name: "Linear", domain: "linear.app", atsType: "ashby", atsSlug: "linear" },
  { name: "Retool", domain: "retool.com", atsType: "ashby", atsSlug: "retool" },
  { name: "Supabase", domain: "supabase.com", atsType: "ashby", atsSlug: "supabase" },
  { name: "Resend", domain: "resend.com", atsType: "ashby", atsSlug: "resend" },
  { name: "Turso", domain: "turso.tech", atsType: "ashby", atsSlug: "turso" },
  { name: "Neon", domain: "neon.tech", atsType: "ashby", atsSlug: "neon" },
  { name: "Cal.com", domain: "cal.com", atsType: "ashby", atsSlug: "calcom" },
  { name: "Tinybird", domain: "tinybird.co", atsType: "ashby", atsSlug: "tinybird" },
  { name: "Inngest", domain: "inngest.com", atsType: "ashby", atsSlug: "inngest" },
  { name: "Trigger.dev", domain: "trigger.dev", atsType: "ashby", atsSlug: "trigger-dev" },
  { name: "Upstash", domain: "upstash.com", atsType: "ashby", atsSlug: "upstash" },
  { name: "Novu", domain: "novu.co", atsType: "ashby", atsSlug: "novu" },
  { name: "Spacelift", domain: "spacelift.io", atsType: "ashby", atsSlug: "spacelift" },
  { name: "Grafbase", domain: "grafbase.com", atsType: "ashby", atsSlug: "grafbase" },
  { name: "Axiom", domain: "axiom.co", atsType: "ashby", atsSlug: "axiom" },
  { name: "Nango", domain: "nango.dev", atsType: "ashby", atsSlug: "nango" },
  { name: "Meilisearch", domain: "meilisearch.com", atsType: "ashby", atsSlug: "meilisearch" },
  { name: "Speakeasy", domain: "speakeasyapi.dev", atsType: "ashby", atsSlug: "speakeasy" },
  { name: "Depot", domain: "depot.dev", atsType: "ashby", atsSlug: "depot" },
  { name: "Deno", domain: "deno.com", atsType: "ashby", atsSlug: "deno" },
  { name: "Bun", domain: "bun.sh", atsType: "ashby", atsSlug: "oven" },
  { name: "Cursor", domain: "cursor.sh", atsType: "ashby", atsSlug: "anysphere" },
  { name: "Replit", domain: "replit.com", atsType: "ashby", atsSlug: "replit" },
  { name: "GitPod", domain: "gitpod.io", atsType: "ashby", atsSlug: "gitpod" },
  { name: "Railway", domain: "railway.app", atsType: "ashby", atsSlug: "railway" },
  { name: "Doppler", domain: "doppler.com", atsType: "ashby", atsSlug: "doppler" },
  { name: "Snyk", domain: "snyk.io", atsType: "ashby", atsSlug: "snyk" },
  { name: "Warp", domain: "warp.dev", atsType: "ashby", atsSlug: "warp" },
  { name: "Fig", domain: "fig.io", atsType: "ashby", atsSlug: "fig" },
  { name: "Clerk", domain: "clerk.com", atsType: "ashby", atsSlug: "clerk" },
  { name: "WorkOS", domain: "workos.com", atsType: "ashby", atsSlug: "workos" },
  { name: "Propel Auth", domain: "propelauth.com", atsType: "ashby", atsSlug: "propelauth" },
  { name: "Lago", domain: "getlago.com", atsType: "ashby", atsSlug: "lago" },
  { name: "Polar", domain: "polar.sh", atsType: "ashby", atsSlug: "polar" },
  { name: "Airplane", domain: "airplane.dev", atsType: "ashby", atsSlug: "airplane" },
  { name: "Pieces", domain: "pieces.app", atsType: "ashby", atsSlug: "pieces" },
  { name: "Raycast", domain: "raycast.com", atsType: "ashby", atsSlug: "raycast" },
  { name: "Zed", domain: "zed.dev", atsType: "ashby", atsSlug: "zed-industries" },
  { name: "Pylon", domain: "usepylon.com", atsType: "ashby", atsSlug: "pylon" },
  { name: "Plain", domain: "plain.com", atsType: "ashby", atsSlug: "plain" },
  { name: "Fern", domain: "buildwithfern.com", atsType: "ashby", atsSlug: "fern" },
  { name: "Baseten", domain: "baseten.co", atsType: "ashby", atsSlug: "baseten" },
  { name: "Fireworks AI", domain: "fireworks.ai", atsType: "ashby", atsSlug: "fireworks-ai" },
  { name: "Pika", domain: "pika.art", atsType: "ashby", atsSlug: "pika" },
  { name: "ElevenLabs", domain: "elevenlabs.io", atsType: "ashby", atsSlug: "elevenlabs" },
  { name: "Glean", domain: "glean.com", atsType: "ashby", atsSlug: "glean" },
  { name: "Hex", domain: "hex.tech", atsType: "ashby", atsSlug: "hex" },
  { name: "Census", domain: "getcensus.com", atsType: "ashby", atsSlug: "census" },
  { name: "Hightouch", domain: "hightouch.com", atsType: "ashby", atsSlug: "hightouch" },
  { name: "Airbyte", domain: "airbyte.com", atsType: "ashby", atsSlug: "airbyte" },
  { name: "Great Expectations", domain: "greatexpectations.io", atsType: "ashby", atsSlug: "great-expectations" },
  { name: "Materialize", domain: "materialize.com", atsType: "ashby", atsSlug: "materialize" },
  { name: "Dagster", domain: "dagster.io", atsType: "ashby", atsSlug: "dagster" },
  { name: "Coalesce", domain: "coalesce.io", atsType: "ashby", atsSlug: "coalesce" },
  { name: "Rudderstack", domain: "rudderstack.com", atsType: "ashby", atsSlug: "rudderstack" },
  { name: "Temporal", domain: "temporal.io", atsType: "ashby", atsSlug: "temporal" },
  { name: "Fly.io", domain: "fly.io", atsType: "ashby", atsSlug: "fly-io" },
  { name: "Coder", domain: "coder.com", atsType: "ashby", atsSlug: "coder" },
  { name: "Gitpod", domain: "gitpod.io", atsType: "ashby", atsSlug: "gitpod" },
  { name: "Buildkite", domain: "buildkite.com", atsType: "ashby", atsSlug: "buildkite" },
  { name: "Semgrep", domain: "semgrep.dev", atsType: "ashby", atsSlug: "semgrep" },
  { name: "Socket", domain: "socket.dev", atsType: "ashby", atsSlug: "socket" },
  { name: "Tailscale", domain: "tailscale.com", atsType: "ashby", atsSlug: "tailscale" },
  { name: "Teleport", domain: "goteleport.com", atsType: "ashby", atsSlug: "teleport" },
  { name: "StrongDM", domain: "strongdm.com", atsType: "ashby", atsSlug: "strongdm" },

  // ── GEM CANDIDATES ──

  { name: "Vercel", domain: "vercel.com", atsType: "gem", atsSlug: "vercel" },
  { name: "Linear", domain: "linear.app", atsType: "gem", atsSlug: "linear" },
  { name: "Resend", domain: "resend.com", atsType: "gem", atsSlug: "resend" },
  { name: "Supabase", domain: "supabase.com", atsType: "gem", atsSlug: "supabase" },
  { name: "Warp", domain: "warp.dev", atsType: "gem", atsSlug: "warp" },
  { name: "Raycast", domain: "raycast.com", atsType: "gem", atsSlug: "raycast" },
  { name: "Cursor", domain: "cursor.sh", atsType: "gem", atsSlug: "anysphere" },
  { name: "Perplexity", domain: "perplexity.ai", atsType: "gem", atsSlug: "perplexity" },
  { name: "Mistral AI", domain: "mistral.ai", atsType: "gem", atsSlug: "mistral" },
  { name: "Pika", domain: "pika.art", atsType: "gem", atsSlug: "pika" },
  { name: "Codeium", domain: "codeium.com", atsType: "gem", atsSlug: "codeium" },
  { name: "Deno", domain: "deno.com", atsType: "gem", atsSlug: "deno" },
  { name: "Bun", domain: "bun.sh", atsType: "gem", atsSlug: "oven" },
  { name: "Turso", domain: "turso.tech", atsType: "gem", atsSlug: "turso" },
  { name: "Inngest", domain: "inngest.com", atsType: "gem", atsSlug: "inngest" },
  { name: "Polar", domain: "polar.sh", atsType: "gem", atsSlug: "polar" },
  { name: "Cal.com", domain: "cal.com", atsType: "gem", atsSlug: "calcom" },
  { name: "PostHog", domain: "posthog.com", atsType: "gem", atsSlug: "posthog" },
  { name: "Dagster", domain: "dagster.io", atsType: "gem", atsSlug: "dagster" },
  { name: "Airbyte", domain: "airbyte.com", atsType: "gem", atsSlug: "airbyte" },
];

// ─── MAIN ───

// Filter out companies already in the existing list
const existingPath = "/tmp/existing_companies.txt";
import { readFileSync } from "fs";

let existingNames = new Set();
try {
  const raw = readFileSync(existingPath, "utf-8");
  existingNames = new Set(raw.split("\n").map((s) => s.trim().toLowerCase()).filter(Boolean));
} catch {}

// Also deduplicate within candidates (keep first occurrence per name)
const seen = new Set();
const uniqueCandidates = CANDIDATES.filter((c) => {
  const key = `${c.name.toLowerCase()}-${c.atsType}`;
  if (seen.has(key)) return false;
  if (existingNames.has(c.name.toLowerCase())) return false;
  seen.add(key);
  return true;
});

console.log(`\nVerifying ${uniqueCandidates.length} candidate companies (excluding ${CANDIDATES.length - uniqueCandidates.length} duplicates/existing)...\n`);

const results = await batchVerify(uniqueCandidates);

const verified = results.filter((r) => r.ok);
const failed = results.filter((r) => !r.ok);

console.log(`\n═══ RESULTS ═══`);
console.log(`✓ Verified: ${verified.length}`);
console.log(`✗ Failed: ${failed.length}`);

if (verified.length > 0) {
  console.log(`\n── VERIFIED (copy to companies.ts) ──\n`);
  for (const c of verified) {
    console.log(
      `  { name: "${c.name}", domain: "${c.domain}", careersUrl: "https://${c.domain}/careers", atsType: "${c.atsType}", atsSlug: "${c.atsSlug}" },`
    );
  }
}

if (failed.length > 0) {
  console.log(`\n── FAILED ──\n`);
  for (const c of failed) {
    console.log(`  ✗ ${c.name} (${c.atsType}/${c.atsSlug}): ${c.status || c.error}`);
  }
}
