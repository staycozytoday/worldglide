#!/usr/bin/env node
/**
 * ashby-customers.mjs
 *
 * Tests confirmed Ashby customers (from ashbyhq.com/customers) +
 * dictionary brute-force of common startup names.
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const src = readFileSync(resolve(__dirname, "../src/lib/companies.ts"), "utf-8");
const existingSlugs = new Set();
const existingNames = new Set();
for (const m of src.matchAll(/atsSlug:\s*"([^"]+)"/g)) existingSlugs.add(m[1]);
for (const m of src.matchAll(/name:\s*"([^"]+)"/g)) existingNames.add(m[1].toLowerCase().replace(/[^a-z0-9]/g, ""));

console.log(`existing: ${existingSlugs.size} slugs, ${existingNames.size} names\n`);

// ── ATS check ──
async function checkAshby(slug) {
  try {
    const res = await fetch(`https://api.ashbyhq.com/posting-api/job-board/${slug}`, { signal: AbortSignal.timeout(6000) });
    if (!res.ok) return null;
    const data = await res.json();
    if (data && (data.jobs || data.jobPostings || data.data)) return slug;
  } catch {}
  return null;
}

async function checkLever(slug) {
  try {
    const res = await fetch(`https://api.lever.co/v0/postings/${slug}?limit=1`, { signal: AbortSignal.timeout(6000) });
    if (!res.ok) return null;
    const data = await res.json();
    if (Array.isArray(data)) return slug;
  } catch {}
  return null;
}

// ── Confirmed Ashby customers + slug guesses ──
const ASHBY_CUSTOMERS = [
  ["Snowflake", "snowflake.com", ["snowflake"]],
  ["Ironclad", "ironcladhq.com", ["ironclad", "ironcladhq"]],
  ["Lemonade", "lemonade.com", ["lemonade"]],
  ["Lime", "li.me", ["lime"]],
  ["Gorgias", "gorgias.com", ["gorgias"]],
  ["UiPath", "uipath.com", ["uipath"]],
  ["Clay", "clay.com", ["clay"]],
  ["Deliveroo", "deliveroo.com", ["deliveroo"]],
  ["Retool", "retool.com", ["retool"]],
  ["Aurora Solar", "aurorasolar.com", ["aurorasolar", "aurora-solar"]],
  ["Boomi", "boomi.com", ["boomi"]],
  ["Brightline", "brightline.com", ["brightline"]],
  ["Coder", "coder.com", ["coder"]],
  ["Convictional", "convictional.com", ["convictional"]],
  ["Dave", "dave.com", ["dave"]],
  ["Eight Sleep", "eightsleep.com", ["eightsleep", "eight-sleep"]],
  ["Flock Safety", "flocksafety.com", ["flocksafety", "flock-safety"]],
  ["Form Energy", "formenergy.com", ["formenergy", "form-energy"]],
  ["FullStory", "fullstory.com", ["fullstory"]],
  ["HackerOne", "hackerone.com", ["hackerone"]],
  ["January", "january.com", ["january"]],
  ["Marqeta", "marqeta.com", ["marqeta"]],
  ["Monte Carlo", "montecarlodata.com", ["montecarlodata", "montecarlo"]],
  ["NETGEAR", "netgear.com", ["netgear"]],
  ["Sequoia", "sequoiacap.com", ["sequoia"]],
  ["Cedar", "cedar.com", ["cedar"]],
  ["Trainline", "trainline.com", ["trainline"]],
  ["Nivoda", "nivoda.com", ["nivoda"]],
  ["GrowthAssistant", "growthassistant.com", ["growthassistant"]],
  ["Zello", "zello.com", ["zello"]],
  ["hyperexponential", "hyperexponential.com", ["hyperexponential", "hx"]],
  ["Brigit", "brigit.com", ["brigit"]],
  ["Hopper", "hopper.com", ["hopper"]],
  ["Worldly", "worldly.io", ["worldly"]],
  ["TheyDo", "theydo.com", ["theydo"]],
  ["Andela", "andela.com", ["andela"]],
  ["Statista", "statista.com", ["statista"]],
  ["Reprise", "reprise.com", ["reprise"]],
  ["mParticle", "mparticle.com", ["mparticle"]],
  ["Vivante Health", "vivantehealth.com", ["vivantehealth"]],
  ["Teal", "tealhq.com", ["teal"]],
  ["Leapsome", "leapsome.com", ["leapsome"]],
  ["Quora", "quora.com", ["quora"]],
  ["Rad AI", "radai.com", ["radai", "rad-ai"]],
  ["Scribe", "scribehow.com", ["scribe", "scribehow"]],
  ["Luma AI", "lumalabs.ai", ["lumalabs", "luma"]],
  ["Supabase", "supabase.com", ["supabase"]],
  ["PostHog", "posthog.com", ["posthog"]],
  ["Help Scout", "helpscout.com", ["helpscout", "help-scout"]],
  ["Notion", "notion.so", ["notion"]],

  // ── dictionary: common startup names ──
  ["Airtable", "airtable.com", ["airtable"]],
  ["Amplitude", "amplitude.com", ["amplitude"]],
  ["Anduril", "anduril.com", ["anduril"]],
  ["Aptos", "aptoslabs.com", ["aptos", "aptoslabs"]],
  ["Assembled", "assembled.com", ["assembled"]],
  ["Attentive", "attentive.com", ["attentive"]],
  ["Bench", "bench.co", ["bench"]],
  ["Bolt", "bolt.com", ["bolt"]],
  ["Braze", "braze.com", ["braze"]],
  ["Brilliant", "brilliant.org", ["brilliant"]],
  ["Bynder", "bynder.com", ["bynder"]],
  ["Census", "getcensus.com", ["census"]],
  ["Charm", "charm.io", ["charm"]],
  ["Circle", "circle.com", ["circle"]],
  ["Clockwise", "getclockwise.com", ["clockwise"]],
  ["Coast", "coast.com", ["coast"]],
  ["Column", "column.com", ["column"]],
  ["Contour", "contour.so", ["contour"]],
  ["Copilot", "copilot.com", ["copilot"]],
  ["Cortex", "cortex.io", ["cortex"]],
  ["Craft", "craft.do", ["craft"]],
  ["Dagger", "dagger.io", ["dagger"]],
  ["Density", "density.io", ["density"]],
  ["Dispatch", "dispatch.com", ["dispatch"]],
  ["Dock", "dock.us", ["dock"]],
  ["Drift", "drift.com", ["drift"]],
  ["Elsa", "elsaspeak.com", ["elsa"]],
  ["Ember", "ember.com", ["ember"]],
  ["Empower", "empower.com", ["empower"]],
  ["Encore", "encore.dev", ["encore"]],
  ["Factor", "factor.ai", ["factor"]],
  ["Finch", "tryfinch.com", ["finch"]],
  ["Float", "float.com", ["float"]],
  ["Flourish", "flourish.studio", ["flourish"]],
  ["Forge", "forge.com", ["forge"]],
  ["Found", "found.com", ["found"]],
  ["Fountain", "fountain.com", ["fountain"]],
  ["Gather", "gather.town", ["gather"]],
  ["Gem", "gem.com", ["gem"]],
  ["Glean", "glean.com", ["glean"]],
  ["Gleam", "gleam.io", ["gleam"]],
  ["Grain", "grain.com", ["grain"]],
  ["Guide", "guide.co", ["guide"]],
  ["Harbor", "harbor.com", ["harbor"]],
  ["Haven", "haven.com", ["haven"]],
  ["Helm", "helm.com", ["helm"]],
  ["Hero", "hero.com", ["hero"]],
  ["Hive", "hive.com", ["hive"]],
  ["Honeycomb", "honeycomb.io", ["honeycomb"]],
  ["Hubble", "hubble.com", ["hubble"]],
  ["Icon", "iconbuild.com", ["icon"]],
  ["Immutable", "immutable.com", ["immutable"]],
  ["Interval", "interval.com", ["interval"]],
  ["Iris", "iris.com", ["iris"]],
  ["Island", "island.io", ["island"]],
  ["Jasper", "jasper.ai", ["jasper"]],
  ["Jolt", "jolt.com", ["jolt"]],
  ["Jump", "jump.com", ["jump"]],
  ["Keen", "keen.io", ["keen"]],
  ["Kinde", "kinde.com", ["kinde"]],
  ["Knock", "knock.app", ["knock"]],
  ["Lambda", "lambda.com", ["lambda", "lambdalabs"]],
  ["Lattice", "lattice.com", ["lattice"]],
  ["Layer", "layer.com", ["layer"]],
  ["Loop", "loop.com", ["loop"]],
  ["Maple", "maple.com", ["maple"]],
  ["Maven", "maven.com", ["maven"]],
  ["Mesa", "mesa.com", ["mesa"]],
  ["Mirror", "mirror.xyz", ["mirror"]],
  ["Motive", "gomotive.com", ["motive"]],
  ["Move", "move.com", ["move"]],
  ["Multi", "multi.app", ["multi"]],
  ["Noble", "noble.com", ["noble"]],
  ["Northbeam", "northbeam.io", ["northbeam"]],
  ["Notion", "notion.so", ["notion"]],
  ["Olive", "olive.com", ["olive"]],
  ["Orbit", "orbit.love", ["orbit"]],
  ["Origin", "useorigin.com", ["origin"]],
  ["Osprey", "osprey.com", ["osprey"]],
  ["Oxide", "oxide.computer", ["oxide"]],
  ["Palm", "palm.com", ["palm"]],
  ["Patch", "patch.io", ["patch"]],
  ["Peak", "peak.ai", ["peak"]],
  ["Pier", "pier.com", ["pier"]],
  ["Pilot", "pilot.com", ["pilot"]],
  ["Pine", "pine.com", ["pine"]],
  ["Pique", "pique.com", ["pique"]],
  ["Plaid", "plaid.com", ["plaid"]],
  ["Plume", "plume.com", ["plume"]],
  ["Primer", "primer.ai", ["primer"]],
  ["Prism", "prism.com", ["prism"]],
  ["Promise", "promise.com", ["promise"]],
  ["Propel", "propel.com", ["propel"]],
  ["Proxima", "proxima.ai", ["proxima"]],
  ["Pulse", "pulse.com", ["pulse"]],
  ["Range", "range.co", ["range"]],
  ["Raze", "raze.com", ["raze"]],
  ["Reef", "reef.com", ["reef"]],
  ["Ridge", "ridge.co", ["ridge"]],
  ["Rise", "rise.com", ["rise"]],
  ["Ritual", "ritual.co", ["ritual"]],
  ["Riverbed", "riverbed.com", ["riverbed"]],
  ["Roam", "roam.co", ["roam"]],
  ["Rocket", "rocket.com", ["rocket"]],
  ["Root", "root.com", ["root"]],
  ["Runway", "runway.com", ["runway"]],
  ["Sage", "sage.com", ["sage"]],
  ["Scale", "scale.com", ["scale"]],
  ["Scribe", "scribehow.com", ["scribe"]],
  ["Scroll", "scroll.com", ["scroll"]],
  ["Seed", "seed.com", ["seed"]],
  ["Shelf", "shelf.io", ["shelf"]],
  ["Shield", "shield.com", ["shield"]],
  ["Sigma", "sigma.com", ["sigma"]],
  ["Signal", "signal.co", ["signal"]],
  ["Slope", "slope.com", ["slope"]],
  ["Snap", "snap.com", ["snap"]],
  ["Solar", "solar.com", ["solar"]],
  ["Solve", "solve.com", ["solve"]],
  ["Source", "source.com", ["source"]],
  ["Spark", "spark.com", ["spark"]],
  ["Spire", "spire.com", ["spire"]],
  ["Spring", "spring.com", ["spring"]],
  ["Stash", "stash.com", ["stash"]],
  ["Stellar", "stellar.org", ["stellar"]],
  ["Stream", "getstream.io", ["stream"]],
  ["Summit", "summit.com", ["summit"]],
  ["Surge", "surge.com", ["surge"]],
  ["Swift", "swift.com", ["swift"]],
  ["Tandem", "tandem.com", ["tandem"]],
  ["Tempo", "tempo.com", ["tempo"]],
  ["Terra", "terra.com", ["terra"]],
  ["Thread", "thread.com", ["thread"]],
  ["Tide", "tide.co", ["tide"]],
  ["Timber", "timber.io", ["timber"]],
  ["Toggle", "toggle.com", ["toggle"]],
  ["Torch", "torch.com", ["torch"]],
  ["Trek", "trek.com", ["trek"]],
  ["Trust", "trust.com", ["trust"]],
  ["Tune", "tune.com", ["tune"]],
  ["Unity", "unity.com", ["unity"]],
  ["Upside", "upside.com", ["upside"]],
  ["Vault", "vault.com", ["vault"]],
  ["Vercel", "vercel.com", ["vercel"]],
  ["Vessel", "vessel.com", ["vessel"]],
  ["Vista", "vista.com", ["vista"]],
  ["Vivid", "vivid.com", ["vivid"]],
  ["Voice", "voice.com", ["voice"]],
  ["Wander", "wander.com", ["wander"]],
  ["Wave", "wave.com", ["wave"]],
  ["Whim", "whim.com", ["whim"]],
  ["Wing", "wing.com", ["wing"]],
  ["Wonder", "wonder.com", ["wonder"]],
  ["Yonder", "yonder.com", ["yonder"]],
  ["Zeal", "zeal.com", ["zeal"]],
  ["Zen", "zen.com", ["zen"]],
  ["Zero", "zero.com", ["zero"]],
  ["Zinc", "zinc.com", ["zinc"]],
  ["Zone", "zone.com", ["zone"]],
  // more tech startup names
  ["Persona", "withpersona.com", ["persona"]],
  ["Materialize", "materialize.com", ["materialize"]],
  ["Temporal", "temporal.io", ["temporal"]],
  ["Tailscale", "tailscale.com", ["tailscale"]],
  ["Weights & Biases", "wandb.com", ["wandb"]],
  ["Runway ML", "runwayml.com", ["runwayml"]],
  ["Wiz", "wiz.io", ["wiz"]],
  ["Snyk", "snyk.io", ["snyk"]],
  ["Canva", "canva.com", ["canva"]],
  ["Figma", "figma.com", ["figma"]],
  ["Webflow", "webflow.com", ["webflow"]],
  ["Vercel", "vercel.com", ["vercel"]],
  ["Render", "render.com", ["render"]],
  ["Railway", "railway.app", ["railway"]],
  ["Planetscale", "planetscale.com", ["planetscale"]],
  ["Neon", "neon.tech", ["neon"]],
  ["Turso", "turso.tech", ["turso"]],
  ["Fly", "fly.io", ["fly"]],
  ["Modal", "modal.com", ["modal"]],
  ["Baseten", "baseten.co", ["baseten"]],
  ["Replicate", "replicate.com", ["replicate"]],
  ["Hugging Face", "huggingface.co", ["huggingface"]],
  ["Anthropic", "anthropic.com", ["anthropic"]],
  ["Perplexity", "perplexity.ai", ["perplexity"]],
  ["ElevenLabs", "elevenlabs.io", ["elevenlabs"]],
  ["Cursor", "cursor.com", ["anysphere"]],
  ["n8n", "n8n.io", ["n8n"]],
  ["Pylon", "usepylon.com", ["pylon"]],
  ["Causal", "causal.app", ["causal"]],
  ["Polaris", "polaris.com", ["polaris"]],
  ["Viam", "viam.com", ["viam"]],
  ["Hex", "hex.tech", ["hex"]],
  ["Modal", "modal.com", ["modal"]],
  ["Codeium", "codeium.com", ["codeium"]],
  ["Sourcegraph", "sourcegraph.com", ["sourcegraph"]],
  ["Sanity", "sanity.io", ["sanity"]],
  ["Stainless", "stainlessapi.com", ["stainless"]],
  ["Resend", "resend.com", ["resend"]],
  ["Cal.com", "cal.com", ["calcom"]],
  ["EvenUp", "evenuplaw.com", ["evenup"]],
  ["Acorns", "acorns.com", ["acorns"]],
  ["Cartesia", "cartesia.ai", ["cartesia"]],
  ["Zip", "ziphq.com", ["zip"]],
];

// dedup
const toTest = [];
const seen = new Set();
for (const [name, domain, slugs] of ASHBY_CUSTOMERS) {
  const norm = name.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (existingNames.has(norm)) continue;
  for (const s of slugs) {
    if (existingSlugs.has(s) || seen.has(s)) continue;
    seen.add(s);
    toTest.push([name, domain, s]);
  }
}

console.log(`${toTest.length} unique slugs to test (after dedup)\n`);

const BATCH = 20;
const DELAY = 400;
const verified = [];

async function run() {
  const t0 = Date.now();

  // test ashby
  console.log("── testing Ashby ──");
  for (let i = 0; i < toTest.length; i += BATCH) {
    const batch = toTest.slice(i, i + BATCH);
    const results = await Promise.allSettled(
      batch.map(async ([name, domain, slug]) => {
        const hit = await checkAshby(slug);
        return hit ? { name, domain, slug, ats: "ashby" } : null;
      })
    );
    for (const r of results) {
      if (r.status === "fulfilled" && r.value) {
        verified.push(r.value);
        console.log(`  ✓ ${r.value.name} → ashby/${r.value.slug}`);
      }
    }
    if ((i / BATCH + 1) % 5 === 0) {
      const e = ((Date.now() - t0) / 1000).toFixed(0);
      console.log(`  [${Math.min(i + BATCH, toTest.length)}/${toTest.length} tested, ${verified.length} found, ${e}s]`);
    }
    if (i + BATCH < toTest.length) await new Promise(r => setTimeout(r, DELAY));
  }

  // test failed ones against lever
  const ashbyHits = new Set(verified.map(v => v.slug));
  const leverCandidates = toTest.filter(([,,slug]) => !ashbyHits.has(slug));

  console.log(`\n── testing ${leverCandidates.length} remaining against Lever ──`);
  for (let i = 0; i < leverCandidates.length; i += BATCH) {
    const batch = leverCandidates.slice(i, i + BATCH);
    const results = await Promise.allSettled(
      batch.map(async ([name, domain, slug]) => {
        const hit = await checkLever(slug);
        return hit ? { name, domain, slug, ats: "lever" } : null;
      })
    );
    for (const r of results) {
      if (r.status === "fulfilled" && r.value) {
        verified.push(r.value);
        console.log(`  ✓ ${r.value.name} → lever/${r.value.slug}`);
      }
    }
    if (i + BATCH < leverCandidates.length) await new Promise(r => setTimeout(r, DELAY));
  }

  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`\n${"═".repeat(60)}`);
  console.log(`DONE in ${elapsed}s — ${verified.length} new companies found`);
  console.log(`${"═".repeat(60)}\n`);

  if (verified.length) {
    const byAts = { ashby: [], lever: [] };
    for (const v of verified) (byAts[v.ats] ||= []).push(v);

    console.log("// ── paste into companies.ts ──\n");
    for (const [ats, items] of Object.entries(byAts)) {
      if (!items.length) continue;
      console.log(`  // ${ats} — ashby customers + dictionary`);
      for (const v of items) {
        const cu = ats === "lever"
          ? `https://jobs.lever.co/${v.slug}`
          : `https://jobs.ashbyhq.com/${v.slug}`;
        const pad1 = " ".repeat(Math.max(1, 20 - v.name.length));
        const pad2 = " ".repeat(Math.max(1, 25 - v.domain.length));
        const pad3 = " ".repeat(Math.max(1, 45 - cu.length));
        console.log(`  { name: "${v.name}",${pad1}domain: "${v.domain}",${pad2}careersUrl: "${cu}",${pad3}atsType: "${ats}", atsSlug: "${v.slug}" },`);
      }
    }
  }
}

run();
