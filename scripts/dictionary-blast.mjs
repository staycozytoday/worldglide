#!/usr/bin/env node
/**
 * dictionary-blast.mjs
 *
 * Test 800+ common words and startup names against Ashby + Lever.
 * These are single-word slugs where Ashby has ~25% hit rate.
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const src = readFileSync(resolve(__dirname, "../src/lib/companies.ts"), "utf-8");
const existingSlugs = new Set();
for (const m of src.matchAll(/atsSlug:\s*"([^"]+)"/g)) existingSlugs.add(m[1]);

// ── words to test ──
const WORDS = [
  // nature / elements
  "amber","anchor","apex","arc","ash","aspen","atlas","aura","aurora",
  "basalt","bay","beacon","birch","bloom","blue","boulder","branch","breeze",
  "bridge","brook","canopy","canyon","cape","cascade","cedar","cinder","cliff",
  "cloud","clover","cobalt","coral","cosmos","creek","crest","crystal","current",
  "cypress","dawn","delta","dew","diamond","dove","dune","dust","echo",
  "eclipse","elm","ember","evergreen","falcon","fern","field","flame","flint",
  "flora","fog","fox","frost","galaxy","garden","glacier","glen","glow",
  "granite","grove","harbor","hawk","hazel","heath","heron","highland","hill",
  "hollow","horizon","ice","indigo","iron","island","ivy","jade","jasmine",
  "jet","jungle","lake","lark","lava","leaf","lily","lunar","meadow",
  "midnight","mineral","mist","moon","moss","mountain","nectar","north","nova",
  "oak","oasis","ocean","onyx","opal","orca","orchid","ore","owl",
  "pacific","panda","pearl","pebble","phoenix","pier","pine","plank","polar",
  "pollen","pond","prairie","quartz","rain","rapids","raven","redwood","reef",
  "ridge","river","robin","rock","rose","ruby","sage","sand","sapphire",
  "sequoia","shadow","shell","shore","silver","sky","slate","snow","solar",
  "sparrow","spring","star","steel","stone","storm","strand","stream","summit",
  "sun","surf","swift","terra","thistle","thorn","thunder","tide","timber",
  "topaz","trail","tree","tundra","valley","vapor","vine","violet","void",
  "wave","wild","willow","wind","wing","winter","wolf","wood","zen",

  // tech / abstract
  "abstract","adapt","agile","align","alpha","alto","amp","analog","anvil",
  "apex","aria","atom","axis","base","beam","beta","binary","bit",
  "block","blueprint","bridge","byte","cache","carbon","cell","chain","cipher",
  "circuit","civic","clarity","click","clip","clock","code","coil","compile",
  "compose","connect","console","core","cosmos","counter","craft","crate","cube",
  "cursor","cycle","daemon","dash","data","decode","deep","dense","depot",
  "derive","detect","device","dial","digital","dock","domain","drift","drive",
  "drop","dual","dynamic","edge","element","embed","enable","encode","engine",
  "entity","envision","epoch","ether","evolve","expand","explore","express",
  "extend","extract","fabric","factor","feed","fiber","field","filter","finite",
  "fix","flag","flash","flat","flex","flip","float","flow","flux",
  "focal","focus","fold","forge","form","frame","frontier","fuel","fulcrum",
  "fuse","fusion","gamma","gate","gauge","gear","genesis","ghost","giga",
  "gist","glide","globe","glyph","golem","graph","gravity","grid","grit",
  "grove","guide","guild","hack","handle","hash","haven","heap","helm",
  "hero","hex","hive","hollow","hood","hook","host","hub","hue",
  "hyper","icon","ignite","impact","impulse","index","infer","infinite","ink",
  "inner","input","insight","instant","intent","ionic","iris","iterate",
  "kernel","key","kinetic","kit","knot","lambda","lane","laser","latch",
  "launch","layer","lead","lens","level","lever","lift","light","limit",
  "line","link","liquid","list","literal","live","lobe","local","lock",
  "logic","loop","lumen","machine","magnet","main","maker","map","mark",
  "matrix","matter","max","maze","media","mega","memory","merge","mesh",
  "meta","method","metric","micro","mill","mind","mint","mission","mix",
  "mode","model","module","mojo","moment","mono","morph","motion","motor",
  "mux","nano","native","near","nerve","nest","net","neural","next",
  "nimbus","node","norm","notion","nucleus","null","object","octet","offset",
  "omega","omni","open","opera","optic","option","oracle","order","origin",
  "output","oxide","pack","page","pair","panel","para","parse","pass",
  "patch","path","pattern","pause","peak","peer","phase","pi","pilot",
  "pin","pipe","pixel","pivot","plan","plate","play","plot","plug",
  "point","polar","poly","pool","port","portal","post","power","prime",
  "print","prism","probe","process","profile","proof","propel","proto",
  "proxy","pulse","pure","push","quant","query","queue","quick","radar",
  "radix","rail","range","rank","ratio","raw","ray","reach","react",
  "realm","reason","record","red","reflex","relay","render","resolve","retro",
  "reveal","rift","ripple","rise","root","route","rover","rule","run",
  "rune","rush","salt","sample","scalar","scan","scope","scout","scroll",
  "seal","search","seed","sense","series","serve","set","shard","sharp",
  "shift","sight","sigma","sign","silk","silver","simple","site","sketch",
  "slate","slice","slot","smart","snap","socket","solo","solve","sonic",
  "south","space","span","spark","spec","speed","sphere","spin","spoke",
  "spot","squad","stack","stage","stamp","stand","static","step","stick",
  "stitch","store","strand","strap","stripe","strobe","studio","style","sum",
  "super","surge","swap","sweep","switch","symbol","sync","syntax","system",
  "tab","tag","tail","tally","tank","tape","target","task","tensor",
  "term","test","text","theme","thread","three","thrust","tick","tier",
  "token","tone","tool","top","topic","total","tower","trace","track",
  "trade","trail","trait","transit","trap","trend","trigger","trim","triple",
  "true","trust","tube","tune","tunnel","turbo","turn","twist","type",
  "ultra","union","unit","unity","unwind","uplink","upload","upper","urban",
  "use","valve","vector","venture","verb","verify","verse","vertex","via",
  "view","vigor","vital","vivo","void","volt","volume","vortex","ward",
  "watch","web","weight","west","widget","wire","witness","work","wrap",
  "yield","zone","zoom",

  // two-word combos (common startup patterns)
  "airlift","airlock","airship","backpack","bandwidth","baseline","blackbird",
  "blueprint","blueshift","brainwave","breakout","burnrate","bytesize","casetext",
  "chainlink","checkpoint","clearbit","clearscope","clockwork","cloudflare",
  "codebase","codepoint","codespace","coinbase","coinflip","compass","crossbeam",
  "crossover","crowdstrike","darkroom","darktrace","datadog","dataflow","dataset",
  "datavault","daybreak","deepmind","deepnote","dialpad","dimeshift","doorbell",
  "doordash","dropbox","earthly","easypost","endpoint","exabeam","eyebeam",
  "fairway","farmstead","fastly","feedloop","finmark","fireblocks","firefly",
  "firstbase","flagship","flatfile","fleetsmith","flipkart","flowspace",
  "flywheel","foldable","footprint","forecast","freeform","fullstack",
  "gameday","gatekeeper","goldfinch","greenfield","greenlight","groupon",
  "growthday","guideline","halfmoon","handshake","hardfork","headline",
  "headspace","headspin","heatmap","helpshift","highrise","highlight",
  "homebase","homerun","hotspot","hotswap","houseware","inbound","infield",
  "inkdrop","insight","intercom","ironside","jetpack","jumpcloud","keystone",
  "kickstart","kitemaker","landline","landmark","launchpad","layerpath",
  "leadpages","liftoff","lightbend","lightbox","lightstep","limelight",
  "lockstep","logfire","lookout","loopback","mainframe","mapbox","markdown",
  "matchbook","mindmap","mixpanel","moonshot","netdata","netflow","newrelic",
  "nightfall","notepad","offgrid","onboard","openpath","outbound","outreach",
  "overcast","overflow","overhaul","overlook","packstack","pagefly","paintbrush",
  "patchwork","paychex","paystack","pitchbook","placehold","playbook","plotline",
  "pushover","rainforest","redpoint","refresh","roadmap","rollbar","rollout",
  "rootstock","runbook","runtime","saleshood","sandbox","seatgeek","seedcamp",
  "serverless","setpoint","sharepoint","shortcut","sidecar","sightline",
  "signpost","skyline","slideshare","slipstream","slowdown","snapshot","snowplow",
  "softbank","soundcloud","sparkpost","spotlight","springboard","standout",
  "starship","startline","statuspage","steadfast","steamline","stepstone",
  "stonewall","stoplight","streamline","strongbox","sunbeam","sunlight",
  "surfboard","swiftkey","switchboard","tailored","taskflow","taskrabbit",
  "textbook","threadbare","tidepool","timescale","timezone","topline","topnotch",
  "touchbase","touchpoint","towergate","trackstar","trademark","treefort",
  "trenchant","trustpilot","turnkey","turnstile","upbound","upstream","uptick",
  "viewpoint","waypoint","webflow","wildcard","windmill","workflow","workrise",
  "workstream","yardstick","yearbook","zerodha",
];

// dedup against existing
const toTest = WORDS.filter(w => !existingSlugs.has(w));
console.log(`Testing ${toTest.length} words (${WORDS.length} total, ${WORDS.length - toTest.length} already exist)\n`);

const BATCH = 25;
const DELAY = 350;
const verified = [];

async function checkAshby(slug) {
  try {
    const r = await fetch(`https://api.ashbyhq.com/posting-api/job-board/${slug}`, { signal: AbortSignal.timeout(5000) });
    if (!r.ok) return null;
    const d = await r.json();
    return (d && (d.jobs || d.jobPostings || d.data)) ? slug : null;
  } catch { return null; }
}

async function checkLever(slug) {
  try {
    const r = await fetch(`https://api.lever.co/v0/postings/${slug}?limit=1`, { signal: AbortSignal.timeout(5000) });
    if (!r.ok) return null;
    const d = await r.json();
    return Array.isArray(d) ? slug : null;
  } catch { return null; }
}

async function run() {
  const t0 = Date.now();
  let tested = 0;

  // Ashby pass
  console.log("── Ashby pass ──");
  for (let i = 0; i < toTest.length; i += BATCH) {
    const batch = toTest.slice(i, i + BATCH);
    const results = await Promise.allSettled(batch.map(checkAshby));
    for (let j = 0; j < results.length; j++) {
      if (results[j].status === "fulfilled" && results[j].value) {
        verified.push({ slug: results[j].value, ats: "ashby" });
        console.log(`  ✓ ashby/${results[j].value}`);
      }
    }
    tested += batch.length;
    if (tested % 100 === 0) {
      const e = ((Date.now() - t0) / 1000).toFixed(0);
      console.log(`  [${tested}/${toTest.length}, ${verified.length} found, ${e}s]`);
    }
    if (i + BATCH < toTest.length) await new Promise(r => setTimeout(r, DELAY));
  }

  // Lever pass (only words that didn't hit Ashby)
  const ashbyHits = new Set(verified.map(v => v.slug));
  const leverWords = toTest.filter(w => !ashbyHits.has(w));

  console.log(`\n── Lever pass (${leverWords.length} remaining) ──`);
  tested = 0;
  for (let i = 0; i < leverWords.length; i += BATCH) {
    const batch = leverWords.slice(i, i + BATCH);
    const results = await Promise.allSettled(batch.map(checkLever));
    for (let j = 0; j < results.length; j++) {
      if (results[j].status === "fulfilled" && results[j].value) {
        verified.push({ slug: results[j].value, ats: "lever" });
        console.log(`  ✓ lever/${results[j].value}`);
      }
    }
    tested += batch.length;
    if (tested % 100 === 0) {
      const e = ((Date.now() - t0) / 1000).toFixed(0);
      console.log(`  [${tested}/${leverWords.length}, ${verified.length} found, ${e}s]`);
    }
    if (i + BATCH < leverWords.length) await new Promise(r => setTimeout(r, DELAY));
  }

  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`\n${"═".repeat(60)}`);
  console.log(`DONE in ${elapsed}s`);
  console.log(`TESTED: ${toTest.length} words`);
  console.log(`VERIFIED: ${verified.length} new companies`);
  console.log(`  Ashby: ${verified.filter(v => v.ats === "ashby").length}`);
  console.log(`  Lever: ${verified.filter(v => v.ats === "lever").length}`);
  console.log(`${"═".repeat(60)}\n`);

  // output
  if (verified.length) {
    const byAts = { ashby: [], lever: [] };
    for (const v of verified) (byAts[v.ats] ||= []).push(v);

    for (const [ats, items] of Object.entries(byAts)) {
      if (!items.length) continue;
      console.log(`  // ${ats} — dictionary blast`);
      for (const v of items) {
        const cu = ats === "lever"
          ? `https://jobs.lever.co/${v.slug}`
          : `https://jobs.ashbyhq.com/${v.slug}`;
        const name = v.slug.charAt(0).toUpperCase() + v.slug.slice(1);
        console.log(`  { name: "${name}", domain: "${v.slug}.com", careersUrl: "${cu}", atsType: "${ats}", atsSlug: "${v.slug}" },`);
      }
    }
  }
}

run();
