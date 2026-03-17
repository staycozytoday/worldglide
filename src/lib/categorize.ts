import { Category } from "./types";

/**
 * Categorize a job into Engineering, Product, or Design.
 * Returns null if the job doesn't belong to any of the three.
 *
 * Philosophy: The craft trio — engineers, designers, and product people
 * are the minimum to build something from nothing. That's the focus.
 *
 * Engineering = builds it (software, infra, security, IT, data eng)
 * Design = shapes it (product, UX, UI, visual, research, motion)
 * Product = steers it (PM, TPM, data analyst, tech writer, strategy)
 *
 * PRECISION over recall. Better to miss a job than miscategorize.
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
  /\b(?<!design\s)operations\s+(manager|director|lead|analyst)/i,
  // Generic leadership that isn't clearly eng/design/product
  /\bchief\s+(revenue|marketing|people|financial|operating)\b/i,
  // BI/business analyst (not data analyst — that's product)
  /\b(business\s+analyst|business\s+intelligence)\b/i,
  // Copywriting, editorial (not design) — but allow "UX writer/copywriter"
  /\b(?<!ux\s)copywriter\b/i,
  /\b(?<!ux\s)editor(?!ial\s+design)\b/i,
  /\beditorial(?!\s+design)\b/i,
  /\bjournalist\b/i,
  // Community
  /community\s+(manager|lead|director)/i,
  // Training / education
  /\b(trainer|training|instructor|enablement)\b/i,
  // Solutions/partner architect (not software architect)
  /\b(solution|partner|gsi|global\s+solution)\s+architect/i,
  // Intern roles (typically location-restricted and low relevance)
  /\bintern\b/i,
  // Mechanical / hardware / facilities design (not software design)
  /\bmechanical\s+design/i,
  /\b(facility|facilities)\s+design/i,
  /\bhot\s+cell\s+design/i,
  /\breactor\b/i,
  /\bfuel\s+fabrication/i,
  /\belectrical\s+design\s+engineer/i,
  /\bcivil\s+design\s+engineer/i,
  /\bstructural\s+design\s+engineer/i,
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
  // Security / InfoSec (non-engineer titles still craft roles)
  /\b(security|infosec|information\s+security)\s+(analyst|specialist|consultant|researcher|architect|director|lead|head|manager)\b/i,
  /\bcybersecurity\b/i,
  /\bpentester\b/i,
  /\bpenetration\s+test/i,
  /\bthreat\s+(analyst|researcher|engineer|hunter)/i,
  /\bsoc\s+analyst/i,
  /\bsecurity\s+operations/i,
  /\bciso\b/i,
  // IT / Sysadmin (infrastructure craft)
  /\b(system|network|database)\s+admin/i,
  /\bsysadmin\b/i,
  /\bit\s+(engineer|manager|director|lead|specialist|administrator)\b/i,
  /\bnetwork\s+engineer/i,
  /\bdatabase\s+(engineer|administrator|architect)\b/i,
  // Crypto / Web3 engineering
  /\bprotocol\s+engineer/i,
  /\bsmart\s+contract\s+(engineer|developer|auditor)/i,
  /\bsolidity\s+(engineer|developer)/i,
  /\bblockchain\s+architect/i,
  // AI / ML research
  /\bresearch\s+(engineer|scientist)/i,
  /\bapplied\s+scientist/i,
  /\bml(ops)?\s+engineer/i,
  // Infra / platform
  /\brelease\s+engineer/i,
  /\bautomation\s+engineer/i,
  /\bperformance\s+engineer/i,
  /\bintegration\s+engineer/i,
  /\bapi\s+engineer/i,
  /\bcore\s+engineer/i,
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
  // Writing & content (design craft)
  /\bux\s+writ/i,                           // UX Writer, UX Writing Lead
  /\bcontent\s+strateg/i,                    // Content Strategist (design side)
  // Service & experience design
  /\bservice\s+design/i,                     // Service Designer
  /\bexperience\s+design/i,                  // Experience Designer
  // Research (design)
  /\bdesign\s+research/i,                    // Design Researcher
  // Ops & strategy
  /\bdesign\s+ops/i,                         // Design Ops Manager
  /\bdesign\s+operations/i,                  // Design Operations
  /\bdesign\s+strateg/i,                     // Design Strategist
  // Art direction
  /\bart\s+director\b/i,                     // Art Director
  // Specialized design
  /\bdesign\s+technolog/i,                   // Design Technologist
  /\baccessibility\s+(designer|specialist|lead|manager|engineer)/i,
  /\bconversational\s+design/i,             // Conversational Designer
  /\bvoice\s+design/i,                       // Voice Designer
  /\bgame\s+design/i,                        // Game Designer
  /\bsound\s+design/i,                       // Sound Designer
  // UX copywriter (rescued from exclusion)
  /\bux\s+copywriter/i,
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
  // Data analyst (understands the product through data)
  /\bdata\s+analyst/i,
  /\banalytics\s+(manager|lead|director|engineer)\b/i,
  // Technical writer (documents the product)
  /\btechnical\s+writer\b/i,
  /\btechnical\s+writing/i,
  /\bdocumentation\s+(engineer|manager|lead|specialist)\b/i,
  /\bapi\s+writer\b/i,
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
