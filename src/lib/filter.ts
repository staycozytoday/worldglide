/**
 * Worldwide-only quality filter.
 *
 * Philosophy: OPT-IN, not opt-out.
 * A job must PROVE it's worldwide. If there's any doubt, reject it.
 * "Remote" alone is not enough — "Remote, US" is US-only.
 * Only jobs with no geographic qualifiers pass.
 *
 * This is the single most important file in the codebase.
 * One false positive = broken trust. Be aggressive with rejections.
 */

export interface FilterableJob {
  title?: string;
  description?: string;
  location?: string;
  locationRestrictions?: string[];
  candidateRequiredLocation?: string;
  jobGeo?: string;
  tags?: string[];
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
  "tel aviv", "bangalore", "bengaluru", "hyderabad", "mumbai",
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
        return { pass: false, reason: "geo_qualifier_location" };
      }
      if (
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

  // --- STEP 5: If no location was provided, require worldwide signal in text ---
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
      textToCheck.includes("across the globe");
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
export function isWorldwideRemote(job: FilterableJob): boolean {
  return analyzeWorldwideRemote(job).pass;
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
