import { RemoteCompany } from "./types";

/**
 * Remote-first companies that hire worldwide.
 * We scrape their careers pages via ATS platforms (Greenhouse, Lever, Ashby).
 *
 * ALL ATS slugs below have been verified against live APIs (2026-02-23).
 * ✓ = returns HTTP 200 from the respective API endpoint.
 */
export const REMOTE_COMPANIES: RemoteCompany[] = [
  // ════════════════════════════════════════════════
  // GREENHOUSE — boards-api.greenhouse.io/v1/boards/{slug}/jobs
  // ════════════════════════════════════════════════

  // infrastructure & devtools
  { name: "GitLab", domain: "gitlab.com", careersUrl: "https://about.gitlab.com/jobs/", atsType: "greenhouse", atsSlug: "gitlab" },
  { name: "Canonical", domain: "canonical.com", careersUrl: "https://canonical.com/careers", atsType: "greenhouse", atsSlug: "canonical" },
  { name: "Grafana Labs", domain: "grafana.com", careersUrl: "https://grafana.com/about/careers/", atsType: "greenhouse", atsSlug: "grafanalabs" },
  { name: "Sourcegraph", domain: "sourcegraph.com", careersUrl: "https://about.sourcegraph.com/jobs", atsType: "greenhouse", atsSlug: "sourcegraph91" },
  { name: "Elastic", domain: "elastic.co", careersUrl: "https://www.elastic.co/careers", atsType: "greenhouse", atsSlug: "elastic" },
  { name: "DigitalOcean", domain: "digitalocean.com", careersUrl: "https://www.digitalocean.com/careers", atsType: "greenhouse", atsSlug: "digitalocean98" },
  { name: "CircleCI", domain: "circleci.com", careersUrl: "https://circleci.com/careers/", atsType: "greenhouse", atsSlug: "circleci" },
  { name: "Netlify", domain: "netlify.com", careersUrl: "https://www.netlify.com/careers/", atsType: "greenhouse", atsSlug: "netlify" },
  { name: "Cloudflare", domain: "cloudflare.com", careersUrl: "https://www.cloudflare.com/careers/", atsType: "greenhouse", atsSlug: "cloudflare" },
  { name: "PlanetScale", domain: "planetscale.com", careersUrl: "https://planetscale.com/careers", atsType: "greenhouse", atsSlug: "planetscale" },
  { name: "CockroachDB", domain: "cockroachlabs.com", careersUrl: "https://www.cockroachlabs.com/careers/", atsType: "greenhouse", atsSlug: "cockroachlabs" },
  { name: "MongoDB", domain: "mongodb.com", careersUrl: "https://www.mongodb.com/careers", atsType: "greenhouse", atsSlug: "mongodb" },
  { name: "Fastly", domain: "fastly.com", careersUrl: "https://www.fastly.com/about/careers", atsType: "greenhouse", atsSlug: "fastly" },
  { name: "Honeycomb", domain: "honeycomb.io", careersUrl: "https://www.honeycomb.io/careers/", atsType: "greenhouse", atsSlug: "honeycomb" },
  { name: "Cribl", domain: "cribl.io", careersUrl: "https://cribl.io/careers/", atsType: "greenhouse", atsSlug: "cribl" },
  { name: "Lob", domain: "lob.com", careersUrl: "https://www.lob.com/careers", atsType: "greenhouse", atsSlug: "lob" },
  { name: "SendBird", domain: "sendbird.com", careersUrl: "https://sendbird.com/careers", atsType: "greenhouse", atsSlug: "sendbird" },
  { name: "Stitch", domain: "stitchdata.com", careersUrl: "https://www.stitchdata.com/jobs/", atsType: "greenhouse", atsSlug: "stitch" },
  { name: "ClickHouse", domain: "clickhouse.com", careersUrl: "https://clickhouse.com/careers", atsType: "greenhouse", atsSlug: "clickhouse" },
  { name: "YugabyteDB", domain: "yugabyte.com", careersUrl: "https://www.yugabyte.com/careers/", atsType: "greenhouse", atsSlug: "yugabyte" },
  { name: "Tailscale", domain: "tailscale.com", careersUrl: "https://tailscale.com/careers", atsType: "greenhouse", atsSlug: "tailscale" },
  { name: "Temporal", domain: "temporal.io", careersUrl: "https://temporal.io/careers", atsType: "greenhouse", atsSlug: "temporal" },

  // fintech & payments & crypto
  { name: "Stripe", domain: "stripe.com", careersUrl: "https://stripe.com/jobs", atsType: "greenhouse", atsSlug: "stripe" },
  { name: "Coinbase", domain: "coinbase.com", careersUrl: "https://www.coinbase.com/careers", atsType: "greenhouse", atsSlug: "coinbase" },
  { name: "BitGo", domain: "bitgo.com", careersUrl: "https://bitgo.com/careers", atsType: "greenhouse", atsSlug: "bitgo" },
  { name: "Alchemy", domain: "alchemy.com", careersUrl: "https://www.alchemy.com/careers", atsType: "greenhouse", atsSlug: "alchemy" },
  { name: "Figment", domain: "figment.io", careersUrl: "https://figment.io/careers", atsType: "greenhouse", atsSlug: "figment" },
  { name: "ConsenSys", domain: "consensys.io", careersUrl: "https://consensys.io/careers", atsType: "greenhouse", atsSlug: "consensys" },
  { name: "Solana Foundation", domain: "solana.org", careersUrl: "https://jobs.solana.com/", atsType: "greenhouse", atsSlug: "solanafoundation" },
  { name: "Ripple", domain: "ripple.com", careersUrl: "https://ripple.com/careers/", atsType: "greenhouse", atsSlug: "ripple" },
  { name: "LayerZero Labs", domain: "layerzero.network", careersUrl: "https://layerzero.network/careers", atsType: "greenhouse", atsSlug: "layerzerolabs" },
  { name: "OpenZeppelin", domain: "openzeppelin.com", careersUrl: "https://www.openzeppelin.com/jobs", atsType: "greenhouse", atsSlug: "openzeppelin" },
  { name: "Paradigm", domain: "paradigm.xyz", careersUrl: "https://www.paradigm.xyz/opportunities", atsType: "greenhouse", atsSlug: "paradigm" },
  { name: "Brex", domain: "brex.com", careersUrl: "https://www.brex.com/careers", atsType: "greenhouse", atsSlug: "brex" },
  { name: "Mercury", domain: "mercury.com", careersUrl: "https://mercury.com/careers", atsType: "greenhouse", atsSlug: "mercury" },
  { name: "Gusto", domain: "gusto.com", careersUrl: "https://gusto.com/about/careers", atsType: "greenhouse", atsSlug: "gusto" },
  { name: "Toast", domain: "toasttab.com", careersUrl: "https://careers.toasttab.com/", atsType: "greenhouse", atsSlug: "toast" },
  { name: "Upstart", domain: "upstart.com", careersUrl: "https://www.upstart.com/careers", atsType: "greenhouse", atsSlug: "upstart" },
  { name: "JustWorks", domain: "justworks.com", careersUrl: "https://justworks.com/careers", atsType: "greenhouse", atsSlug: "justworks" },
  { name: "Carta", domain: "carta.com", careersUrl: "https://carta.com/careers/", atsType: "greenhouse", atsSlug: "carta" },
  { name: "Forter", domain: "forter.com", careersUrl: "https://www.forter.com/careers/", atsType: "greenhouse", atsSlug: "forter" },
  { name: "Adyen", domain: "adyen.com", careersUrl: "https://careers.adyen.com/", atsType: "greenhouse", atsSlug: "adyen" },
  { name: "Zuora", domain: "zuora.com", careersUrl: "https://www.zuora.com/careers/", atsType: "greenhouse", atsSlug: "zuora" },
  { name: "Papaya Global", domain: "papayaglobal.com", careersUrl: "https://www.papayaglobal.com/careers/", atsType: "greenhouse", atsSlug: "papaya" },

  // saas & productivity
  { name: "HubSpot", domain: "hubspot.com", careersUrl: "https://www.hubspot.com/careers", atsType: "greenhouse", atsSlug: "hubspot" },
  { name: "Figma", domain: "figma.com", careersUrl: "https://www.figma.com/careers/", atsType: "greenhouse", atsSlug: "figma" },
  { name: "Airtable", domain: "airtable.com", careersUrl: "https://airtable.com/careers", atsType: "greenhouse", atsSlug: "airtable" },
  { name: "Webflow", domain: "webflow.com", careersUrl: "https://webflow.com/careers", atsType: "greenhouse", atsSlug: "webflow" },
  { name: "Contentful", domain: "contentful.com", careersUrl: "https://www.contentful.com/careers/", atsType: "greenhouse", atsSlug: "contentful" },
  { name: "Algolia", domain: "algolia.com", careersUrl: "https://www.algolia.com/careers/", atsType: "greenhouse", atsSlug: "algolia" },
  { name: "LaunchDarkly", domain: "launchdarkly.com", careersUrl: "https://launchdarkly.com/careers/", atsType: "greenhouse", atsSlug: "launchdarkly" },
  { name: "Lattice", domain: "lattice.com", careersUrl: "https://lattice.com/careers", atsType: "greenhouse", atsSlug: "lattice" },
  { name: "Culture Amp", domain: "cultureamp.com", careersUrl: "https://www.cultureamp.com/careers", atsType: "greenhouse", atsSlug: "cultureamp" },
  { name: "Calendly", domain: "calendly.com", careersUrl: "https://calendly.com/careers", atsType: "greenhouse", atsSlug: "calendly" },
  { name: "Asana", domain: "asana.com", careersUrl: "https://asana.com/jobs", atsType: "greenhouse", atsSlug: "asana" },
  { name: "Braze", domain: "braze.com", careersUrl: "https://www.braze.com/careers", atsType: "greenhouse", atsSlug: "braze" },
  { name: "Intercom", domain: "intercom.com", careersUrl: "https://www.intercom.com/careers", atsType: "greenhouse", atsSlug: "intercom" },
  { name: "Mixpanel", domain: "mixpanel.com", careersUrl: "https://mixpanel.com/jobs/", atsType: "greenhouse", atsSlug: "mixpanel" },
  { name: "Amplitude", domain: "amplitude.com", careersUrl: "https://amplitude.com/careers", atsType: "greenhouse", atsSlug: "amplitude" },
  { name: "Typeform", domain: "typeform.com", careersUrl: "https://www.typeform.com/careers/", atsType: "greenhouse", atsSlug: "typeform" },
  { name: "Wrike", domain: "wrike.com", careersUrl: "https://www.wrike.com/careers/", atsType: "greenhouse", atsSlug: "wrike" },
  { name: "Grammarly", domain: "grammarly.com", careersUrl: "https://www.grammarly.com/jobs", atsType: "greenhouse", atsSlug: "grammarly" },
  { name: "Squarespace", domain: "squarespace.com", careersUrl: "https://www.squarespace.com/careers", atsType: "greenhouse", atsSlug: "squarespace" },
  { name: "Aha!", domain: "aha.io", careersUrl: "https://www.aha.io/company/careers", atsType: "greenhouse", atsSlug: "aha" },
  { name: "Klaviyo", domain: "klaviyo.com", careersUrl: "https://www.klaviyo.com/careers", atsType: "greenhouse", atsSlug: "klaviyo" },
  { name: "Iterable", domain: "iterable.com", careersUrl: "https://iterable.com/careers/", atsType: "greenhouse", atsSlug: "iterable" },
  { name: "Customer.io", domain: "customer.io", careersUrl: "https://customer.io/careers/", atsType: "greenhouse", atsSlug: "customerio" },
  { name: "Yotpo", domain: "yotpo.com", careersUrl: "https://www.yotpo.com/careers/", atsType: "greenhouse", atsSlug: "yotpo" },
  { name: "Postscript", domain: "postscript.io", careersUrl: "https://postscript.io/careers", atsType: "greenhouse", atsSlug: "postscript" },
  { name: "Attentive", domain: "attentivemobile.com", careersUrl: "https://www.attentivemobile.com/careers", atsType: "greenhouse", atsSlug: "attentive" },

  // data & AI
  { name: "Anthropic", domain: "anthropic.com", careersUrl: "https://www.anthropic.com/careers", atsType: "greenhouse", atsSlug: "anthropic" },
  { name: "DeepMind", domain: "deepmind.com", careersUrl: "https://deepmind.google/about/careers/", atsType: "greenhouse", atsSlug: "deepmind" },
  { name: "Databricks", domain: "databricks.com", careersUrl: "https://www.databricks.com/company/careers", atsType: "greenhouse", atsSlug: "databricks" },
  { name: "Dataiku", domain: "dataiku.com", careersUrl: "https://www.dataiku.com/careers/", atsType: "greenhouse", atsSlug: "dataiku" },
  { name: "DataDog", domain: "datadoghq.com", careersUrl: "https://www.datadoghq.com/careers/", atsType: "greenhouse", atsSlug: "datadog" },
  { name: "AssemblyAI", domain: "assemblyai.com", careersUrl: "https://www.assemblyai.com/careers", atsType: "greenhouse", atsSlug: "assemblyai" },
  { name: "Kaggle", domain: "kaggle.com", careersUrl: "https://www.kaggle.com/careers", atsType: "greenhouse", atsSlug: "kaggle" },

  // marketplace & consumer
  { name: "Upwork", domain: "upwork.com", careersUrl: "https://www.upwork.com/careers", atsType: "greenhouse", atsSlug: "upwork" },
  { name: "Faire", domain: "faire.com", careersUrl: "https://www.faire.com/careers", atsType: "greenhouse", atsSlug: "faire" },
  { name: "Instacart", domain: "instacart.com", careersUrl: "https://instacart.careers/", atsType: "greenhouse", atsSlug: "instacart" },
  { name: "Duolingo", domain: "duolingo.com", careersUrl: "https://careers.duolingo.com/", atsType: "greenhouse", atsSlug: "duolingo" },
  { name: "Discord", domain: "discord.com", careersUrl: "https://discord.com/careers", atsType: "greenhouse", atsSlug: "discord" },
  { name: "Lyft", domain: "lyft.com", careersUrl: "https://www.lyft.com/careers", atsType: "greenhouse", atsSlug: "lyft" },
  { name: "Everlane", domain: "everlane.com", careersUrl: "https://www.everlane.com/careers", atsType: "greenhouse", atsSlug: "everlane" },
  { name: "Peloton", domain: "onepeloton.com", careersUrl: "https://www.onepeloton.com/careers", atsType: "greenhouse", atsSlug: "peloton" },
  { name: "Nextdoor", domain: "nextdoor.com", careersUrl: "https://about.nextdoor.com/careers/", atsType: "greenhouse", atsSlug: "nextdoor" },
  { name: "OpenDoor", domain: "opendoor.com", careersUrl: "https://www.opendoor.com/careers", atsType: "greenhouse", atsSlug: "opendoor" },
  { name: "Epic Games", domain: "epicgames.com", careersUrl: "https://www.epicgames.com/site/en-US/careers", atsType: "greenhouse", atsSlug: "epicgames" },
  { name: "Twitch", domain: "twitch.tv", careersUrl: "https://www.twitch.tv/jobs/en/", atsType: "greenhouse", atsSlug: "twitch" },
  { name: "Ziprecruiter", domain: "ziprecruiter.com", careersUrl: "https://www.ziprecruiter.com/careers", atsType: "greenhouse", atsSlug: "ziprecruiter" },
  { name: "Pinterest", domain: "pinterest.com", careersUrl: "https://www.pinterestcareers.com/", atsType: "greenhouse", atsSlug: "pinterest" },
  { name: "Reddit", domain: "reddit.com", careersUrl: "https://www.redditinc.com/careers", atsType: "greenhouse", atsSlug: "reddit" },
  { name: "Riot Games", domain: "riotgames.com", careersUrl: "https://www.riotgames.com/en/work-with-us", atsType: "greenhouse", atsSlug: "riotgames" },
  { name: "Dropbox", domain: "dropbox.com", careersUrl: "https://www.dropbox.com/jobs", atsType: "greenhouse", atsSlug: "dropbox" },
  { name: "Calm", domain: "calm.com", careersUrl: "https://www.calm.com/careers", atsType: "greenhouse", atsSlug: "calm" },

  // edtech & learning
  { name: "Coursera", domain: "coursera.org", careersUrl: "https://about.coursera.org/careers/", atsType: "greenhouse", atsSlug: "coursera" },
  { name: "Udemy", domain: "udemy.com", careersUrl: "https://about.udemy.com/careers/", atsType: "greenhouse", atsSlug: "udemy" },
  { name: "Thinkific", domain: "thinkific.com", careersUrl: "https://www.thinkific.com/careers/", atsType: "greenhouse", atsSlug: "thinkific" },
  { name: "Kajabi", domain: "kajabi.com", careersUrl: "https://kajabi.com/careers", atsType: "greenhouse", atsSlug: "kajabi" },
  { name: "Mighty Networks", domain: "mightynetworks.com", careersUrl: "https://www.mightynetworks.com/careers", atsType: "greenhouse", atsSlug: "mighty" },

  // security & compliance
  { name: "Okta", domain: "okta.com", careersUrl: "https://www.okta.com/company/careers/", atsType: "greenhouse", atsSlug: "okta" },
  { name: "Zscaler", domain: "zscaler.com", careersUrl: "https://www.zscaler.com/careers", atsType: "greenhouse", atsSlug: "zscaler" },
  { name: "Rubrik", domain: "rubrik.com", careersUrl: "https://www.rubrik.com/company/careers", atsType: "greenhouse", atsSlug: "rubrik" },
  { name: "Tanium", domain: "tanium.com", careersUrl: "https://www.tanium.com/careers/", atsType: "greenhouse", atsSlug: "tanium" },
  { name: "Orca Security", domain: "orca.security", careersUrl: "https://orca.security/about/careers/", atsType: "greenhouse", atsSlug: "orca" },
  { name: "BeyondTrust", domain: "beyondtrust.com", careersUrl: "https://www.beyondtrust.com/company/careers", atsType: "greenhouse", atsSlug: "beyondtrust" },
  { name: "OneSpan", domain: "onespan.com", careersUrl: "https://www.onespan.com/careers", atsType: "greenhouse", atsSlug: "onespan" },
  { name: "Huntress", domain: "huntress.com", careersUrl: "https://www.huntress.com/company/careers", atsType: "greenhouse", atsSlug: "huntress" },
  { name: "Axonius", domain: "axonius.com", careersUrl: "https://www.axonius.com/company/careers", atsType: "greenhouse", atsSlug: "axonius" },
  { name: "Exabeam", domain: "exabeam.com", careersUrl: "https://www.exabeam.com/careers/", atsType: "greenhouse", atsSlug: "exabeam" },
  { name: "Corelight", domain: "corelight.com", careersUrl: "https://corelight.com/company/careers", atsType: "greenhouse", atsSlug: "corelight" },
  { name: "Sumo Logic", domain: "sumologic.com", careersUrl: "https://www.sumologic.com/company/careers/", atsType: "greenhouse", atsSlug: "sumologic" },
  { name: "Chainguard", domain: "chainguard.dev", careersUrl: "https://www.chainguard.dev/careers", atsType: "greenhouse", atsSlug: "chainguard" },

  // ops, monitoring & infra services
  { name: "Remote", domain: "remote.com", careersUrl: "https://remote.com/careers", atsType: "greenhouse", atsSlug: "remotecom" },
  { name: "PagerDuty", domain: "pagerduty.com", careersUrl: "https://www.pagerduty.com/careers/", atsType: "greenhouse", atsSlug: "pagerduty" },
  { name: "New Relic", domain: "newrelic.com", careersUrl: "https://newrelic.careers/", atsType: "greenhouse", atsSlug: "newrelic" },
  { name: "Twilio", domain: "twilio.com", careersUrl: "https://www.twilio.com/en-us/company/jobs", atsType: "greenhouse", atsSlug: "twilio" },
  { name: "Samsara", domain: "samsara.com", careersUrl: "https://www.samsara.com/careers", atsType: "greenhouse", atsSlug: "samsara" },
  { name: "Fleetio", domain: "fleetio.com", careersUrl: "https://www.fleetio.com/careers", atsType: "greenhouse", atsSlug: "fleetio" },
  { name: "GoDaddy", domain: "godaddy.com", careersUrl: "https://careers.godaddy.com/", atsType: "greenhouse", atsSlug: "godaddy" },
  { name: "Turing", domain: "turing.com", careersUrl: "https://www.turing.com/careers", atsType: "greenhouse", atsSlug: "turing" },
  { name: "Doximity", domain: "doximity.com", careersUrl: "https://workat.doximity.com/", atsType: "greenhouse", atsSlug: "doximity" },

  // adtech & martech
  { name: "The Trade Desk", domain: "thetradedesk.com", careersUrl: "https://www.thetradedesk.com/us/careers", atsType: "greenhouse", atsSlug: "thetradedesk" },

  // other greenhouse
  { name: "Mozilla", domain: "mozilla.org", careersUrl: "https://www.mozilla.org/en-US/careers/", atsType: "greenhouse", atsSlug: "mozilla" },
  { name: "Wikimedia Foundation", domain: "wikimedia.org", careersUrl: "https://wikimediafoundation.org/about/jobs/", atsType: "greenhouse", atsSlug: "wikimedia" },
  { name: "Platform.sh", domain: "platform.sh", careersUrl: "https://platform.sh/company/careers/", atsType: "greenhouse", atsSlug: "platformsh" },
  { name: "Cloudbeds", domain: "cloudbeds.com", careersUrl: "https://www.cloudbeds.com/careers/", atsType: "greenhouse", atsSlug: "cloudbeds" },
  { name: "Yext", domain: "yext.com", careersUrl: "https://www.yext.com/careers/", atsType: "greenhouse", atsSlug: "yext" },
  { name: "SalesLoft", domain: "salesloft.com", careersUrl: "https://salesloft.com/careers/", atsType: "greenhouse", atsSlug: "salesloft" },

  // ════════════════════════════════════════════════
  // LEVER — api.lever.co/v0/postings/{slug}
  // ════════════════════════════════════════════════
  { name: "Superside", domain: "superside.com", careersUrl: "https://www.superside.com/careers", atsType: "lever", atsSlug: "superside" },
  { name: "Kraken", domain: "kraken.com", careersUrl: "https://www.kraken.com/careers", atsType: "lever", atsSlug: "kraken" },
  { name: "Plaid", domain: "plaid.com", careersUrl: "https://plaid.com/careers/", atsType: "lever", atsSlug: "plaid" },
  { name: "Metabase", domain: "metabase.com", careersUrl: "https://www.metabase.com/jobs/", atsType: "lever", atsSlug: "metabase" },
  { name: "Palantir", domain: "palantir.com", careersUrl: "https://www.palantir.com/careers/", atsType: "lever", atsSlug: "palantir" },
  { name: "WHOOP", domain: "whoop.com", careersUrl: "https://www.whoop.com/careers/", atsType: "lever", atsSlug: "whoop" },
  { name: "Spotify", domain: "spotify.com", careersUrl: "https://www.lifeatspotify.com/jobs", atsType: "lever", atsSlug: "spotify" },
  { name: "Freshworks", domain: "freshworks.com", careersUrl: "https://www.freshworks.com/company/careers/", atsType: "lever", atsSlug: "freshworks" },
  { name: "Immutable", domain: "immutable.com", careersUrl: "https://www.immutable.com/careers", atsType: "lever", atsSlug: "immutable" },
  { name: "Kinsta", domain: "kinsta.com", careersUrl: "https://kinsta.com/careers/", atsType: "lever", atsSlug: "kinsta" },
  { name: "FloQast", domain: "floqast.com", careersUrl: "https://floqast.com/careers/", atsType: "lever", atsSlug: "floqast" },
  { name: "Atlassian", domain: "atlassian.com", careersUrl: "https://www.atlassian.com/company/careers", atsType: "lever", atsSlug: "atlassian" },
  { name: "Mistral", domain: "mistral.ai", careersUrl: "https://mistral.ai/careers/", atsType: "lever", atsSlug: "mistral" },
  { name: "Anyscale", domain: "anyscale.com", careersUrl: "https://www.anyscale.com/careers", atsType: "lever", atsSlug: "anyscale" },
  { name: "100ms", domain: "100ms.live", careersUrl: "https://www.100ms.live/careers", atsType: "lever", atsSlug: "100ms" },
  { name: "Teleport", domain: "goteleport.com", careersUrl: "https://goteleport.com/careers/", atsType: "lever", atsSlug: "teleport" },

  // ════════════════════════════════════════════════
  // ASHBY — api.ashbyhq.com/posting-api/job-board/{slug}
  // ════════════════════════════════════════════════

  // dev platforms & infra
  { name: "Vercel", domain: "vercel.com", careersUrl: "https://vercel.com/careers", atsType: "ashby", atsSlug: "vercel" },
  { name: "Supabase", domain: "supabase.com", careersUrl: "https://supabase.com/careers", atsType: "ashby", atsSlug: "supabase" },
  { name: "Render", domain: "render.com", careersUrl: "https://render.com/careers", atsType: "ashby", atsSlug: "render" },
  { name: "Railway", domain: "railway.app", careersUrl: "https://railway.app/careers", atsType: "ashby", atsSlug: "railway" },
  { name: "Neon", domain: "neon.tech", careersUrl: "https://neon.tech/careers", atsType: "ashby", atsSlug: "neon" },
  { name: "Linear", domain: "linear.app", careersUrl: "https://linear.app/careers", atsType: "ashby", atsSlug: "linear" },
  { name: "PostHog", domain: "posthog.com", careersUrl: "https://posthog.com/careers", atsType: "ashby", atsSlug: "posthog" },
  { name: "Docker", domain: "docker.com", careersUrl: "https://www.docker.com/career/", atsType: "ashby", atsSlug: "docker" },
  { name: "Kong", domain: "konghq.com", careersUrl: "https://konghq.com/careers", atsType: "ashby", atsSlug: "kong" },
  { name: "Mux", domain: "mux.com", careersUrl: "https://mux.com/jobs", atsType: "ashby", atsSlug: "mux" },
  { name: "Retool", domain: "retool.com", careersUrl: "https://retool.com/careers", atsType: "ashby", atsSlug: "retool" },
  { name: "Stitch (Ashby)", domain: "stitchdata.com", careersUrl: "https://www.stitchdata.com/jobs/", atsType: "ashby", atsSlug: "stitch" },
  { name: "Benchling", domain: "benchling.com", careersUrl: "https://www.benchling.com/careers", atsType: "ashby", atsSlug: "benchling" },
  { name: "Uniswap", domain: "uniswap.org", careersUrl: "https://boards.greenhouse.io/uniswaplabs", atsType: "ashby", atsSlug: "uniswap" },
  { name: "Replit", domain: "replit.com", careersUrl: "https://replit.com/site/careers", atsType: "ashby", atsSlug: "replit" },
  { name: "Cursor", domain: "cursor.com", careersUrl: "https://www.cursor.com/careers", atsType: "ashby", atsSlug: "cursor" },
  { name: "Mapbox", domain: "mapbox.com", careersUrl: "https://www.mapbox.com/careers", atsType: "ashby", atsSlug: "mapbox" },
  { name: "LiveKit", domain: "livekit.io", careersUrl: "https://livekit.io/careers", atsType: "ashby", atsSlug: "livekit" },
  { name: "n8n", domain: "n8n.io", careersUrl: "https://n8n.io/careers", atsType: "ashby", atsSlug: "n8n" },
  { name: "Airbyte", domain: "airbyte.com", careersUrl: "https://airbyte.com/careers", atsType: "ashby", atsSlug: "airbyte" },
  { name: "Confluent", domain: "confluent.io", careersUrl: "https://www.confluent.io/careers/", atsType: "ashby", atsSlug: "confluent" },

  // saas & tools
  { name: "Notion", domain: "notion.so", careersUrl: "https://www.notion.so/careers", atsType: "ashby", atsSlug: "notion" },
  { name: "Clerk", domain: "clerk.com", careersUrl: "https://clerk.com/careers", atsType: "ashby", atsSlug: "clerk" },
  { name: "WorkOS", domain: "workos.com", careersUrl: "https://workos.com/careers", atsType: "ashby", atsSlug: "workos" },
  { name: "Zapier", domain: "zapier.com", careersUrl: "https://zapier.com/jobs", atsType: "ashby", atsSlug: "zapier" },
  { name: "Buffer", domain: "buffer.com", careersUrl: "https://buffer.com/journey", atsType: "ashby", atsSlug: "buffer" },
  { name: "Doist", domain: "doist.com", careersUrl: "https://doist.com/careers", atsType: "ashby", atsSlug: "doist" },
  { name: "FullStory", domain: "fullstory.com", careersUrl: "https://www.fullstory.com/careers/", atsType: "ashby", atsSlug: "fullstory" },
  { name: "ClickUp", domain: "clickup.com", careersUrl: "https://clickup.com/careers", atsType: "ashby", atsSlug: "clickup" },
  { name: "Hubstaff", domain: "hubstaff.com", careersUrl: "https://hubstaff.com/jobs", atsType: "ashby", atsSlug: "hubstaff" },

  // security & compliance
  { name: "Sentry", domain: "sentry.io", careersUrl: "https://sentry.io/careers/", atsType: "ashby", atsSlug: "sentry" },
  { name: "Snyk", domain: "snyk.io", careersUrl: "https://snyk.io/careers/", atsType: "ashby", atsSlug: "snyk" },
  { name: "1Password", domain: "1password.com", careersUrl: "https://1password.com/careers", atsType: "ashby", atsSlug: "1password" },
  { name: "Vanta", domain: "vanta.com", careersUrl: "https://www.vanta.com/careers", atsType: "ashby", atsSlug: "vanta" },
  { name: "Drata", domain: "drata.com", careersUrl: "https://drata.com/careers", atsType: "ashby", atsSlug: "drata" },
  { name: "Wiz", domain: "wiz.io", careersUrl: "https://www.wiz.io/careers", atsType: "ashby", atsSlug: "wiz" },
  { name: "Sift", domain: "sift.com", careersUrl: "https://sift.com/careers", atsType: "ashby", atsSlug: "sift" },
  { name: "Stytch", domain: "stytch.com", careersUrl: "https://stytch.com/careers", atsType: "ashby", atsSlug: "stytch" },

  // fintech & payments
  { name: "Deel", domain: "deel.com", careersUrl: "https://www.deel.com/careers", atsType: "ashby", atsSlug: "deel" },
  { name: "Ramp", domain: "ramp.com", careersUrl: "https://ramp.com/careers", atsType: "ashby", atsSlug: "ramp" },
  { name: "NerdWallet", domain: "nerdwallet.com", careersUrl: "https://www.nerdwallet.com/careers", atsType: "ashby", atsSlug: "nerdwallet" },
  { name: "Paddle", domain: "paddle.com", careersUrl: "https://www.paddle.com/careers", atsType: "ashby", atsSlug: "paddle" },
  { name: "Rokt", domain: "rokt.com", careersUrl: "https://rokt.com/careers/", atsType: "ashby", atsSlug: "rokt" },

  // AI & data
  { name: "OpenAI", domain: "openai.com", careersUrl: "https://openai.com/careers/", atsType: "ashby", atsSlug: "openai" },
  { name: "Deepgram", domain: "deepgram.com", careersUrl: "https://deepgram.com/company/careers", atsType: "ashby", atsSlug: "deepgram" },
  { name: "ElevenLabs", domain: "elevenlabs.io", careersUrl: "https://elevenlabs.io/careers", atsType: "ashby", atsSlug: "elevenlabs" },

  // consumer & creator
  { name: "Patreon", domain: "patreon.com", careersUrl: "https://www.patreon.com/careers", atsType: "ashby", atsSlug: "patreon" },
  { name: "Persona", domain: "withpersona.com", careersUrl: "https://withpersona.com/careers", atsType: "ashby", atsSlug: "persona" },
  { name: "Loom", domain: "loom.com", careersUrl: "https://www.loom.com/careers", atsType: "ashby", atsSlug: "loom" },
  { name: "Ghost", domain: "ghost.org", careersUrl: "https://ghost.org/about/", atsType: "ashby", atsSlug: "ghost" },
  { name: "Close", domain: "close.com", careersUrl: "https://www.close.com/careers", atsType: "ashby", atsSlug: "close" },

  // hr & remote ops
  { name: "Help Scout", domain: "helpscout.com", careersUrl: "https://www.helpscout.com/company/careers/", atsType: "ashby", atsSlug: "helpscout" },
  { name: "RevenueCat", domain: "revenuecat.com", careersUrl: "https://www.revenuecat.com/careers/", atsType: "ashby", atsSlug: "revenuecat" },
  { name: "Camunda", domain: "camunda.com", careersUrl: "https://camunda.com/careers/", atsType: "ashby", atsSlug: "camunda" },
  { name: "Oyster", domain: "oysterhr.com", careersUrl: "https://www.oysterhr.com/careers", atsType: "ashby", atsSlug: "oyster" },
  { name: "Chili Piper", domain: "chilipiper.com", careersUrl: "https://www.chilipiper.com/careers", atsType: "ashby", atsSlug: "chilipiper" },
  { name: "SalesLoft (Ashby)", domain: "salesloft.com", careersUrl: "https://salesloft.com/careers/", atsType: "ashby", atsSlug: "salesloft" },

  // other ashby
  { name: "Percona", domain: "percona.com", careersUrl: "https://www.percona.com/about/careers", atsType: "ashby", atsSlug: "percona" },

  // ════════════════════════════════════════════════
  // CUSTOM — no scrapeable ATS, picked up via external aggregators
  // ════════════════════════════════════════════════
  { name: "Toptal", domain: "toptal.com", careersUrl: "https://www.toptal.com/careers", atsType: "custom" },
  { name: "SafetyWing", domain: "safetywing.com", careersUrl: "https://safetywing.com/careers", atsType: "custom" },
  { name: "Automattic", domain: "automattic.com", careersUrl: "https://automattic.com/work-with-us/", atsType: "custom" },
  { name: "Basecamp", domain: "basecamp.com", careersUrl: "https://basecamp.com/about/jobs", atsType: "custom" },
  { name: "Bitwarden", domain: "bitwarden.com", careersUrl: "https://bitwarden.com/careers/", atsType: "custom" },
  { name: "Toggl", domain: "toggl.com", careersUrl: "https://toggl.com/jobs/", atsType: "custom" },
  { name: "MailerLite", domain: "mailerlite.com", careersUrl: "https://www.mailerlite.com/jobs", atsType: "custom" },
  { name: "Hotjar", domain: "hotjar.com", careersUrl: "https://www.hotjar.com/careers/", atsType: "custom" },
  { name: "DuckDuckGo", domain: "duckduckgo.com", careersUrl: "https://duckduckgo.com/hiring", atsType: "custom" },
  { name: "Dribbble", domain: "dribbble.com", careersUrl: "https://dribbble.com/careers", atsType: "custom" },
  { name: "X-Team", domain: "x-team.com", careersUrl: "https://x-team.com/join/", atsType: "custom" },
  { name: "Shopify", domain: "shopify.com", careersUrl: "https://www.shopify.com/careers", atsType: "custom" },
  { name: "Crossover", domain: "crossover.com", careersUrl: "https://www.crossover.com/jobs", atsType: "custom" },
  { name: "BairesDev", domain: "bairesdev.com", careersUrl: "https://www.bairesdev.com/careers/", atsType: "custom" },
  { name: "Chess.com", domain: "chess.com", careersUrl: "https://www.chess.com/jobs", atsType: "custom" },
  { name: "CloudBees", domain: "cloudbees.com", careersUrl: "https://www.cloudbees.com/careers", atsType: "custom" },
  { name: "Envato", domain: "envato.com", careersUrl: "https://www.envato.com/careers/", atsType: "custom" },
  { name: "Igalia", domain: "igalia.com", careersUrl: "https://www.igalia.com/jobs/", atsType: "custom" },
  { name: "YNAB", domain: "ynab.com", careersUrl: "https://www.ynab.com/careers", atsType: "custom" },
  { name: "Zyte", domain: "zyte.com", careersUrl: "https://www.zyte.com/jobs/", atsType: "custom" },
  { name: "Xapo", domain: "xapo.com", careersUrl: "https://www.xapo.com/careers/", atsType: "custom" },

  // ── NEW BATCH (2026-02-24) ──────────────────────

  // greenhouse — new
  { name: "Abnormal Security", domain: "abnormalsecurity.com", careersUrl: "https://www.abnormalsecurity.com/careers", atsType: "greenhouse", atsSlug: "abnormalsecurity" },
  { name: "ZoomInfo", domain: "zoominfo.com", careersUrl: "https://www.zoominfo.com/about/careers", atsType: "greenhouse", atsSlug: "zoominfo" },
  { name: "Remote", domain: "remote.com", careersUrl: "https://remote.com/careers", atsType: "greenhouse", atsSlug: "remote" },
  { name: "Storyblok", domain: "storyblok.com", careersUrl: "https://www.storyblok.com/careers", atsType: "greenhouse", atsSlug: "storyblok" },
  { name: "Cato Networks", domain: "catonetworks.com", careersUrl: "https://www.catonetworks.com/careers/", atsType: "greenhouse", atsSlug: "catonetworks" },
  { name: "Bitwarden", domain: "bitwarden.com", careersUrl: "https://bitwarden.com/careers/", atsType: "greenhouse", atsSlug: "bitwarden" },
  { name: "Marqeta", domain: "marqeta.com", careersUrl: "https://www.marqeta.com/company/careers", atsType: "greenhouse", atsSlug: "marqeta" },
  { name: "Navan", domain: "navan.com", careersUrl: "https://navan.com/careers", atsType: "greenhouse", atsSlug: "tripactions" },

  // ashby — new
  { name: "Lightspark", domain: "lightspark.com", careersUrl: "https://www.lightspark.com/careers", atsType: "ashby", atsSlug: "lightspark" },
  { name: "Farcaster", domain: "farcaster.xyz", careersUrl: "https://www.farcaster.xyz/careers", atsType: "ashby", atsSlug: "farcaster" },
  { name: "Phantom", domain: "phantom.app", careersUrl: "https://phantom.app/careers", atsType: "ashby", atsSlug: "phantom" },
  { name: "Backpack", domain: "backpack.app", careersUrl: "https://www.backpack.app/careers", atsType: "ashby", atsSlug: "backpack" },
  { name: "Blockworks", domain: "blockworks.co", careersUrl: "https://blockworks.co/careers", atsType: "ashby", atsSlug: "blockworks" },
  { name: "Dune", domain: "dune.com", careersUrl: "https://dune.com/careers", atsType: "ashby", atsSlug: "dune" },
  { name: "Elliptic", domain: "elliptic.co", careersUrl: "https://www.elliptic.co/careers", atsType: "ashby", atsSlug: "elliptic" },
  { name: "Sardine", domain: "sardine.ai", careersUrl: "https://www.sardine.ai/careers", atsType: "ashby", atsSlug: "sardine" },
  { name: "Resend", domain: "resend.com", careersUrl: "https://resend.com/careers", atsType: "ashby", atsSlug: "resend" },
  { name: "Inngest", domain: "inngest.com", careersUrl: "https://www.inngest.com/careers", atsType: "ashby", atsSlug: "inngest" },
  { name: "MotherDuck", domain: "motherduck.com", careersUrl: "https://motherduck.com/careers", atsType: "ashby", atsSlug: "motherduck" },
  { name: "tldraw", domain: "tldraw.com", careersUrl: "https://tldraw.com/careers", atsType: "ashby", atsSlug: "tldraw" },
  { name: "Stainless", domain: "stainlessapi.com", careersUrl: "https://www.stainlessapi.com/careers", atsType: "ashby", atsSlug: "stainlessapi" },
  { name: "Fern", domain: "buildwithfern.com", careersUrl: "https://www.buildwithfern.com/careers", atsType: "ashby", atsSlug: "buildwithfern" },
  { name: "Mintlify", domain: "mintlify.com", careersUrl: "https://mintlify.com/careers", atsType: "ashby", atsSlug: "mintlify" },
  { name: "ReadMe", domain: "readme.com", careersUrl: "https://readme.com/careers", atsType: "ashby", atsSlug: "readme" },
  { name: "GitBook", domain: "gitbook.com", careersUrl: "https://www.gitbook.com/careers", atsType: "ashby", atsSlug: "gitbook" },

  // lever — new
  { name: "Strapi", domain: "strapi.io", careersUrl: "https://strapi.io/careers", atsType: "lever", atsSlug: "strapi" },
  { name: "Prismic", domain: "prismic.io", careersUrl: "https://prismic.io/careers", atsType: "lever", atsSlug: "prismic" },

  // ── BATCH 2 (2026-02-24) ───────────────────────

  // greenhouse — fintech & crypto
  { name: "Chime", domain: "chime.com", careersUrl: "https://www.chime.com/careers/", atsType: "greenhouse", atsSlug: "chime" },
  { name: "SoFi", domain: "sofi.com", careersUrl: "https://www.sofi.com/careers/", atsType: "greenhouse", atsSlug: "sofi" },
  { name: "Monzo", domain: "monzo.com", careersUrl: "https://monzo.com/careers/", atsType: "greenhouse", atsSlug: "monzo" },
  { name: "Payoneer", domain: "payoneer.com", careersUrl: "https://www.payoneer.com/careers/", atsType: "greenhouse", atsSlug: "payoneer" },
  { name: "Gemini", domain: "gemini.com", careersUrl: "https://www.gemini.com/careers", atsType: "greenhouse", atsSlug: "gemini" },
  { name: "Blockchain.com", domain: "blockchain.com", careersUrl: "https://www.blockchain.com/careers", atsType: "greenhouse", atsSlug: "blockchain" },
  { name: "Affirm", domain: "affirm.com", careersUrl: "https://www.affirm.com/careers", atsType: "greenhouse", atsSlug: "affirm" },
  { name: "Sezzle", domain: "sezzle.com", careersUrl: "https://sezzle.com/careers", atsType: "greenhouse", atsSlug: "sezzle" },
  { name: "Thunes", domain: "thunes.com", careersUrl: "https://www.thunes.com/careers/", atsType: "greenhouse", atsSlug: "thunes" },

  // greenhouse — sales/marketing tech
  { name: "Apollo", domain: "apollo.io", careersUrl: "https://www.apollo.io/careers", atsType: "greenhouse", atsSlug: "apollo" },
  { name: "6sense", domain: "6sense.com", careersUrl: "https://6sense.com/careers/", atsType: "greenhouse", atsSlug: "6sense" },
  { name: "Bombora", domain: "bombora.com", careersUrl: "https://bombora.com/careers/", atsType: "greenhouse", atsSlug: "bombora" },
  { name: "Seamless.AI", domain: "seamless.ai", careersUrl: "https://seamless.ai/careers", atsType: "greenhouse", atsSlug: "seamlessai" },
  { name: "Trustpilot", domain: "trustpilot.com", careersUrl: "https://business.trustpilot.com/careers", atsType: "greenhouse", atsSlug: "trustpilot" },
  { name: "Pendo", domain: "pendo.io", careersUrl: "https://www.pendo.io/careers/", atsType: "greenhouse", atsSlug: "pendo" },

  // greenhouse — video & comms
  { name: "Vidyard", domain: "vidyard.com", careersUrl: "https://www.vidyard.com/careers/", atsType: "greenhouse", atsSlug: "vidyard" },
  { name: "Vonage", domain: "vonage.com", careersUrl: "https://www.vonage.com/careers/", atsType: "greenhouse", atsSlug: "vonage" },
  { name: "Bandwidth", domain: "bandwidth.com", careersUrl: "https://www.bandwidth.com/careers/", atsType: "greenhouse", atsSlug: "bandwidth" },
  { name: "mmhmm", domain: "mmhmm.app", careersUrl: "https://www.mmhmm.app/careers", atsType: "greenhouse", atsSlug: "mmhmm" },

  // greenhouse — productivity & time
  { name: "Clockwise", domain: "getclockwise.com", careersUrl: "https://www.getclockwise.com/careers", atsType: "greenhouse", atsSlug: "clockwise" },
  { name: "Otter.ai", domain: "otter.ai", careersUrl: "https://otter.ai/careers", atsType: "greenhouse", atsSlug: "otter" },

  // greenhouse — security
  { name: "Orca Security", domain: "orca.security", careersUrl: "https://orca.security/careers/", atsType: "greenhouse", atsSlug: "orcasecurity" },
  { name: "Cybereason", domain: "cybereason.com", careersUrl: "https://www.cybereason.com/careers", atsType: "greenhouse", atsSlug: "cybereason" },
  { name: "Recorded Future", domain: "recordedfuture.com", careersUrl: "https://www.recordedfuture.com/careers", atsType: "greenhouse", atsSlug: "recordedfuture" },
  { name: "Egress", domain: "egress.com", careersUrl: "https://www.egress.com/careers", atsType: "greenhouse", atsSlug: "egress" },

  // greenhouse — HR & remote infra
  { name: "Omnipresent", domain: "omnipresent.com", careersUrl: "https://www.omnipresent.com/careers", atsType: "greenhouse", atsSlug: "omnipresent" },

  // greenhouse — commerce & CMS
  { name: "commercetools", domain: "commercetools.com", careersUrl: "https://commercetools.com/careers", atsType: "greenhouse", atsSlug: "commercetools" },
  { name: "Spryker", domain: "spryker.com", careersUrl: "https://spryker.com/careers/", atsType: "greenhouse", atsSlug: "spryker" },
  { name: "Salsify", domain: "salsify.com", careersUrl: "https://www.salsify.com/careers", atsType: "greenhouse", atsSlug: "salsify" },

  // greenhouse — data
  { name: "Fivetran", domain: "fivetran.com", careersUrl: "https://www.fivetran.com/careers", atsType: "greenhouse", atsSlug: "fivetran" },
  { name: "Hightouch", domain: "hightouch.com", careersUrl: "https://hightouch.com/careers", atsType: "greenhouse", atsSlug: "hightouch" },
  { name: "SingleStore", domain: "singlestore.com", careersUrl: "https://www.singlestore.com/careers/", atsType: "greenhouse", atsSlug: "singlestore" },
  { name: "HackerRank", domain: "hackerrank.com", careersUrl: "https://www.hackerrank.com/careers", atsType: "greenhouse", atsSlug: "hackerrank" },

  // greenhouse — gaming
  { name: "Scopely", domain: "scopely.com", careersUrl: "https://scopely.com/careers", atsType: "greenhouse", atsSlug: "scopely" },
  { name: "Roblox", domain: "roblox.com", careersUrl: "https://careers.roblox.com/", atsType: "greenhouse", atsSlug: "roblox" },
  { name: "Insomniac Games", domain: "insomniacgames.com", careersUrl: "https://insomniac.games/careers/", atsType: "greenhouse", atsSlug: "insomniac" },
  { name: "Naughty Dog", domain: "naughtydog.com", careersUrl: "https://www.naughtydog.com/careers", atsType: "greenhouse", atsSlug: "naughtydog" },

  // greenhouse — browser & privacy
  { name: "Brave", domain: "brave.com", careersUrl: "https://brave.com/careers/", atsType: "greenhouse", atsSlug: "brave" },
  { name: "Crisp", domain: "crisp.chat", careersUrl: "https://crisp.chat/en/careers/", atsType: "greenhouse", atsSlug: "crisp" },

  // ashby — API & integrations
  { name: "Nango", domain: "nango.dev", careersUrl: "https://www.nango.dev/careers", atsType: "ashby", atsSlug: "nango" },
  { name: "Paragon", domain: "useparagon.com", careersUrl: "https://www.useparagon.com/careers", atsType: "ashby", atsSlug: "paragon" },
  { name: "Codat", domain: "codat.io", careersUrl: "https://www.codat.io/careers/", atsType: "ashby", atsSlug: "codat" },
  { name: "Finch", domain: "tryfinch.com", careersUrl: "https://www.tryfinch.com/careers", atsType: "ashby", atsSlug: "finch" },
  { name: "Rutter", domain: "rutter.com", careersUrl: "https://rutter.com/careers", atsType: "ashby", atsSlug: "rutter" },
  { name: "Svix", domain: "svix.com", careersUrl: "https://www.svix.com/careers/", atsType: "ashby", atsSlug: "svix" },
  { name: "Knock", domain: "knock.app", careersUrl: "https://knock.app/careers", atsType: "ashby", atsSlug: "knock" },

  // ashby — AI/ML
  { name: "Beam", domain: "beam.cloud", careersUrl: "https://www.beam.cloud/careers", atsType: "ashby", atsSlug: "beam" },
  { name: "Modal", domain: "modal.com", careersUrl: "https://modal.com/careers", atsType: "ashby", atsSlug: "modal" },
  { name: "Replicate", domain: "replicate.com", careersUrl: "https://replicate.com/careers", atsType: "ashby", atsSlug: "replicate" },
  { name: "Cohere", domain: "cohere.com", careersUrl: "https://cohere.com/careers", atsType: "ashby", atsSlug: "cohere" },
  { name: "Character.AI", domain: "character.ai", careersUrl: "https://character.ai/careers", atsType: "ashby", atsSlug: "character" },
  { name: "Aleph Alpha", domain: "aleph-alpha.com", careersUrl: "https://aleph-alpha.com/careers", atsType: "ashby", atsSlug: "aleph" },
  { name: "Writer", domain: "writer.com", careersUrl: "https://writer.com/careers/", atsType: "ashby", atsSlug: "writer" },
  { name: "Pinecone", domain: "pinecone.io", careersUrl: "https://www.pinecone.io/careers/", atsType: "ashby", atsSlug: "pinecone" },
  { name: "Weaviate", domain: "weaviate.io", careersUrl: "https://weaviate.io/careers", atsType: "ashby", atsSlug: "weaviate" },

  // ashby — crypto
  { name: "Cosmos", domain: "cosmos.network", careersUrl: "https://cosmos.network/careers", atsType: "ashby", atsSlug: "cosmos" },

  // ashby — HR & remote
  { name: "Velocity Global", domain: "velocityglobal.com", careersUrl: "https://velocityglobal.com/careers/", atsType: "ashby", atsSlug: "velocity" },
  { name: "Atlas", domain: "atlashxm.com", careersUrl: "https://www.atlashxm.com/careers", atsType: "ashby", atsSlug: "atlas" },
  { name: "Humaans", domain: "humaans.io", careersUrl: "https://humaans.io/careers", atsType: "ashby", atsSlug: "humaans" },

  // ashby — feature flags & analytics
  { name: "Statsig", domain: "statsig.com", careersUrl: "https://statsig.com/careers", atsType: "ashby", atsSlug: "statsig" },

  // ashby — workflow & orchestration
  { name: "Prefect", domain: "prefect.io", careersUrl: "https://www.prefect.io/careers/", atsType: "ashby", atsSlug: "prefect" },
  { name: "Windmill", domain: "windmill.dev", careersUrl: "https://www.windmill.dev/careers", atsType: "ashby", atsSlug: "windmill" },

  // ashby — developer tools
  { name: "Raycast", domain: "raycast.com", careersUrl: "https://www.raycast.com/careers", atsType: "ashby", atsSlug: "raycast" },
  { name: "Fig", domain: "fig.io", careersUrl: "https://fig.io/careers", atsType: "ashby", atsSlug: "fig" },
  { name: "Warp", domain: "warp.dev", careersUrl: "https://www.warp.dev/careers", atsType: "ashby", atsSlug: "warp" },

  // ashby — observability & reliability
  { name: "Axiom", domain: "axiom.co", careersUrl: "https://axiom.co/careers", atsType: "ashby", atsSlug: "axiom" },
  { name: "Checkly", domain: "checklyhq.com", careersUrl: "https://www.checklyhq.com/careers/", atsType: "ashby", atsSlug: "checkly" },
  { name: "incident.io", domain: "incident.io", careersUrl: "https://incident.io/careers", atsType: "ashby", atsSlug: "incident" },
  { name: "OpsLevel", domain: "opslevel.com", careersUrl: "https://www.opslevel.com/careers/", atsType: "ashby", atsSlug: "opslevel" },

  // ashby — billing & monetization
  { name: "Stigg", domain: "stigg.io", careersUrl: "https://www.stigg.io/careers", atsType: "ashby", atsSlug: "stigg" },
  { name: "Orb", domain: "withorb.com", careersUrl: "https://www.withorb.com/careers", atsType: "ashby", atsSlug: "orb" },

  // lever — new
  { name: "StackBlitz", domain: "stackblitz.com", careersUrl: "https://stackblitz.com/careers", atsType: "lever", atsSlug: "stackblitz" },
  { name: "Cloudinary", domain: "cloudinary.com", careersUrl: "https://cloudinary.com/careers", atsType: "lever", atsSlug: "cloudinary" },
  { name: "Whereby", domain: "whereby.com", careersUrl: "https://whereby.com/careers", atsType: "lever", atsSlug: "whereby" },

  // ════════════════════════════════════════════════
  // BATCH 3 — verified 2026-02-24
  // ════════════════════════════════════════════════

  // greenhouse — security & compliance
  { name: "Semgrep", domain: "semgrep.dev", careersUrl: "https://semgrep.dev/careers", atsType: "greenhouse", atsSlug: "semgrep" },
  { name: "Bugcrowd", domain: "bugcrowd.com", careersUrl: "https://www.bugcrowd.com/about/careers/", atsType: "greenhouse", atsSlug: "bugcrowd" },
  { name: "Synack", domain: "synack.com", careersUrl: "https://www.synack.com/careers/", atsType: "greenhouse", atsSlug: "synack" },
  { name: "SecurityScorecard", domain: "securityscorecard.com", careersUrl: "https://securityscorecard.com/company/careers/", atsType: "greenhouse", atsSlug: "securityscorecard" },
  { name: "Censys", domain: "censys.com", careersUrl: "https://censys.com/careers/", atsType: "greenhouse", atsSlug: "censys" },
  { name: "McAfee", domain: "mcafee.com", careersUrl: "https://careers.mcafee.com/", atsType: "greenhouse", atsSlug: "mcafee" },
  { name: "SmartBear", domain: "smartbear.com", careersUrl: "https://smartbear.com/company/careers/", atsType: "greenhouse", atsSlug: "smartbear" },
  { name: "BeyondIdentity", domain: "beyondidentity.com", careersUrl: "https://www.beyondidentity.com/company/careers", atsType: "greenhouse", atsSlug: "beyondidentity" },

  // greenhouse — fintech & payments
  { name: "GoCardless", domain: "gocardless.com", careersUrl: "https://gocardless.com/about/careers/", atsType: "greenhouse", atsSlug: "gocardless" },
  { name: "Galileo", domain: "galileo-ft.com", careersUrl: "https://www.galileo-ft.com/careers/", atsType: "greenhouse", atsSlug: "galileo" },
  { name: "Lithic", domain: "lithic.com", careersUrl: "https://lithic.com/careers", atsType: "greenhouse", atsSlug: "lithic" },

  // greenhouse — crypto & web3
  { name: "Magic", domain: "magic.link", careersUrl: "https://magic.link/careers", atsType: "greenhouse", atsSlug: "magic" },
  { name: "Foundry", domain: "foundrydigital.com", careersUrl: "https://foundrydigital.com/careers/", atsType: "greenhouse", atsSlug: "foundry" },
  { name: "Gelato", domain: "gelato.network", careersUrl: "https://www.gelato.network/careers", atsType: "greenhouse", atsSlug: "gelato" },
  { name: "Immunefi", domain: "immunefi.com", careersUrl: "https://immunefi.com/careers/", atsType: "greenhouse", atsSlug: "immunefi" },
  { name: "Zora", domain: "zora.co", careersUrl: "https://zora.co/careers", atsType: "greenhouse", atsSlug: "zora" },

  // greenhouse — localization & i18n
  { name: "Lokalise", domain: "lokalise.com", careersUrl: "https://lokalise.com/careers", atsType: "greenhouse", atsSlug: "lokalise" },
  { name: "Phrase", domain: "phrase.com", careersUrl: "https://phrase.com/careers/", atsType: "greenhouse", atsSlug: "phrase" },
  { name: "Smartling", domain: "smartling.com", careersUrl: "https://www.smartling.com/careers/", atsType: "greenhouse", atsSlug: "smartling" },

  // greenhouse — data governance & infrastructure
  { name: "Collibra", domain: "collibra.com", careersUrl: "https://www.collibra.com/us/en/company/careers", atsType: "greenhouse", atsSlug: "collibra" },
  { name: "CoreWeave", domain: "coreweave.com", careersUrl: "https://www.coreweave.com/careers", atsType: "greenhouse", atsSlug: "coreweave" },
  { name: "RunPod", domain: "runpod.io", careersUrl: "https://www.runpod.io/careers", atsType: "greenhouse", atsSlug: "runpod" },
  { name: "Vast.ai", domain: "vast.ai", careersUrl: "https://vast.ai/careers", atsType: "greenhouse", atsSlug: "vast" },

  // greenhouse — content & media
  { name: "Medium", domain: "medium.com", careersUrl: "https://medium.com/jobs-at-medium", atsType: "greenhouse", atsSlug: "medium" },

  // ashby — customer support & success
  { name: "Plain", domain: "plain.com", careersUrl: "https://www.plain.com/careers", atsType: "ashby", atsSlug: "plain" },
  { name: "Pylon", domain: "usepylon.com", careersUrl: "https://www.usepylon.com/careers", atsType: "ashby", atsSlug: "pylon" },
  { name: "Vitally", domain: "vitally.io", careersUrl: "https://www.vitally.io/careers", atsType: "ashby", atsSlug: "vitally" },

  // ashby — CRM
  { name: "Affinity", domain: "affinity.co", careersUrl: "https://www.affinity.co/careers", atsType: "ashby", atsSlug: "affinity" },

  // ashby — design & content
  { name: "Gamma", domain: "gamma.app", careersUrl: "https://gamma.app/careers", atsType: "ashby", atsSlug: "gamma" },

  // ashby — no-code
  { name: "Bubble", domain: "bubble.io", careersUrl: "https://bubble.io/careers", atsType: "ashby", atsSlug: "bubble" },

  // ashby — learning
  { name: "Docebo", domain: "docebo.com", careersUrl: "https://www.docebo.com/company/careers/", atsType: "ashby", atsSlug: "docebo" },

  // lever — crypto
  { name: "Binance", domain: "binance.com", careersUrl: "https://www.binance.com/en/careers", atsType: "lever", atsSlug: "binance" },
  { name: "Celestia", domain: "celestia.org", careersUrl: "https://celestia.org/careers", atsType: "lever", atsSlug: "celestia" },

  // ════════════════════════════════════════════════
  // BATCH 4 — verified 2026-02-24 (round 2)
  // ════════════════════════════════════════════════

  // greenhouse — databases
  { name: "Redis", domain: "redis.io", careersUrl: "https://redis.io/careers/", atsType: "greenhouse", atsSlug: "redis" },
  { name: "Neo4j", domain: "neo4j.com", careersUrl: "https://neo4j.com/careers/", atsType: "greenhouse", atsSlug: "neo4j" },
  { name: "TigerGraph", domain: "tigergraph.com", careersUrl: "https://www.tigergraph.com/careers/", atsType: "greenhouse", atsSlug: "tigergraph" },
  { name: "Materialize", domain: "materialize.com", careersUrl: "https://materialize.com/careers/", atsType: "greenhouse", atsSlug: "materialize" },

  // greenhouse — AI & data labeling
  { name: "Labelbox", domain: "labelbox.com", careersUrl: "https://labelbox.com/careers/", atsType: "greenhouse", atsSlug: "labelbox" },
  { name: "Scale AI", domain: "scale.com", careersUrl: "https://scale.com/careers", atsType: "greenhouse", atsSlug: "scaleai" },

  // greenhouse — security
  { name: "Netskope", domain: "netskope.com", careersUrl: "https://www.netskope.com/company/careers", atsType: "greenhouse", atsSlug: "netskope" },
  { name: "Veracode", domain: "veracode.com", careersUrl: "https://www.veracode.com/careers", atsType: "greenhouse", atsSlug: "veracode" },
  { name: "Shield", domain: "shield.com", careersUrl: "https://shield.com/careers/", atsType: "greenhouse", atsSlug: "shield" },

  // greenhouse — real estate & proptech
  { name: "Roofstock", domain: "roofstock.com", careersUrl: "https://www.roofstock.com/careers", atsType: "greenhouse", atsSlug: "roofstock" },

  // greenhouse — government & compliance
  { name: "Propel", domain: "joinpropel.com", careersUrl: "https://www.joinpropel.com/careers", atsType: "greenhouse", atsSlug: "propel" },
  { name: "Relativity", domain: "relativity.com", careersUrl: "https://www.relativity.com/careers/", atsType: "greenhouse", atsSlug: "relativity" },

  // greenhouse — crypto & web3
  { name: "Oasis Protocol", domain: "oasisprotocol.org", careersUrl: "https://oasisprotocol.org/careers", atsType: "greenhouse", atsSlug: "oasis" },
  { name: "Helium", domain: "helium.com", careersUrl: "https://www.helium.com/careers", atsType: "greenhouse", atsSlug: "helium" },
  { name: "Fetch.ai", domain: "fetch.ai", careersUrl: "https://fetch.ai/careers", atsType: "greenhouse", atsSlug: "fetch" },

  // greenhouse — space & satellite
  { name: "Spire Global", domain: "spire.com", careersUrl: "https://spire.com/careers/", atsType: "greenhouse", atsSlug: "spire" },
  { name: "BlackSky", domain: "blacksky.com", careersUrl: "https://www.blacksky.com/careers/", atsType: "greenhouse", atsSlug: "blacksky" },
  { name: "Momentus", domain: "momentus.space", careersUrl: "https://momentus.space/careers/", atsType: "greenhouse", atsSlug: "momentus" },
  { name: "SES", domain: "ses.com", careersUrl: "https://www.ses.com/careers", atsType: "greenhouse", atsSlug: "ses" },

  // greenhouse — analytics & hosting
  { name: "Microsoft Clarity", domain: "clarity.microsoft.com", careersUrl: "https://clarity.microsoft.com/careers", atsType: "greenhouse", atsSlug: "clarity" },
  { name: "Pantheon", domain: "pantheon.io", careersUrl: "https://pantheon.io/careers", atsType: "greenhouse", atsSlug: "pantheon" },
  { name: "Spin", domain: "spin.pm", careersUrl: "https://www.spin.pm/careers", atsType: "greenhouse", atsSlug: "spin" },

  // ashby — orchestration & workflow
  { name: "Conductor", domain: "conductor.is", careersUrl: "https://conductor.is/careers", atsType: "ashby", atsSlug: "conductor" },

  // ashby — HR & people ops
  { name: "Leapsome", domain: "leapsome.com", careersUrl: "https://www.leapsome.com/careers", atsType: "ashby", atsSlug: "leapsome" },

  // ashby — developer tools
  { name: "Tango", domain: "tango.us", careersUrl: "https://www.tango.us/careers", atsType: "ashby", atsSlug: "tango" },
  { name: "Anon", domain: "anon.com", careersUrl: "https://www.anon.com/careers", atsType: "ashby", atsSlug: "anon" },
  { name: "Speakeasy", domain: "speakeasyapi.dev", careersUrl: "https://www.speakeasyapi.dev/careers", atsType: "ashby", atsSlug: "speakeasy" },
  { name: "Slab", domain: "slab.com", careersUrl: "https://slab.com/careers", atsType: "ashby", atsSlug: "slab" },

  // lever — crypto
  { name: "StarkNet", domain: "starknet.io", careersUrl: "https://starknet.io/careers", atsType: "lever", atsSlug: "starknet" },

  // ════════════════════════════════════════════════
  // BATCH 5 — verified 2026-02-24 (round 3)
  // ════════════════════════════════════════════════

  // greenhouse — DevOps & CI/CD
  { name: "Upbound", domain: "upbound.io", careersUrl: "https://www.upbound.io/careers", atsType: "greenhouse", atsSlug: "upbound" },
  { name: "Buildkite", domain: "buildkite.com", careersUrl: "https://buildkite.com/careers", atsType: "greenhouse", atsSlug: "buildkite" },

  // greenhouse — health & wellness
  { name: "Cerebral", domain: "cerebral.com", careersUrl: "https://cerebral.com/careers", atsType: "greenhouse", atsSlug: "cerebral" },
  { name: "Headway", domain: "headway.co", careersUrl: "https://headway.co/careers", atsType: "greenhouse", atsSlug: "headway" },
  { name: "Alma", domain: "helloalma.com", careersUrl: "https://helloalma.com/careers/", atsType: "greenhouse", atsSlug: "alma" },
  { name: "Waymark", domain: "waymark.care", careersUrl: "https://waymark.care/careers", atsType: "greenhouse", atsSlug: "waymark" },
  { name: "Collective Health", domain: "collectivehealth.com", careersUrl: "https://collectivehealth.com/careers/", atsType: "greenhouse", atsSlug: "collectivehealth" },

  // greenhouse — CMS & headless
  { name: "Contentstack", domain: "contentstack.com", careersUrl: "https://www.contentstack.com/careers", atsType: "greenhouse", atsSlug: "contentstack" },
  { name: "Builder.io", domain: "builder.io", careersUrl: "https://www.builder.io/careers", atsType: "greenhouse", atsSlug: "builder" },

  // greenhouse — AI & video
  { name: "HeyGen", domain: "heygen.com", careersUrl: "https://www.heygen.com/careers", atsType: "greenhouse", atsSlug: "heygen" },
  { name: "Descript", domain: "descript.com", careersUrl: "https://descript.com/careers", atsType: "greenhouse", atsSlug: "descript" },

  // greenhouse — partnerships & ecosystem
  { name: "Crossbeam", domain: "crossbeam.com", careersUrl: "https://www.crossbeam.com/careers", atsType: "greenhouse", atsSlug: "crossbeam" },
  { name: "PartnerStack", domain: "partnerstack.com", careersUrl: "https://partnerstack.com/careers", atsType: "greenhouse", atsSlug: "partnerstack" },
  { name: "Impact", domain: "impact.com", careersUrl: "https://impact.com/about/careers/", atsType: "greenhouse", atsSlug: "impact" },
  { name: "Partnerize", domain: "partnerize.com", careersUrl: "https://partnerize.com/careers", atsType: "greenhouse", atsSlug: "partnerize" },

  // greenhouse — data & analytics
  { name: "Starburst", domain: "starburst.io", careersUrl: "https://www.starburst.io/careers/", atsType: "greenhouse", atsSlug: "starburst" },
  { name: "Comet", domain: "comet.com", careersUrl: "https://www.comet.com/careers", atsType: "greenhouse", atsSlug: "comet" },

  // greenhouse — communications
  { name: "Dialpad", domain: "dialpad.com", careersUrl: "https://www.dialpad.com/careers/", atsType: "greenhouse", atsSlug: "dialpad" },

  // greenhouse — fintech & banking
  { name: "Silicon Valley Bank", domain: "svb.com", careersUrl: "https://www.svb.com/careers", atsType: "greenhouse", atsSlug: "silicon" },

  // greenhouse — procurement
  { name: "Ivalua", domain: "ivalua.com", careersUrl: "https://www.ivalua.com/careers/", atsType: "greenhouse", atsSlug: "ivalua" },

  // greenhouse — incident management
  { name: "Rootly", domain: "rootly.com", careersUrl: "https://rootly.com/careers", atsType: "greenhouse", atsSlug: "rootly" },

  // ashby — CMS & content
  { name: "Sanity", domain: "sanity.io", careersUrl: "https://www.sanity.io/careers", atsType: "ashby", atsSlug: "sanity" },

  // ashby — editor & docs
  { name: "Novel", domain: "novel.sh", careersUrl: "https://novel.sh/careers", atsType: "ashby", atsSlug: "novel" },
  { name: "Scribe", domain: "scribehow.com", careersUrl: "https://scribehow.com/careers", atsType: "ashby", atsSlug: "scribe" },

  // lever — security & VPN
  { name: "Surfshark", domain: "surfshark.com", careersUrl: "https://surfshark.com/careers", atsType: "lever", atsSlug: "surfshark" },
  { name: "Twingate", domain: "twingate.com", careersUrl: "https://www.twingate.com/careers", atsType: "lever", atsSlug: "twingate" },
  { name: "Sophos", domain: "sophos.com", careersUrl: "https://www.sophos.com/en-us/careers", atsType: "lever", atsSlug: "sophos" },

  // lever — HR & remote work
  { name: "Remofirst", domain: "remofirst.com", careersUrl: "https://www.remofirst.com/careers", atsType: "lever", atsSlug: "remofirst" },

  // lever — crypto custody
  { name: "Anchorage Digital", domain: "anchorage.com", careersUrl: "https://www.anchorage.com/careers", atsType: "lever", atsSlug: "anchorage" },

  // greenhouse — contact center & CX
  { name: "Five9", domain: "five9.com", careersUrl: "https://www.five9.com/about/careers", atsType: "greenhouse", atsSlug: "five9" },
  { name: "Harbor", domain: "harbor.com", careersUrl: "https://harbor.com/careers", atsType: "greenhouse", atsSlug: "harbor" },
  { name: "Qualtrics", domain: "qualtrics.com", careersUrl: "https://www.qualtrics.com/careers/", atsType: "greenhouse", atsSlug: "qualtrics" },
  { name: "SurveyMonkey", domain: "surveymonkey.com", careersUrl: "https://www.surveymonkey.com/careers/", atsType: "greenhouse", atsSlug: "surveymonkey" },

  // ashby — contact center & APIs
  { name: "Talkdesk", domain: "talkdesk.com", careersUrl: "https://www.talkdesk.com/careers/", atsType: "ashby", atsSlug: "talkdesk" },
  { name: "Kustomer", domain: "kustomer.com", careersUrl: "https://www.kustomer.com/careers/", atsType: "ashby", atsSlug: "kustomer" },
  { name: "WunderGraph", domain: "wundergraph.com", careersUrl: "https://wundergraph.com/careers", atsType: "ashby", atsSlug: "wundergraph" },
  { name: "Stream", domain: "getstream.io", careersUrl: "https://getstream.io/team/", atsType: "ashby", atsSlug: "stream" },

  // ════════════════════════════════════════════════
  // BATCH 6 — verified 2026-02-24 (round 4)
  // ════════════════════════════════════════════════

  // greenhouse — recruiting & HR tech
  { name: "Greenhouse", domain: "greenhouse.io", careersUrl: "https://www.greenhouse.io/careers", atsType: "greenhouse", atsSlug: "greenhouse" },
  { name: "SeekOut", domain: "seekout.com", careersUrl: "https://seekout.com/careers", atsType: "greenhouse", atsSlug: "seekout" },
  { name: "hireEZ", domain: "hireez.com", careersUrl: "https://hireez.com/careers", atsType: "greenhouse", atsSlug: "hireez" },
  { name: "Indeed", domain: "indeed.com", careersUrl: "https://www.indeed.com/cmp/Indeed/jobs", atsType: "greenhouse", atsSlug: "indeed" },
  { name: "Glassdoor", domain: "glassdoor.com", careersUrl: "https://www.glassdoor.com/Jobs/Glassdoor-Jobs", atsType: "greenhouse", atsSlug: "glassdoor" },

  // greenhouse — integration & automation
  { name: "Workato", domain: "workato.com", careersUrl: "https://www.workato.com/careers", atsType: "greenhouse", atsSlug: "workato" },
  { name: "Celigo", domain: "celigo.com", careersUrl: "https://www.celigo.com/careers/", atsType: "greenhouse", atsSlug: "celigo" },

  // greenhouse — physical security
  { name: "Verkada", domain: "verkada.com", careersUrl: "https://www.verkada.com/careers/", atsType: "greenhouse", atsSlug: "verkada" },

  // greenhouse — crypto analytics
  { name: "Nansen", domain: "nansen.ai", careersUrl: "https://www.nansen.ai/careers", atsType: "greenhouse", atsSlug: "nansen" },
  { name: "Messari", domain: "messari.io", careersUrl: "https://messari.io/careers", atsType: "greenhouse", atsSlug: "messari" },
  { name: "TaxBit", domain: "taxbit.com", careersUrl: "https://taxbit.com/careers", atsType: "greenhouse", atsSlug: "taxbit" },

  // greenhouse — fintech infra & fraud
  { name: "Alloy", domain: "alloy.com", careersUrl: "https://www.alloy.com/careers", atsType: "greenhouse", atsSlug: "alloy" },
  { name: "Featurespace", domain: "featurespace.com", careersUrl: "https://www.featurespace.com/careers/", atsType: "greenhouse", atsSlug: "featurespace" },
  { name: "Feedzai", domain: "feedzai.com", careersUrl: "https://feedzai.com/careers/", atsType: "greenhouse", atsSlug: "feedzai" },

  // greenhouse — gifting & ABM
  { name: "Reachdesk", domain: "reachdesk.com", careersUrl: "https://www.reachdesk.com/careers", atsType: "greenhouse", atsSlug: "reachdesk" },
  { name: "BlueConic", domain: "blueconic.com", careersUrl: "https://www.blueconic.com/careers", atsType: "greenhouse", atsSlug: "blueconic" },

  // greenhouse — mobile & testing
  { name: "Embrace", domain: "embrace.io", careersUrl: "https://embrace.io/careers/", atsType: "greenhouse", atsSlug: "embrace" },
  { name: "mabl", domain: "mabl.com", careersUrl: "https://www.mabl.com/careers", atsType: "greenhouse", atsSlug: "mabl" },

  // greenhouse — vector search & travel
  { name: "Vectara", domain: "vectara.com", careersUrl: "https://vectara.com/careers/", atsType: "greenhouse", atsSlug: "vectara" },
  { name: "Kayak", domain: "kayak.com", careersUrl: "https://www.kayak.com/careers", atsType: "greenhouse", atsSlug: "kayak" },
  { name: "Skyscanner", domain: "skyscanner.net", careersUrl: "https://www.skyscanner.net/jobs", atsType: "greenhouse", atsSlug: "skyscanner" },

  // ashby — collaboration & CDP
  { name: "Tandem", domain: "tandem.chat", careersUrl: "https://tandem.chat/careers", atsType: "ashby", atsSlug: "tandem" },
  { name: "Aptible", domain: "aptible.com", careersUrl: "https://www.aptible.com/careers", atsType: "ashby", atsSlug: "aptible" },

  // lever — CI/CD & ML
  { name: "Octopus Deploy", domain: "octopus.com", careersUrl: "https://octopus.com/company/careers", atsType: "lever", atsSlug: "octopus" },
  { name: "SuperAnnotate", domain: "superannotate.com", careersUrl: "https://www.superannotate.com/careers", atsType: "lever", atsSlug: "superannotate" },

  // ── Batch 7: Crypto & Web3 expansion ──

  // greenhouse
  { name: "Fireblocks", domain: "fireblocks.com", careersUrl: "https://www.fireblocks.com/careers", atsType: "greenhouse", atsSlug: "fireblocks" },
  { name: "Aptos Labs", domain: "aptoslabs.com", careersUrl: "https://aptoslabs.com/careers", atsType: "greenhouse", atsSlug: "aptoslabs" },
  { name: "OKX", domain: "okx.com", careersUrl: "https://www.okx.com/careers", atsType: "greenhouse", atsSlug: "okx" },
  { name: "Wormhole", domain: "wormhole.com", careersUrl: "https://wormhole.com/careers", atsType: "greenhouse", atsSlug: "wormholefoundation" },
  { name: "LayerZero", domain: "layerzero.network", careersUrl: "https://layerzero.network/careers", atsType: "greenhouse", atsSlug: "layerzerolabs" },

  // ashby
  { name: "Compound", domain: "compound.finance", careersUrl: "https://compound.finance/governance/comp", atsType: "ashby", atsSlug: "compound" },
  { name: "Paxos", domain: "paxos.com", careersUrl: "https://paxos.com/careers", atsType: "ashby", atsSlug: "paxos" },
  { name: "Stellar", domain: "stellar.org", careersUrl: "https://stellar.org/foundation/careers", atsType: "ashby", atsSlug: "stellar" },
  { name: "Blockdaemon", domain: "blockdaemon.com", careersUrl: "https://blockdaemon.com/careers", atsType: "ashby", atsSlug: "blockdaemon" },
  { name: "QuickNode", domain: "quicknode.com", careersUrl: "https://www.quicknode.com/careers", atsType: "ashby", atsSlug: "quicknode" },
  { name: "OpenSea", domain: "opensea.io", careersUrl: "https://opensea.io/careers", atsType: "ashby", atsSlug: "opensea" },
  { name: "Magic Eden", domain: "magiceden.io", careersUrl: "https://magiceden.io/careers", atsType: "ashby", atsSlug: "magiceden" },
  { name: "Ledger", domain: "ledger.com", careersUrl: "https://www.ledger.com/careers", atsType: "ashby", atsSlug: "ledger" },
  { name: "Safe", domain: "safe.global", careersUrl: "https://safe.global/careers", atsType: "ashby", atsSlug: "safe" },
  { name: "Polymarket", domain: "polymarket.com", careersUrl: "https://polymarket.com/careers", atsType: "ashby", atsSlug: "polymarket" },

  // lever
  { name: "Zerion", domain: "zerion.io", careersUrl: "https://zerion.io/careers", atsType: "lever", atsSlug: "zerion" },
  { name: "Ethena", domain: "ethena.fi", careersUrl: "https://ethena.fi/careers", atsType: "lever", atsSlug: "ethena" },
];

// ════════════════════════════════════════════════
// 445 companies across Greenhouse, Lever, Ashby, Custom
// ════════════════════════════════════════════════
