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

  // discovered 2026-02-25
  { name: "TRM Labs", domain: "trmlabs.com", careersUrl: "https://www.trmlabs.com/careers", atsType: "greenhouse", atsSlug: "trmlabs" },
  { name: "Expel", domain: "expel.com", careersUrl: "https://expel.com/careers/", atsType: "greenhouse", atsSlug: "expel" },
  { name: "Voxel51", domain: "voxel51.com", careersUrl: "https://voxel51.com/careers/", atsType: "greenhouse", atsSlug: "voxel51" },
  { name: "Stability AI", domain: "stability.ai", careersUrl: "https://stability.ai/careers", atsType: "greenhouse", atsSlug: "stabilityai" },
  { name: "MinIO", domain: "min.io", careersUrl: "https://min.io/careers", atsType: "greenhouse", atsSlug: "minio" },
  { name: "MasterClass", domain: "masterclass.com", careersUrl: "https://www.masterclass.com/careers", atsType: "greenhouse", atsSlug: "masterclass" },

  // imported 2026-02-25
  { name: "Kentik", domain: "kentik.com", careersUrl: "https://boards.greenhouse.io/kentik", atsType: "greenhouse", atsSlug: "kentik" },
  { name: "SaasGroup", domain: "saas.group", careersUrl: "https://boards.greenhouse.io/saasgroup", atsType: "greenhouse", atsSlug: "saasgroup" },
  { name: "Sauce Labs", domain: "saucelabs.com", careersUrl: "https://boards.greenhouse.io/saucelabs", atsType: "greenhouse", atsSlug: "saucelabs" },

  // imported 2026-02-25
  { name: "Rocket.Chat", domain: "rocket.chat", careersUrl: "https://boards.greenhouse.io/rocketchat", atsType: "greenhouse", atsSlug: "rocketchat" },
  { name: "Udacity", domain: "udacity.com", careersUrl: "https://boards.greenhouse.io/udacity", atsType: "greenhouse", atsSlug: "udacity" },

  // imported 2026-03-10 (remoteintech scan)
  { name: "RunwayML", domain: "runwayml.com", careersUrl: "https://boards.greenhouse.io/runwayml", atsType: "greenhouse", atsSlug: "runwayml" },
  { name: "Amplemarket", domain: "amplemarket.com", careersUrl: "https://boards.greenhouse.io/amplemarket", atsType: "greenhouse", atsSlug: "amplemarket" },
  { name: "Zup Innovation", domain: "zup.com.br", careersUrl: "https://boards.greenhouse.io/zupinnovation", atsType: "greenhouse", atsSlug: "zupinnovation" },
  { name: "OfferFit", domain: "offerfit.ai", careersUrl: "https://boards.greenhouse.io/offerfit", atsType: "greenhouse", atsSlug: "offerfit" },

  // imported 2026-03-12 (discovery pipeline)
  { name: "Modus Create", domain: "moduscreate.com", careersUrl: "https://boards.greenhouse.io/moduscreate", atsType: "greenhouse", atsSlug: "moduscreate" },
  { name: "CRO Metrics", domain: "crometrics.com", careersUrl: "https://boards.greenhouse.io/crometrics", atsType: "greenhouse", atsSlug: "crometrics" },
  { name: "Ergeon", domain: "ergeon.com", careersUrl: "https://boards.greenhouse.io/ergeon", atsType: "greenhouse", atsSlug: "ergeon" },

  // imported 2026-03-13 (growth v2 — design company blitz + woodyjobs)
  { name: "MetaLab",          domain: "metalab.com",           careersUrl: "https://boards.greenhouse.io/metalab",         atsType: "greenhouse", atsSlug: "metalab" },
  { name: "HUGE",             domain: "hugeinc.com",           careersUrl: "https://boards.greenhouse.io/hugeinc",         atsType: "greenhouse", atsSlug: "hugeinc" },
  { name: "7shifts",          domain: "7shifts.com",           careersUrl: "https://boards.greenhouse.io/7shifts",         atsType: "greenhouse", atsSlug: "7shifts" },
  { name: "RegScale",         domain: "regscale.com",          careersUrl: "https://boards.greenhouse.io/regscale",        atsType: "greenhouse", atsSlug: "regscale" },

  // imported 2026-03-14 (harvest-ats.ts)
  { name: "dbt Labs",         domain: "getdbt.com",            careersUrl: "https://boards.greenhouse.io/dbtlabsinc",      atsType: "greenhouse", atsSlug: "dbtlabsinc" },
  { name: "Solana Labs",      domain: "solanalabs.com",        careersUrl: "https://boards.greenhouse.io/solana",           atsType: "greenhouse", atsSlug: "solana" },

  // ════════════════════════════════════════════════
  // LEVER — api.lever.co/v0/postings/{slug}
  // ════════════════════════════════════════════════
  { name: "Superside", domain: "superside.com", careersUrl: "https://www.superside.com/careers", atsType: "lever", atsSlug: "superside" },
  { name: "Kraken", domain: "kraken.com", careersUrl: "https://www.kraken.com/careers", atsType: "lever", atsSlug: "kraken" },
  // { name: "Plaid", domain: "plaid.com", careersUrl: "https://plaid.com/careers/", atsType: "lever", atsSlug: "plaid" }, // migrated to Ashby (2026-03)
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

  // discovered 2026-02-25
  { name: "Clari", domain: "clari.com", careersUrl: "https://www.clari.com/careers", atsType: "lever", atsSlug: "clari" },

  // imported 2026-02-25
  { name: "Redox", domain: "redoxengine.com", careersUrl: "https://jobs.lever.co/redoxengine", atsType: "lever", atsSlug: "redoxengine" },

  // imported 2026-02-25
  { name: "Iterative", domain: "iterative.ai", careersUrl: "https://jobs.lever.co/iterative", atsType: "lever", atsSlug: "iterative" },

  // imported 2026-03-10 (remoteintech scan)
  { name: "Quantcast", domain: "quantcast.com", careersUrl: "https://jobs.lever.co/quantcast", atsType: "lever", atsSlug: "quantcast" },

  // imported 2026-03-13 (growth v2 — design company blitz + woodyjobs)
  { name: "Instrument",       domain: "instrument.com",        careersUrl: "https://jobs.lever.co/instrument",             atsType: "lever", atsSlug: "instrument" },
  { name: "Aircall",          domain: "aircall.io",            careersUrl: "https://jobs.lever.co/aircall",                atsType: "lever", atsSlug: "aircall" },
  { name: "Moo",              domain: "moo.com",               careersUrl: "https://jobs.lever.co/moo",                    atsType: "lever", atsSlug: "moo" },

  // imported 2026-03-14 (harvest-ats.ts)
  { name: "Swile",            domain: "swile.co",              careersUrl: "https://jobs.lever.co/swile",                  atsType: "lever", atsSlug: "swile" },

  // ════════════════════════════════════════════════
  // ASHBY — api.ashbyhq.com/posting-api/job-board/{slug}
  // ════════════════════════════════════════════════

  // dev platforms & infra
  // { name: "Vercel", domain: "vercel.com", careersUrl: "https://vercel.com/careers", atsType: "ashby", atsSlug: "vercel" }, // migrated to Greenhouse (2026-03)
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

  // discovered batch 1 — ashby
  { name: "ClassDojo", domain: "classdojo.com", careersUrl: "https://www.classdojo.com/careers/", atsType: "ashby", atsSlug: "classdojo" },
  { name: "Polygon", domain: "polygon.technology", careersUrl: "https://polygon.technology/careers", atsType: "ashby", atsSlug: "polygon-labs" },
  { name: "Optimism", domain: "optimism.io", careersUrl: "https://www.optimism.io/jobs", atsType: "ashby", atsSlug: "oplabs" },
  { name: "zkSync", domain: "zksync.io", careersUrl: "https://zksync.io/careers", atsType: "ashby", atsSlug: "matter-labs" },
  { name: "Vultr", domain: "vultr.com", careersUrl: "https://www.vultr.com/company/careers/", atsType: "ashby", atsSlug: "vultr" },
  { name: "Socket", domain: "socket.dev", careersUrl: "https://socket.dev/careers", atsType: "ashby", atsSlug: "socket" },
  { name: "Eigenlayer", domain: "eigenlayer.xyz", careersUrl: "https://www.eigenlayer.xyz/careers", atsType: "ashby", atsSlug: "eigen-labs" },
  { name: "Infisical", domain: "infisical.com", careersUrl: "https://infisical.com/careers", atsType: "ashby", atsSlug: "infisical" },

  // imported 2026-02-25
  { name: "ConvertKit", domain: "convertkit.com", careersUrl: "https://jobs.ashbyhq.com/kit", atsType: "ashby", atsSlug: "kit" },

  // imported 2026-03-12 (discovery pipeline)
  { name: "9fin", domain: "9fin.com", careersUrl: "https://jobs.ashbyhq.com/9fin", atsType: "ashby", atsSlug: "9fin" },
  { name: "Unmind", domain: "unmind.com", careersUrl: "https://jobs.ashbyhq.com/unmind", atsType: "ashby", atsSlug: "unmind" },

  // imported 2026-03-13 (growth v2 — design company blitz)
  { name: "Maze",             domain: "maze.co",               careersUrl: "https://jobs.ashbyhq.com/mazedesign",          atsType: "ashby", atsSlug: "mazedesign" },

  // imported 2026-03-14 (harvest-ats.ts)
  { name: "Back Market",      domain: "backmarket.com",        careersUrl: "https://jobs.ashbyhq.com/backmarket",           atsType: "ashby", atsSlug: "backmarket" },
  { name: "a16z Crypto",      domain: "a16zcrypto.com",        careersUrl: "https://jobs.ashbyhq.com/a16z-crypto",          atsType: "ashby", atsSlug: "a16z-crypto" },

  // ════════════════════════════════════════════════
  // CUSTOM — no scrapeable ATS, picked up via external aggregators
  // ════════════════════════════════════════════════
  { name: "SafetyWing", domain: "safetywing.com", careersUrl: "https://safetywing.com/careers", atsType: "custom" },
  { name: "Automattic", domain: "automattic.com", careersUrl: "https://automattic.com/work-with-us/", atsType: "custom" },
  { name: "Basecamp", domain: "basecamp.com", careersUrl: "https://basecamp.com/about/jobs", atsType: "custom" },
  { name: "MailerLite", domain: "mailerlite.com", careersUrl: "https://www.mailerlite.com/jobs", atsType: "custom" },
  { name: "Hotjar", domain: "hotjar.com", careersUrl: "https://www.hotjar.com/careers/", atsType: "custom" },
  { name: "DuckDuckGo", domain: "duckduckgo.com", careersUrl: "https://duckduckgo.com/hiring", atsType: "ashby", atsSlug: "duck-duck-go" },
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
  { name: "Ethena Labs", domain: "ethena.fi", careersUrl: "https://ethena.fi/careers", atsType: "lever", atsSlug: "ethenalabs" },

  // ── Batch 8: Crypto & Web3 expansion (from cryptocurrencyjobs.co, web3.career, a16z list) ──

  // lever — crypto trading & defi
  { name: "Wintermute", domain: "wintermute.com", careersUrl: "https://www.wintermute.com/careers", atsType: "lever", atsSlug: "wintermute-trading" },
  { name: "Offchain Labs", domain: "offchainlabs.com", careersUrl: "https://offchainlabs.com/careers", atsType: "lever", atsSlug: "offchainlabs" },
  { name: "1inch", domain: "1inch.io", careersUrl: "https://1inch.io/careers", atsType: "lever", atsSlug: "1inch" },
  { name: "Nium", domain: "nium.com", careersUrl: "https://www.nium.com/careers", atsType: "lever", atsSlug: "nium" },
  { name: "15Five", domain: "15five.com", careersUrl: "https://www.15five.com/careers", atsType: "lever", atsSlug: "15five" },

  // ashby — crypto & web3
  { name: "Nethermind", domain: "nethermind.io", careersUrl: "https://www.nethermind.io/careers", atsType: "ashby", atsSlug: "nethermind" },
  { name: "Injective", domain: "injective.com", careersUrl: "https://injective.com/careers", atsType: "ashby", atsSlug: "injective" },
  { name: "Keyrock", domain: "keyrock.eu", careersUrl: "https://keyrock.eu/careers", atsType: "ashby", atsSlug: "keyrock" },
  { name: "CoW DAO", domain: "cow.fi", careersUrl: "https://cow.fi/careers", atsType: "ashby", atsSlug: "cow-dao" },
  { name: "Tavus", domain: "tavus.io", careersUrl: "https://www.tavus.io/careers", atsType: "ashby", atsSlug: "tavus" },
  { name: "LiveFlow", domain: "liveflow.io", careersUrl: "https://www.liveflow.io/careers", atsType: "ashby", atsSlug: "liveflow" },
  { name: "Rain", domain: "rain.co", careersUrl: "https://www.rain.co/careers", atsType: "ashby", atsSlug: "rain" },

  // greenhouse — large tech & fintech
  { name: "Block", domain: "block.xyz", careersUrl: "https://block.xyz/careers", atsType: "greenhouse", atsSlug: "block" },
  { name: "Prolific", domain: "prolific.com", careersUrl: "https://www.prolific.com/careers", atsType: "greenhouse", atsSlug: "prolific" },
  { name: "JFrog", domain: "jfrog.com", careersUrl: "https://jfrog.com/careers", atsType: "greenhouse", atsSlug: "jfrog" },

  // ── Batch 9: New companies verified 2026-03-01 ──

  // ashby — AI & ML
  { name: "Perplexity", domain: "perplexity.ai", careersUrl: "https://www.perplexity.ai/hub/careers", atsType: "ashby", atsSlug: "perplexity" },
  { name: "Nomic", domain: "nomic.ai", careersUrl: "https://www.nomic.ai/careers", atsType: "ashby", atsSlug: "nomic" },
  { name: "Poolside", domain: "poolside.ai", careersUrl: "https://www.poolside.ai/careers", atsType: "ashby", atsSlug: "poolside" },
  { name: "Baseten", domain: "baseten.co", careersUrl: "https://www.baseten.co/careers", atsType: "ashby", atsSlug: "baseten" },
  { name: "DeepL", domain: "deepl.com", careersUrl: "https://www.deepl.com/careers", atsType: "ashby", atsSlug: "deepl" },

  // ashby — developer tools & infrastructure
  { name: "Coder", domain: "coder.com", careersUrl: "https://coder.com/careers", atsType: "ashby", atsSlug: "coder" },
  { name: "Doppler", domain: "doppler.com", careersUrl: "https://www.doppler.com/careers", atsType: "ashby", atsSlug: "doppler" },
  { name: "Zed", domain: "zed.dev", careersUrl: "https://zed.dev/jobs", atsType: "ashby", atsSlug: "zed" },
  { name: "Cube", domain: "cube.dev", careersUrl: "https://cube.dev/careers", atsType: "ashby", atsSlug: "cube" },
  { name: "Oso", domain: "osohq.com", careersUrl: "https://www.osohq.com/company/jobs", atsType: "ashby", atsSlug: "oso" },
  { name: "Polar", domain: "polar.sh", careersUrl: "https://polar.sh/careers", atsType: "ashby", atsSlug: "polar" },
  { name: "Plane", domain: "plane.com", careersUrl: "https://plane.com/careers", atsType: "ashby", atsSlug: "plane" },

  // ashby — crypto & web3
  { name: "Mysten Labs", domain: "mystenlabs.com", careersUrl: "https://mystenlabs.com/careers", atsType: "ashby", atsSlug: "mystenlabs" },
  { name: "Morpho", domain: "morpho.org", careersUrl: "https://www.morpho.org/careers", atsType: "ashby", atsSlug: "morpho" },
  { name: "Espresso Systems", domain: "espressosys.com", careersUrl: "https://www.espressosys.com/careers", atsType: "ashby", atsSlug: "espresso" },
  { name: "Biconomy", domain: "biconomy.io", careersUrl: "https://www.biconomy.io/careers", atsType: "ashby", atsSlug: "biconomy" },
  { name: "Turnkey", domain: "turnkey.com", careersUrl: "https://www.turnkey.com/careers", atsType: "ashby", atsSlug: "turnkey" },
  { name: "Dynamic", domain: "dynamic.xyz", careersUrl: "https://www.dynamic.xyz/careers", atsType: "ashby", atsSlug: "dynamic" },

  // ashby — saas & productivity
  { name: "Kittl", domain: "kittl.com", careersUrl: "https://www.kittl.com/careers", atsType: "ashby", atsSlug: "kittl" },
  { name: "Causal", domain: "causal.app", careersUrl: "https://www.causal.app/careers", atsType: "ashby", atsSlug: "causal" },
  { name: "Range", domain: "range.co", careersUrl: "https://www.range.co/careers", atsType: "ashby", atsSlug: "range" },

  // greenhouse — AI & ML
  { name: "Together AI", domain: "together.ai", careersUrl: "https://www.together.ai/careers", atsType: "greenhouse", atsSlug: "togetherai" },
  { name: "Lightning AI", domain: "lightning.ai", careersUrl: "https://lightning.ai/careers", atsType: "greenhouse", atsSlug: "lightningai" },
  { name: "Fireworks AI", domain: "fireworks.ai", careersUrl: "https://fireworks.ai/careers", atsType: "greenhouse", atsSlug: "fireworksai" },
  { name: "MindsDB", domain: "mindsdb.com", careersUrl: "https://mindsdb.com/careers", atsType: "greenhouse", atsSlug: "mindsdb" },

  // greenhouse — fintech & enterprise
  { name: "N26", domain: "n26.com", careersUrl: "https://n26.com/en/careers", atsType: "greenhouse", atsSlug: "n26" },
  { name: "Pleo", domain: "pleo.io", careersUrl: "https://www.pleo.io/careers", atsType: "greenhouse", atsSlug: "pleo" },
  { name: "Catchpoint", domain: "catchpoint.com", careersUrl: "https://www.catchpoint.com/careers", atsType: "greenhouse", atsSlug: "catchpoint" },

  // greenhouse — privacy & crypto
  { name: "Proton", domain: "proton.me", careersUrl: "https://proton.me/careers", atsType: "greenhouse", atsSlug: "proton" },
  { name: "Osmosis", domain: "osmosis.zone", careersUrl: "https://osmosis.zone/careers", atsType: "greenhouse", atsSlug: "osmosis" },
  { name: "Sei Network", domain: "sei.io", careersUrl: "https://www.sei.io/careers", atsType: "greenhouse", atsSlug: "sei" },

  // ashby — fintech
  { name: "Tradeify", domain: "tradeify.com", careersUrl: "https://www.tradeify.com/careers", atsType: "ashby", atsSlug: "tradeify" },

  // lever — analytics & streaming
  { name: "Tinybird", domain: "tinybird.co", careersUrl: "https://www.tinybird.co/careers", atsType: "lever", atsSlug: "tinybird" },
  { name: "Restream", domain: "restream.io", careersUrl: "https://restream.io/careers", atsType: "lever", atsSlug: "restream" },

  // ── batch 10: discovered via career page ATS detection ──

  // greenhouse — AI & frontier
  { name: "xAI", domain: "x.ai", careersUrl: "https://x.ai/careers", atsType: "greenhouse", atsSlug: "xai" },
  { name: "Imbue", domain: "imbue.com", careersUrl: "https://imbue.com/careers", atsType: "greenhouse", atsSlug: "imbue" },
  { name: "Hebbia", domain: "hebbia.ai", careersUrl: "https://www.hebbia.ai/careers", atsType: "greenhouse", atsSlug: "hebbia" },

  // greenhouse — fintech & insurance
  { name: "Betterment", domain: "betterment.com", careersUrl: "https://www.betterment.com/careers", atsType: "greenhouse", atsSlug: "betterment" },
  { name: "Hippo Insurance", domain: "hippo.com", careersUrl: "https://www.hippo.com/careers", atsType: "greenhouse", atsSlug: "hippo70" },

  // greenhouse — streaming & analytics
  { name: "Roku", domain: "roku.com", careersUrl: "https://www.roku.com/en-us/jobs", atsType: "greenhouse", atsSlug: "roku" },
  { name: "Superset", domain: "superset.com", careersUrl: "https://www.superset.com/careers", atsType: "greenhouse", atsSlug: "superset" },

  // ashby — AI & ML
  { name: "Runway", domain: "runwayml.com", careersUrl: "https://runwayml.com/careers", atsType: "ashby", atsSlug: "runway" },
  { name: "Pika", domain: "pika.art", careersUrl: "https://pika.art/careers", atsType: "ashby", atsSlug: "pika" },
  { name: "LangChain", domain: "langchain.com", careersUrl: "https://www.langchain.com/careers", atsType: "ashby", atsSlug: "langchain" },

  // ashby — developer tools
  { name: "Convex", domain: "convex.dev", careersUrl: "https://www.convex.dev/careers", atsType: "ashby", atsSlug: "convex-dev" },
  { name: "Trigger.dev", domain: "trigger.dev", careersUrl: "https://trigger.dev/careers", atsType: "ashby", atsSlug: "triggerdev" },

  // ashby — fintech & banking
  { name: "Wealthsimple", domain: "wealthsimple.com", careersUrl: "https://www.wealthsimple.com/en-ca/careers", atsType: "ashby", atsSlug: "wealthsimple" },
  { name: "Dave", domain: "dave.com", careersUrl: "https://www.dave.com/careers", atsType: "ashby", atsSlug: "dave" },
  { name: "Unit", domain: "unit.co", careersUrl: "https://www.unit.co/careers", atsType: "ashby", atsSlug: "unit" },
  { name: "Column", domain: "column.com", careersUrl: "https://column.com/careers", atsType: "ashby", atsSlug: "column" },

  // ashby — data & security
  { name: "Monte Carlo", domain: "montecarlodata.com", careersUrl: "https://www.montecarlodata.com/careers", atsType: "ashby", atsSlug: "montecarlodata" },
  { name: "Material Security", domain: "material.security", careersUrl: "https://material.security/careers", atsType: "ashby", atsSlug: "materialsecurity" },

  // lever — data & analytics
  { name: "Matillion", domain: "matillion.com", careersUrl: "https://www.matillion.com/careers", atsType: "lever", atsSlug: "matillion" },

  // ── batch 11: mass ATS slug discovery ──

  // greenhouse — AI & ML
  { name: "Glean", domain: "glean.com", careersUrl: "https://www.glean.com/careers", atsType: "greenhouse", atsSlug: "gleanwork" },
  { name: "Inflection AI", domain: "inflection.ai", careersUrl: "https://inflection.ai/careers", atsType: "greenhouse", atsSlug: "inflectionai" },
  { name: "Moveworks", domain: "moveworks.com", careersUrl: "https://www.moveworks.com/careers", atsType: "greenhouse", atsSlug: "moveworks" },
  { name: "Snorkel AI", domain: "snorkel.ai", careersUrl: "https://snorkel.ai/careers", atsType: "greenhouse", atsSlug: "snorkelai" },
  { name: "Typeface", domain: "typeface.ai", careersUrl: "https://www.typeface.ai/careers", atsType: "greenhouse", atsSlug: "typeface" },
  { name: "Forethought", domain: "forethought.ai", careersUrl: "https://forethought.ai/careers", atsType: "greenhouse", atsSlug: "forethought" },
  { name: "SambaNova", domain: "sambanova.ai", careersUrl: "https://sambanova.ai/careers", atsType: "greenhouse", atsSlug: "sambanovasystems" },
  { name: "Textio", domain: "textio.com", careersUrl: "https://textio.com/careers", atsType: "greenhouse", atsSlug: "textio" },

  // greenhouse — security
  { name: "Virtru", domain: "virtru.com", careersUrl: "https://www.virtru.com/careers", atsType: "greenhouse", atsSlug: "virtru" },
  { name: "LastPass", domain: "lastpass.com", careersUrl: "https://www.lastpass.com/careers", atsType: "greenhouse", atsSlug: "lastpass" },
  { name: "Dashlane", domain: "dashlane.com", careersUrl: "https://www.dashlane.com/careers", atsType: "greenhouse", atsSlug: "dashlane" },
  { name: "Torq", domain: "torq.io", careersUrl: "https://torq.io/careers", atsType: "greenhouse", atsSlug: "torq" },
  { name: "Tines", domain: "tines.com", careersUrl: "https://www.tines.com/careers", atsType: "greenhouse", atsSlug: "tines" },
  { name: "Ping Identity", domain: "pingidentity.com", careersUrl: "https://www.pingidentity.com/careers", atsType: "greenhouse", atsSlug: "pingidentity" },

  // greenhouse — fintech & marketplace
  { name: "Robinhood", domain: "robinhood.com", careersUrl: "https://robinhood.com/careers", atsType: "greenhouse", atsSlug: "robinhood" },
  { name: "Nubank", domain: "nubank.com.br", careersUrl: "https://nubank.com.br/en/careers", atsType: "greenhouse", atsSlug: "nubank" },
  { name: "StockX", domain: "stockx.com", careersUrl: "https://stockx.com/careers", atsType: "greenhouse", atsSlug: "stockx" },
  { name: "Recharge", domain: "rechargepayments.com", careersUrl: "https://rechargepayments.com/careers", atsType: "greenhouse", atsSlug: "recharge" },
  { name: "Mercari", domain: "mercari.com", careersUrl: "https://about.mercari.com/en/careers", atsType: "greenhouse", atsSlug: "mercari" },

  // greenhouse — data & analytics
  { name: "Sigma Computing", domain: "sigmacomputing.com", careersUrl: "https://www.sigmacomputing.com/careers", atsType: "greenhouse", atsSlug: "sigmacomputing" },
  { name: "Sisense", domain: "sisense.com", careersUrl: "https://www.sisense.com/careers", atsType: "greenhouse", atsSlug: "sisense" },
  { name: "Smartsheet", domain: "smartsheet.com", careersUrl: "https://www.smartsheet.com/careers", atsType: "greenhouse", atsSlug: "smartsheet" },

  // greenhouse — healthcare & enterprise
  { name: "Flatiron Health", domain: "flatironhealth.com", careersUrl: "https://flatiron.com/careers", atsType: "greenhouse", atsSlug: "flatironhealth" },
  { name: "Modern Health", domain: "modernhealth.com", careersUrl: "https://www.modernhealth.com/careers", atsType: "greenhouse", atsSlug: "modernhealth" },
  { name: "Jamf", domain: "jamf.com", careersUrl: "https://www.jamf.com/careers", atsType: "greenhouse", atsSlug: "jamf" },
  { name: "Make", domain: "make.com", careersUrl: "https://www.make.com/en/careers", atsType: "greenhouse", atsSlug: "make" },
  { name: "Superblocks", domain: "superblocks.com", careersUrl: "https://www.superblocks.com/careers", atsType: "greenhouse", atsSlug: "superblocks" },
  { name: "Laika", domain: "heylaika.com", careersUrl: "https://heylaika.com/careers", atsType: "greenhouse", atsSlug: "laika" },

  // ashby — AI & ML
  { name: "Reka AI", domain: "reka.ai", careersUrl: "https://reka.ai/careers", atsType: "ashby", atsSlug: "reka" },
  { name: "Synthesia", domain: "synthesia.io", careersUrl: "https://www.synthesia.io/careers", atsType: "ashby", atsSlug: "synthesia" },
  { name: "Insitro", domain: "insitro.com", careersUrl: "https://insitro.com/careers", atsType: "ashby", atsSlug: "insitro" },
  { name: "MosaicML", domain: "mosaicml.com", careersUrl: "https://www.mosaicml.com/careers", atsType: "ashby", atsSlug: "mosaic" },

  // ashby — data & analytics
  { name: "Snowflake", domain: "snowflake.com", careersUrl: "https://www.snowflake.com/careers", atsType: "ashby", atsSlug: "snowflake" },
  { name: "Atlan", domain: "atlan.com", careersUrl: "https://atlan.com/careers", atsType: "ashby", atsSlug: "atlan" },
  { name: "Lightdash", domain: "lightdash.com", careersUrl: "https://lightdash.com/careers", atsType: "ashby", atsSlug: "lightdash" },
  { name: "Modern Treasury", domain: "moderntreasury.com", careersUrl: "https://www.moderntreasury.com/careers", atsType: "ashby", atsSlug: "moderntreasury" },
  { name: "Astronomer", domain: "astronomer.io", careersUrl: "https://www.astronomer.io/careers", atsType: "ashby", atsSlug: "astronomer" },

  // ashby — saas & CRM
  { name: "Attio", domain: "attio.com", careersUrl: "https://attio.com/careers", atsType: "ashby", atsSlug: "attio" },
  { name: "Motion", domain: "usemotion.com", careersUrl: "https://www.usemotion.com/careers", atsType: "ashby", atsSlug: "motion" },
  { name: "Gorgias", domain: "gorgias.com", careersUrl: "https://www.gorgias.com/careers", atsType: "ashby", atsSlug: "gorgias" },
  { name: "Zip", domain: "ziphq.com", careersUrl: "https://ziphq.com/careers", atsType: "ashby", atsSlug: "zip" },
  { name: "Poshmark", domain: "poshmark.com", careersUrl: "https://poshmark.com/careers", atsType: "ashby", atsSlug: "poshmark" },

  // ashby — security & infra
  { name: "StrongDM", domain: "strongdm.com", careersUrl: "https://www.strongdm.com/careers", atsType: "ashby", atsSlug: "strongdm" },

  // ashby — healthcare
  { name: "Notable Health", domain: "notablehealth.com", careersUrl: "https://www.notablehealth.com/careers", atsType: "ashby", atsSlug: "notable" },
  { name: "Talkiatry", domain: "talkiatry.com", careersUrl: "https://www.talkiatry.com/careers", atsType: "ashby", atsSlug: "talkiatry" },
  { name: "Olive AI", domain: "oliveai.com", careersUrl: "https://oliveai.com/careers", atsType: "ashby", atsSlug: "olive" },

  // ashby — misc
  { name: "Rev", domain: "rev.com", careersUrl: "https://www.rev.com/careers", atsType: "ashby", atsSlug: "rev" },
  { name: "Wistia", domain: "wistia.com", careersUrl: "https://wistia.com/careers", atsType: "ashby", atsSlug: "wistia" },
  { name: "Roam Research", domain: "roamresearch.com", careersUrl: "https://roamresearch.com/careers", atsType: "ashby", atsSlug: "roam" },

  // lever — healthcare
  { name: "Lyra Health", domain: "lyrahealth.com", careersUrl: "https://www.lyrahealth.com/careers", atsType: "lever", atsSlug: "lyrahealth" },
  { name: "Sword Health", domain: "swordhealth.com", careersUrl: "https://swordhealth.com/careers", atsType: "lever", atsSlug: "swordhealth" },
  { name: "Color Health", domain: "color.com", careersUrl: "https://www.color.com/careers", atsType: "lever", atsSlug: "color" },
  { name: "Ro", domain: "ro.co", careersUrl: "https://ro.co/careers", atsType: "lever", atsSlug: "ro" },
  { name: "Varo Money", domain: "varomoney.com", careersUrl: "https://www.varomoney.com/careers", atsType: "lever", atsSlug: "varomoney" },

  // lever — security & compliance
  { name: "Secureframe", domain: "secureframe.com", careersUrl: "https://secureframe.com/careers", atsType: "lever", atsSlug: "secureframe" },
  { name: "SonarSource", domain: "sonarsource.com", careersUrl: "https://www.sonarsource.com/careers", atsType: "lever", atsSlug: "sonarsource" },
  { name: "Yubico", domain: "yubico.com", careersUrl: "https://www.yubico.com/careers", atsType: "lever", atsSlug: "yubico" },

  // lever — data & developer tools
  { name: "Pipedrive", domain: "pipedrive.com", careersUrl: "https://www.pipedrive.com/careers", atsType: "lever", atsSlug: "pipedrive" },
  { name: "Zilliz", domain: "zilliz.com", careersUrl: "https://zilliz.com/careers", atsType: "lever", atsSlug: "zilliz" },
  { name: "ZeroTier", domain: "zerotier.com", careersUrl: "https://www.zerotier.com/careers", atsType: "lever", atsSlug: "zerotier" },
  { name: "Okendo", domain: "okendo.io", careersUrl: "https://okendo.io/careers", atsType: "lever", atsSlug: "okendo" },

  // lever — biotech
  { name: "BenchSci", domain: "benchsci.com", careersUrl: "https://www.benchsci.com/careers", atsType: "lever", atsSlug: "benchsci" },
  { name: "Deep Genomics", domain: "deepgenomics.com", careersUrl: "https://www.deepgenomics.com/careers", atsType: "lever", atsSlug: "deepgenomics" },

  // ── batch 12: round 2 mass discovery ──

  // greenhouse — big tech & marketplace
  { name: "Airbnb", domain: "airbnb.com", careersUrl: "https://careers.airbnb.com", atsType: "greenhouse", atsSlug: "airbnb" },
  { name: "Oscar Health", domain: "hioscar.com", careersUrl: "https://www.hioscar.com/careers", atsType: "greenhouse", atsSlug: "oscar" },
  { name: "Flexport", domain: "flexport.com", careersUrl: "https://www.flexport.com/careers", atsType: "greenhouse", atsSlug: "flexport" },
  { name: "PandaDoc", domain: "pandadoc.com", careersUrl: "https://www.pandadoc.com/careers", atsType: "greenhouse", atsSlug: "pandadoc" },
  { name: "Clover Health", domain: "cloverhealth.com", careersUrl: "https://www.cloverhealth.com/careers", atsType: "greenhouse", atsSlug: "cloverhealth" },
  { name: "QuintoAndar", domain: "quintoandar.com.br", careersUrl: "https://carreiras.quintoandar.com.br", atsType: "greenhouse", atsSlug: "quintoandar" },
  { name: "Redwood Materials", domain: "redwoodmaterials.com", careersUrl: "https://www.redwoodmaterials.com/careers", atsType: "greenhouse", atsSlug: "redwoodmaterials" },

  // greenhouse — security & identity
  { name: "Keeper Security", domain: "keepersecurity.com", careersUrl: "https://www.keepersecurity.com/careers", atsType: "greenhouse", atsSlug: "keepersecurity" },
  { name: "Transmit Security", domain: "transmitsecurity.com", careersUrl: "https://www.transmitsecurity.com/careers", atsType: "greenhouse", atsSlug: "transmitsecurity" },
  { name: "ExpressVPN", domain: "expressvpn.com", careersUrl: "https://www.expressvpn.com/jobs", atsType: "greenhouse", atsSlug: "expressvpn" },

  // greenhouse — AI & data
  { name: "Arize AI", domain: "arize.com", careersUrl: "https://arize.com/careers", atsType: "greenhouse", atsSlug: "arizeai" },
  { name: "Merge", domain: "merge.dev", careersUrl: "https://merge.dev/careers", atsType: "greenhouse", atsSlug: "merge" },
  { name: "Melio", domain: "melio.com", careersUrl: "https://www.melio.com/careers", atsType: "greenhouse", atsSlug: "melio" },

  // greenhouse — biotech & healthcare
  { name: "Freenome", domain: "freenome.com", careersUrl: "https://www.freenome.com/careers", atsType: "greenhouse", atsSlug: "freenome" },
  { name: "Maven Clinic", domain: "mavenclinic.com", careersUrl: "https://www.mavenclinic.com/careers", atsType: "greenhouse", atsSlug: "mavenclinic" },
  { name: "Veracyte", domain: "veracyte.com", careersUrl: "https://www.veracyte.com/careers", atsType: "greenhouse", atsSlug: "veracyte" },
  { name: "PathAI", domain: "pathai.com", careersUrl: "https://www.pathai.com/careers", atsType: "greenhouse", atsSlug: "pathai" },
  { name: "Owkin", domain: "owkin.com", careersUrl: "https://owkin.com/careers", atsType: "greenhouse", atsSlug: "owkin" },
  { name: "Valo Health", domain: "valohealth.com", careersUrl: "https://www.valohealth.com/careers", atsType: "greenhouse", atsSlug: "valohealth" },

  // greenhouse — crypto & web3
  { name: "a16z", domain: "a16z.com", careersUrl: "https://a16z.com/about/#careers", atsType: "greenhouse", atsSlug: "a16z" },
  { name: "Ava Labs", domain: "avalabs.org", careersUrl: "https://www.avalabs.org/careers", atsType: "greenhouse", atsSlug: "avalabs" },
  { name: "Aztec", domain: "aztec.network", careersUrl: "https://aztec.network/careers", atsType: "greenhouse", atsSlug: "aztec" },

  // greenhouse — logistics & supply chain
  { name: "FourKites", domain: "fourkites.com", careersUrl: "https://www.fourkites.com/careers", atsType: "greenhouse", atsSlug: "fourkites" },
  { name: "project44", domain: "project44.com", careersUrl: "https://www.project44.com/careers", atsType: "greenhouse", atsSlug: "project44" },

  // greenhouse — enterprise & messaging
  { name: "Bird", domain: "bird.com", careersUrl: "https://bird.com/careers", atsType: "greenhouse", atsSlug: "bird" },
  { name: "Globalization Partners", domain: "globalization-partners.com", careersUrl: "https://www.globalization-partners.com/careers", atsType: "greenhouse", atsSlug: "globalizationpartners" },
  { name: "Insider", domain: "useinsider.com", careersUrl: "https://useinsider.com/careers", atsType: "greenhouse", atsSlug: "insider" },

  // greenhouse — energy & climate
  { name: "Antora Energy", domain: "antoraenergy.com", careersUrl: "https://antoraenergy.com/careers", atsType: "greenhouse", atsSlug: "antora" },
  { name: "Vast", domain: "vast.ai", careersUrl: "https://vast.ai/careers", atsType: "greenhouse", atsSlug: "vastai" },
  { name: "Watershed", domain: "watershed.com", careersUrl: "https://www.watershed.com/careers", atsType: "greenhouse", atsSlug: "watershed" },
  { name: "Patch", domain: "patch.io", careersUrl: "https://www.patch.io/careers", atsType: "greenhouse", atsSlug: "patch" },
  { name: "Redpanda", domain: "redpanda.com", careersUrl: "https://redpanda.com/careers", atsType: "greenhouse", atsSlug: "redpandadata" },

  // greenhouse — devtools & misc
  { name: "Beautiful.ai", domain: "beautiful.ai", careersUrl: "https://www.beautiful.ai/careers", atsType: "greenhouse", atsSlug: "beautifulai" },
  { name: "Airship", domain: "airship.com", careersUrl: "https://www.airship.com/careers", atsType: "greenhouse", atsSlug: "airship" },
  { name: "Cortex", domain: "cortex.io", careersUrl: "https://www.cortex.io/careers", atsType: "greenhouse", atsSlug: "cortex" },
  { name: "Cypress", domain: "cypress.io", careersUrl: "https://www.cypress.io/careers", atsType: "greenhouse", atsSlug: "cypressio" },
  { name: "Neptune AI", domain: "neptune.ai", careersUrl: "https://neptune.ai/careers", atsType: "greenhouse", atsSlug: "neptuneai" },
  { name: "Branch", domain: "branch.io", careersUrl: "https://branch.io/careers", atsType: "greenhouse", atsSlug: "branch" },
  { name: "PubNub", domain: "pubnub.com", careersUrl: "https://www.pubnub.com/careers", atsType: "greenhouse", atsSlug: "pubnub" },
  { name: "Akoya", domain: "akoya.com", careersUrl: "https://www.akoya.com/careers", atsType: "greenhouse", atsSlug: "akoya" },
  { name: "Mangopay", domain: "mangopay.com", careersUrl: "https://www.mangopay.com/careers", atsType: "greenhouse", atsSlug: "mangopay" },
  { name: "Babbel", domain: "babbel.com", careersUrl: "https://www.babbel.com/careers", atsType: "greenhouse", atsSlug: "babbel" },
  { name: "HYPR", domain: "hypr.com", careersUrl: "https://www.hypr.com/careers", atsType: "greenhouse", atsSlug: "hypr" },

  // ashby — AI & compute
  { name: "Crusoe", domain: "crusoe.ai", careersUrl: "https://www.crusoe.ai/careers", atsType: "ashby", atsSlug: "crusoe" },
  { name: "Cognition", domain: "cognition.ai", careersUrl: "https://www.cognition.ai/careers", atsType: "ashby", atsSlug: "cognition" },
  { name: "Lambda", domain: "lambdalabs.com", careersUrl: "https://lambdalabs.com/careers", atsType: "ashby", atsSlug: "lambda" },
  { name: "E2B", domain: "e2b.dev", careersUrl: "https://e2b.dev/careers", atsType: "ashby", atsSlug: "e2b" },
  { name: "Letta", domain: "letta.com", careersUrl: "https://www.letta.com/careers", atsType: "ashby", atsSlug: "letta" },
  { name: "Continue", domain: "continue.dev", careersUrl: "https://continue.dev/careers", atsType: "ashby", atsSlug: "continue" },
  { name: "Tecton", domain: "tecton.ai", careersUrl: "https://www.tecton.ai/careers", atsType: "ashby", atsSlug: "tectonai" },
  { name: "Gradient", domain: "gradient.ai", careersUrl: "https://gradient.ai/careers", atsType: "ashby", atsSlug: "gradient" },
  { name: "Braintrust", domain: "braintrustdata.com", careersUrl: "https://www.braintrustdata.com/careers", atsType: "ashby", atsSlug: "braintrust" },

  // ashby — security & identity
  { name: "Delinea", domain: "delinea.com", careersUrl: "https://delinea.com/careers", atsType: "ashby", atsSlug: "delinea" },
  { name: "Passage", domain: "passage.id", careersUrl: "https://passage.id/careers", atsType: "ashby", atsSlug: "passage" },

  // ashby — fintech & enterprise
  { name: "Pennylane", domain: "pennylane.com", careersUrl: "https://www.pennylane.com/careers", atsType: "ashby", atsSlug: "pennylane" },
  { name: "Preply", domain: "preply.com", careersUrl: "https://preply.com/careers", atsType: "ashby", atsSlug: "preply" },
  { name: "Ashby", domain: "ashby.com", careersUrl: "https://www.ashby.com/careers", atsType: "ashby", atsSlug: "ashby" },
  { name: "Instructure", domain: "instructure.com", careersUrl: "https://www.instructure.com/careers", atsType: "ashby", atsSlug: "instructure" },
  { name: "Substack", domain: "substack.com", careersUrl: "https://substack.com/careers", atsType: "ashby", atsSlug: "substack" },
  { name: "Weave", domain: "getweave.com", careersUrl: "https://www.getweave.com/careers", atsType: "ashby", atsSlug: "weave" },

  // ashby — energy & climate
  { name: "Form Energy", domain: "formenergy.com", careersUrl: "https://formenergy.com/careers", atsType: "ashby", atsSlug: "formenergy" },
  { name: "Twelve", domain: "twelve.co", careersUrl: "https://www.twelve.co/careers", atsType: "ashby", atsSlug: "twelve" },
  { name: "Swan", domain: "swan.io", careersUrl: "https://www.swan.io/careers", atsType: "ashby", atsSlug: "swan" },

  // ashby — gaming & media
  { name: "Supercell", domain: "supercell.com", careersUrl: "https://supercell.com/en/careers", atsType: "ashby", atsSlug: "supercell" },
  { name: "Improbable", domain: "improbable.io", careersUrl: "https://www.improbable.io/careers", atsType: "ashby", atsSlug: "improbable" },
  { name: "LottieFiles", domain: "lottiefiles.com", careersUrl: "https://lottiefiles.com/careers", atsType: "ashby", atsSlug: "lottie" },

  // ashby — developer tools & analytics
  { name: "Andela", domain: "andela.com", careersUrl: "https://andela.com/careers", atsType: "ashby", atsSlug: "andela" },
  { name: "Chromatic", domain: "chromatic.com", careersUrl: "https://www.chromatic.com/careers", atsType: "ashby", atsSlug: "chromatic" },
  { name: "Flux", domain: "fluxcd.io", careersUrl: "https://fluxcd.io/careers", atsType: "ashby", atsSlug: "flux" },
  { name: "Sprig", domain: "sprig.com", careersUrl: "https://sprig.com/careers", atsType: "ashby", atsSlug: "sprig" },
  { name: "Vantage", domain: "vantage.sh", careersUrl: "https://www.vantage.sh/careers", atsType: "ashby", atsSlug: "vantage" },
  { name: "InfluxData", domain: "influxdata.com", careersUrl: "https://www.influxdata.com/careers", atsType: "ashby", atsSlug: "influxdata" },

  // ashby — crypto
  { name: "Parity", domain: "parity.io", careersUrl: "https://www.parity.io/jobs", atsType: "ashby", atsSlug: "parity" },
  { name: "Delphi Digital", domain: "delphidigital.io", careersUrl: "https://delphidigital.io/careers", atsType: "ashby", atsSlug: "delphi" },
  { name: "Goldsky", domain: "goldsky.com", careersUrl: "https://goldsky.com/careers", atsType: "ashby", atsSlug: "goldsky" },

  // lever — enterprise & SaaS
  { name: "Toptal", domain: "toptal.com", careersUrl: "https://www.toptal.com/careers", atsType: "lever", atsSlug: "toptal" },
  { name: "Saviynt", domain: "saviynt.com", careersUrl: "https://saviynt.com/careers", atsType: "lever", atsSlug: "saviynt" },
  { name: "dLocal", domain: "dlocal.com", careersUrl: "https://dlocal.com/careers", atsType: "lever", atsSlug: "dlocal" },
  { name: "Contentsquare", domain: "contentsquare.com", careersUrl: "https://contentsquare.com/careers", atsType: "lever", atsSlug: "contentsquare" },
  { name: "Meesho", domain: "meesho.com", careersUrl: "https://meesho.com/careers", atsType: "lever", atsSlug: "meesho" },
  { name: "Agicap", domain: "agicap.com", careersUrl: "https://agicap.com/careers", atsType: "lever", atsSlug: "agicap" },
  { name: "ActiveCampaign", domain: "activecampaign.com", careersUrl: "https://www.activecampaign.com/about/careers", atsType: "lever", atsSlug: "activecampaign" },

  // lever — gaming & logistics
  { name: "Kabam", domain: "kabam.com", careersUrl: "https://www.kabam.com/careers", atsType: "lever", atsSlug: "kabam" },
  { name: "Loadsmart", domain: "loadsmart.com", careersUrl: "https://loadsmart.com/careers", atsType: "lever", atsSlug: "loadsmart" },
  { name: "Brevo", domain: "brevo.com", careersUrl: "https://www.brevo.com/careers", atsType: "lever", atsSlug: "brevo" },
  { name: "Quantum Metric", domain: "quantummetric.com", careersUrl: "https://www.quantummetric.com/careers", atsType: "lever", atsSlug: "quantummetric" },

  // lever — devtools & analytics
  { name: "LogRocket", domain: "logrocket.com", careersUrl: "https://logrocket.com/careers", atsType: "lever", atsSlug: "logrocket" },
  { name: "Omnisend", domain: "omnisend.com", careersUrl: "https://www.omnisend.com/careers", atsType: "lever", atsSlug: "omnisend" },
  { name: "Agiloft", domain: "agiloft.com", careersUrl: "https://www.agiloft.com/careers", atsType: "lever", atsSlug: "agiloft" },
  { name: "Plivo", domain: "plivo.com", careersUrl: "https://www.plivo.com/careers", atsType: "lever", atsSlug: "plivo" },
  { name: "Tala", domain: "tala.co", careersUrl: "https://tala.co/careers", atsType: "lever", atsSlug: "tala" },
  { name: "Shippo", domain: "goshippo.com", careersUrl: "https://goshippo.com/careers", atsType: "lever", atsSlug: "shippo" },

  // lever — climate & energy
  { name: "Charm Industrial", domain: "charmindustrial.com", careersUrl: "https://charmindustrial.com/careers", atsType: "lever", atsSlug: "charmindustrial" },
  { name: "Fuel Labs", domain: "fuel.network", careersUrl: "https://fuel.network/careers", atsType: "lever", atsSlug: "fuellabs" },
  { name: "Brilliant", domain: "brilliant.org", careersUrl: "https://brilliant.org/careers", atsType: "lever", atsSlug: "brilliant" },

  // ── batch 13 — smart discovery v3 (github repo lists + slug variations) ──

  // greenhouse — identity & verification
  { name: "Jumio", domain: "jumio.com", careersUrl: "https://www.jumio.com/careers", atsType: "greenhouse", atsSlug: "jumio" },
  { name: "Veriff", domain: "veriff.com", careersUrl: "https://www.veriff.com/careers", atsType: "greenhouse", atsSlug: "veriff" },

  // greenhouse — education
  { name: "Khan Academy", domain: "khanacademy.org", careersUrl: "https://www.khanacademy.org/careers", atsType: "greenhouse", atsSlug: "khanacademy" },
  { name: "General Assembly", domain: "generalassemb.ly", careersUrl: "https://generalassemb.ly/careers", atsType: "greenhouse", atsSlug: "generalassembly" },
  { name: "GoGuardian", domain: "goguardian.com", careersUrl: "https://www.goguardian.com/careers", atsType: "greenhouse", atsSlug: "goguardian" },
  { name: "Clever", domain: "clever.com", careersUrl: "https://www.clever.com/about/careers", atsType: "greenhouse", atsSlug: "clever" },

  // greenhouse — fintech & payments
  { name: "Pilot", domain: "pilot.com", careersUrl: "https://pilot.com/careers", atsType: "greenhouse", atsSlug: "pilothq" },
  { name: "Array", domain: "array.com", careersUrl: "https://array.com/careers", atsType: "greenhouse", atsSlug: "array" },
  { name: "Highnote", domain: "highnote.com", careersUrl: "https://www.highnote.com/careers", atsType: "greenhouse", atsSlug: "highnote" },
  { name: "TabaPay", domain: "tabapay.com", careersUrl: "https://tabapay.com/careers", atsType: "greenhouse", atsSlug: "tabapay" },
  { name: "Blend", domain: "blend.com", careersUrl: "https://blend.com/company/careers", atsType: "greenhouse", atsSlug: "blend" },
  { name: "Synctera", domain: "synctera.com", careersUrl: "https://synctera.com/careers", atsType: "greenhouse", atsSlug: "synctera" },

  // greenhouse — ml & data
  { name: "Domino Data Lab", domain: "dominodatalab.com", careersUrl: "https://www.dominodatalab.com/careers", atsType: "greenhouse", atsSlug: "dominodatalab" },

  // greenhouse — martech & content
  { name: "LaunchPotato", domain: "launchpotato.com", careersUrl: "https://launchpotato.com/careers", atsType: "greenhouse", atsSlug: "launchpotato" },
  { name: "Ceros", domain: "ceros.com", careersUrl: "https://www.ceros.com/careers", atsType: "greenhouse", atsSlug: "ceros" },
  { name: "Mixmax", domain: "mixmax.com", careersUrl: "https://www.mixmax.com/careers", atsType: "greenhouse", atsSlug: "mixmax" },

  // greenhouse — developer tools & infra
  { name: "NearForm", domain: "nearform.com", careersUrl: "https://www.nearform.com/careers", atsType: "greenhouse", atsSlug: "nearform" },
  { name: "Karat", domain: "karat.com", careersUrl: "https://www.karat.com/careers", atsType: "greenhouse", atsSlug: "karat" },
  { name: "Gradle", domain: "gradle.org", careersUrl: "https://gradle.org/careers", atsType: "greenhouse", atsSlug: "gradle" },
  { name: "Acquia", domain: "acquia.com", careersUrl: "https://www.acquia.com/careers", atsType: "greenhouse", atsSlug: "acquia" },
  { name: "Stack Exchange", domain: "stackexchange.com", careersUrl: "https://stackoverflow.co/company/careers", atsType: "greenhouse", atsSlug: "stackexchange" },
  { name: "Baselayer", domain: "baselayer.com", careersUrl: "https://baselayer.com/careers", atsType: "greenhouse", atsSlug: "baselayer" },

  // greenhouse — learning & enterprise
  { name: "Intellum", domain: "intellum.com", careersUrl: "https://www.intellum.com/careers", atsType: "greenhouse", atsSlug: "intelluminc" },

  // ashby — identity & fintech
  { name: "Socure", domain: "socure.com", careersUrl: "https://www.socure.com/careers", atsType: "ashby", atsSlug: "socure" },
  { name: "Middesk", domain: "middesk.com", careersUrl: "https://www.middesk.com/careers", atsType: "ashby", atsSlug: "middesk" },

  // ashby — energy & health
  { name: "Aurora Solar", domain: "aurorasolar.com", careersUrl: "https://www.aurorasolar.com/careers", atsType: "ashby", atsSlug: "aurorasolar" },
  { name: "Wheel", domain: "wheel.com", careersUrl: "https://www.wheel.com/careers", atsType: "ashby", atsSlug: "wheel" },

  // ashby — developer tools & ml
  { name: "SearchApi", domain: "searchapi.io", careersUrl: "https://www.searchapi.io/careers", atsType: "ashby", atsSlug: "searchapi" },
  { name: "BentoML", domain: "bentoml.com", careersUrl: "https://www.bentoml.com/careers", atsType: "ashby", atsSlug: "bentoml" },
  { name: "Conduit", domain: "conduit.xyz", careersUrl: "https://conduit.xyz/careers", atsType: "ashby", atsSlug: "conduit" },
  { name: "Binti", domain: "binti.com", careersUrl: "https://binti.com/careers", atsType: "ashby", atsSlug: "binti" },
  { name: "Astra", domain: "astra.finance", careersUrl: "https://www.astra.finance/careers", atsType: "ashby", atsSlug: "astra" },

  // lever — security & infrastructure
  { name: "Sysdig", domain: "sysdig.com", careersUrl: "https://sysdig.com/careers", atsType: "lever", atsSlug: "sysdig" },
  { name: "Articulate", domain: "articulate.com", careersUrl: "https://articulate.com/careers", atsType: "lever", atsSlug: "articulate" },
  { name: "Heetch", domain: "heetch.com", careersUrl: "https://www.heetch.com/careers", atsType: "lever", atsSlug: "heetch" },
  { name: "LiveChat", domain: "livechat.com", careersUrl: "https://www.livechat.com/careers", atsType: "lever", atsSlug: "livechatinc" },
  { name: "TeamSnap", domain: "teamsnap.com", careersUrl: "https://www.teamsnap.com/careers", atsType: "lever", atsSlug: "teamsnap" },
  { name: "Brightspot", domain: "brightspot.com", careersUrl: "https://www.brightspot.com/careers", atsType: "lever", atsSlug: "brightspot" },

  // ── batch 14 — round 4 deep vertical discovery ──

  // greenhouse — food & delivery
  { name: "HelloFresh", domain: "hellofresh.com", careersUrl: "https://www.hellofresh.com/careers", atsType: "greenhouse", atsSlug: "hellofresh" },
  { name: "Sweetgreen", domain: "sweetgreen.com", careersUrl: "https://www.sweetgreen.com/careers", atsType: "greenhouse", atsSlug: "sweetgreen" },
  { name: "Misfits Market", domain: "misfitsmarket.com", careersUrl: "https://www.misfitsmarket.com/careers", atsType: "greenhouse", atsSlug: "misfitsmarket" },
  { name: "Home Chef", domain: "homechef.com", careersUrl: "https://www.homechef.com/careers", atsType: "greenhouse", atsSlug: "homechef" },
  { name: "Hungryroot", domain: "hungryroot.com", careersUrl: "https://www.hungryroot.com/careers", atsType: "greenhouse", atsSlug: "hungryroot" },
  { name: "Ritual", domain: "ritual.com", careersUrl: "https://www.ritual.com/careers", atsType: "greenhouse", atsSlug: "ritual" },

  // greenhouse — healthcare & biotech
  { name: "Natera", domain: "natera.com", careersUrl: "https://www.natera.com/careers", atsType: "greenhouse", atsSlug: "natera" },
  { name: "Omada Health", domain: "omadahealth.com", careersUrl: "https://www.omadahealth.com/careers", atsType: "greenhouse", atsSlug: "omadahealth" },
  { name: "Amwell", domain: "amwell.com", careersUrl: "https://www.amwell.com/careers", atsType: "greenhouse", atsSlug: "amwell" },
  { name: "Thirty Madison", domain: "thirtymadison.com", careersUrl: "https://thirtymadison.com/careers", atsType: "greenhouse", atsSlug: "thirtymadison" },
  { name: "Ginkgo Bioworks", domain: "ginkgobioworks.com", careersUrl: "https://www.ginkgobioworks.com/careers", atsType: "greenhouse", atsSlug: "ginkgobioworks" },
  { name: "Dotmatics", domain: "dotmatics.com", careersUrl: "https://www.dotmatics.com/careers", atsType: "greenhouse", atsSlug: "dotmatics" },

  // greenhouse — transportation & logistics
  { name: "Via", domain: "ridewithvia.com", careersUrl: "https://ridewithvia.com/careers", atsType: "greenhouse", atsSlug: "via" },
  { name: "Uber Freight", domain: "uberfreight.com", careersUrl: "https://www.uberfreight.com/careers", atsType: "greenhouse", atsSlug: "uberfreight" },
  { name: "Bringg", domain: "bringg.com", careersUrl: "https://www.bringg.com/careers", atsType: "greenhouse", atsSlug: "bringg" },
  { name: "Shipwell", domain: "shipwell.com", careersUrl: "https://shipwell.com/careers", atsType: "greenhouse", atsSlug: "shipwell" },

  // greenhouse — fintech & payments
  { name: "Bill.com", domain: "bill.com", careersUrl: "https://www.bill.com/careers", atsType: "greenhouse", atsSlug: "billcom" },
  { name: "AppsFlyer", domain: "appsflyer.com", careersUrl: "https://www.appsflyer.com/careers", atsType: "greenhouse", atsSlug: "appsflyer" },
  { name: "Bloomreach", domain: "bloomreach.com", careersUrl: "https://www.bloomreach.com/careers", atsType: "greenhouse", atsSlug: "bloomreach" },
  { name: "Thoropass", domain: "thoropass.com", careersUrl: "https://www.thoropass.com/careers", atsType: "greenhouse", atsSlug: "thoropass" },

  // greenhouse — security
  { name: "Obsidian Security", domain: "obsidiansecurity.com", careersUrl: "https://www.obsidiansecurity.com/careers", atsType: "greenhouse", atsSlug: "obsidiansecurity" },
  { name: "Endor Labs", domain: "endorlabs.com", careersUrl: "https://www.endorlabs.com/careers", atsType: "greenhouse", atsSlug: "endorlabs" },
  { name: "Apiiro", domain: "apiiro.com", careersUrl: "https://apiiro.com/careers", atsType: "greenhouse", atsSlug: "apiiro" },
  { name: "Panther", domain: "runpanther.io", careersUrl: "https://runpanther.io/careers", atsType: "greenhouse", atsSlug: "pantherlabs" },

  // greenhouse — sales & marketing
  { name: "Apollo.io", domain: "apollo.io", careersUrl: "https://www.apollo.io/careers", atsType: "greenhouse", atsSlug: "apolloio" },
  { name: "Newsela", domain: "newsela.com", careersUrl: "https://newsela.com/careers", atsType: "greenhouse", atsSlug: "newsela" },

  // greenhouse — ai & developer tools
  { name: "Lovable", domain: "lovable.dev", careersUrl: "https://lovable.dev/careers", atsType: "greenhouse", atsSlug: "lovable" },
  { name: "Fellow", domain: "fellow.app", careersUrl: "https://fellow.app/careers", atsType: "greenhouse", atsSlug: "fellow" },
  { name: "Litify", domain: "litify.com", careersUrl: "https://www.litify.com/careers", atsType: "greenhouse", atsSlug: "litify" },

  // greenhouse — commerce & marketplace
  { name: "GOAT", domain: "goat.com", careersUrl: "https://www.goat.com/careers", atsType: "greenhouse", atsSlug: "goatgroup" },
  { name: "Orchard", domain: "orchard.com", careersUrl: "https://www.orchard.com/careers", atsType: "greenhouse", atsSlug: "orchard" },
  { name: "OfferUp", domain: "offerup.com", careersUrl: "https://offerup.com/careers", atsType: "greenhouse", atsSlug: "offerup" },
  { name: "Rebag", domain: "rebag.com", careersUrl: "https://www.rebag.com/careers", atsType: "greenhouse", atsSlug: "rebag" },
  { name: "SHEIN", domain: "shein.com", careersUrl: "https://careers.shein.com", atsType: "greenhouse", atsSlug: "shein" },

  // greenhouse — proptech & real estate
  { name: "SmartRent", domain: "smartrent.com", careersUrl: "https://smartrent.com/careers", atsType: "greenhouse", atsSlug: "smartrent" },

  // greenhouse — edtech
  { name: "Outschool", domain: "outschool.com", careersUrl: "https://outschool.com/careers", atsType: "greenhouse", atsSlug: "outschool" },

  // greenhouse — gaming
  { name: "Bandai Namco", domain: "bandainamcoent.com", careersUrl: "https://www.bandainamcoent.com/careers", atsType: "greenhouse", atsSlug: "bandainamco" },

  // ashby — marketplace & commerce
  { name: "Whatnot", domain: "whatnot.com", careersUrl: "https://www.whatnot.com/careers", atsType: "ashby", atsSlug: "whatnot" },

  // ashby — fintech & banking
  { name: "Relay", domain: "relay.com", careersUrl: "https://relay.com/careers", atsType: "ashby", atsSlug: "relayfi" },
  { name: "Mollie", domain: "mollie.com", careersUrl: "https://www.mollie.com/careers", atsType: "ashby", atsSlug: "mollie" },
  { name: "Moss", domain: "getmoss.com", careersUrl: "https://getmoss.com/careers", atsType: "ashby", atsSlug: "moss" },
  { name: "Fonoa", domain: "fonoa.com", careersUrl: "https://www.fonoa.com/careers", atsType: "ashby", atsSlug: "fonoa" },
  { name: "Float", domain: "float.com", careersUrl: "https://www.float.com/careers", atsType: "ashby", atsSlug: "float" },
  { name: "Novo", domain: "novo.co", careersUrl: "https://www.novo.co/careers", atsType: "ashby", atsSlug: "novo" },
  { name: "Found", domain: "found.com", careersUrl: "https://found.com/careers", atsType: "ashby", atsSlug: "found" },
  { name: "Rho", domain: "rho.co", careersUrl: "https://rho.co/careers", atsType: "ashby", atsSlug: "rho" },
  { name: "OwnUp", domain: "ownup.com", careersUrl: "https://www.ownup.com/careers", atsType: "ashby", atsSlug: "ownup" },
  { name: "Tomo", domain: "hellotomo.com", careersUrl: "https://hellotomo.com/careers", atsType: "ashby", atsSlug: "tomo" },
  { name: "Capchase", domain: "capchase.com", careersUrl: "https://www.capchase.com/careers", atsType: "ashby", atsSlug: "capchase" },
  { name: "Clearco", domain: "clear.co", careersUrl: "https://clear.co/careers", atsType: "ashby", atsSlug: "clearco" },
  { name: "Procurify", domain: "procurify.com", careersUrl: "https://www.procurify.com/careers", atsType: "ashby", atsSlug: "procurify" },

  // ashby — ai & developer tools
  { name: "Factory", domain: "factory.ai", careersUrl: "https://www.factory.ai/careers", atsType: "ashby", atsSlug: "factory" },
  { name: "Langfuse", domain: "langfuse.com", careersUrl: "https://langfuse.com/careers", atsType: "ashby", atsSlug: "langfuse" },
  { name: "Greptile", domain: "greptile.com", careersUrl: "https://greptile.com/careers", atsType: "ashby", atsSlug: "greptile" },
  { name: "Codegen", domain: "codegen.com", careersUrl: "https://www.codegen.com/careers", atsType: "ashby", atsSlug: "codegen" },
  { name: "Sweep", domain: "sweep.net", careersUrl: "https://sweep.net/careers", atsType: "ashby", atsSlug: "sweep" },

  // ashby — cloud & infrastructure
  { name: "FluidStack", domain: "fluidstack.io", careersUrl: "https://www.fluidstack.io/careers", atsType: "ashby", atsSlug: "fluidstack" },

  // ashby — analytics & security
  { name: "Singular", domain: "singular.net", careersUrl: "https://www.singular.net/careers", atsType: "ashby", atsSlug: "singular" },
  { name: "Oligo Security", domain: "oligo.security", careersUrl: "https://www.oligo.security/careers", atsType: "ashby", atsSlug: "oligo" },

  // ashby — edtech & health
  { name: "Cambly", domain: "cambly.com", careersUrl: "https://www.cambly.com/careers", atsType: "ashby", atsSlug: "cambly" },
  { name: "Capsule", domain: "capsule.com", careersUrl: "https://www.capsule.com/careers", atsType: "ashby", atsSlug: "capsule" },

  // lever — delivery & logistics
  { name: "Gopuff", domain: "gopuff.com", careersUrl: "https://gopuff.com/careers", atsType: "lever", atsSlug: "gopuff" },
  { name: "Turvo", domain: "turvo.com", careersUrl: "https://turvo.com/careers", atsType: "lever", atsSlug: "turvo" },
  { name: "Snappr", domain: "snappr.com", careersUrl: "https://www.snappr.com/careers", atsType: "lever", atsSlug: "snappr" },

  // lever — fintech & enterprise
  { name: "Coupa", domain: "coupa.com", careersUrl: "https://www.coupa.com/careers", atsType: "lever", atsSlug: "coupa" },
  { name: "Jeeves", domain: "tryjeeves.com", careersUrl: "https://www.tryjeeves.com/careers", atsType: "lever", atsSlug: "tryjeeves" },
  { name: "Better", domain: "better.com", careersUrl: "https://www.better.com/careers", atsType: "lever", atsSlug: "better" },

  // lever — sales & marketing
  { name: "Outreach", domain: "outreach.io", careersUrl: "https://www.outreach.io/careers", atsType: "lever", atsSlug: "outreach" },
  { name: "Kochava", domain: "kochava.com", careersUrl: "https://www.kochava.com/careers", atsType: "lever", atsSlug: "kochava" },

  // lever — legal & proptech
  { name: "Filevine", domain: "filevine.com", careersUrl: "https://www.filevine.com/careers", atsType: "lever", atsSlug: "filevine" },
  { name: "Onit", domain: "onit.com", careersUrl: "https://www.onit.com/careers", atsType: "lever", atsSlug: "onit" },
  { name: "Entrata", domain: "entrata.com", careersUrl: "https://www.entrata.com/careers", atsType: "lever", atsSlug: "entrata" },

  // lever — healthcare & gaming
  { name: "GRAIL", domain: "grail.com", careersUrl: "https://grail.com/careers", atsType: "lever", atsSlug: "grailbio" },
  { name: "NimbleRx", domain: "nimblerx.com", careersUrl: "https://www.nimblerx.com/careers", atsType: "lever", atsSlug: "nimblerx" },
  { name: "Jam City", domain: "jamcity.com", careersUrl: "https://www.jamcity.com/careers", atsType: "lever", atsSlug: "jamcity" },
  { name: "Factor", domain: "factor.com", careersUrl: "https://www.factor.com/careers", atsType: "lever", atsSlug: "factor" },

  // ── batch 15 — round 5 final push (eu tech, climate, ai, gaming) ──

  // greenhouse — eu fintech & payments
  { name: "SumUp", domain: "sumup.com", careersUrl: "https://www.sumup.com/careers", atsType: "greenhouse", atsSlug: "sumup" },
  { name: "Tide", domain: "tide.co", careersUrl: "https://www.tide.co/careers", atsType: "greenhouse", atsSlug: "tide" },
  { name: "Bitpanda", domain: "bitpanda.com", careersUrl: "https://www.bitpanda.com/careers", atsType: "greenhouse", atsSlug: "bitpanda" },

  // greenhouse — ai & generative
  { name: "Fal", domain: "fal.ai", careersUrl: "https://fal.ai/careers", atsType: "greenhouse", atsSlug: "fal" },
  { name: "Speechmatics", domain: "speechmatics.com", careersUrl: "https://www.speechmatics.com/careers", atsType: "greenhouse", atsSlug: "speechmatics" },

  // greenhouse — robotics & energy
  { name: "Kodiak", domain: "kodiak.ai", careersUrl: "https://kodiak.ai/careers", atsType: "greenhouse", atsSlug: "kodiak" },
  { name: "ESS", domain: "essinc.com", careersUrl: "https://www.essinc.com/careers", atsType: "greenhouse", atsSlug: "ess" },

  // ashby — ai & generative
  { name: "Exa", domain: "exa.ai", careersUrl: "https://exa.ai/careers", atsType: "ashby", atsSlug: "exa" },
  { name: "Meshy", domain: "meshy.ai", careersUrl: "https://www.meshy.ai/careers", atsType: "ashby", atsSlug: "meshy" },
  { name: "Ideogram", domain: "ideogram.ai", careersUrl: "https://ideogram.ai/careers", atsType: "ashby", atsSlug: "ideogram" },
  { name: "Dust", domain: "dust.tt", careersUrl: "https://dust.tt/careers", atsType: "ashby", atsSlug: "dust" },
  { name: "Relevance AI", domain: "relevanceai.com", careersUrl: "https://relevanceai.com/careers", atsType: "ashby", atsSlug: "relevanceai" },
  { name: "Granola", domain: "granola.ai", careersUrl: "https://granola.ai/careers", atsType: "ashby", atsSlug: "granola" },

  // ashby — devtools & infrastructure
  { name: "Graphite", domain: "graphite.dev", careersUrl: "https://graphite.dev/careers", atsType: "ashby", atsSlug: "graphite" },
  { name: "Twenty", domain: "twenty.com", careersUrl: "https://twenty.com/careers", atsType: "ashby", atsSlug: "twenty" },
  { name: "Freshpaint", domain: "freshpaint.io", careersUrl: "https://www.freshpaint.io/careers", atsType: "ashby", atsSlug: "freshpaint" },
  { name: "SavvyCal", domain: "savvycal.com", careersUrl: "https://savvycal.com/careers", atsType: "ashby", atsSlug: "savvy" },
  { name: "Craft", domain: "craft.do", careersUrl: "https://www.craft.do/careers", atsType: "ashby", atsSlug: "craftdocs" },

  // ashby — fintech & prediction markets
  { name: "Kalshi", domain: "kalshi.com", careersUrl: "https://kalshi.com/careers", atsType: "ashby", atsSlug: "kalshi" },
  { name: "Freetrade", domain: "freetrade.io", careersUrl: "https://freetrade.io/careers", atsType: "ashby", atsSlug: "freetrade" },
  { name: "Billie", domain: "billie.io", careersUrl: "https://www.billie.io/careers", atsType: "ashby", atsSlug: "billie" },

  // ashby — climate & energy
  { name: "Span", domain: "span.io", careersUrl: "https://www.span.io/careers", atsType: "ashby", atsSlug: "span" },
  { name: "Sylvera", domain: "sylvera.com", careersUrl: "https://www.sylvera.com/careers", atsType: "ashby", atsSlug: "sylvera" },
  { name: "Heirloom Carbon", domain: "heirloomcarbon.com", careersUrl: "https://heirloomcarbon.com/careers", atsType: "ashby", atsSlug: "heirloomcarbon" },
  { name: "Aclima", domain: "aclima.io", careersUrl: "https://www.aclima.io/careers", atsType: "ashby", atsSlug: "aclima" },

  // ashby — gaming
  { name: "Voodoo", domain: "voodoo.io", careersUrl: "https://www.voodoo.io/careers", atsType: "ashby", atsSlug: "voodoo" },
  { name: "Forto", domain: "forto.com", careersUrl: "https://www.forto.com/careers", atsType: "ashby", atsSlug: "forto" },

  // lever — fintech & eu
  { name: "Qonto", domain: "qonto.com", careersUrl: "https://qonto.com/careers", atsType: "lever", atsSlug: "qonto" },
  { name: "Wealthfront", domain: "wealthfront.com", careersUrl: "https://www.wealthfront.com/careers", atsType: "lever", atsSlug: "wealthfront" },
  { name: "Arcadia", domain: "arcadia.com", careersUrl: "https://www.arcadia.com/careers", atsType: "lever", atsSlug: "arcadia" },

  // lever — devtools & infrastructure
  { name: "Porter", domain: "porter.run", careersUrl: "https://porter.run/careers", atsType: "lever", atsSlug: "porter" },
  { name: "Trunk", domain: "trunk.io", careersUrl: "https://trunk.io/careers", atsType: "lever", atsSlug: "trunkio" },

  // lever — crypto & gaming
  { name: "Ethena", domain: "ethena.fi", careersUrl: "https://ethena.fi/careers", atsType: "lever", atsSlug: "ethena" },
  { name: "Kolibri Games", domain: "kolibrigames.com", careersUrl: "https://kolibrigames.com/careers", atsType: "lever", atsSlug: "kolibrigames" },

  // ── batch 16 — final sweep (insurtech, robotics, enterprise, travel) ──

  // greenhouse — robotics & autonomous
  { name: "Figure AI", domain: "figure.ai", careersUrl: "https://figure.ai/careers", atsType: "greenhouse", atsSlug: "figureai" },
  { name: "Agility Robotics", domain: "agilityrobotics.com", careersUrl: "https://agilityrobotics.com/careers", atsType: "greenhouse", atsSlug: "agilityrobotics" },
  { name: "Locus Robotics", domain: "locusrobotics.com", careersUrl: "https://locusrobotics.com/careers", atsType: "greenhouse", atsSlug: "locusrobotics" },

  // greenhouse — insurtech
  { name: "Ethos Life", domain: "ethoslife.com", careersUrl: "https://www.ethoslife.com/careers", atsType: "greenhouse", atsSlug: "ethoslife" },
  { name: "Pie Insurance", domain: "pieinsurance.com", careersUrl: "https://pieinsurance.com/careers", atsType: "greenhouse", atsSlug: "pieinsurance" },
  { name: "Cowbell Cyber", domain: "cowbell.insure", careersUrl: "https://cowbell.insure/careers", atsType: "greenhouse", atsSlug: "cowbellcyber" },

  // greenhouse — ai & enterprise
  { name: "Parloa", domain: "parloa.com", careersUrl: "https://www.parloa.com/careers", atsType: "greenhouse", atsSlug: "parloa" },
  { name: "BuildOps", domain: "buildops.com", careersUrl: "https://buildops.com/careers", atsType: "greenhouse", atsSlug: "buildops" },
  { name: "Incode", domain: "incode.com", careersUrl: "https://incode.com/careers", atsType: "greenhouse", atsSlug: "incode" },

  // greenhouse — data & construction
  { name: "Dremio", domain: "dremio.com", careersUrl: "https://www.dremio.com/careers", atsType: "greenhouse", atsSlug: "dremio" },
  { name: "Fieldwire", domain: "fieldwire.com", careersUrl: "https://www.fieldwire.com/careers", atsType: "greenhouse", atsSlug: "fieldwire" },
  { name: "Apaleo", domain: "apaleo.com", careersUrl: "https://apaleo.com/careers", atsType: "greenhouse", atsSlug: "apaleo" },

  // ashby — travel & insurtech
  { name: "Hopper", domain: "hopper.com", careersUrl: "https://www.hopper.com/careers", atsType: "ashby", atsSlug: "hopper" },
  { name: "Lemonade", domain: "lemonade.com", careersUrl: "https://www.lemonade.com/careers", atsType: "ashby", atsSlug: "lemonade" },
  { name: "Bestow", domain: "bestow.com", careersUrl: "https://www.bestow.com/careers", atsType: "ashby", atsSlug: "bestow" },
  { name: "Branch Insurance", domain: "ourbranch.com", careersUrl: "https://www.ourbranch.com/careers", atsType: "ashby", atsSlug: "branchinsurance" },

  // lever — data & drones
  { name: "Hevo Data", domain: "hevodata.com", careersUrl: "https://hevodata.com/careers", atsType: "lever", atsSlug: "hevodata" },
  { name: "DroneDeploy", domain: "dronedeploy.com", careersUrl: "https://www.dronedeploy.com/careers", atsType: "lever", atsSlug: "dronedeploy" },

  // ── batch 17 — round 7 (pos, billing, location, sales, education) ──

  // greenhouse — restaurant & fintech
  { name: "Slice", domain: "slicelife.com", careersUrl: "https://slicelife.com/careers", atsType: "greenhouse", atsSlug: "slice" },
  { name: "Proof", domain: "proof.com", careersUrl: "https://www.proof.com/careers", atsType: "greenhouse", atsSlug: "proof" },
  { name: "Metronome", domain: "metronome.com", careersUrl: "https://www.metronome.com/careers", atsType: "greenhouse", atsSlug: "metronome" },
  { name: "Radar", domain: "radar.com", careersUrl: "https://radar.com/careers", atsType: "greenhouse", atsSlug: "radar" },
  { name: "D2L", domain: "d2l.com", careersUrl: "https://www.d2l.com/careers", atsType: "greenhouse", atsSlug: "d2l" },

  // ashby — commerce & location
  { name: "Lightspeed", domain: "lightspeedhq.com", careersUrl: "https://www.lightspeedhq.com/careers", atsType: "ashby", atsSlug: "lightspeedhq" },
  { name: "Lemlist", domain: "lemlist.com", careersUrl: "https://www.lemlist.com/careers", atsType: "ashby", atsSlug: "lemlist" },
  { name: "what3words", domain: "what3words.com", careersUrl: "https://what3words.com/careers", atsType: "ashby", atsSlug: "what3words" },
  { name: "Foursquare", domain: "foursquare.com", careersUrl: "https://foursquare.com/careers", atsType: "ashby", atsSlug: "foursquare" },

  // lever — sales & recognition
  { name: "Reply", domain: "reply.io", careersUrl: "https://reply.io/careers", atsType: "lever", atsSlug: "reply" },
  { name: "Achievers", domain: "achievers.com", careersUrl: "https://www.achievers.com/careers", atsType: "lever", atsSlug: "achievers" },
  { name: "Olo", domain: "olo.com", careersUrl: "https://www.olo.com/careers", atsType: "lever", atsSlug: "olo" },

  // ── batch 18 · round 8 broad sweep (aerospace, quantum, nuclear, mobility, media, fashion) ──

  // greenhouse — aerospace & space
  { name: "SpaceX", domain: "spacex.com", careersUrl: "https://www.spacex.com/careers", atsType: "greenhouse", atsSlug: "spacex" },
  { name: "Rocket Lab", domain: "rocketlabusa.com", careersUrl: "https://www.rocketlabusa.com/careers", atsType: "greenhouse", atsSlug: "rocketlab" },
  { name: "Astranis", domain: "astranis.com", careersUrl: "https://www.astranis.com/careers", atsType: "greenhouse", atsSlug: "astranis" },
  { name: "Varda Space", domain: "varda.com", careersUrl: "https://www.varda.com/careers", atsType: "greenhouse", atsSlug: "vardaspace" },
  { name: "Capella Space", domain: "capellaspace.com", careersUrl: "https://www.capellaspace.com/careers", atsType: "greenhouse", atsSlug: "capellaspace" },

  // greenhouse — quantum & nuclear
  { name: "IonQ", domain: "ionq.com", careersUrl: "https://ionq.com/careers", atsType: "greenhouse", atsSlug: "ionq" },
  { name: "PsiQuantum", domain: "psiquantum.com", careersUrl: "https://www.psiquantum.com/careers", atsType: "greenhouse", atsSlug: "psiquantum" },
  { name: "Oklo", domain: "oklo.com", careersUrl: "https://oklo.com/careers", atsType: "greenhouse", atsSlug: "oklo" },
  { name: "Kairos Power", domain: "kairospower.com", careersUrl: "https://kairospower.com/careers", atsType: "greenhouse", atsSlug: "kairospower" },

  // greenhouse — automotive & mobility
  { name: "Lucid Motors", domain: "lucidmotors.com", careersUrl: "https://www.lucidmotors.com/careers", atsType: "greenhouse", atsSlug: "lucidmotors" },
  { name: "BYD", domain: "byd.com", careersUrl: "https://www.byd.com/careers", atsType: "greenhouse", atsSlug: "byd" },
  { name: "FreeNow", domain: "free-now.com", careersUrl: "https://www.free-now.com/careers", atsType: "greenhouse", atsSlug: "freenow" },

  // greenhouse — media & content
  { name: "Crunchyroll", domain: "crunchyroll.com", careersUrl: "https://www.crunchyroll.com/careers", atsType: "greenhouse", atsSlug: "crunchyroll" },
  { name: "Vox Media", domain: "voxmedia.com", careersUrl: "https://www.voxmedia.com/careers", atsType: "greenhouse", atsSlug: "voxmedia" },
  { name: "Axios", domain: "axios.com", careersUrl: "https://www.axios.com/careers", atsType: "greenhouse", atsSlug: "axios" },
  { name: "BuzzFeed", domain: "buzzfeed.com", careersUrl: "https://www.buzzfeed.com/careers", atsType: "greenhouse", atsSlug: "buzzfeed" },

  // greenhouse — fashion & beauty
  { name: "Stitch Fix", domain: "stitchfix.com", careersUrl: "https://www.stitchfix.com/careers", atsType: "greenhouse", atsSlug: "stitchfix" },
  { name: "Rent the Runway", domain: "renttherunway.com", careersUrl: "https://www.renttherunway.com/careers", atsType: "greenhouse", atsSlug: "renttherunway" },
  { name: "Gymshark", domain: "gymshark.com", careersUrl: "https://www.gymshark.com/careers", atsType: "greenhouse", atsSlug: "gymshark" },
  { name: "Glossier", domain: "glossier.com", careersUrl: "https://www.glossier.com/careers", atsType: "greenhouse", atsSlug: "glossier" },

  // greenhouse — health & wellness
  { name: "Oura", domain: "ouraring.com", careersUrl: "https://ouraring.com/careers", atsType: "greenhouse", atsSlug: "oura" },
  { name: "Talkspace", domain: "talkspace.com", careersUrl: "https://www.talkspace.com/careers", atsType: "greenhouse", atsSlug: "talkspace" },

  // greenhouse — agriculture & real estate
  { name: "Pivot Bio", domain: "pivotbio.com", careersUrl: "https://www.pivotbio.com/careers", atsType: "greenhouse", atsSlug: "pivotbio" },
  { name: "CoStar", domain: "costargroup.com", careersUrl: "https://www.costargroup.com/careers", atsType: "greenhouse", atsSlug: "costar" },
  { name: "Bark", domain: "bark.co", careersUrl: "https://www.bark.co/careers", atsType: "greenhouse", atsSlug: "bark" },

  // ashby — energy & deep tech
  { name: "Helion Energy", domain: "helionenergy.com", careersUrl: "https://www.helionenergy.com/careers", atsType: "ashby", atsSlug: "helion" },
  { name: "Focused Energy", domain: "focused-energy.world", careersUrl: "https://www.focused-energy.world/careers", atsType: "ashby", atsSlug: "focused" },
  { name: "Orbital", domain: "orbital.com", careersUrl: "https://orbital.com/careers", atsType: "ashby", atsSlug: "orbital" },
  { name: "Lynk", domain: "lynk.world", careersUrl: "https://lynk.world/careers", atsType: "ashby", atsSlug: "lynk" },

  // ashby — fitness & consumer
  { name: "Strava", domain: "strava.com", careersUrl: "https://www.strava.com/careers", atsType: "ashby", atsSlug: "strava" },
  { name: "BetterUp", domain: "betterup.com", careersUrl: "https://www.betterup.com/careers", atsType: "ashby", atsSlug: "betterup" },
  { name: "Quora", domain: "quora.com", careersUrl: "https://www.quora.com/careers", atsType: "ashby", atsSlug: "quora" },
  { name: "PhotoRoom", domain: "photoroom.com", careersUrl: "https://www.photoroom.com/careers", atsType: "ashby", atsSlug: "photoroom" },
  { name: "Upside", domain: "upside.com", careersUrl: "https://www.upside.com/careers", atsType: "ashby", atsSlug: "upside" },

  // lever — quantum & misc
  { name: "Rigetti", domain: "rigetti.com", careersUrl: "https://www.rigetti.com/careers", atsType: "lever", atsSlug: "rigetti" },
  { name: "Atom Computing", domain: "atom-computing.com", careersUrl: "https://www.atom-computing.com/careers", atsType: "lever", atsSlug: "atomcomputing" },
  { name: "Getty Images", domain: "gettyimages.com", careersUrl: "https://www.gettyimages.com/careers", atsType: "lever", atsSlug: "gettyimages" },
  { name: "Rover", domain: "rover.com", careersUrl: "https://www.rover.com/careers", atsType: "lever", atsSlug: "rover" },
  { name: "Arable", domain: "arable.com", careersUrl: "https://www.arable.com/careers", atsType: "lever", atsSlug: "arable" },
  { name: "Fi", domain: "tryfi.com", careersUrl: "https://www.tryfi.com/careers", atsType: "lever", atsSlug: "fi" },

  // ── batch 19 · round 9 (govtech, defense, adtech, manufacturing, privacy) ──

  // greenhouse — defense & govtech
  { name: "Anduril", domain: "anduril.com", careersUrl: "https://www.anduril.com/careers", atsType: "greenhouse", atsSlug: "andurilindustries" },
  { name: "Govini", domain: "govini.com", careersUrl: "https://govini.com/careers", atsType: "greenhouse", atsSlug: "govini" },
  { name: "Accela", domain: "accela.com", careersUrl: "https://www.accela.com/careers", atsType: "greenhouse", atsSlug: "accela" },

  // greenhouse — manufacturing & 3D printing
  { name: "Xometry", domain: "xometry.com", careersUrl: "https://www.xometry.com/careers", atsType: "greenhouse", atsSlug: "xometry" },
  { name: "Formlabs", domain: "formlabs.com", careersUrl: "https://formlabs.com/careers", atsType: "greenhouse", atsSlug: "formlabs" },
  { name: "Fictiv", domain: "fictiv.com", careersUrl: "https://www.fictiv.com/careers", atsType: "greenhouse", atsSlug: "fictiv" },
  { name: "Markforged", domain: "markforged.com", careersUrl: "https://markforged.com/careers", atsType: "greenhouse", atsSlug: "markforged" },
  { name: "Carbon", domain: "carbon3d.com", careersUrl: "https://www.carbon3d.com/careers", atsType: "greenhouse", atsSlug: "carbon" },
  { name: "Augury", domain: "augury.com", careersUrl: "https://www.augury.com/careers", atsType: "greenhouse", atsSlug: "augury" },
  { name: "Tulip", domain: "tulip.co", careersUrl: "https://tulip.co/careers", atsType: "greenhouse", atsSlug: "tulip" },

  // greenhouse — adtech & mobile
  { name: "Taboola", domain: "taboola.com", careersUrl: "https://www.taboola.com/careers", atsType: "greenhouse", atsSlug: "taboola" },
  { name: "Moloco", domain: "moloco.com", careersUrl: "https://www.moloco.com/careers", atsType: "greenhouse", atsSlug: "moloco" },
  { name: "InMobi", domain: "inmobi.com", careersUrl: "https://www.inmobi.com/careers", atsType: "greenhouse", atsSlug: "inmobi" },
  { name: "AppLovin", domain: "applovin.com", careersUrl: "https://www.applovin.com/careers", atsType: "greenhouse", atsSlug: "applovin" },
  { name: "PubMatic", domain: "pubmatic.com", careersUrl: "https://pubmatic.com/careers", atsType: "greenhouse", atsSlug: "pubmatic" },
  { name: "TripleLift", domain: "triplelift.com", careersUrl: "https://triplelift.com/careers", atsType: "greenhouse", atsSlug: "triplelift" },
  { name: "Liftoff", domain: "liftoff.io", careersUrl: "https://liftoff.io/careers", atsType: "greenhouse", atsSlug: "liftoff" },
  { name: "Kargo", domain: "kargo.com", careersUrl: "https://www.kargo.com/careers", atsType: "greenhouse", atsSlug: "kargo" },

  // greenhouse — fleet & logistics
  { name: "Motive", domain: "gomotive.com", careersUrl: "https://gomotive.com/careers", atsType: "greenhouse", atsSlug: "gomotive" },
  { name: "Geotab", domain: "geotab.com", careersUrl: "https://www.geotab.com/careers", atsType: "greenhouse", atsSlug: "geotab" },
  { name: "Platform Science", domain: "platformscience.com", careersUrl: "https://www.platformscience.com/careers", atsType: "greenhouse", atsSlug: "platformscience" },

  // greenhouse — privacy & compliance
  { name: "OneTrust", domain: "onetrust.com", careersUrl: "https://www.onetrust.com/careers", atsType: "greenhouse", atsSlug: "onetrust" },
  { name: "BigID", domain: "bigid.com", careersUrl: "https://bigid.com/careers", atsType: "greenhouse", atsSlug: "bigid" },
  { name: "Osano", domain: "osano.com", careersUrl: "https://www.osano.com/careers", atsType: "greenhouse", atsSlug: "osano" },

  // greenhouse — payments & events
  { name: "TransferGo", domain: "transfergo.com", careersUrl: "https://www.transfergo.com/careers", atsType: "greenhouse", atsSlug: "transfergo" },
  { name: "Swoogo", domain: "swoogo.com", careersUrl: "https://swoogo.com/careers", atsType: "greenhouse", atsSlug: "swoogo" },
  { name: "BrightHire", domain: "brighthire.com", careersUrl: "https://brighthire.com/careers", atsType: "greenhouse", atsSlug: "brighthire" },
  { name: "Clearway Energy", domain: "clearwayenergy.com", careersUrl: "https://www.clearwayenergy.com/careers", atsType: "greenhouse", atsSlug: "clearway" },

  // ashby — defense & insurance
  { name: "Applied Systems", domain: "appliedsystems.com", careersUrl: "https://www.appliedsystems.com/careers", atsType: "ashby", atsSlug: "applied" },
  { name: "Kin Insurance", domain: "kininsurance.com", careersUrl: "https://www.kininsurance.com/careers", atsType: "ashby", atsSlug: "kin" },
  { name: "Cape Analytics", domain: "capeanalytics.com", careersUrl: "https://capeanalytics.com/careers", atsType: "ashby", atsSlug: "cape" },
  { name: "Tractable", domain: "tractable.ai", careersUrl: "https://tractable.ai/careers", atsType: "ashby", atsSlug: "tractable" },

  // ashby — adtech & recruiting
  { name: "Paradox", domain: "paradox.ai", careersUrl: "https://www.paradox.ai/careers", atsType: "ashby", atsSlug: "paradox" },
  { name: "Permutive", domain: "permutive.com", careersUrl: "https://permutive.com/careers", atsType: "ashby", atsSlug: "permutive" },
  { name: "Primer", domain: "primer.ai", careersUrl: "https://primer.ai/careers", atsType: "ashby", atsSlug: "primer" },
  { name: "Beamery", domain: "beamery.com", careersUrl: "https://beamery.com/careers", atsType: "ashby", atsSlug: "beamery" },

  // lever — defense & manufacturing
  { name: "Shield AI", domain: "shield.ai", careersUrl: "https://shield.ai/careers", atsType: "lever", atsSlug: "shieldai" },
  { name: "Protolabs", domain: "protolabs.com", careersUrl: "https://www.protolabs.com/careers", atsType: "lever", atsSlug: "protolabs" },
  { name: "Velo3D", domain: "velo3d.com", careersUrl: "https://velo3d.com/careers", atsType: "lever", atsSlug: "velo3d" },
  { name: "Ogury", domain: "ogury.com", careersUrl: "https://ogury.com/careers", atsType: "lever", atsSlug: "ogury" },
  { name: "Sonatype", domain: "sonatype.com", careersUrl: "https://www.sonatype.com/careers", atsType: "lever", atsSlug: "sonatype" },
  { name: "Voltus", domain: "voltus.co", careersUrl: "https://www.voltus.co/careers", atsType: "lever", atsSlug: "voltus" },
  { name: "Immuta", domain: "immuta.com", careersUrl: "https://www.immuta.com/careers", atsType: "lever", atsSlug: "immuta" },

  // ── batch 20 · round 10 (autonomous vehicles, AI chips, enterprise, consumer fintech) ──

  // greenhouse — autonomous vehicles
  { name: "Waymo", domain: "waymo.com", careersUrl: "https://waymo.com/careers", atsType: "greenhouse", atsSlug: "waymo" },
  { name: "Motional", domain: "motional.com", careersUrl: "https://motional.com/careers", atsType: "greenhouse", atsSlug: "motional" },
  { name: "Nuro", domain: "nuro.ai", careersUrl: "https://www.nuro.ai/careers", atsType: "greenhouse", atsSlug: "nuro" },

  // greenhouse — AI chips & photonics
  { name: "Tenstorrent", domain: "tenstorrent.com", careersUrl: "https://tenstorrent.com/careers", atsType: "greenhouse", atsSlug: "tenstorrent" },
  { name: "Lightmatter", domain: "lightmatter.co", careersUrl: "https://lightmatter.co/careers", atsType: "greenhouse", atsSlug: "lightmatter" },

  // greenhouse — enterprise & fintech
  { name: "Celonis", domain: "celonis.com", careersUrl: "https://www.celonis.com/careers", atsType: "greenhouse", atsSlug: "celonis" },
  { name: "Credit Karma", domain: "creditkarma.com", careersUrl: "https://www.creditkarma.com/careers", atsType: "greenhouse", atsSlug: "creditkarma" },
  { name: "Rocket Money", domain: "rocketmoney.com", careersUrl: "https://www.rocketmoney.com/careers", atsType: "greenhouse", atsSlug: "truebill" },
  { name: "Blumira", domain: "blumira.com", careersUrl: "https://www.blumira.com/careers", atsType: "greenhouse", atsSlug: "blumira" },

  // ashby — automation & consumer
  { name: "UiPath", domain: "uipath.com", careersUrl: "https://www.uipath.com/careers", atsType: "ashby", atsSlug: "uipath" },
  { name: "Arlo", domain: "arlo.com", careersUrl: "https://www.arlo.com/careers", atsType: "ashby", atsSlug: "arlo" },
  { name: "Acorns", domain: "acorns.com", careersUrl: "https://www.acorns.com/careers", atsType: "ashby", atsSlug: "acorns" },
  { name: "Raspberry Pi", domain: "raspberrypi.com", careersUrl: "https://www.raspberrypi.com/careers", atsType: "ashby", atsSlug: "raspberry" },

  // lever — autonomous & solar
  { name: "Zoox", domain: "zoox.com", careersUrl: "https://zoox.com/careers", atsType: "lever", atsSlug: "zoox" },
  { name: "Omnidian", domain: "omnidian.com", careersUrl: "https://omnidian.com/careers", atsType: "lever", atsSlug: "omnidian" },

  // ── batch 21 · round 11 (autonomous, social) ──
  { name: "Aurora Innovation", domain: "aurora.tech", careersUrl: "https://aurora.tech/careers", atsType: "greenhouse", atsSlug: "aurorainnovation" },
  { name: "Bumble", domain: "bumble.com", careersUrl: "https://bumble.com/careers", atsType: "lever", atsSlug: "bumbleinc" },

  // ── batch 22 · round 12 (API tools, AR, AI, fintech) ──

  // greenhouse — API & AR
  { name: "Postman", domain: "postman.com", careersUrl: "https://www.postman.com/careers", atsType: "greenhouse", atsSlug: "postman" },
  { name: "Magic Leap", domain: "magicleap.com", careersUrl: "https://www.magicleap.com/careers", atsType: "greenhouse", atsSlug: "magicleap" },
  { name: "Figure Technologies", domain: "figure.com", careersUrl: "https://www.figure.com/careers", atsType: "greenhouse", atsSlug: "figure" },

  // ashby — AI & community
  { name: "Common Room", domain: "commonroom.io", careersUrl: "https://www.commonroom.io/careers", atsType: "ashby", atsSlug: "commonroom" },
  { name: "LlamaIndex", domain: "llamaindex.ai", careersUrl: "https://www.llamaindex.ai/careers", atsType: "ashby", atsSlug: "llamaindex" },
  { name: "Laurel", domain: "laurel.ai", careersUrl: "https://laurel.ai/careers", atsType: "ashby", atsSlug: "laurel" },
  { name: "Abound", domain: "abound.com", careersUrl: "https://www.abound.com/careers", atsType: "ashby", atsSlug: "abound" },

  // lever — lending
  { name: "Prosper", domain: "prosper.com", careersUrl: "https://www.prosper.com/careers", atsType: "lever", atsSlug: "prosper" },

  // ── batch 23 · final push (marketplace, health, AI, enterprise) ──

  // greenhouse — consumer & marketplace
  { name: "DoorDash", domain: "doordash.com", careersUrl: "https://careers.doordash.com", atsType: "greenhouse", atsSlug: "doordashusa" },
  { name: "Thumbtack", domain: "thumbtack.com", careersUrl: "https://www.thumbtack.com/careers", atsType: "greenhouse", atsSlug: "thumbtack" },
  { name: "TaskRabbit", domain: "taskrabbit.com", careersUrl: "https://www.taskrabbit.com/careers", atsType: "greenhouse", atsSlug: "taskrabbit" },
  { name: "Angi", domain: "angi.com", careersUrl: "https://www.angi.com/careers", atsType: "greenhouse", atsSlug: "angi" },
  { name: "Instawork", domain: "instawork.com", careersUrl: "https://www.instawork.com/careers", atsType: "greenhouse", atsSlug: "instawork" },
  { name: "ZocDoc", domain: "zocdoc.com", careersUrl: "https://www.zocdoc.com/careers", atsType: "greenhouse", atsSlug: "zocdoc" },
  { name: "Care.com", domain: "care.com", careersUrl: "https://www.care.com/careers", atsType: "greenhouse", atsSlug: "carecom" },

  // ashby — health & enterprise
  { name: "Sesame", domain: "sesamecare.com", careersUrl: "https://sesamecare.com/careers", atsType: "ashby", atsSlug: "sesame" },
  { name: "Demandbase", domain: "demandbase.com", careersUrl: "https://www.demandbase.com/careers", atsType: "ashby", atsSlug: "demandbase" },
  { name: "ShiftKey", domain: "shiftkey.com", careersUrl: "https://www.shiftkey.com/careers", atsType: "ashby", atsSlug: "shiftkey" },

  // lever — identity
  { name: "JumpCloud", domain: "jumpcloud.com", careersUrl: "https://jumpcloud.com/careers", atsType: "lever", atsSlug: "jumpcloud" },

  // ashby — new additions
  { name: "EverAI", domain: "everai.com", careersUrl: "https://everai.com/careers", atsType: "ashby", atsSlug: "everai" },
  { name: "Vanta", domain: "vanta.com", careersUrl: "https://www.vanta.com/careers", atsType: "ashby", atsSlug: "vanta" },
  { name: "Stytch", domain: "stytch.com", careersUrl: "https://stytch.com/careers", atsType: "ashby", atsSlug: "stytch" },
  { name: "Modern Treasury", domain: "moderntreasury.com", careersUrl: "https://www.moderntreasury.com/careers", atsType: "ashby", atsSlug: "moderntreasury" },
  { name: "incident.io", domain: "incident.io", careersUrl: "https://incident.io/careers", atsType: "ashby", atsSlug: "incident" },
  { name: "Ramp", domain: "ramp.com", careersUrl: "https://ramp.com/careers", atsType: "ashby", atsSlug: "ramp" },
  { name: "Suno", domain: "suno.com", careersUrl: "https://suno.com/careers", atsType: "ashby", atsSlug: "suno" },
  { name: "Harvey AI", domain: "harvey.ai", careersUrl: "https://www.harvey.ai/careers", atsType: "ashby", atsSlug: "harvey" },
  { name: "Cognition", domain: "cognition.ai", careersUrl: "https://www.cognition.ai/careers", atsType: "ashby", atsSlug: "cognition" },
  { name: "Ashby", domain: "ashbyhq.com", careersUrl: "https://www.ashbyhq.com/careers", atsType: "ashby", atsSlug: "ashby" },

  // greenhouse — new additions
  { name: "Fingerprint", domain: "fingerprint.com", careersUrl: "https://fingerprint.com/careers/", atsType: "greenhouse", atsSlug: "fingerprint" },

  // gem — 4th ats
  { name: "Bluesky", domain: "bsky.social", careersUrl: "https://jobs.gem.com/bluesky", atsType: "gem", atsSlug: "bluesky" },
  { name: "CodeSignal", domain: "codesignal.com", careersUrl: "https://jobs.gem.com/codesignal", atsType: "gem", atsSlug: "codesignal" },
  { name: "Genspark", domain: "genspark.ai", careersUrl: "https://jobs.gem.com/genspark", atsType: "gem", atsSlug: "genspark" },
  { name: "Gem", domain: "gem.com", careersUrl: "https://jobs.gem.com/gem", atsType: "gem", atsSlug: "gem" },
  { name: "Bilt Rewards", domain: "bilt.com", careersUrl: "https://jobs.gem.com/bilt", atsType: "gem", atsSlug: "bilt" },
  { name: "Luma AI", domain: "lumalabs.ai", careersUrl: "https://jobs.gem.com/lumalabs-ai", atsType: "gem", atsSlug: "lumalabs-ai" },
  { name: "Superblocks", domain: "superblocks.com", careersUrl: "https://jobs.gem.com/superblocks", atsType: "gem", atsSlug: "superblocks" },
  { name: "sennder", domain: "sennder.com", careersUrl: "https://jobs.gem.com/senndertechnologies-gmbh", atsType: "gem", atsSlug: "senndertechnologies-gmbh" },
  { name: "BioRender", domain: "biorender.com", careersUrl: "https://jobs.gem.com/biorender", atsType: "gem", atsSlug: "biorender" },
  { name: "Eliza", domain: "eliza.com", careersUrl: "https://jobs.gem.com/eliza", atsType: "gem", atsSlug: "eliza" },
  { name: "Agora", domain: "agora.io", careersUrl: "https://jobs.gem.com/agora", atsType: "gem", atsSlug: "agora" },
  { name: "Nue", domain: "nue.io", careersUrl: "https://jobs.gem.com/nue", atsType: "gem", atsSlug: "nue" },
  { name: "Inception AI", domain: "inceptionlabs.ai", careersUrl: "https://jobs.gem.com/inception", atsType: "gem", atsSlug: "inception" },
  { name: "Nominal", domain: "nominal.io", careersUrl: "https://jobs.gem.com/nominal", atsType: "gem", atsSlug: "nominal" },
  { name: "Letter AI", domain: "letter.ai", careersUrl: "https://jobs.gem.com/letter-ai", atsType: "gem", atsSlug: "letter-ai" },
  { name: "Roamless", domain: "roamless.com", careersUrl: "https://jobs.gem.com/roamless", atsType: "gem", atsSlug: "roamless" },
  { name: "Nuvo", domain: "getnuvo.com", careersUrl: "https://jobs.gem.com/nuvo", atsType: "gem", atsSlug: "nuvo" },
  { name: "Index Exchange", domain: "indexexchange.com", careersUrl: "https://jobs.gem.com/index-exchange", atsType: "gem", atsSlug: "index-exchange" },
  { name: "CloudRaft", domain: "cloudraft.io", careersUrl: "https://jobs.gem.com/cloudraft", atsType: "gem", atsSlug: "cloudraft" },

  // imported 2026-03-14 (harvest-ats.ts)
  { name: "Multiplier",       domain: "usemultiplier.com",     careersUrl: "https://jobs.gem.com/multiplierhq",            atsType: "gem", atsSlug: "multiplierhq" },

  // remote-first batch — verified slugs
  { name: "Velocity Global", domain: "velocityglobal.com", careersUrl: "https://velocityglobal.com/careers/", atsType: "lever", atsSlug: "velocityglobal" },
  { name: "Rula", domain: "rula.com", careersUrl: "https://www.rula.com/careers", atsType: "ashby", atsSlug: "rula" },
  { name: "Semgrep", domain: "semgrep.dev", careersUrl: "https://semgrep.dev/careers", atsType: "ashby", atsSlug: "semgrep" },
  { name: "Coalesce", domain: "coalesce.io", careersUrl: "https://coalesce.io/careers/", atsType: "ashby", atsSlug: "coalesce" },

  // ashby — remoteintech batch (verified 2025-03)
  { name: "AirGarage",     domain: "airgarage.com",     careersUrl: "https://jobs.ashbyhq.com/airgarage",     atsType: "ashby", atsSlug: "airgarage" },
  { name: "Alan",           domain: "alan.com",           careersUrl: "https://jobs.ashbyhq.com/alan",           atsType: "ashby", atsSlug: "alan" },
  { name: "Envoy",          domain: "envoy.com",          careersUrl: "https://jobs.ashbyhq.com/envoy",          atsType: "ashby", atsSlug: "envoy" },
  { name: "Firecrawl",      domain: "firecrawl.dev",      careersUrl: "https://jobs.ashbyhq.com/firecrawl",      atsType: "ashby", atsSlug: "firecrawl" },
  { name: "Flatfile",       domain: "flatfile.com",       careersUrl: "https://jobs.ashbyhq.com/flatfile",       atsType: "ashby", atsSlug: "flatfile" },
  { name: "Gridium",        domain: "gridium.com",        careersUrl: "https://jobs.ashbyhq.com/gridium",        atsType: "ashby", atsSlug: "gridium" },
  { name: "Gruntwork",      domain: "gruntwork.io",       careersUrl: "https://jobs.ashbyhq.com/gruntwork",      atsType: "ashby", atsSlug: "gruntwork" },
  { name: "JOOR",           domain: "joor.com",           careersUrl: "https://jobs.ashbyhq.com/joor",           atsType: "ashby", atsSlug: "joor" },
  { name: "Kindred",        domain: "kindred.com",        careersUrl: "https://jobs.ashbyhq.com/kindred",        atsType: "ashby", atsSlug: "kindred" },
  { name: "Lifen",          domain: "lifen.com",          careersUrl: "https://jobs.ashbyhq.com/lifen",          atsType: "ashby", atsSlug: "lifen" },
  { name: "Luxor",          domain: "luxor.tech",         careersUrl: "https://jobs.ashbyhq.com/luxor",          atsType: "ashby", atsSlug: "luxor" },
  { name: "MeridianLink",   domain: "meridianlink.com",   careersUrl: "https://jobs.ashbyhq.com/meridianlink",   atsType: "ashby", atsSlug: "meridianlink" },
  { name: "Mural",          domain: "mural.co",           careersUrl: "https://jobs.ashbyhq.com/mural",          atsType: "ashby", atsSlug: "mural" },
  { name: "Nuna",           domain: "nuna.com",           careersUrl: "https://jobs.ashbyhq.com/nuna",           atsType: "ashby", atsSlug: "nuna" },
  { name: "PayScale",       domain: "payscale.com",       careersUrl: "https://jobs.ashbyhq.com/payscale",       atsType: "ashby", atsSlug: "payscale" },
  { name: "Prelude",        domain: "prelude.co",         careersUrl: "https://jobs.ashbyhq.com/prelude",        atsType: "ashby", atsSlug: "prelude" },
  { name: "Sticker Mule",   domain: "stickermule.com",    careersUrl: "https://jobs.ashbyhq.com/stickermule",    atsType: "ashby", atsSlug: "stickermule" },
  { name: "Browserbase",    domain: "browserbase.com",    careersUrl: "https://jobs.ashbyhq.com/browserbase",    atsType: "ashby", atsSlug: "browserbase" },
  { name: "Truelogic",      domain: "truelogic.io",       careersUrl: "https://jobs.ashbyhq.com/truelogic",      atsType: "ashby", atsSlug: "truelogic" },
  { name: "Virta Health",   domain: "virtahealth.com",    careersUrl: "https://jobs.ashbyhq.com/virtahealth",    atsType: "ashby", atsSlug: "virtahealth" },
  { name: "YAZIO",          domain: "yazio.com",          careersUrl: "https://jobs.ashbyhq.com/yazio",          atsType: "ashby", atsSlug: "yazio" },

  // lever — remoteintech batch (verified 2025-03)
  { name: "90 Seconds",       domain: "90seconds.com",       careersUrl: "https://jobs.lever.co/90seconds",       atsType: "lever", atsSlug: "90seconds" },
  { name: "Aerostrat",        domain: "aerostrat.com",       careersUrl: "https://jobs.lever.co/aerostrat",       atsType: "lever", atsSlug: "aerostrat" },
  { name: "Anomali",          domain: "anomali.com",         careersUrl: "https://jobs.lever.co/anomali",         atsType: "lever", atsSlug: "anomali" },
  { name: "Appen",            domain: "appen.com",           careersUrl: "https://jobs.lever.co/appen",           atsType: "lever", atsSlug: "appen" },
  { name: "BlueCat Networks",  domain: "bluecatnetworks.com", careersUrl: "https://jobs.lever.co/bluecatnetworks", atsType: "lever", atsSlug: "bluecatnetworks" },
  { name: "Bounteous",        domain: "bounteous.com",       careersUrl: "https://jobs.lever.co/bounteous",       atsType: "lever", atsSlug: "bounteous" },
  { name: "BriteCore",        domain: "britecore.com",       careersUrl: "https://jobs.lever.co/britecore",       atsType: "lever", atsSlug: "britecore" },
  { name: "CareMessage",      domain: "caremessage.org",     careersUrl: "https://jobs.lever.co/caremessage",     atsType: "lever", atsSlug: "caremessage" },
  { name: "Coforma",          domain: "coforma.io",          careersUrl: "https://jobs.lever.co/coforma",         atsType: "lever", atsSlug: "coforma" },
  { name: "Collabora",        domain: "collabora.com",       careersUrl: "https://jobs.lever.co/collabora",       atsType: "lever", atsSlug: "collabora" },
  { name: "Extreme Networks",  domain: "extremenetworks.com", careersUrl: "https://jobs.lever.co/extremenetworks", atsType: "lever", atsSlug: "extremenetworks" },
  { name: "Findem",           domain: "findem.ai",           careersUrl: "https://jobs.lever.co/findem",          atsType: "lever", atsSlug: "findem" },
  { name: "Freeletics",       domain: "freeletics.com",      careersUrl: "https://jobs.lever.co/freeletics",      atsType: "lever", atsSlug: "freeletics" },
  { name: "GoJob",            domain: "gojob.com",           careersUrl: "https://jobs.lever.co/gojob",           atsType: "lever", atsSlug: "gojob" },
  { name: "Granicus",         domain: "granicus.com",        careersUrl: "https://jobs.lever.co/granicus",        atsType: "lever", atsSlug: "granicus" },
  { name: "Graylog",          domain: "graylog.org",         careersUrl: "https://jobs.lever.co/graylog",         atsType: "lever", atsSlug: "graylog" },
  { name: "Marco Polo",       domain: "marcopolo.me",        careersUrl: "https://jobs.lever.co/marcopolo",       atsType: "lever", atsSlug: "marcopolo" },
  { name: "Mindful",          domain: "getmindful.com",      careersUrl: "https://jobs.lever.co/mindful",         atsType: "lever", atsSlug: "mindful" },
  { name: "Paytm",            domain: "paytm.com",           careersUrl: "https://jobs.lever.co/paytm",           atsType: "lever", atsSlug: "paytm" },
  { name: "Prominent Edge",   domain: "prominentedge.com",   careersUrl: "https://jobs.lever.co/prominentedge",   atsType: "lever", atsSlug: "prominentedge" },
  { name: "Rackspace",        domain: "rackspace.com",       careersUrl: "https://jobs.lever.co/rackspace",       atsType: "lever", atsSlug: "rackspace" },
  { name: "RenoFi",           domain: "renofi.com",          careersUrl: "https://jobs.lever.co/renofi",          atsType: "lever", atsSlug: "renofi" },
  { name: "Skillshare",       domain: "skillshare.com",      careersUrl: "https://jobs.lever.co/skillshare",      atsType: "lever", atsSlug: "skillshare" },
  { name: "Spreedly",         domain: "spreedly.com",        careersUrl: "https://jobs.lever.co/spreedly",        atsType: "lever", atsSlug: "spreedly" },
  { name: "Trussworks",       domain: "truss.works",         careersUrl: "https://jobs.lever.co/trussworks",      atsType: "lever", atsSlug: "trussworks" },
  { name: "WebFX",            domain: "webfx.com",           careersUrl: "https://jobs.lever.co/webfx",           atsType: "lever", atsSlug: "webfx" },

  // ashby — customers page + dictionary (verified 2025-03)
  { name: "Ironclad",            domain: "ironcladhq.com",        careersUrl: "https://jobs.ashbyhq.com/ironcladhq",       atsType: "ashby", atsSlug: "ironcladhq" },
  { name: "Deliveroo",           domain: "deliveroo.com",         careersUrl: "https://jobs.ashbyhq.com/deliveroo",        atsType: "ashby", atsSlug: "deliveroo" },
  { name: "Boomi",               domain: "boomi.com",             careersUrl: "https://jobs.ashbyhq.com/boomi",            atsType: "ashby", atsSlug: "boomi" },
  { name: "Convictional",        domain: "convictional.com",      careersUrl: "https://jobs.ashbyhq.com/convictional",     atsType: "ashby", atsSlug: "convictional" },
  { name: "Eight Sleep",         domain: "eightsleep.com",        careersUrl: "https://jobs.ashbyhq.com/eightsleep",       atsType: "ashby", atsSlug: "eightsleep" },
  { name: "HackerOne",           domain: "hackerone.com",         careersUrl: "https://jobs.ashbyhq.com/hackerone",        atsType: "ashby", atsSlug: "hackerone" },
  { name: "January",             domain: "january.com",           careersUrl: "https://jobs.ashbyhq.com/january",          atsType: "ashby", atsSlug: "january" },
  { name: "NETGEAR",             domain: "netgear.com",           careersUrl: "https://jobs.ashbyhq.com/netgear",          atsType: "ashby", atsSlug: "netgear" },
  { name: "Sequoia",             domain: "sequoiacap.com",        careersUrl: "https://jobs.ashbyhq.com/sequoia",          atsType: "ashby", atsSlug: "sequoia" },
  { name: "Cedar",               domain: "cedar.com",             careersUrl: "https://jobs.ashbyhq.com/cedar",            atsType: "ashby", atsSlug: "cedar" },
  { name: "Trainline",           domain: "trainline.com",         careersUrl: "https://jobs.ashbyhq.com/trainline",        atsType: "ashby", atsSlug: "trainline" },
  { name: "Nivoda",              domain: "nivoda.com",            careersUrl: "https://jobs.ashbyhq.com/nivoda",           atsType: "ashby", atsSlug: "nivoda" },
  { name: "Zello",               domain: "zello.com",             careersUrl: "https://jobs.ashbyhq.com/zello",            atsType: "ashby", atsSlug: "zello" },
  { name: "hyperexponential",    domain: "hyperexponential.com",  careersUrl: "https://jobs.ashbyhq.com/hyperexponential", atsType: "ashby", atsSlug: "hyperexponential" },
  { name: "Brigit",              domain: "brigit.com",            careersUrl: "https://jobs.ashbyhq.com/brigit",           atsType: "ashby", atsSlug: "brigit" },
  { name: "Worldly",             domain: "worldly.io",            careersUrl: "https://jobs.ashbyhq.com/worldly",          atsType: "ashby", atsSlug: "worldly" },
  { name: "TheyDo",              domain: "theydo.io",             careersUrl: "https://jobs.ashbyhq.com/theydo",           atsType: "ashby", atsSlug: "theydo" },
  { name: "Statista",            domain: "statista.com",          careersUrl: "https://jobs.ashbyhq.com/statista",         atsType: "ashby", atsSlug: "statista" },
  { name: "Reprise",             domain: "reprise.com",           careersUrl: "https://jobs.ashbyhq.com/reprise",          atsType: "ashby", atsSlug: "reprise" },
  { name: "Rad AI",              domain: "radai.com",             careersUrl: "https://jobs.ashbyhq.com/radai",            atsType: "ashby", atsSlug: "radai" },
  { name: "Bolt",                domain: "bolt.com",              careersUrl: "https://jobs.ashbyhq.com/bolt",             atsType: "ashby", atsSlug: "bolt" },
  { name: "Bynder",              domain: "bynder.com",            careersUrl: "https://jobs.ashbyhq.com/bynder",           atsType: "ashby", atsSlug: "bynder" },
  { name: "Dispatch",            domain: "dispatch.com",          careersUrl: "https://jobs.ashbyhq.com/dispatch",         atsType: "ashby", atsSlug: "dispatch" },
  { name: "Forge",               domain: "forge.com",             careersUrl: "https://jobs.ashbyhq.com/forge",            atsType: "ashby", atsSlug: "forge" },
  { name: "Jump",                domain: "jumptrading.com",       careersUrl: "https://jobs.ashbyhq.com/jump",             atsType: "ashby", atsSlug: "jump" },
  { name: "Layer",               domain: "layer.com",             careersUrl: "https://jobs.ashbyhq.com/layer",            atsType: "ashby", atsSlug: "layer" },
  { name: "Maple",               domain: "maple.com",             careersUrl: "https://jobs.ashbyhq.com/maple",            atsType: "ashby", atsSlug: "maple" },
  { name: "Orbit",               domain: "orbit.love",            careersUrl: "https://jobs.ashbyhq.com/orbit",            atsType: "ashby", atsSlug: "orbit" },
  { name: "Promise",             domain: "promise.com",           careersUrl: "https://jobs.ashbyhq.com/promise",          atsType: "ashby", atsSlug: "promise" },
  { name: "Proxima",             domain: "proxima.ai",            careersUrl: "https://jobs.ashbyhq.com/proxima",          atsType: "ashby", atsSlug: "proxima" },
  { name: "Pulse",               domain: "pulse.com",             careersUrl: "https://jobs.ashbyhq.com/pulse",            atsType: "ashby", atsSlug: "pulse" },
  { name: "Slope",               domain: "slope.so",              careersUrl: "https://jobs.ashbyhq.com/slope",            atsType: "ashby", atsSlug: "slope" },
  { name: "Stash",               domain: "stash.com",             careersUrl: "https://jobs.ashbyhq.com/stash",            atsType: "ashby", atsSlug: "stash" },
  { name: "Tempo",               domain: "tempo.io",              careersUrl: "https://jobs.ashbyhq.com/tempo",            atsType: "ashby", atsSlug: "tempo" },
  { name: "Vivid",               domain: "vivid.money",           careersUrl: "https://jobs.ashbyhq.com/vivid",            atsType: "ashby", atsSlug: "vivid" },
  { name: "Wander",              domain: "wander.com",            careersUrl: "https://jobs.ashbyhq.com/wander",           atsType: "ashby", atsSlug: "wander" },
  { name: "Zero",                domain: "zero.com",              careersUrl: "https://jobs.ashbyhq.com/zero",             atsType: "ashby", atsSlug: "zero" },
  { name: "Cartesia",            domain: "cartesia.ai",           careersUrl: "https://jobs.ashbyhq.com/cartesia",         atsType: "ashby", atsSlug: "cartesia" },

  // lever — dictionary batch (verified 2025-03)
  { name: "Hive",                domain: "hive.com",              careersUrl: "https://jobs.lever.co/hive",                atsType: "lever", atsSlug: "hive" },
  { name: "Mirror",              domain: "mirror.xyz",            careersUrl: "https://jobs.lever.co/mirror",              atsType: "lever", atsSlug: "mirror" },
  { name: "Plume",               domain: "plume.com",             careersUrl: "https://jobs.lever.co/plume",               atsType: "lever", atsSlug: "plume" },
  { name: "Rise",                domain: "rise.com",              careersUrl: "https://jobs.lever.co/rise",                atsType: "lever", atsSlug: "rise" },
  { name: "Signal",              domain: "signal.co",             careersUrl: "https://jobs.lever.co/signal",              atsType: "lever", atsSlug: "signal" },
  { name: "Source",              domain: "source.ag",             careersUrl: "https://jobs.lever.co/source",              atsType: "lever", atsSlug: "source" },
  { name: "Torch",               domain: "torch.io",              careersUrl: "https://jobs.lever.co/torch",               atsType: "lever", atsSlug: "torch" },

  // ashby — dictionary blast (verified 2025-03)
  { name: "Alpha",               domain: "alpha.com",             careersUrl: "https://jobs.ashbyhq.com/alpha",            atsType: "ashby", atsSlug: "alpha" },
  { name: "Base",                domain: "base.org",              careersUrl: "https://jobs.ashbyhq.com/base",             atsType: "ashby", atsSlug: "base" },
  { name: "Bridge",              domain: "bridge.xyz",            careersUrl: "https://jobs.ashbyhq.com/bridge",           atsType: "ashby", atsSlug: "bridge" },
  { name: "Canopy",              domain: "canopy.com",            careersUrl: "https://jobs.ashbyhq.com/canopy",           atsType: "ashby", atsSlug: "canopy" },
  { name: "Cascade",             domain: "cascade.io",            careersUrl: "https://jobs.ashbyhq.com/cascade",          atsType: "ashby", atsSlug: "cascade" },
  { name: "Cinder",              domain: "cinder.com",            careersUrl: "https://jobs.ashbyhq.com/cinder",           atsType: "ashby", atsSlug: "cinder" },
  { name: "Console",             domain: "console.dev",           careersUrl: "https://jobs.ashbyhq.com/console",          atsType: "ashby", atsSlug: "console" },
  { name: "Darkroom",            domain: "darkroom.tech",         careersUrl: "https://jobs.ashbyhq.com/darkroom",         atsType: "ashby", atsSlug: "darkroom" },
  { name: "Deepnote",            domain: "deepnote.com",          careersUrl: "https://jobs.ashbyhq.com/deepnote",         atsType: "ashby", atsSlug: "deepnote" },
  { name: "Echo",                domain: "echo.com",              careersUrl: "https://jobs.ashbyhq.com/echo",             atsType: "ashby", atsSlug: "echo" },
  { name: "Evolve",              domain: "evolve.com",            careersUrl: "https://jobs.ashbyhq.com/evolve",           atsType: "ashby", atsSlug: "evolve" },
  { name: "Extend",              domain: "extend.com",            careersUrl: "https://jobs.ashbyhq.com/extend",           atsType: "ashby", atsSlug: "extend" },
  { name: "Flint",               domain: "flint.com",             careersUrl: "https://jobs.ashbyhq.com/flint",            atsType: "ashby", atsSlug: "flint" },
  { name: "Flora",               domain: "flora.co",              careersUrl: "https://jobs.ashbyhq.com/flora",            atsType: "ashby", atsSlug: "flora" },
  { name: "Focal",               domain: "focal.com",             careersUrl: "https://jobs.ashbyhq.com/focal",            atsType: "ashby", atsSlug: "focal" },
  { name: "Focus",               domain: "focus.com",             careersUrl: "https://jobs.ashbyhq.com/focus",            atsType: "ashby", atsSlug: "focus" },
  { name: "Frontier",            domain: "frontier.com",          careersUrl: "https://jobs.ashbyhq.com/frontier",         atsType: "ashby", atsSlug: "frontier" },
  { name: "Fulcrum",             domain: "fulcrum.com",           careersUrl: "https://jobs.ashbyhq.com/fulcrum",          atsType: "ashby", atsSlug: "fulcrum" },
  { name: "Fullstack",           domain: "fullstack.com",         careersUrl: "https://jobs.ashbyhq.com/fullstack",        atsType: "ashby", atsSlug: "fullstack" },
  { name: "Fuse",                domain: "fuse.io",               careersUrl: "https://jobs.ashbyhq.com/fuse",             atsType: "ashby", atsSlug: "fuse" },
  { name: "Garden",              domain: "garden.io",             careersUrl: "https://jobs.ashbyhq.com/garden",           atsType: "ashby", atsSlug: "garden" },
  { name: "Glacier",             domain: "glacier.com",           careersUrl: "https://jobs.ashbyhq.com/glacier",          atsType: "ashby", atsSlug: "glacier" },
  { name: "Glide",               domain: "glideapps.com",         careersUrl: "https://jobs.ashbyhq.com/glide",            atsType: "ashby", atsSlug: "glide" },
  { name: "Glow",                domain: "glow.com",              careersUrl: "https://jobs.ashbyhq.com/glow",             atsType: "ashby", atsSlug: "glow" },
  { name: "Gravity",             domain: "gravity.com",           careersUrl: "https://jobs.ashbyhq.com/gravity",          atsType: "ashby", atsSlug: "gravity" },
  { name: "Greenlight",          domain: "greenlight.com",        careersUrl: "https://jobs.ashbyhq.com/greenlight",       atsType: "ashby", atsSlug: "greenlight" },
  { name: "Guild",               domain: "guild.com",             careersUrl: "https://jobs.ashbyhq.com/guild",            atsType: "ashby", atsSlug: "guild" },
  { name: "Handshake",           domain: "handshake.com",         careersUrl: "https://jobs.ashbyhq.com/handshake",        atsType: "ashby", atsSlug: "handshake" },
  { name: "Hawk",                domain: "hawk.ai",               careersUrl: "https://jobs.ashbyhq.com/hawk",             atsType: "ashby", atsSlug: "hawk" },
  { name: "Hazel",               domain: "hazel.co",              careersUrl: "https://jobs.ashbyhq.com/hazel",            atsType: "ashby", atsSlug: "hazel" },
  { name: "Homebase",            domain: "joinhomebase.com",      careersUrl: "https://jobs.ashbyhq.com/homebase",         atsType: "ashby", atsSlug: "homebase" },
  { name: "Hook",                domain: "hook.com",              careersUrl: "https://jobs.ashbyhq.com/hook",             atsType: "ashby", atsSlug: "hook" },
  { name: "Horizon",             domain: "horizon.io",            careersUrl: "https://jobs.ashbyhq.com/horizon",          atsType: "ashby", atsSlug: "horizon" },
  { name: "Impulse",             domain: "impulse.com",           careersUrl: "https://jobs.ashbyhq.com/impulse",          atsType: "ashby", atsSlug: "impulse" },
  { name: "Infinite",            domain: "infinite.com",          careersUrl: "https://jobs.ashbyhq.com/infinite",         atsType: "ashby", atsSlug: "infinite" },
  { name: "Kernel",              domain: "kernel.com",            careersUrl: "https://jobs.ashbyhq.com/kernel",           atsType: "ashby", atsSlug: "kernel" },
  { name: "Keystone",            domain: "keystone.com",          careersUrl: "https://jobs.ashbyhq.com/keystone",         atsType: "ashby", atsSlug: "keystone" },
  { name: "Knot",                domain: "knot.com",              careersUrl: "https://jobs.ashbyhq.com/knot",             atsType: "ashby", atsSlug: "knot" },
  { name: "Lark",                domain: "lark.com",              careersUrl: "https://jobs.ashbyhq.com/lark",             atsType: "ashby", atsSlug: "lark" },
  { name: "Lens",                domain: "lens.xyz",              careersUrl: "https://jobs.ashbyhq.com/lens",             atsType: "ashby", atsSlug: "lens" },
  { name: "Level",               domain: "level.com",             careersUrl: "https://jobs.ashbyhq.com/level",            atsType: "ashby", atsSlug: "level" },
  { name: "Light",               domain: "light.co",              careersUrl: "https://jobs.ashbyhq.com/light",            atsType: "ashby", atsSlug: "light" },
  { name: "Liquid",              domain: "liquid.com",            careersUrl: "https://jobs.ashbyhq.com/liquid",           atsType: "ashby", atsSlug: "liquid" },
  { name: "Lumen",               domain: "lumen.com",             careersUrl: "https://jobs.ashbyhq.com/lumen",            atsType: "ashby", atsSlug: "lumen" },
  { name: "Lunar",               domain: "lunar.app",             careersUrl: "https://jobs.ashbyhq.com/lunar",            atsType: "ashby", atsSlug: "lunar" },
  { name: "Method",              domain: "method.com",            careersUrl: "https://jobs.ashbyhq.com/method",           atsType: "ashby", atsSlug: "method" },
  { name: "Moment",              domain: "moment.dev",            careersUrl: "https://jobs.ashbyhq.com/moment",           atsType: "ashby", atsSlug: "moment" },
  { name: "Nucleus",             domain: "nucleus.com",           careersUrl: "https://jobs.ashbyhq.com/nucleus",          atsType: "ashby", atsSlug: "nucleus" },
  { name: "Omni",                domain: "omni.co",               careersUrl: "https://jobs.ashbyhq.com/omni",             atsType: "ashby", atsSlug: "omni" },
  { name: "Onyx",                domain: "onyx.com",              careersUrl: "https://jobs.ashbyhq.com/onyx",             atsType: "ashby", atsSlug: "onyx" },
  { name: "Opal",                domain: "opal.dev",              careersUrl: "https://jobs.ashbyhq.com/opal",             atsType: "ashby", atsSlug: "opal" },
  { name: "Output",              domain: "output.com",            careersUrl: "https://jobs.ashbyhq.com/output",           atsType: "ashby", atsSlug: "output" },
  { name: "Pearl",               domain: "pearl.com",             careersUrl: "https://jobs.ashbyhq.com/pearl",            atsType: "ashby", atsSlug: "pearl" },
  { name: "Phoenix",             domain: "phoenix.com",           careersUrl: "https://jobs.ashbyhq.com/phoenix",          atsType: "ashby", atsSlug: "phoenix" },
  { name: "Pivot",               domain: "pivot.com",             careersUrl: "https://jobs.ashbyhq.com/pivot",            atsType: "ashby", atsSlug: "pivot" },
  { name: "Playbook",            domain: "playbook.com",          careersUrl: "https://jobs.ashbyhq.com/playbook",         atsType: "ashby", atsSlug: "playbook" },
  { name: "Plot",                domain: "plot.com",              careersUrl: "https://jobs.ashbyhq.com/plot",             atsType: "ashby", atsSlug: "plot" },
  { name: "Point",               domain: "point.com",             careersUrl: "https://jobs.ashbyhq.com/point",            atsType: "ashby", atsSlug: "point" },
  { name: "Post",                domain: "post.com",              careersUrl: "https://jobs.ashbyhq.com/post",             atsType: "ashby", atsSlug: "post" },
  { name: "Prime",               domain: "prime.com",             careersUrl: "https://jobs.ashbyhq.com/prime",            atsType: "ashby", atsSlug: "prime" },
  { name: "Pure",                domain: "pure.com",              careersUrl: "https://jobs.ashbyhq.com/pure",             atsType: "ashby", atsSlug: "pure" },
  { name: "Reach",               domain: "reach.com",             careersUrl: "https://jobs.ashbyhq.com/reach",            atsType: "ashby", atsSlug: "reach" },
  { name: "Relay",               domain: "relay.com",             careersUrl: "https://jobs.ashbyhq.com/relay",            atsType: "ashby", atsSlug: "relay" },
  { name: "River",               domain: "river.com",             careersUrl: "https://jobs.ashbyhq.com/river",            atsType: "ashby", atsSlug: "river" },
  { name: "Scout",               domain: "scout.com",             careersUrl: "https://jobs.ashbyhq.com/scout",            atsType: "ashby", atsSlug: "scout" },
  { name: "Shift",               domain: "shift.com",             careersUrl: "https://jobs.ashbyhq.com/shift",            atsType: "ashby", atsSlug: "shift" },
  { name: "Silver",              domain: "silver.com",            careersUrl: "https://jobs.ashbyhq.com/silver",           atsType: "ashby", atsSlug: "silver" },
  { name: "Sphere",              domain: "sphere.com",            careersUrl: "https://jobs.ashbyhq.com/sphere",           atsType: "ashby", atsSlug: "sphere" },
  { name: "Spotlight",           domain: "spotlight.com",         careersUrl: "https://jobs.ashbyhq.com/spotlight",        atsType: "ashby", atsSlug: "spotlight" },
  { name: "Squad",               domain: "squad.com",             careersUrl: "https://jobs.ashbyhq.com/squad",            atsType: "ashby", atsSlug: "squad" },
  { name: "Stand",               domain: "stand.com",             careersUrl: "https://jobs.ashbyhq.com/stand",            atsType: "ashby", atsSlug: "stand" },
  { name: "Steel",               domain: "steel.dev",             careersUrl: "https://jobs.ashbyhq.com/steel",            atsType: "ashby", atsSlug: "steel" },
  { name: "Swap",                domain: "swap.com",              careersUrl: "https://jobs.ashbyhq.com/swap",             atsType: "ashby", atsSlug: "swap" },
  { name: "Switchboard",         domain: "switchboard.app",       careersUrl: "https://jobs.ashbyhq.com/switchboard",      atsType: "ashby", atsSlug: "switchboard" },
  { name: "Trenchant",           domain: "trenchant.com",         careersUrl: "https://jobs.ashbyhq.com/trenchant",        atsType: "ashby", atsSlug: "trenchant" },
  { name: "Turnstile",           domain: "turnstile.com",         careersUrl: "https://jobs.ashbyhq.com/turnstile",        atsType: "ashby", atsSlug: "turnstile" },
  { name: "Ultra",               domain: "ultra.com",             careersUrl: "https://jobs.ashbyhq.com/ultra",            atsType: "ashby", atsSlug: "ultra" },
  { name: "Union",               domain: "union.ai",              careersUrl: "https://jobs.ashbyhq.com/union",            atsType: "ashby", atsSlug: "union" },
  { name: "Vector",              domain: "vector.com",            careersUrl: "https://jobs.ashbyhq.com/vector",           atsType: "ashby", atsSlug: "vector" },
  { name: "Violet",              domain: "violet.io",             careersUrl: "https://jobs.ashbyhq.com/violet",           atsType: "ashby", atsSlug: "violet" },

  // lever — dictionary blast (verified 2025-03)
  { name: "Beta",                domain: "beta.com",              careersUrl: "https://jobs.lever.co/beta",                atsType: "lever", atsSlug: "beta" },
  { name: "Bloom",               domain: "bloom.com",             careersUrl: "https://jobs.lever.co/bloom",               atsType: "lever", atsSlug: "bloom" },
  { name: "Blue",                domain: "blue.com",              careersUrl: "https://jobs.lever.co/blue",                atsType: "lever", atsSlug: "blue" },
  { name: "Enable",              domain: "enable.com",            careersUrl: "https://jobs.lever.co/enable",              atsType: "lever", atsSlug: "enable" },
  { name: "Engine",              domain: "engine.com",            careersUrl: "https://jobs.lever.co/engine",              atsType: "lever", atsSlug: "engine" },
  { name: "Falcon",              domain: "falcon.io",             careersUrl: "https://jobs.lever.co/falcon",              atsType: "lever", atsSlug: "falcon" },
  { name: "Form",                domain: "form.com",              careersUrl: "https://jobs.lever.co/form",                atsType: "lever", atsSlug: "form" },
  { name: "Gate",                domain: "gate.io",               careersUrl: "https://jobs.lever.co/gate",                atsType: "lever", atsSlug: "gate" },
  { name: "Genesis",             domain: "genesis.com",           careersUrl: "https://jobs.lever.co/genesis",             atsType: "lever", atsSlug: "genesis" },
  { name: "Latch",               domain: "latch.com",             careersUrl: "https://jobs.lever.co/latch",               atsType: "lever", atsSlug: "latch" },
  { name: "Lever",               domain: "lever.co",              careersUrl: "https://jobs.lever.co/lever",               atsType: "lever", atsSlug: "lever" },
  { name: "Mega",                domain: "mega.io",               careersUrl: "https://jobs.lever.co/mega",                atsType: "lever", atsSlug: "mega" },
  { name: "Nimbus",              domain: "nimbus.com",            careersUrl: "https://jobs.lever.co/nimbus",              atsType: "lever", atsSlug: "nimbus" },
  { name: "Pattern",             domain: "pattern.com",           careersUrl: "https://jobs.lever.co/pattern",             atsType: "lever", atsSlug: "pattern" },
  { name: "Rainforest",          domain: "rainforestqa.com",      careersUrl: "https://jobs.lever.co/rainforest",          atsType: "lever", atsSlug: "rainforest" },
  { name: "Retro",               domain: "retro.app",             careersUrl: "https://jobs.lever.co/retro",               atsType: "lever", atsSlug: "retro" },
  { name: "Shadow",              domain: "shadow.tech",           careersUrl: "https://jobs.lever.co/shadow",              atsType: "lever", atsSlug: "shadow" },
  { name: "Slate",               domain: "slate.com",             careersUrl: "https://jobs.lever.co/slate",               atsType: "lever", atsSlug: "slate" },
  { name: "Snowplow",            domain: "snowplow.io",           careersUrl: "https://jobs.lever.co/snowplow",            atsType: "lever", atsSlug: "snowplow" },
  { name: "Super",               domain: "super.com",             careersUrl: "https://jobs.lever.co/super",               atsType: "lever", atsSlug: "super" },
  { name: "Syntax",              domain: "syntax.com",            careersUrl: "https://jobs.lever.co/syntax",              atsType: "lever", atsSlug: "syntax" },
  { name: "Tag",                 domain: "tag.com",               careersUrl: "https://jobs.lever.co/tag",                 atsType: "lever", atsSlug: "tag" },
  { name: "Token",               domain: "token.com",             careersUrl: "https://jobs.lever.co/token",               atsType: "lever", atsSlug: "token" },

  // ── BATCH 3 (2026-03-05) — new companies ──────────

  // greenhouse — new
  { name: "Vercel",              domain: "vercel.com",            careersUrl: "https://vercel.com/careers",                atsType: "greenhouse", atsSlug: "vercel" },
  { name: "DataCamp",            domain: "datacamp.com",          careersUrl: "https://www.datacamp.com/careers",          atsType: "greenhouse", atsSlug: "datacamp" },
  { name: "Cobo",                domain: "cobo.com",              careersUrl: "https://www.cobo.com/careers",              atsType: "greenhouse", atsSlug: "cobo" },
  { name: "Copper.co",           domain: "copper.co",             careersUrl: "https://copper.co/careers",                 atsType: "greenhouse", atsSlug: "copperco" },
  { name: "Ghost",               domain: "ghost.org",             careersUrl: "https://ghost.org/about/",                  atsType: "greenhouse", atsSlug: "ghost" },
  { name: "Paystack",            domain: "paystack.com",          careersUrl: "https://paystack.com/careers",              atsType: "greenhouse", atsSlug: "paystack" },
  { name: "Knack",               domain: "knack.com",             careersUrl: "https://www.knack.com/careers",             atsType: "greenhouse", atsSlug: "knack" },

  // ashby — new
  { name: "Plaid",               domain: "plaid.com",             careersUrl: "https://plaid.com/careers/",                atsType: "ashby", atsSlug: "plaid" },
  { name: "Roboflow",            domain: "roboflow.com",          careersUrl: "https://roboflow.com/careers",              atsType: "ashby", atsSlug: "roboflow" },
  { name: "Fleek",               domain: "fleek.xyz",             careersUrl: "https://fleek.xyz/careers",                 atsType: "ashby", atsSlug: "fleek" },
  { name: "AKASA",               domain: "akasa.com",             careersUrl: "https://www.akasa.com/careers",             atsType: "ashby", atsSlug: "akasa" },
  { name: "Bunny.net",           domain: "bunny.net",             careersUrl: "https://bunny.net/careers",                 atsType: "ashby", atsSlug: "bunny" },
  { name: "Fathom",              domain: "fathom.video",          careersUrl: "https://fathom.video/careers",              atsType: "ashby", atsSlug: "fathom" },
  { name: "Pyth Network",        domain: "pyth.network",          careersUrl: "https://pyth.network/careers",              atsType: "ashby", atsSlug: "pythnetwork" },

  // lever — new
  { name: "Neon",                domain: "neon.tech",             careersUrl: "https://neon.tech/careers",                 atsType: "lever", atsSlug: "neon" },

  // ════════════════════════════════════════════════
  // BATCH 4 — crypto/web3/devtools discovery (2026-03-05)
  // ════════════════════════════════════════════════

  // ashby — crypto/web3
  { name: "Trust Wallet",       domain: "trustwallet.com",       careersUrl: "https://trustwallet.com/careers",           atsType: "ashby", atsSlug: "trust-wallet" },
  { name: "Monad Foundation",   domain: "monad.xyz",             careersUrl: "https://monad.xyz/careers",                 atsType: "ashby", atsSlug: "monad.foundation" },
  { name: "P2P.org",            domain: "p2p.org",               careersUrl: "https://p2p.org/careers",                   atsType: "ashby", atsSlug: "p2p.org" },
  { name: "0x",                 domain: "0x.org",                careersUrl: "https://0x.org/careers",                    atsType: "ashby", atsSlug: "0x" },
  { name: "Allium",             domain: "allium.so",             careersUrl: "https://allium.so/careers",                 atsType: "ashby", atsSlug: "allium" },
  { name: "CoinTracker",        domain: "cointracker.io",        careersUrl: "https://www.cointracker.io/careers",        atsType: "ashby", atsSlug: "cointracker" },
  { name: "Partisia Blockchain", domain: "partisiablockchain.com", careersUrl: "https://partisiablockchain.com/careers",  atsType: "ashby", atsSlug: "partisiablockchain" },
  { name: "Sky Mavis",          domain: "skymavis.com",          careersUrl: "https://skymavis.com/careers",              atsType: "ashby", atsSlug: "skymavis" },
  // ashby — devtools/security
  { name: "Horizon3 AI",        domain: "horizon3.ai",           careersUrl: "https://horizon3.ai/careers",               atsType: "ashby", atsSlug: "horizon3ai" },
  { name: "SF Compute",         domain: "sfcompute.com",         careersUrl: "https://sfcompute.com/careers",             atsType: "ashby", atsSlug: "sfcompute" },

  // lever — crypto/web3
  { name: "Animoca Brands",     domain: "animocabrands.com",     careersUrl: "https://www.animocabrands.com/careers",     atsType: "lever", atsSlug: "animocabrands" },
  { name: "CertiK",             domain: "certik.com",            careersUrl: "https://www.certik.com/careers",            atsType: "lever", atsSlug: "certik" },
  { name: "Crypto.com",         domain: "crypto.com",            careersUrl: "https://crypto.com/careers",                atsType: "lever", atsSlug: "crypto" },
  { name: "Sei Labs",           domain: "sei.io",                careersUrl: "https://sei.io/careers",                    atsType: "lever", atsSlug: "SeiLabs" },
  { name: "Merkle Science",     domain: "merklescience.com",     careersUrl: "https://merklescience.com/careers",         atsType: "lever", atsSlug: "merklescience" },
  { name: "InfStones",          domain: "infstones.com",         careersUrl: "https://infstones.com/careers",             atsType: "lever", atsSlug: "infstones" },
  { name: "Veda Tech Labs",     domain: "veda.tech",             careersUrl: "https://veda.tech/careers",                 atsType: "lever", atsSlug: "vedatechlabs" },
  { name: "Crypto Banter",      domain: "cryptobanter.com",      careersUrl: "https://cryptobanter.com/careers",          atsType: "lever", atsSlug: "crypto-banter" },

  // workable — new
  { name: "GetResponse",        domain: "getresponse.com",       careersUrl: "https://www.getresponse.com/about-us/careers", atsType: "workable", atsSlug: "getresponse" },
  { name: "Driftrock",          domain: "driftrock.com",         careersUrl: "https://www.driftrock.com/careers",         atsType: "workable", atsSlug: "driftrock" },

  // ════════════════════════════════════════════════
  // SMARTRECRUITERS — api.smartrecruiters.com/v1/companies/{slug}/postings
  // ════════════════════════════════════════════════
  { name: "Wise",                domain: "wise.com",              careersUrl: "https://www.wise.jobs/",                    atsType: "smartrecruiters", atsSlug: "wise" },
  { name: "Canva",               domain: "canva.com",             careersUrl: "https://www.canva.com/careers/",            atsType: "smartrecruiters", atsSlug: "canva" },
  { name: "Visa",                domain: "visa.com",              careersUrl: "https://usa.visa.com/careers.html",         atsType: "smartrecruiters", atsSlug: "visa" },
  { name: "CERN",                domain: "home.cern",             careersUrl: "https://careers.cern/",                     atsType: "smartrecruiters", atsSlug: "cern" },
  { name: "DocuSign",            domain: "docusign.com",          careersUrl: "https://www.docusign.com/careers",          atsType: "smartrecruiters", atsSlug: "docusign" },
  { name: "SmartRecruiters",     domain: "smartrecruiters.com",   careersUrl: "https://www.smartrecruiters.com/careers",   atsType: "smartrecruiters", atsSlug: "smartrecruiters" },

  // imported 2026-03-14 (harvest-ats.ts)
  { name: "Unleash",            domain: "getunleash.io",         careersUrl: "https://jobs.smartrecruiters.com/unleash",     atsType: "smartrecruiters", atsSlug: "unleash" },
  { name: "BigCommerce",        domain: "bigcommerce.com",       careersUrl: "https://jobs.smartrecruiters.com/bigcommerce", atsType: "smartrecruiters", atsSlug: "bigcommerce" },

  // imported 2026-03-14 (discover-sr-workable.ts)
  { name: "Delivery Hero",     domain: "deliveryhero.com",      careersUrl: "https://jobs.smartrecruiters.com/deliveryhero",  atsType: "smartrecruiters", atsSlug: "deliveryhero" },
  { name: "Freshworks",        domain: "freshworks.com",        careersUrl: "https://jobs.smartrecruiters.com/freshworks",    atsType: "smartrecruiters", atsSlug: "freshworks" },
  { name: "Thales",            domain: "thales.com",            careersUrl: "https://jobs.smartrecruiters.com/thales",        atsType: "smartrecruiters", atsSlug: "thales" },
  { name: "Dataiku",           domain: "dataiku.com",           careersUrl: "https://jobs.smartrecruiters.com/dataiku",       atsType: "smartrecruiters", atsSlug: "dataiku" },

  // ════════════════════════════════════════════════
  // WORKABLE — apply.workable.com/api/v1/widget/accounts/{slug}
  // ════════════════════════════════════════════════
  { name: "Hugging Face",        domain: "huggingface.co",        careersUrl: "https://huggingface.co/jobs",               atsType: "workable", atsSlug: "huggingface" },

  // imported 2026-03-10 (remoteintech scan)
  { name: "Zyte",               domain: "zyte.com",              careersUrl: "https://apply.workable.com/zyte",           atsType: "workable", atsSlug: "zyte" },
  { name: "DevSquad",           domain: "devsquad.com",          careersUrl: "https://apply.workable.com/devsquad",       atsType: "workable", atsSlug: "devsquad" },
];

/** number of companies we actually scrape (excludes custom) */
export const SCRAPED_COMPANY_COUNT = REMOTE_COMPANIES.filter(
  (c) => c.atsType !== "custom",
).length;
