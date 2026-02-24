/**
 * Worldwide-only quality filter.
 *
 * Philosophy: OPT-IN, not opt-out.
 * A job must PROVE it's worldwide. If there's any doubt, reject it.
 * "Remote" alone is not enough — "Remote, US" is US-only.
 * Only jobs with no geographic qualifiers pass.
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
 * If location is "Remote, {ANYTHING HERE}" → it's restricted.
 */
const COUNTRY_AND_REGION_TERMS = [
  // Countries
  "us", "usa", "u.s.", "u.s.a.", "united states", "america",
  "uk", "u.k.", "united kingdom", "britain", "england", "scotland", "wales",
  "canada", "australia", "india", "germany", "france", "spain",
  "italy", "netherlands", "ireland", "israel", "brazil", "mexico",
  "japan", "korea", "china", "singapore", "sweden", "norway",
  "denmark", "finland", "poland", "portugal", "switzerland",
  "austria", "belgium", "czech", "romania", "new zealand",
  "south africa", "argentina", "chile", "colombia", "turkey",
  "philippines", "indonesia", "thailand", "vietnam", "malaysia",
  "taiwan", "hong kong",
  // Regions
  "emea", "apac", "americas", "north america", "south america",
  "latin america", "latam", "europe", "european union", "eu",
  "asia", "asia pacific", "middle east", "africa",
  // US states (common in remote listings)
  "california", "new york", "texas", "florida", "washington",
  "colorado", "massachusetts", "illinois", "georgia", "virginia",
  "oregon", "pennsylvania", "ohio", "michigan", "north carolina",
  "arizona", "maryland", "minnesota", "connecticut", "utah",
  // Canadian provinces
  "ontario", "british columbia", "quebec", "alberta",
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
];

/** Phrases in title/description that prove geographic restriction */
const RESTRICTION_PHRASES = [
  "us only", "usa only", "uk only", "eu only", "europe only",
  "canada only", "australia only",
  "us-based", "uk-based", "eu-based",
  "us based", "uk based", "eu based",
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
  "us timezone required", "us time zone required",
  "americas only", "emea only", "apac only",
  "est only", "pst only", "cet only", "gmt only",
  "north america only", "europe only",
];

/**
 * Returns true ONLY if the job is genuinely available worldwide.
 *
 * The logic:
 * 1. If location field exists, it must match a known worldwide pattern EXACTLY.
 *    "Remote" alone = worldwide. "Remote, US" = NOT worldwide.
 * 2. If location has any country/region qualifier after "Remote" → reject.
 * 3. If description/title contains restriction phrases → reject.
 * 4. If no location field at all, check description for worldwide signals.
 */
export function isWorldwideRemote(job: FilterableJob): boolean {
  const location = (job.location || "").trim();
  let locationIsExactWorldwide = false;

  // --- STEP 1: Analyze location field ---
  if (location) {
    const locLower = location.toLowerCase().trim();

    // Check if it exactly matches a known worldwide location
    if (WORLDWIDE_EXACT_LOCATIONS.includes(locLower)) {
      locationIsExactWorldwide = true;
      // Strong signal — proceed to structural checks but skip description scanning
    } else {
      // Location has qualifiers. Parse "Remote, X" or "Remote - X" patterns.
      // If location contains "remote" but also contains a country/region → reject
      if (hasGeographicQualifier(locLower)) {
        return false;
      }

      // If location doesn't contain "remote" at all and isn't a worldwide keyword → reject
      if (!locLower.includes("remote") && !locLower.includes("worldwide") && !locLower.includes("anywhere") && !locLower.includes("global")) {
        return false;
      }
    }
  }

  // --- STEP 2: Check structured location restrictions ---
  // These are explicit machine-readable fields → always trust them
  if (job.locationRestrictions && job.locationRestrictions.length > 0) {
    return false;
  }
  if (job.candidateRequiredLocation) {
    const crl = job.candidateRequiredLocation.toLowerCase();
    if (!isWorldwideKeyword(crl)) {
      return false;
    }
  }
  if (job.jobGeo) {
    const geo = job.jobGeo.toLowerCase();
    if (!isWorldwideKeyword(geo)) {
      return false;
    }
  }

  // --- STEP 3: Check title for country/region names ---
  // Titles like "Backend Engineer, Canada" or "Senior Dev (US)" are restricted
  if (job.title) {
    const titleLower = job.title.toLowerCase();
    if (hasGeographicQualifier(titleLower)) {
      return false;
    }
  }

  // --- STEP 4: Scan description for restriction phrases ---
  // ONLY if the location field wasn't an exact worldwide match.
  // When location is explicitly "Remote" or "Worldwide", generic legal boilerplate
  // like "must reside in the country specified in posting" should NOT override it.
  // The location field is the strongest signal we have.
  if (!locationIsExactWorldwide) {
    const textToCheck = [job.title || "", job.description || ""]
      .join(" ")
      .toLowerCase();

    for (const phrase of RESTRICTION_PHRASES) {
      if (textToCheck.includes(phrase)) {
        return false;
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
      textToCheck.includes("location independent");
    if (!hasWorldwideSignal) {
      return false;
    }
  }

  return true;
}

/** Check if a location string contains country or region qualifiers */
function hasGeographicQualifier(location: string): boolean {
  // Split on common delimiters: comma, semicolon, dash, parentheses
  // NOTE: We do NOT split on "/" because titles like "User Interface / Visual Designer"
  // would produce "user interface" which falsely matches "us" as a substring.
  const parts = location.split(/[,;\-()|·•]+/).map((p) => p.trim());

  for (const part of parts) {
    if (!part) continue;
    // Skip the "remote" part itself
    if (part === "remote") continue;

    // Check if this part matches a known country/region
    for (const term of COUNTRY_AND_REGION_TERMS) {
      if (part === term) {
        // Exact match is always valid
        return true;
      }
      // For short terms (≤3 chars like "us", "uk", "eu"), require word boundary match
      // to prevent "user" matching "us", "queue" matching "eu", etc.
      if (term.length <= 3) {
        const wordBoundaryRegex = new RegExp(`\\b${term}\\b`);
        if (wordBoundaryRegex.test(part)) {
          return true;
        }
      } else {
        // Longer terms are safe for substring matching
        if (part.includes(term)) {
          return true;
        }
      }
    }

    // If the part is a standalone 2-letter code (likely country code like US, UK, DE)
    if (/^[a-z]{2}$/.test(part) && part !== "no") {
      return true;
    }
  }

  return false;
}

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
