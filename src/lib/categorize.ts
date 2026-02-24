import { Category } from "./types";

/**
 * Categorize a job into Engineering, Product, or Design.
 * Returns null if the job doesn't belong to any of the three.
 *
 * Philosophy: PRECISION over recall. Better to miss a job than
 * to show a Sales role under Engineering. Every match must be
 * unambiguous. Title is the primary signal.
 */

/**
 * Title patterns that EXCLUDE a job from our categories entirely.
 * These are roles that share keywords but aren't eng/design/product.
 * Checked first to prevent false positives.
 */
const EXCLUDE_TITLE_PATTERNS = [
  // Sales roles that contain "engineer" or "technical"
  /sales\s+engineer/i,
  /solutions?\s+engineer/i,
  /pre-?sales/i,
  /sales/i,
  /account\s+(executive|manager|director)/i,
  /business\s+development/i,
  /revenue/i,
  // Marketing roles
  /marketing/i,
  /growth\s+market/i,
  /content\s+market/i,
  /demand\s+gen/i,
  /seo\s+/i,
  /social\s+media/i,
  // Support/success
  /customer\s+(success|support|service|experience)/i,
  /technical\s+support/i,
  /support\s+engineer/i,
  /help\s+desk/i,
  // Operations / admin / HR / finance / legal
  /\b(hr|human\s+resources|recruiter|recruiting|talent\s+acq)/i,
  /\b(finance|accounting|accountant|payroll|controller)\b/i,
  /\b(legal|counsel|attorney|compliance|paralegal)\b/i,
  /\b(office\s+manager|executive\s+assistant|admin\s+assist)/i,
  /\boperations\s+(manager|director|lead|analyst)/i,
  // Generic leadership that isn't clearly eng/design/product
  /\bchief\s+(revenue|marketing|people|financial|operating)\b/i,
  // Data roles that are analytics/BI, not engineering
  /\b(data\s+analyst|business\s+analyst|business\s+intelligence)\b/i,
  /\banalyst\b(?!.*engineer)/i,
  // Copywriting, editorial (not design)
  /\b(copywriter|editor|editorial|journalist|technical\s+writer)\b/i,
  // Community
  /community\s+(manager|lead|director)/i,
  // Training / education
  /\b(trainer|training|instructor|enablement)\b/i,
  // Solutions/partner architect (not software architect)
  /\b(solution|partner|gsi|global\s+solution)\s+architect/i,
  // Intern roles (typically location-restricted and low relevance)
  /\bintern\b/i,
];

/** Engineering: must clearly be a software/infra/data engineering role */
const ENGINEERING_PATTERNS = [
  // "{role} engineer/developer" patterns
  /\b(software|backend|frontend|front[\s-]?end|back[\s-]?end|full[\s-]?stack)\s+(engineer|developer)\b/i,
  /\b(senior|staff|principal|lead|junior|mid[\s-]?level)?\s*(software|backend|frontend)\s*(engineer|developer)\b/i,
  /\bsoftware\s+(engineer|developer)\b/i,
  /\b(web|mobile|ios|android)\s+(engineer|developer)\b/i,
  // Reversed: "Engineer, {specialty}" (e.g. "Staff Engineer, Front End")
  /\bengineer[,:]?\s+(front[\s-]?end|back[\s-]?end|full[\s-]?stack|backend|frontend|mobile|ios|android|platform|cloud|security|infrastructure)/i,
  /\b(devops|sre|site\s+reliability)\s*(engineer)?\b/i,
  /\bplatform\s+engineer/i,
  /\binfrastructure\s+engineer/i,
  /\bcloud\s+engineer/i,
  /\bsystems?\s+engineer/i,
  /\bsecurity\s+engineer/i,
  /\b(qa|quality\s+assurance|sdet|test)\s+engineer/i,
  /\b(data|ml|machine\s+learning|ai)\s+engineer/i,
  /\bdata\s+scientist/i,
  /\b(embedded|firmware)\s+engineer/i,
  /\bblockchain\s+(engineer|developer)/i,
  /\b(rust|golang|python|java|typescript)\s+(engineer|developer)/i,
  /\bengineering\s+(manager|director|lead|head)\b/i,
  /\bvp\s+of\s+engineering/i,
  /\bhead\s+of\s+engineering/i,
  /\bcto\b/i,
  /\btech\s+lead\b/i,
  /\btechnical\s+lead\b/i,
  /\barchitect\b/i,
  // Bare "Staff/Senior Engineer" (common at top companies)
  /\b(staff|senior|principal|lead)\s+engineer\b/i,
  /\b(staff|senior|principal)\s+mobile\s+engineer\b/i,
  /\b(dev|developer)\b(?!.*ops.*manager)(?!.*rel)/i,
];

/** Design: must clearly be a design role */
const DESIGN_PATTERNS = [
  /\b(product|ux|ui|visual|interaction|graphic|web)\s+designer\b/i,
  /\b(senior|staff|principal|lead|junior)?\s*(product|ux|ui)\s+designer\b/i,
  // Bare "Staff/Senior Designer" (common at top companies)
  /\b(staff|senior|principal|lead)\s+designer\b/i,
  /\bux\b(?!\s*(research|writing|writer))/i,
  /\bui\b/i,
  // "User Interface / Visual Designer" style
  /\buser\s+(experience|interface)\b.*designer/i,
  /\bdesign\s+(manager|director|lead|head)\b/i,
  /\bvp\s+of\s+design/i,
  /\bhead\s+of\s+design/i,
  /\bcreative\s+director\b/i,
  /\bdesign\s+system/i,
  /\buser\s+research/i,
  /\bux\s+research/i,
  /\bcontent\s+designer\b/i,
  /\bmotion\s+design/i,
  /\bvisual\s+design/i,
  /\billustrat/i,
  /\bproduct\s+design/i,
  /\binteraction\s+design/i,
  /\bbrand\s+designer\b/i,
  // Vibe coding / creative coding / design engineering
  /\bvibe\s+cod/i,
  /\bcreative\s+(coder|developer|engineer|technologist)/i,
  /\bdesign\s+engineer/i,
  /\bcreative\s+tech/i,
  /\bprototyp/i,
];

/** Product: must clearly be a product management role */
const PRODUCT_PATTERNS = [
  /\bproduct\s+(manager|owner|lead|director|head|analyst)\b/i,
  /\bvp\s+of\s+product/i,
  /\bhead\s+of\s+product/i,
  /\bchief\s+product/i,
  /\bproduct\s+ops/i,
  /\bproduct\s+operations/i,
  /\bproduct\s+strateg/i,
  /\btechnical\s+program\s+manager\b/i,
  /\btpm\b/i,
  /\bprogram\s+manager\b/i,
  /\bproject\s+manager\b/i,
  /\bscrum\s+master\b/i,
  /\bagile\s+coach\b/i,
];

export function categorizeJob(
  title: string,
  tags: string[] = []
): Category | null {
  const titleLower = title.toLowerCase().trim();

  // Step 1: Exclude roles that definitely don't belong
  for (const pattern of EXCLUDE_TITLE_PATTERNS) {
    if (pattern.test(titleLower)) {
      return null;
    }
  }

  // Step 2: Match against categories using TITLE ONLY (not tags)
  // Tags are unreliable — a "Sales" department tag on an "Engineer" title is still valid,
  // but a "Software" tag on a "Marketing Manager" title is not.

  // Design first (to catch "Product Designer" as design, not product)
  for (const pattern of DESIGN_PATTERNS) {
    if (pattern.test(titleLower)) return "design";
  }

  // Product second
  for (const pattern of PRODUCT_PATTERNS) {
    if (pattern.test(titleLower)) return "product";
  }

  // Engineering last
  for (const pattern of ENGINEERING_PATTERNS) {
    if (pattern.test(titleLower)) return "engineering";
  }

  return null;
}
