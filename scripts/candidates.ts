/**
 * Candidate companies for ATS discovery.
 * Sourced from known remote-first directories, tech company lists, and crypto/web3 ecosystems.
 * The discover script will probe each for Greenhouse/Lever/Ashby APIs.
 */

export interface Candidate {
  name: string;
  domain: string;
  /** Optional slug hints if the ATS slug differs from the domain name */
  slugHints?: string[];
}

export const CANDIDATES: Candidate[] = [
  // Developer Tools & Infrastructure
  { name: "Fly.io", domain: "fly.io" },
  { name: "Deno", domain: "deno.com" },
  { name: "Bun", domain: "bun.sh" },
  { name: "Turso", domain: "turso.tech" },
  { name: "Zed", domain: "zed.dev" },
  { name: "Expo", domain: "expo.dev" },
  { name: "Pulumi", domain: "pulumi.com" },
  { name: "Hasura", domain: "hasura.io" },
  { name: "Fauna", domain: "fauna.com" },
  { name: "Appsmith", domain: "appsmith.com" },
  { name: "Directus", domain: "directus.io" },
  { name: "Medusa", domain: "medusajs.com", slugHints: ["medusa", "medusajs"] },
  { name: "Payload CMS", domain: "payloadcms.com", slugHints: ["payload", "payloadcms"] },
  { name: "Nx", domain: "nx.dev", slugHints: ["nrwl", "nx"] },
  { name: "Prisma", domain: "prisma.io" },
  { name: "Tinybird", domain: "tinybird.co" },
  { name: "EdgeDB", domain: "edgedb.com" },
  { name: "SurrealDB", domain: "surrealdb.com" },
  { name: "TimescaleDB", domain: "timescale.com", slugHints: ["timescale", "timescaledb"] },
  { name: "QuestDB", domain: "questdb.io" },
  { name: "Qdrant", domain: "qdrant.tech" },
  { name: "Chroma", domain: "trychroma.com", slugHints: ["chroma", "trychroma"] },
  { name: "LangChain", domain: "langchain.com" },
  { name: "LlamaIndex", domain: "llamaindex.ai" },
  { name: "Weights & Biases", domain: "wandb.ai", slugHints: ["wandb", "weightsandbiases"] },
  { name: "Neptune.ai", domain: "neptune.ai" },
  { name: "Voxel51", domain: "voxel51.com" },
  { name: "Hugging Face", domain: "huggingface.co", slugHints: ["huggingface", "hugging-face"] },
  { name: "Together AI", domain: "together.ai", slugHints: ["together", "togetherai", "together-ai"] },
  { name: "Fireworks AI", domain: "fireworks.ai", slugHints: ["fireworks", "fireworksai"] },
  { name: "Groq", domain: "groq.com" },
  { name: "Perplexity", domain: "perplexity.ai" },
  { name: "Stability AI", domain: "stability.ai", slugHints: ["stability", "stabilityai"] },
  { name: "Runway", domain: "runwayml.com", slugHints: ["runway", "runwayml"] },
  { name: "Midjourney", domain: "midjourney.com" },
  { name: "Jasper AI", domain: "jasper.ai", slugHints: ["jasper", "jasperai"] },
  { name: "Copy.ai", domain: "copy.ai", slugHints: ["copyai", "copy-ai"] },

  // SaaS & Productivity
  { name: "Coda", domain: "coda.io" },
  { name: "Monday.com", domain: "monday.com" },
  { name: "Obsidian", domain: "obsidian.md" },
  { name: "Luma", domain: "lu.ma", slugHints: ["luma", "lu-ma"] },
  { name: "Pitch", domain: "pitch.com" },
  { name: "Miro", domain: "miro.com" },
  { name: "Canva", domain: "canva.com" },
  { name: "Zeplin", domain: "zeplin.io" },
  { name: "Framer", domain: "framer.com" },
  { name: "Hashnode", domain: "hashnode.com" },
  { name: "Cal.com", domain: "cal.com", slugHints: ["calcom", "cal-com", "cal"] },
  { name: "SavvyCal", domain: "savvycal.com" },
  { name: "Riverside.fm", domain: "riverside.fm", slugHints: ["riverside", "riversidefm"] },
  { name: "Krisp", domain: "krisp.ai" },
  { name: "Grain", domain: "grain.com" },
  { name: "Fireflies.ai", domain: "fireflies.ai", slugHints: ["fireflies", "firefliesai"] },
  { name: "Gong", domain: "gong.io" },
  { name: "Clari", domain: "clari.com" },

  // Fintech & Payments
  { name: "Wise", domain: "wise.com", slugHints: ["wise", "transferwise"] },
  { name: "Revolut", domain: "revolut.com" },
  { name: "N26", domain: "n26.com" },
  { name: "Mollie", domain: "mollie.com" },
  { name: "Rapyd", domain: "rapyd.net" },
  { name: "dLocal", domain: "dlocal.com" },
  { name: "Airwallex", domain: "airwallex.com" },
  { name: "Nuvei", domain: "nuvei.com" },
  { name: "Checkout.com", domain: "checkout.com", slugHints: ["checkout", "checkoutcom"] },
  { name: "Remitly", domain: "remitly.com" },
  { name: "Flywire", domain: "flywire.com" },
  { name: "Parafin", domain: "parafin.com" },
  { name: "Column", domain: "column.com" },
  { name: "Moov", domain: "moov.io" },
  { name: "Modern Treasury", domain: "moderntreasury.com", slugHints: ["moderntreasury", "modern-treasury"] },
  { name: "Increase", domain: "increase.com" },
  { name: "Unit", domain: "unit.co" },
  { name: "Treasury Prime", domain: "treasuryprime.com", slugHints: ["treasuryprime", "treasury-prime"] },
  { name: "Middesk", domain: "middesk.com" },

  // Crypto & Web3
  { name: "Polygon", domain: "polygon.technology", slugHints: ["polygon", "polygontechnology", "polygon-labs"] },
  { name: "Avalanche", domain: "avax.network", slugHints: ["avalabs", "ava-labs"] },
  { name: "Near Protocol", domain: "near.org", slugHints: ["near", "nearprotocol", "near-protocol", "pagoda"] },
  { name: "Sui", domain: "sui.io", slugHints: ["sui", "mystenlabs", "mysten-labs"] },
  { name: "Aave", domain: "aave.com" },
  { name: "MakerDAO", domain: "makerdao.com", slugHints: ["makerdao", "maker"] },
  { name: "Lido", domain: "lido.fi", slugHints: ["lido", "lidofinance"] },
  { name: "Eigenlayer", domain: "eigenlayer.xyz", slugHints: ["eigenlayer", "eigenlabs", "eigen-labs"] },
  { name: "Optimism", domain: "optimism.io", slugHints: ["optimism", "oplabs", "op-labs"] },
  { name: "zkSync", domain: "zksync.io", slugHints: ["zksync", "matterlabs", "matter-labs"] },
  { name: "StarkWare", domain: "starkware.co", slugHints: ["starkware"] },
  { name: "Scroll", domain: "scroll.io" },
  { name: "Chainlink", domain: "chain.link", slugHints: ["chainlink", "chainlinklabs", "smartcontract"] },
  { name: "The Graph", domain: "thegraph.com", slugHints: ["thegraph", "the-graph", "edgeandnode", "edge-and-node"] },
  { name: "Filecoin", domain: "filecoin.io", slugHints: ["filecoin", "protocollabs", "protocol-labs"] },
  { name: "Arweave", domain: "arweave.org" },
  { name: "Hedera", domain: "hedera.com" },
  { name: "Mina Protocol", domain: "minaprotocol.com", slugHints: ["minaprotocol", "o1labs", "o1-labs"] },
  { name: "dYdX", domain: "dydx.exchange", slugHints: ["dydx", "dydxexchange"] },
  { name: "Synthetix", domain: "synthetix.io" },
  { name: "Ondo Finance", domain: "ondo.finance", slugHints: ["ondo", "ondofinance"] },
  { name: "Maple Finance", domain: "maple.finance", slugHints: ["maple", "maplefinance"] },
  { name: "Circle", domain: "circle.com" },
  { name: "Copper.co", domain: "copper.co", slugHints: ["copper", "copperco"] },
  { name: "Chainalysis", domain: "chainalysis.com" },
  { name: "TRM Labs", domain: "trmlabs.com", slugHints: ["trmlabs", "trm-labs"] },
  { name: "CoinGecko", domain: "coingecko.com" },
  { name: "Trezor", domain: "trezor.io" },
  { name: "Rainbow", domain: "rainbow.me", slugHints: ["rainbow", "rainbowdotme"] },

  // Security & DevSecOps
  { name: "CrowdStrike", domain: "crowdstrike.com" },
  { name: "SentinelOne", domain: "sentinelone.com" },
  { name: "Lacework", domain: "lacework.com" },
  { name: "Aqua Security", domain: "aquasec.com", slugHints: ["aqua", "aquasec", "aquasecurity"] },
  { name: "Sysdig", domain: "sysdig.com" },
  { name: "Rapid7", domain: "rapid7.com" },
  { name: "Tenable", domain: "tenable.com" },
  { name: "Arctic Wolf", domain: "arcticwolf.com", slugHints: ["arcticwolf", "arctic-wolf"] },
  { name: "Expel", domain: "expel.com" },
  { name: "Panther", domain: "panther.com", slugHints: ["panther", "runpanther"] },
  { name: "Tines", domain: "tines.com" },
  { name: "Socket", domain: "socket.dev" },

  // Data & Analytics
  { name: "Snowflake", domain: "snowflake.com" },
  { name: "dbt Labs", domain: "getdbt.com", slugHints: ["dbt", "dbtlabs", "getdbt"] },
  { name: "Census", domain: "getcensus.com", slugHints: ["census", "getcensus"] },
  { name: "Rudderstack", domain: "rudderstack.com" },
  { name: "Segment", domain: "segment.com" },
  { name: "Heap", domain: "heap.io" },
  { name: "Plausible", domain: "plausible.io" },
  { name: "Lightdash", domain: "lightdash.com" },
  { name: "Preset", domain: "preset.io" },
  { name: "Hex", domain: "hex.tech" },
  { name: "Observable", domain: "observablehq.com", slugHints: ["observable", "observablehq"] },
  { name: "Monte Carlo", domain: "montecarlodata.com", slugHints: ["montecarlo", "montecarlodata"] },
  { name: "Atlan", domain: "atlan.com" },
  { name: "Alation", domain: "alation.com" },

  // Cloud & Infrastructure
  { name: "HashiCorp", domain: "hashicorp.com" },
  { name: "Chronosphere", domain: "chronosphere.io" },
  { name: "Coralogix", domain: "coralogix.com" },
  { name: "Scaleway", domain: "scaleway.com" },
  { name: "Vultr", domain: "vultr.com" },
  { name: "Oxide", domain: "oxide.computer", slugHints: ["oxide", "oxidecomputer"] },
  { name: "Akamai", domain: "akamai.com" },
  { name: "Redpanda", domain: "redpanda.com" },
  { name: "InfluxData", domain: "influxdata.com" },
  { name: "MinIO", domain: "min.io", slugHints: ["minio", "min-io"] },

  // E-commerce
  { name: "BigCommerce", domain: "bigcommerce.com" },
  { name: "Saleor", domain: "saleor.io" },
  { name: "Nacelle", domain: "nacelle.com" },
  { name: "Typesense", domain: "typesense.org" },
  { name: "Meilisearch", domain: "meilisearch.com" },

  // Communication
  { name: "MessageBird", domain: "messagebird.com" },
  { name: "Ably", domain: "ably.com" },
  { name: "Pusher", domain: "pusher.com" },
  { name: "Daily.co", domain: "daily.co", slugHints: ["daily", "dailyco"] },
  { name: "Agora", domain: "agora.io" },
  { name: "imgix", domain: "imgix.com" },

  // HR & Remote Work
  { name: "Multiplier", domain: "multiplier.com" },
  { name: "Plane", domain: "plane.com" },
  { name: "Rippling", domain: "rippling.com" },
  { name: "BambooHR", domain: "bamboohr.com" },
  { name: "Personio", domain: "personio.com" },
  { name: "HiBob", domain: "hibob.com" },

  // Gaming
  { name: "Unity", domain: "unity.com" },
  { name: "Niantic", domain: "nianticlabs.com", slugHints: ["niantic", "nianticlabs"] },
  { name: "Supercell", domain: "supercell.com" },
  { name: "Bungie", domain: "bungie.net", slugHints: ["bungie"] },

  // Health & Wellness
  { name: "Headspace", domain: "headspace.com" },
  { name: "Noom", domain: "noom.com" },
  { name: "Hims & Hers", domain: "forhims.com", slugHints: ["hims", "forhims", "himsandhers"] },
  { name: "Ro", domain: "ro.co", slugHints: ["ro", "romanhealth"] },
  { name: "Zocdoc", domain: "zocdoc.com" },
  { name: "GoodRx", domain: "goodrx.com" },

  // EdTech
  { name: "Khan Academy", domain: "khanacademy.org", slugHints: ["khanacademy", "khan-academy"] },
  { name: "Codecademy", domain: "codecademy.com" },
  { name: "Pluralsight", domain: "pluralsight.com" },
  { name: "Skillshare", domain: "skillshare.com" },
  { name: "MasterClass", domain: "masterclass.com" },
  { name: "Outschool", domain: "outschool.com" },
  { name: "ClassDojo", domain: "classdojo.com" },
  { name: "Quizlet", domain: "quizlet.com" },

  // Media & Content
  { name: "Substack", domain: "substack.com" },
  { name: "Butter CMS", domain: "buttercms.com", slugHints: ["butter", "buttercms"] },

  // Legal & Compliance
  { name: "Ironclad", domain: "ironcladapp.com", slugHints: ["ironclad", "ironcladapp"] },
  { name: "DocuSign", domain: "docusign.com" },
  { name: "PandaDoc", domain: "pandadoc.com" },
  { name: "Clio", domain: "clio.com" },
  { name: "Secureframe", domain: "secureframe.com" },
  { name: "Thoropass", domain: "thoropass.com" },
  { name: "OneTrust", domain: "onetrust.com" },
  { name: "BigID", domain: "bigid.com" },

  // Customer Experience
  { name: "Zendesk", domain: "zendesk.com" },
  { name: "Front", domain: "front.com" },
  { name: "Chatwoot", domain: "chatwoot.com" },
  { name: "Qualified", domain: "qualified.com" },
  { name: "Gainsight", domain: "gainsight.com" },
  { name: "ChurnZero", domain: "churnzero.net", slugHints: ["churnzero"] },
  { name: "Totango", domain: "totango.com" },

  // Marketing & Growth
  { name: "Brevo", domain: "brevo.com", slugHints: ["brevo", "sendinblue"] },
  { name: "Semrush", domain: "semrush.com" },
  { name: "Ahrefs", domain: "ahrefs.com" },
  { name: "Moz", domain: "moz.com" },
  { name: "Unbounce", domain: "unbounce.com" },
  { name: "Make", domain: "make.com", slugHints: ["make", "integromat", "celonis"] },
  { name: "Tray.io", domain: "tray.io", slugHints: ["tray", "trayio"] },

  // Dev Environments & Tooling
  { name: "Gitpod", domain: "gitpod.io" },
  { name: "Coder", domain: "coder.com" },
  { name: "CodeSandbox", domain: "codesandbox.io" },
  { name: "JetBrains", domain: "jetbrains.com" },
  { name: "Tabnine", domain: "tabnine.com" },
  { name: "Sonar", domain: "sonarsource.com", slugHints: ["sonar", "sonarsource"] },
  { name: "Earthly", domain: "earthly.dev" },
  { name: "Depot", domain: "depot.dev" },
  { name: "Spacelift", domain: "spacelift.io" },
  { name: "env0", domain: "env0.com" },

  // Additional Remote-First
  { name: "Andela", domain: "andela.com" },
  { name: "Articulate", domain: "articulate.com" },
  { name: "Time Doctor", domain: "timedoctor.com", slugHints: ["timedoctor", "time-doctor"] },
  { name: "Harvest", domain: "getharvest.com", slugHints: ["harvest", "getharvest"] },
  { name: "Around", domain: "around.co" },
  { name: "Gather", domain: "gather.town", slugHints: ["gather", "gathertown"] },
  { name: "Logseq", domain: "logseq.com" },
  { name: "AppFlowy", domain: "appflowy.io" },
  { name: "Anytype", domain: "anytype.io" },
  { name: "Tana", domain: "tana.inc", slugHints: ["tana", "tanainc"] },
  { name: "Infisical", domain: "infisical.com" },
  { name: "Trigger.dev", domain: "trigger.dev", slugHints: ["trigger", "triggerdev"] },
  { name: "Upstash", domain: "upstash.com" },
  { name: "Unkey", domain: "unkey.dev" },
  { name: "Documenso", domain: "documenso.com" },
  { name: "Design Pickle", domain: "designpickle.com", slugHints: ["designpickle", "design-pickle"] },
  { name: "Palantir", domain: "palantir.com" },
  { name: "Figma", domain: "figma.com" },
  { name: "Vercel", domain: "vercel.com" },
  { name: "Linear", domain: "linear.app" },
  { name: "Retool", domain: "retool.com" },
  { name: "WorkOS", domain: "workos.com" },
  { name: "Clerk", domain: "clerk.com" },
  { name: "Stytch", domain: "stytch.com" },
  { name: "Auth0", domain: "auth0.com", slugHints: ["auth0", "okta"] },
  { name: "Temporal", domain: "temporal.io" },
  { name: "Prefect", domain: "prefect.io" },
  { name: "Dagster", domain: "dagster.io", slugHints: ["dagster", "elementl"] },
  { name: "Apache Airflow", domain: "astronomer.io", slugHints: ["astronomer"] },
  { name: "Materialize", domain: "materialize.com" },
  { name: "SingleStore", domain: "singlestore.com" },
  { name: "StarRocks", domain: "starrocks.io", slugHints: ["starrocks", "celerdata"] },
  { name: "ClickHouse", domain: "clickhouse.com" },
  { name: "Cockroach Labs", domain: "cockroachlabs.com" },

  // Batch 2 — from GitHub remote-company lists + Wellfound
  { name: "BandLab", domain: "bandlab.com" },
  { name: "Bunny.net", domain: "bunny.net", slugHints: ["bunnynet", "bunny-net"] },
  { name: "ConvertKit", domain: "convertkit.com", slugHints: ["convertkit", "kit"] },
  { name: "DataCamp", domain: "datacamp.com" },
  { name: "Eyeo", domain: "eyeo.com" },
  { name: "Shogun", domain: "getshogun.com", slugHints: ["shogun", "getshogun"] },
  { name: "Ionic", domain: "ionic.io" },
  { name: "Kentik", domain: "kentik.com" },
  { name: "OfferFit", domain: "offerfit.ai" },
  { name: "Optimizely", domain: "optimizely.com" },
  { name: "Proton", domain: "proton.me", slugHints: ["proton", "protonmail"] },
  { name: "Quantcast", domain: "quantcast.com" },
  { name: "Redox", domain: "redoxengine.com", slugHints: ["redox", "redoxengine"] },
  { name: "Rollbar", domain: "rollbar.com" },
  { name: "SaasGroup", domain: "saas.group", slugHints: ["saasgroup", "saas-group"] },
  { name: "Sauce Labs", domain: "saucelabs.com", slugHints: ["saucelabs", "sauce-labs"] },
  { name: "ScyllaDB", domain: "scylladb.com", slugHints: ["scylladb", "scylla"] },
  { name: "Sonatype", domain: "sonatype.com" },
  { name: "Taskade", domain: "taskade.com" },
  { name: "Wikimedia", domain: "wikimediafoundation.org", slugHints: ["wikimedia", "wikimediafoundation"] },
  { name: "Xapo", domain: "xapobank.com", slugHints: ["xapo", "xapobank"] },
  { name: "XWP", domain: "xwp.co" },
  { name: "YNAB", domain: "youneedabudget.com", slugHints: ["ynab", "youneedabudget"] },

  // Batch 3 — expanded sourcing from GitHub lists + known remote-first companies
  // Large Tech
  { name: "GitHub", domain: "github.com", slugHints: ["github", "githubinc"] },
  { name: "Etsy", domain: "etsy.com" },
  { name: "Klarna", domain: "klarna.com" },
  { name: "Snap", domain: "snap.com", slugHints: ["snap", "snapinc", "snapchat"] },
  { name: "Airbnb", domain: "airbnb.com" },
  { name: "DoorDash", domain: "doordash.com" },
  { name: "Robinhood", domain: "robinhood.com", slugHints: ["robinhood", "robinhoodmarkets"] },
  { name: "Red Hat", domain: "redhat.com", slugHints: ["redhat", "red-hat"] },
  { name: "Stack Overflow", domain: "stackoverflow.com", slugHints: ["stackoverflow", "stackexchange", "stack-overflow", "stackoverflowsolutions"] },

  // Developer Tools
  { name: "Gradle", domain: "gradle.com" },
  { name: "Discourse", domain: "discourse.org" },
  { name: "Appwrite", domain: "appwrite.io" },
  { name: "Doppler", domain: "doppler.com" },

  // Design
  { name: "Sketch", domain: "sketch.com" },

  // AI/ML
  { name: "DataRobot", domain: "datarobot.com" },
  { name: "Iterative", domain: "iterative.ai", slugHints: ["iterative", "iterativeai"] },

  // Database
  { name: "MariaDB", domain: "mariadb.com" },

  // Communication & Infrastructure
  { name: "Rocket.Chat", domain: "rocket.chat", slugHints: ["rocketchat", "rocket-chat"] },
  { name: "Tyk", domain: "tyk.io" },

  // Education
  { name: "Teachable", domain: "teachable.com" },
  { name: "Udacity", domain: "udacity.com" },

  // Crypto/Web3
  { name: "Rarible", domain: "rarible.com" },
  { name: "Fuel Labs", domain: "fuel.network", slugHints: ["fuel", "fuellabs", "fuel-labs"] },
  { name: "Stacks", domain: "stacks.co", slugHints: ["stacks", "hirosystems", "hiro-systems"] },

  // Fintech
  { name: "Blend", domain: "blend.com" },

  // Product/SaaS
  { name: "Productboard", domain: "productboard.com" },
  { name: "Canny", domain: "canny.io" },
  { name: "ChartMogul", domain: "chartmogul.com" },
  { name: "BetterUp", domain: "betterup.com" },

  // E-commerce
  { name: "Elastic Path", domain: "elasticpath.com", slugHints: ["elasticpath", "elastic-path"] },

  // Data
  { name: "mParticle", domain: "mparticle.com" },

  // Safety/Enterprise
  { name: "SafetyCulture", domain: "safetyculture.com" },

  // Other Tech
  { name: "Plex", domain: "plex.tv", slugHints: ["plex", "plexinc"] },
  { name: "AB Tasty", domain: "abtasty.com", slugHints: ["abtasty", "ab-tasty"] },
  { name: "Mimecast", domain: "mimecast.com" },
  { name: "DNSimple", domain: "dnsimple.com" },
  { name: "Float", domain: "float.com" },
  { name: "Teamwork", domain: "teamwork.com" },
];
