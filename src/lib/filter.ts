/**
 * Geographic filter & region classifier.
 *
 * v4.2 strategy: show ALL creative jobs, tagged by region.
 * Regions: WW (worldwide), NOAM, LATAM, EUR, MENA, SSA, APAC.
 *
 * The worldwide detector logic is preserved — WW jobs pass it cleanly.
 * Regional jobs are classified by their location signals.
 */

export interface FilterableJob {
  title?: string;
  description?: string;
  location?: string;
  locationRestrictions?: string[];
  candidateRequiredLocation?: string;
  jobGeo?: string;
  tags?: string[];
  companySlug?: string;  // ATS slug, used for trusted company allowlist
}

/**
 * Countries/regions that, when paired with "Remote", mean restricted.
 * Comprehensive list — every real country that shows up in job listings.
 */
const COUNTRY_AND_REGION_TERMS = [
  // ── Major English-speaking ────────────────────────────────────
  "us", "usa", "u.s.", "u.s.a.", "united states", "america",
  "uk", "u.k.", "united kingdom", "britain", "england", "scotland", "wales",
  "canada", "australia", "new zealand",
  "ireland", "south africa",
  // ── Western Europe ────────────────────────────────────────────
  "germany", "france", "spain", "italy", "netherlands", "belgium",
  "switzerland", "austria", "portugal", "luxembourg", "liechtenstein",
  "monaco", "andorra", "san marino",
  // ── Northern Europe ───────────────────────────────────────────
  "sweden", "norway", "denmark", "finland", "iceland",
  // ── Central & Eastern Europe ──────────────────────────────────
  "poland", "czech", "czechia", "czech republic", "slovakia",
  "hungary", "romania", "bulgaria", "croatia", "slovenia",
  "serbia", "bosnia", "montenegro", "albania", "north macedonia",
  "macedonia", "kosovo", "moldova", "ukraine", "belarus",
  "estonia", "latvia", "lithuania",
  // ── Southern Europe / Mediterranean ───────────────────────────
  "greece", "cyprus", "malta", "turkey", "türkiye",
  // ── Middle East ───────────────────────────────────────────────
  "israel", "uae", "united arab emirates", "dubai", "saudi arabia",
  "qatar", "bahrain", "kuwait", "oman", "jordan", "lebanon",
  "doha", "riyadh", "jeddah", "muscat", "manama", "abu dhabi",
  "amman", "beirut", "ramallah",
  // ── Asia ──────────────────────────────────────────────────────
  "india", "japan", "korea", "south korea", "china", "singapore",
  "taiwan", "hong kong", "philippines", "indonesia", "thailand",
  "vietnam", "malaysia", "pakistan", "bangladesh", "sri lanka",
  "myanmar", "cambodia", "nepal", "mongolia",
  // ── Americas ──────────────────────────────────────────────────
  "brazil", "mexico", "argentina", "chile", "colombia", "peru",
  "venezuela", "ecuador", "uruguay", "paraguay", "bolivia",
  "costa rica", "panama", "guatemala", "dominican republic",
  "puerto rico", "jamaica", "trinidad", "cuba",
  // ── Africa ────────────────────────────────────────────────────
  "nigeria", "kenya", "egypt", "ghana", "ethiopia", "tanzania",
  "uganda", "rwanda", "morocco", "tunisia", "senegal",
  // ── Oceania ───────────────────────────────────────────────────
  "fiji", "papua new guinea",

  // ── Regions ───────────────────────────────────────────────────
  "emea", "apac", "americas", "north america", "south america",
  "latin america", "latam", "europe", "european union", "eu",
  "asia", "asia pacific", "middle east", "africa",
  "central europe", "eastern europe", "western europe",
  "nordics", "nordic", "baltics", "balkans",
  "dach", "benelux", "cee", "mena", "anz",

  // ── US states (most common in remote listings) ────────────────
  "california", "new york", "texas", "florida", "washington",
  "colorado", "massachusetts", "illinois", "georgia", "virginia",
  "oregon", "pennsylvania", "ohio", "michigan", "north carolina",
  "arizona", "maryland", "minnesota", "connecticut", "utah",
  "nevada", "tennessee", "missouri", "wisconsin", "indiana",
  "new jersey", "south carolina", "iowa", "kentucky", "louisiana",
  "alabama", "oklahoma", "nebraska", "kansas", "hawaii",
  "new hampshire", "maine", "vermont", "rhode island",
  "delaware", "montana", "idaho", "wyoming", "west virginia",
  "north dakota", "south dakota", "alaska", "mississippi",
  "arkansas", "new mexico",

  // ── Canadian provinces ────────────────────────────────────────
  "ontario", "british columbia", "quebec", "alberta",
  "manitoba", "saskatchewan", "nova scotia",

  // ── Major cities that appear as location restrictions ─────────
  "berlin", "london", "paris", "amsterdam", "dublin", "barcelona",
  "madrid", "lisbon", "munich", "hamburg", "vienna", "zurich",
  "stockholm", "oslo", "copenhagen", "helsinki",
  "new york city", "nyc", "san francisco", "sf", "seattle",
  "austin", "denver", "chicago", "boston", "los angeles", "la",
  "toronto", "vancouver", "montreal", "sydney", "melbourne",
  "tel aviv", "doha", "abu dhabi", "riyadh", "muscat", "manama",
  "bangalore", "bengaluru", "hyderabad", "mumbai",
  "tokyo", "seoul", "shanghai", "beijing", "são paulo", "sao paulo",
  "mexico city", "buenos aires", "bogota", "bogotá", "lima",
  "lagos", "nairobi", "cairo", "cape town",
  "warsaw", "prague", "budapest", "bucharest", "sofia",
  "zagreb", "belgrade", "tallinn", "riga", "vilnius",
  "singapore city", "kuala lumpur", "bangkok", "jakarta", "manila",
  "ho chi minh", "hanoi",
];

/**
 * Structural patterns that ALWAYS indicate geographic restriction,
 * regardless of what follows them.
 * "Remote from Bulgaria" → restricted (doesn't matter that Bulgaria isn't a major country)
 * "Based in Nigeria" → restricted
 */
const GEO_STRUCTURAL_PATTERNS = [
  /\bremote\s+from\s+\S/,              // "Remote from Bulgaria"
  /\bremote\s+in\s+\S/,               // "Remote in Germany"
  /\bbased\s+in\s+\S/,                // "Based in UK"
  /\blocated\s+in\s+\S/,              // "Located in US"
  /\bresident\s+(?:of|in)\s+\S/,      // "Resident of Canada"
  /\bwithin\s+\S/,                     // "Within EMEA"
  /\bopen\s+to\s+candidates?\s+in\s/,  // "Open to candidates in EU"
  /\beligible\s+(?:in|for)\s+\S/,     // "Eligible in US"
  /\bwork\s+from\s+(?!anywhere|home)\S/, // "Work from Germany" (not "Work from anywhere/home")
];

/**
 * Location strings that mean "truly worldwide, no restrictions."
 * These must be the ENTIRE location value (not a substring).
 */
const WORLDWIDE_EXACT_LOCATIONS = [
  "remote",
  "worldwide",
  "anywhere",
  "global",
  "remote - worldwide",
  "remote worldwide",
  "remote, worldwide",
  "remote (worldwide)",
  "remote - global",
  "remote - anywhere",
  "remote, anywhere",
  "remote (anywhere)",
  "worldwide remote",
  "globally remote",
  "work from anywhere",
  "location independent",
  "fully remote",
  "100% remote",
  // Canonical-style
  "home based - worldwide",
  "home based worldwide",
  "home-based - worldwide",
  "home-based worldwide",
  // Additional patterns seen in the wild
  "remote/worldwide",
  "remote | worldwide",
  "remote: worldwide",
  "remote, global",
  "remote/global",
  "global remote",
  "global | remote",
  "earth",
  "all locations",
  "remote - all regions",
  "remote (all regions)",
  "international",
  "remote international",
  "remote - international",
  // Flexible / distributed
  "distributed",
  "remote-first",
  "remote first",
  "remote / hq optional",
  "remote, flexible",
  "remote (flexible)",
  "remote - flexible location",
  "no office",
  "home office",
  // Additional variants seen in ATS listings
  "remote, global",
  "global / remote",
  "anywhere / remote",
  "global (remote)",
  "worldwide (remote)",
  "fully remote / worldwide",
  "remote-global",
  "open to all",
  "no location required",
  "any location",
  "location flexible",
  "flexible location",
  "work remotely",
  "remote - open",
  "fully remote - global",
  "remote | global",
  "remote (global)",
  "global, remote",
  "anywhere, remote",
  "remote – worldwide",
  "remote – global",
  "remote – anywhere",
];

/** Phrases in title/description that prove geographic restriction */
const RESTRICTION_PHRASES = [
  "us only", "usa only", "uk only", "eu only", "europe only",
  "canada only", "australia only", "india only",
  "us-based", "uk-based", "eu-based", "india-based",
  "us based", "uk based", "eu based", "india based",
  "must be located in", "must reside in", "must be based in",
  "residents only", "residents of",
  "authorized to work in", "work authorization required",
  "work permit required", "eligibility to work in",
  "right to work in",
  "h1b", "h-1b", "visa sponsorship not available",
  "green card required", "citizenship required",
  "permanent resident required",
  "within the us", "within the uk", "within the eu",
  "united states only", "united kingdom only",
  "americas only", "emea only", "apac only",
  "north america only",
  "this role is limited to", "this position is limited to",
  "restricted to candidates in", "available in select",
  "open to applicants in",
];

/**
 * STRONG rescue signals — these describe the JOB's availability, not the company.
 * A sentence containing these is likely saying "this role is open worldwide."
 * Weak/ambiguous signals (e.g. "distributed team", "remote-first") are excluded
 * because they commonly appear in company boilerplate appended to every listing.
 */
/**
 * Each signal must unambiguously state the JOB is available worldwide.
 * Excluded: "globally distributed" (describes team, not job availability),
 * "candidates/talent worldwide" (often boilerplate recruitment language).
 */
const RESCUE_SIGNALS = [
  // Explicit: "this role is open worldwide"
  "work from anywhere in the world",
  "open to candidates worldwide",
  "open to candidates globally",
  "open to candidates from anywhere",
  "hire from anywhere in the world",
  "we hire everywhere in the world",
  "regardless of location",
  "no geographic restriction",
  "no location restrictions",
  "location is not a factor",
  "remote without borders",
  // Strong worldwide phrases (must include world/global scope)
  "any country in the world",
  "anywhere in the world",
  "from anywhere in the world",
  "based anywhere in the world",
  "live and work anywhere in the world",
  // Strong "all" phrases
  "open to all locations worldwide",
  "all countries are welcome",
  "this role is open globally",
  "this position is open globally",
  "can be performed from anywhere",
  "can be done from anywhere",
];

/**
 * Phrases that look like rescue signals but are actually restricted.
 * "based anywhere in the US" ≠ "based anywhere in the world"
 * These are checked AFTER a signal match and veto the rescue.
 */
const RESCUE_VETOES = [
  "anywhere in the us",
  "anywhere in the u.s",
  "anywhere in the united states",
  "anywhere in the uk",
  "anywhere in the u.k",
  "anywhere in canada",
  "anywhere in europe",
  "anywhere in emea",
  "anywhere in apac",
  "anywhere in north america",
  "anywhere in the americas",
  "anywhere in latin america",
];

/**
 * Companies known to be worldwide-first.
 * When these companies post "Remote" with no geo qualifier, trust it as worldwide.
 * This bypasses the description signal requirement for location="Remote".
 * Still reject if explicit geo qualifier is present ("Remote, US").
 *
 * Key: atsSlug values from companies.ts
 */
const TRUSTED_WORLDWIDE_SLUGS = new Set([
  // Verified worldwide-first companies (original 25)
  "gitlab", "canonical", "remote", "zapier", "buffer",
  "toptal", "safetywing", "hotjar", "close", "helpscout",
  "articulate", "toggl", "gitbook", "posthog", "sourcegraph91",
  "mattermost", "ghost", "doist", "automattic", "superside",
  "wikimedia", "mozilla", "elastic", "testgorilla", "oyster",
  // Expansion — verified worldwide-first (growth v2)
  "grafanalabs", "cockroachlabs", "honeycomb", "netlify",
  "circleci", "planetscale", "cribl", "hashicorp",
  "sentry", "snyk", "datadog", "cloudflare",
  "dbtlabsinc", "airbyte", "temporal", "dagster",
  "supabase", "neon", "turso", "fly",
  "1password", "tailscale", "bitwarden",
  "runwayml", "huggingface", "wandb",
  "deel", "velocityglobal", "omnipresent",
  "printful", "convertkit", "lottiefiles",
  "webflow", "framer", "sketch", "miro",
  "metalab", "hugeinc", "instrument", "mazedesign",
  // Expansion — verified worldwide-first (growth v3)
  // Design/creative tools & platforms
  "mural", "chromatic", "zed", "contra", "wetransfer",
  "dovetail", "gamma", "tldraw", "loom", "stickermule",
  "canva", "ideogram", "pitch", "rive", "spline",
  // Remote-first infra & developer tools
  "vercel", "linear", "notion", "figma", "stripe",
  "airtable", "retool", "prisma", "fly", "render",
  "railway", "upstash", "resend", "inngest", "convex",
  // Open-source & foundations
  "ideo", "civicactions", "creativecommons", "processingio",
  // EOR & global hiring platforms (hire worldwide by definition)
  "niural", "andela", "letsdeel", "papaya", "multiplier",
  // Verified creative agencies & studios (distributed worldwide)
  "ueno", "metalab", "clay", "handsome", "basicagency",
  "fivesixdesign", "10up", "boldcommerce",
  // Additional worldwide-first companies with creative teams
  "patreon", "gumroad", "substack", "medium", "ghost",
  "replit", "coda", "whimsical", "excalidraw",
  "penpot", "balsamiq", "abstract", "zeroheight",
  // Expansion — verified worldwide-first (growth v4)
  "muckrack", "circleso", "testlio", "xapo61",
  "canny", "agencyanalytics", "paymentology", "lyssna",
  "harvest", "outliant", "cofense", "lumenalta",
  "moderntribe", "levelaccess", "navapbc", "getshogun",
  "coalitiontech", "goodwaygroup", "awesomemotive",
  "onthegosystems", "pocketworlds", "aha",
  "gravityglobal", "order",
  // AI-native & LLM companies (remote-first by design)
  "anthropic", "openai", "cohere", "mistral", "perplexity",
  "adept", "together", "imbue", "characterai",
  // Design-forward SaaS (remote-first, global teams)
  "typeform", "intercom", "amplitude", "mixpanel", "fullstory",
  "beehiiv", "mailerlite", "klaviyo",
  // Global fintech (hire worldwide)
  "brex", "ramp", "mercury", "wise", "paddle", "lemonsqueezy",
  "payoneer", "airwallex",
  // Remote-first infra & developer tools
  "gitpod", "loops", "hookdeck", "svix", "trigger",
  "sanity", "contentful", "storyblok", "hygraph", "directus",
  // Creative & media platforms
  "envato", "creativemarket", "designcuts",
  "supernova", "zeroheight",
  "adobe", "invision",
  // Content & creator economy
  "grammarly", "squarespace", "bigcommerce", "shopify",
  "cargo", "readymag",
  // Creative agencies & studios (distributed)
  "mediamonks", "stinkstudios", "wearephi",
  "rottenrobots", "makemepulse",
]);

export interface FilterResult {
  pass: boolean;
  reason: string;
}

/**
 * Analyzes whether a job is genuinely worldwide, returning the rejection reason.
 * This is the core filter logic — `isWorldwideRemote` is a thin wrapper.
 */
export function analyzeWorldwideRemote(job: FilterableJob): FilterResult {
  const location = (job.location || "").trim();
  let locationIsExactWorldwide = false;

  // --- STEP 1: Analyze location field ---
  if (location) {
    const locLower = location.toLowerCase().trim();

    if (WORLDWIDE_EXACT_LOCATIONS.includes(locLower)) {
      locationIsExactWorldwide = true;
    } else {
      if (hasStructuralGeoPattern(locLower)) {
        return { pass: false, reason: "structural_pattern_location" };
      }
      if (hasGeographicQualifier(locLower)) {
        // Multi-region exception: if a trusted company lists "Remote, X"
        // across 4+ distinct countries, treat as effectively worldwide.
        if (job.companySlug && TRUSTED_WORLDWIDE_SLUGS.has(job.companySlug)) {
          const parts = locLower.split(/[;]/).map(s => s.trim()).filter(Boolean);
          const countries = new Set<string>();
          for (const part of parts) {
            const m = part.match(/remote[,\s]+(.+)/);
            if (m) countries.add(m[1].trim());
          }
          if (countries.size >= 4) {
            locationIsExactWorldwide = true;
          } else {
            return { pass: false, reason: "geo_qualifier_location" };
          }
        } else {
          return { pass: false, reason: "geo_qualifier_location" };
        }
      }
      if (
        !locationIsExactWorldwide &&
        !locLower.includes("remote") &&
        !locLower.includes("worldwide") &&
        !locLower.includes("anywhere") &&
        !locLower.includes("global")
      ) {
        return { pass: false, reason: "no_remote_keyword" };
      }
    }
  }

  // --- STEP 2: Check structured location restrictions ---
  if (job.locationRestrictions && job.locationRestrictions.length > 0) {
    return { pass: false, reason: "location_restrictions" };
  }
  if (job.candidateRequiredLocation) {
    const crl = job.candidateRequiredLocation.toLowerCase();
    if (!isWorldwideKeyword(crl)) {
      return { pass: false, reason: "candidate_required_location" };
    }
  }
  if (job.jobGeo) {
    const geo = job.jobGeo.toLowerCase();
    if (!isWorldwideKeyword(geo)) {
      return { pass: false, reason: "job_geo" };
    }
  }

  // --- STEP 3: Check title for geographic restriction ---
  if (job.title) {
    const titleLower = job.title.toLowerCase();
    if (hasStructuralGeoPattern(titleLower)) {
      return { pass: false, reason: "structural_pattern_title" };
    }
    if (hasGeographicQualifier(titleLower)) {
      return { pass: false, reason: "geo_qualifier_title" };
    }
  }

  // --- STEP 4: Scan description for restriction phrases ---
  if (!locationIsExactWorldwide) {
    const textToCheck = [job.title || "", job.description || ""]
      .join(" ")
      .toLowerCase();

    for (const phrase of RESTRICTION_PHRASES) {
      if (textToCheck.includes(phrase)) {
        return { pass: false, reason: "restriction_phrase" };
      }
    }
  }

  // --- STEP 5: If location is ambiguous, check for worldwide signal ---
  if (!locationIsExactWorldwide) {
    // 5a: Trusted companies get a pass for bare "Remote" locations
    if (job.companySlug && TRUSTED_WORLDWIDE_SLUGS.has(job.companySlug)) {
      const locLower = (job.location || "").toLowerCase().trim();
      if (locLower.includes("remote")) {
        return { pass: true, reason: "pass_trusted_company" };
      }
    }
  }

  // --- STEP 6: If no location was provided, require worldwide signal in text ---
  if (!location) {
    const textToCheck = [job.title || "", job.description || ""]
      .join(" ")
      .toLowerCase();
    const hasWorldwideSignal =
      textToCheck.includes("worldwide") ||
      textToCheck.includes("work from anywhere") ||
      textToCheck.includes("globally") ||
      textToCheck.includes("any location") ||
      textToCheck.includes("no location requirement") ||
      textToCheck.includes("location independent") ||
      textToCheck.includes("open to candidates globally") ||
      textToCheck.includes("hire from anywhere") ||
      textToCheck.includes("no geographic restriction") ||
      textToCheck.includes("distributed team") ||
      textToCheck.includes("remote friendly") ||
      textToCheck.includes("across the globe") ||
      // New signals (v2)
      textToCheck.includes("open to all locations") ||
      textToCheck.includes("timezone-flexible") ||
      textToCheck.includes("timezone agnostic") ||
      textToCheck.includes("location-agnostic") ||
      textToCheck.includes("location agnostic") ||
      textToCheck.includes("work from wherever") ||
      textToCheck.includes("live wherever") ||
      textToCheck.includes("based wherever") ||
      textToCheck.includes("all geographies") ||
      textToCheck.includes("every timezone") ||
      textToCheck.includes("any country") ||
      textToCheck.includes("regardless of location") ||
      textToCheck.includes("truly remote") ||
      textToCheck.includes("100% distributed") ||
      textToCheck.includes("fully distributed") ||
      textToCheck.includes("global workforce") ||
      textToCheck.includes("remote-first company") ||
      textToCheck.includes("location is not a factor") ||
      textToCheck.includes("we hire everywhere") ||
      textToCheck.includes("remote without borders") ||
      textToCheck.includes("any timezone") ||
      textToCheck.includes("no location restrictions");
    if (!hasWorldwideSignal) {
      return { pass: false, reason: "no_worldwide_signal" };
    }
  }

  return { pass: true, reason: "pass" };
}

/**
 * Returns true ONLY if the job is genuinely available worldwide.
 * Thin wrapper around analyzeWorldwideRemote for existing call sites.
 */
export function isWorldwideRemote(
  job: FilterableJob,
  fullDescription?: string
): boolean {
  return analyzeWithRescue(job, fullDescription).pass;
}

/**
 * Check for structural patterns that always indicate geographic restriction.
 * These work regardless of whether the country/city is in our list.
 * "Remote from X" is ALWAYS a restriction, no matter what X is.
 */
function hasStructuralGeoPattern(text: string): boolean {
  for (const pattern of GEO_STRUCTURAL_PATTERNS) {
    if (pattern.test(text)) {
      return true;
    }
  }
  return false;
}

/** Check if a location string contains country or region qualifiers */
function hasGeographicQualifier(location: string): boolean {
  // Split on common delimiters: comma, semicolon, dash, parentheses
  // NOTE: We do NOT split on "/" because titles like "User Interface / Visual Designer"
  // would produce "user interface" which falsely matches "us" as a substring.
  const parts = location.split(/[,;\-()|·•]+/).map((p) => p.trim());

  for (const part of parts) {
    if (!part) continue;
    // Skip the "remote" and "fully remote" parts
    if (part === "remote" || part === "fully remote") continue;
    // Skip timezone references — timezone ≠ location restriction
    if (/time\s*zone|timezone|\btz\b|hours|working\s*hours/i.test(part)) continue;
    // Skip generic job-level qualifiers
    if (/full\s*time|part\s*time|contract|freelance|hybrid/i.test(part)) continue;

    // Check if this part matches a known country/region/city
    for (const term of COUNTRY_AND_REGION_TERMS) {
      if (part === term) {
        return true;
      }
      // For short terms (≤3 chars like "us", "uk", "eu"), require word boundary match
      if (term.length <= 3) {
        const wordBoundaryRegex = new RegExp(`\\b${term}\\b`);
        if (wordBoundaryRegex.test(part)) {
          return true;
        }
      } else {
        if (part.includes(term)) {
          return true;
        }
      }
    }

    // If the part is a standalone 2-letter code (likely country code like US, UK, DE)
    // But exclude common job abbreviations: PM, QA, VP, HR, IT, AI, ML, UI, UX, BI, SE, RE, QE, DB
    if (/^[a-z]{2}$/.test(part) && !JOB_ABBREVIATIONS.has(part)) {
      return true;
    }
  }

  return false;
}

/** Common 2-letter job abbreviations that are NOT country codes */
const JOB_ABBREVIATIONS = new Set([
  "pm", "qa", "vp", "hr", "it", "ai", "ml", "ui", "ux",
  "bi", "se", "re", "qe", "db", "os", "dx", "cx", "gm",
  "am", "sm", "em", "ic", "sr", "ab", "ad", "do", "go",
  "id", "ii", "iv", "no", "or", "so", "to", "up",
]);

/** Check if a string is a worldwide keyword */
function isWorldwideKeyword(text: string): boolean {
  const t = text.trim().toLowerCase();
  return (
    t.includes("worldwide") ||
    t.includes("anywhere") ||
    t.includes("global") ||
    t === "remote" ||
    t.includes("no restriction") ||
    t.includes("work from anywhere") ||
    t.includes("location independent")
  );
}

/**
 * Common boilerplate section headers that introduce company-level text.
 * Everything after these headers is stripped before scanning for rescue signals.
 */
const BOILERPLATE_HEADERS = [
  "about us",
  "about the company",
  "about elastic",
  "about gitlab",
  "about zapier",
  "about grafana",
  "about datadog",
  "about cloudflare",
  "who we are",
  "why join",
  "why work at",
  "why work with",
  "why work for",
  "our company",
  "our culture",
  "our values",
  "our mission",
  "our story",
  "our team",
  "we take care of our people",
  "benefits and perks",
  "benefits & perks",
  "what we offer",
  "equal opportunity",
  "diversity and inclusion",
  "diversity & inclusion",
  "compensation and",
  "compensation range",
];

/**
 * Strip boilerplate "About Us" sections from a job description.
 * Returns only the job-specific content (requirements, responsibilities, etc.)
 */
function stripBoilerplate(description: string): string {
  // Remove HTML tags for cleaner matching
  const text = description.replace(/<[^>]+>/g, " ");
  const lower = text.toLowerCase();

  // Find the earliest boilerplate header in the latter half and truncate there
  let earliestIdx = text.length;
  for (const header of BOILERPLATE_HEADERS) {
    const idx = lower.indexOf(header);
    // Only treat as boilerplate if it's in the latter 60% of the description
    if (idx !== -1 && idx > text.length * 0.4 && idx < earliestIdx) {
      earliestIdx = idx;
    }
  }

  return text.substring(0, earliestIdx);
}

/**
 * Check if a full job description contains worldwide signals
 * that override a restrictive location/title.
 * Only called for trusted companies (phase 1).
 *
 * Uses two defenses against false positives:
 * 1. Strip boilerplate "About Us" sections before scanning
 * 2. Only match strong, job-specific worldwide signals (not weak words like "distributed")
 */
function rescueByDescription(description: string): boolean {
  if (!description) return false;
  const jobContent = stripBoilerplate(description).toLowerCase();

  // Check for veto phrases first — "anywhere in the US" is NOT worldwide
  if (RESCUE_VETOES.some((veto) => jobContent.includes(veto))) {
    return false;
  }

  return RESCUE_SIGNALS.some((signal) => jobContent.includes(signal));
}

/**
 * Wrapper that attempts to rescue rejected jobs using full description.
 * Phase 1: Only rescues trusted company jobs.
 */
export function analyzeWithRescue(
  job: FilterableJob,
  fullDescription?: string
): FilterResult {
  const result = analyzeWorldwideRemote(job);
  if (result.pass) return result;

  // Only rescue trusted companies (phase 1)
  if (!job.companySlug || !TRUSTED_WORLDWIDE_SLUGS.has(job.companySlug)) {
    return result;
  }

  // Don't rescue if the title itself contains geographic restrictions —
  // a title like "Engineer - Netherlands" is intentionally geo-scoped
  if (job.title && titleHasGeoRestriction(job.title)) {
    return result;
  }

  const descToCheck = fullDescription || job.description || "";
  if (rescueByDescription(descToCheck)) {
    return { pass: true, reason: "pass_rescued_by_description" };
  }

  return result;
}

/**
 * Check if a job title contains geographic terms that indicate
 * the role is intentionally scoped to a region/country.
 */
function titleHasGeoRestriction(title: string): boolean {
  const lower = title.toLowerCase();
  return hasGeographicQualifier(lower) || hasStructuralGeoPattern(lower);
}

// ─────────────────────────────────────────────────────────────────────────────
// REGION CLASSIFIER (v4.2)
// ─────────────────────────────────────────────────────────────────────────────

import type { Region } from "./types";

// ── Geographic terms per region ───────────────────────────────────────────────

const NOAM_TERMS = [
  "us", "usa", "u.s.", "u.s.a.", "united states", "america",
  "canada", "ontario", "british columbia", "quebec", "alberta",
  "mexico", "north america",
  "california", "new york", "texas", "florida", "washington",
  "colorado", "massachusetts", "illinois", "georgia", "virginia",
  "oregon", "pennsylvania", "ohio", "michigan", "north carolina",
  "arizona", "maryland", "minnesota", "connecticut", "utah",
  "nevada", "tennessee", "new jersey", "seattle", "san francisco",
  "nyc", "new york city", "austin", "denver", "chicago", "boston",
  "los angeles", "toronto", "vancouver", "montreal",
  // Timezone signals → NOAM
  "est", "cst", "mst", "pst", "eastern time", "central time",
  "mountain time", "pacific time", "et ", "ct ", "pt ",
  "utc-4", "utc-5", "utc-6", "utc-7", "utc-8",
  "gmt-4", "gmt-5", "gmt-6", "gmt-7", "gmt-8",
];

const LATAM_TERMS = [
  "brazil", "argentina", "colombia", "chile", "peru", "venezuela",
  "ecuador", "uruguay", "paraguay", "bolivia", "costa rica", "panama",
  "guatemala", "dominican republic", "puerto rico", "jamaica", "trinidad",
  "cuba", "latin america", "latam", "south america", "são paulo", "sao paulo",
  "mexico city", "buenos aires", "bogota", "bogotá", "lima",
  // Timezone signals → LATAM
  "brt", "art", "clt", "col", "pet",
  "utc-3", "gmt-3",
];

const EUR_TERMS = [
  "europe", "european union", "eu", "emea",
  "germany", "france", "spain", "italy", "netherlands", "belgium",
  "switzerland", "austria", "portugal", "luxembourg", "liechtenstein",
  "sweden", "norway", "denmark", "finland", "iceland",
  "poland", "czech", "czechia", "czech republic", "slovakia",
  "hungary", "romania", "bulgaria", "croatia", "slovenia",
  "serbia", "bosnia", "montenegro", "albania", "north macedonia",
  "moldova", "ukraine", "belarus", "estonia", "latvia", "lithuania",
  "greece", "cyprus", "malta", "turkey", "türkiye",
  "ireland", "united kingdom", "uk", "britain", "england", "scotland", "wales",
  "dach", "benelux", "cee", "nordics", "nordic", "balkans",
  "berlin", "london", "paris", "amsterdam", "dublin", "barcelona",
  "madrid", "lisbon", "munich", "vienna", "zurich", "stockholm",
  "oslo", "copenhagen", "helsinki", "warsaw", "prague", "budapest",
  // Timezone signals → EUR
  "cet", "cest", "gmt", "bst", "wet", "eet", "eest",
  "utc+0", "utc+1", "utc+2", "utc+3",
  "gmt+0", "gmt+1", "gmt+2",
];

const MENA_TERMS = [
  "middle east", "mena", "north africa",
  "uae", "united arab emirates", "dubai", "saudi arabia", "saudi",
  "qatar", "bahrain", "kuwait", "oman", "jordan", "lebanon",
  "israel", "tel aviv", "egypt", "cairo", "morocco", "tunisia",
  // Timezone signals → MENA
  "ast", "arabia standard", "eat",
  "utc+3", "utc+4", "gmt+3", "gmt+4",
];

const SSA_TERMS = [
  "africa", "sub-saharan", "sub saharan",
  "nigeria", "kenya", "ghana", "ethiopia", "tanzania",
  "uganda", "rwanda", "south africa", "cape town", "johannesburg",
  "senegal", "mozambique", "zambia", "zimbabwe", "cameroon",
  "ivory coast", "nairobi", "lagos",
  // Timezone signals → SSA (WAT/EAT)
  "wat", "west africa time", "east africa time",
];

const APAC_TERMS = [
  "asia", "asia pacific", "apac", "oceania",
  "india", "bangalore", "bengaluru", "mumbai", "hyderabad", "delhi",
  "japan", "tokyo", "korea", "south korea", "seoul",
  "china", "beijing", "shanghai", "taiwan", "hong kong",
  "singapore", "malaysia", "kuala lumpur", "philippines", "manila",
  "indonesia", "jakarta", "thailand", "bangkok", "vietnam",
  "ho chi minh", "hanoi", "myanmar", "cambodia", "nepal",
  "australia", "sydney", "melbourne", "new zealand", "anz",
  "pakistan", "bangladesh", "sri lanka",
  // Timezone signals → APAC
  "ist", "sgt", "jst", "kst", "aest", "nzst", "hkt", // "cst" removed — ambiguous with US Central Standard Time (covered by NOAM_TZ)
  "india standard", "japan standard", "korea standard",
  "utc+5", "utc+5:30", "utc+6", "utc+7", "utc+8", "utc+9", "utc+10", "utc+11",
  "gmt+5", "gmt+5:30", "gmt+6", "gmt+7", "gmt+8", "gmt+9", "gmt+10",
];

// ── Remote check ──────────────────────────────────────────────────────────────

const REMOTE_LOCATION_KEYWORDS = [
  "remote", "worldwide", "anywhere", "global", "distributed",
  "work from home", "work from anywhere", "fully distributed",
  "location independent", "virtual", "home-based",
];

const OFFICE_ONLY_PATTERNS = [
  /\bin[\s-]office\b/i,
  /\bon[\s-]site\b/i,
  /\bonsite\b/i,
  /\bhybrid\b/i,
  /\boffice[\s-]based\b/i,
];

const OFFICE_DESCRIPTION_SIGNALS = [
  /\b(in[\s-]?office|on[\s-]?site|onsite)\s+role\b/i,
  /\brequired?\s+to\s+(be\s+)?in\s+(?:the\s+)?office/i,
  /\bmust\s+(be\s+)?report\s+to\s+(the\s+)?office/i,
  /\boffice\s+(attendance|presence)\s+required\b/i,
  /\bthis\s+(role|position)\s+is\s+(in[\s-]?office|on[\s-]?site)\b/i,
  /\bnot\s+(eligible|available)\s+for\s+remote\b/i,
  /\bcannot\s+be\s+performed\s+remotely\b/i,
  /\b\w+[\s-]based\s+(?:corporate\s+)?office\b/i,
];

const STRONG_REMOTE_SIGNALS = [
  /\bfully\s+remote\b/i,
  /\b100%\s+remote\b/i,
  /\bremote[\s-]first\b/i,
  /\ball[\s-]remote\b/i,
  /\bfully\s+distributed\b/i,
  /\bwork\s+from\s+anywhere\b/i,
  /\bthis\s+(?:role|position)\s+is\s+(?:fully\s+)?remote\b/i,
  /\bremote\s+(?:role|position)\b/i,
];

const CITY_PATTERN = /\b[a-z]+(?:\s[a-z]+)*,\s*[a-z]{2,}\b/;

/**
 * Returns true if the job is (or can be) remote.
 * Rejects jobs with explicit office-only / hybrid signals in location or description.
 *
 * Note: many companies list their HQ city as location even for remote roles.
 * We check the full description for office-only signals before rejecting.
 */
export function isRemoteJob(job: FilterableJob, fullDescription?: string): boolean {
  const loc = (job.location || "").toLowerCase().trim();
  const title = (job.title || "").toLowerCase();

  // If title explicitly says hybrid/onsite/in-office → not remote
  for (const p of OFFICE_ONLY_PATTERNS) {
    if (p.test(title)) return false;
  }

  // If location explicitly says office/hybrid → not remote
  for (const p of OFFICE_ONLY_PATTERNS) {
    if (p.test(loc)) return false;
  }

  // If location has a remote keyword → remote
  for (const kw of REMOTE_LOCATION_KEYWORDS) {
    if (loc.includes(kw)) return true;
  }

  // Location is a city/region name — check description for office signals
  const desc = (fullDescription || job.description || "").toLowerCase();
  for (const p of OFFICE_DESCRIPTION_SIGNALS) {
    if (p.test(desc)) return false;
  }

  // Only trust STRONG remote signals in description — bare "remote" is too
  // noisy (perks sections mention "remote environment" on in-office roles).
  if (STRONG_REMOTE_SIGNALS.some((p) => p.test(desc))) return true;

  // Location looks like a physical address (City, ST or City, Country) with
  // no strong remote signal → reject. Many on-site/hybrid jobs omit the tag
  // or misspell it (e.g. "Berlin, Germany (Hybird)").
  if (CITY_PATTERN.test(loc)) return false;

  // Also reject parenthesized annotations on otherwise-city locations —
  // catches typos of hybrid/onsite that slip past the regex set.
  if (/\([^)]*\)/.test(loc)) return false;

  // No disqualifying signal found → treat as remote-eligible
  return true;
}

function matchesTerms(text: string, terms: string[]): boolean {
  for (const term of terms) {
    if (term.length <= 3) {
      if (new RegExp(`\\b${term}\\b`).test(text)) return true;
    } else {
      if (text.includes(term)) return true;
    }
  }
  return false;
}

// ── Geo terms (place names only — no timezones) ───────────────────────────────

const NOAM_GEO = NOAM_TERMS.filter(t => !t.match(/^(est|cst|mst|pst|et |ct |pt |utc-|gmt-|eastern|central|mountain|pacific)/i));
const LATAM_GEO = LATAM_TERMS.filter(t => !t.match(/^(brt|art|clt|col|pet|utc-3|gmt-3)/i));
const EUR_GEO   = EUR_TERMS.filter(t => !t.match(/^(cet|cest|gmt|bst|wet|eet|eest|utc\+[0-3]|gmt\+[0-2])/i));
const MENA_GEO  = MENA_TERMS.filter(t => !t.match(/^(ast|arabia|eat|utc\+3|utc\+4|gmt\+3|gmt\+4)/i));
const SSA_GEO   = SSA_TERMS.filter(t => !t.match(/^(wat|west africa time|east africa time)/i));
const APAC_GEO  = APAC_TERMS.filter(t => !t.match(/^(ist|sgt|jst|kst|aest|nzst|hkt|india standard|japan standard|korea standard|utc\+[5-9]|utc\+1[0-1]|gmt\+[5-9]|gmt\+10)/i));

// ── Timezone-only terms (used as fallback when location is ambiguous) ─────────

const NOAM_TZ = ["est", "cst", "mst", "pst", "eastern time", "central time", "mountain time", "pacific time", "et ", "ct ", "pt ", "utc-4", "utc-5", "utc-6", "utc-7", "utc-8", "gmt-4", "gmt-5", "gmt-6", "gmt-7", "gmt-8"];
const LATAM_TZ = ["brt", "art", "clt", "col", "pet", "utc-3", "gmt-3"];
const EUR_TZ   = ["cet", "cest", "bst", "wet", "eet", "eest", "utc+0", "utc+1", "utc+2", "gmt+0", "gmt+1", "gmt+2"];
const MENA_TZ  = ["ast", "arabia standard", "eat", "utc+3", "utc+4", "gmt+3", "gmt+4"];
const SSA_TZ   = ["wat", "west africa time", "east africa time"];
const APAC_TZ  = ["ist", "sgt", "jst", "kst", "aest", "nzst", "hkt", "india standard", "japan standard", "korea standard", "utc+5", "utc+5:30", "utc+6", "utc+7", "utc+8", "utc+9", "utc+10", "utc+11", "gmt+5", "gmt+5:30", "gmt+6", "gmt+7", "gmt+8", "gmt+9", "gmt+10"];

function classifyByGeo(text: string): Region | null {
  if (matchesTerms(text, MENA_GEO)) return "mena";
  if (matchesTerms(text, SSA_GEO)) return "ssa";
  if (matchesTerms(text, APAC_GEO)) return "apac";
  if (matchesTerms(text, LATAM_GEO)) return "latam";
  if (matchesTerms(text, EUR_GEO)) return "eur";
  if (matchesTerms(text, NOAM_GEO)) return "noam";
  return null;
}

function classifyByTimezone(text: string): Region | null {
  if (matchesTerms(text, MENA_TZ)) return "mena";
  if (matchesTerms(text, SSA_TZ)) return "ssa";
  if (matchesTerms(text, APAC_TZ)) return "apac";
  if (matchesTerms(text, LATAM_TZ)) return "latam";
  if (matchesTerms(text, EUR_TZ)) return "eur";
  if (matchesTerms(text, NOAM_TZ)) return "noam";
  return null;
}

/**
 * Classify a job into one of 7 regions.
 *
 * WW  = genuinely worldwide (no geo restriction).
 * NOAM/LATAM/EUR/MENA/SSA/APAC = region-restricted remote jobs.
 *
 * Two-pass approach: location signals first, timezone fallback second.
 * Timezones follow the location — they only activate when location is ambiguous.
 */
export function getJobRegion(job: FilterableJob, fullDescription?: string): Region {
  // WW: passes the existing worldwide filter
  if (analyzeWithRescue(job, fullDescription).pass) return "ww";

  // Pass 1: geographic terms from location fields only
  const locText = [
    job.location || "",
    job.candidateRequiredLocation || "",
    job.jobGeo || "",
    (job.locationRestrictions || []).join(" "),
  ].join(" ").toLowerCase();

  const geoRegion = classifyByGeo(locText);
  if (geoRegion) return geoRegion;

  // Pass 2: timezone signals from description (fallback only)
  const descSnippet = (fullDescription || job.description || "").substring(0, 600).toLowerCase();
  const tzRegion = classifyByTimezone(descSnippet);
  if (tzRegion) return tzRegion;

  // No clear region signal → treat as WW (benefit of the doubt)
  return "ww";
}
