import { Category } from "./types";

/**
 * Categorize a job as "creative" or reject it (null).
 *
 * v4.2 strategy: worldglide is a creative-only job board.
 * Creative = design, brand, motion, UX, illustration, art direction,
 * content design, design engineering, and related crafts.
 *
 * PRECISION over recall. Better to miss a job than include a non-creative role.
 */

/**
 * Title patterns that EXCLUDE a job from the creative category.
 * These share keywords with creative roles but are not creative craft.
 * Order matters: run these BEFORE creative patterns.
 */
const EXCLUDE_PATTERNS = [
  // ── Semiconductor / chip / electronics engineering ─────────────────────────
  // These all contain "design" or "designer" but are hardware engineering roles.
  /\b(pcb|printed\s+circuit)\s+(design|designer|engineer|layout)/i,
  /\b(asic|rtl|soc|fpga|chiplet|vlsi)\b/i,                      // chip design acronyms — always hardware
  /\bbaw\b/i,                                                     // bulk acoustic wave filter
  /\bphysical\s+design\s+engineer/i,
  /\b(analog|digital\s+(logic|design)|mixed[\s-]signal|rf|rfic|mmic|silicon\s+photonic|photonic\s+circuit)\s+(design|designer|engineer|circuit)/i,
  /\b(ic|integrated\s+circuit)\s+(package|design|layout)\s*(engineer|designer)?/i,
  /\b(layout|circuit)\s+(design|designer|engineer)/i,
  /\bphotonic\s+circuits?\s+(design|designer|engineer)/i,         // optoelectronics — not creative
  /\bpic\s+(design|designer|engineer)/i,                          // photonic integrated circuit
  /\bsemiconductor\s+(design|engineer)/i,
  /\b(silicon|chip)\s+(design|engineer|validation)/i,
  /full\s+chip\s+physical/i,
  /die[\s-]to[\s-]die/i,
  /rtl\s+to\s+gdsii/i,
  /network\s+design\s+engineer/i,
  /\belectrical\s+harness/i,
  /\bharness\s+design/i,
  /\bcircuit\s+design/i,
  /\bcad\s+(design\s+engineer|designer)/i,                        // CAD roles are mechanical/engineering

  // ── Hardware / mechanical / aerospace / defense engineering ────────────────
  /\bhardware\s+design\s+engineer/i,
  /\bpropulsion\s+design/i,
  /\bwarhead/i,
  /\bmunition/i,
  /\bhot\s+cell/i,                                                // nuclear facility
  /\bmarine\s+system/i,
  /\bvehicle\s+structure/i,
  /\bcombustion\s+device/i,
  /\bmep\s+design/i,
  /\btooling\s+design/i,
  /\bmechanical[\s/]+(design|engineer)/i,                         // handles "Mechanical / Design Engineer"
  /\bmechanical\s+engineer/i,
  /\bmechanical\s+\w+\s+design/i,                                // "mechanical product designer", "mechanical product design engineer"
  /\belectrical\s+design\s+engineer/i,
  /\bcivil\s+design/i,
  /\bstructural\s+design/i,
  /\b(facility|facilities)\s+design/i,
  /\bsystems\s+design\s+engineer/i,
  /\bmanufacturing\s+design/i,
  /\binstrumentation\s+and\s+controls/i,
  /\bcontrols\s+design\s+engineer/i,
  /\bsatellite\s+(payload|hardware)/i,
  /package\s+design\s+engineer/i,   // semiconductor packaging (not consumer packaging)
  /sustainable\s+data\s+center/i,
  /data\s+center\s+design/i,
  /\bsenior\s+bess\s+design/i,
  /\bpolicy\s+design/i,
  /\barchitectural\s+project/i,                                   // architecture/construction

  // ── Aerospace / defense / energy / industrial (expanded) ──────────────────
  /\b(avionics|battery|energy\s+storage|thermal|optical)\s+design/i,
  /\bhardware\s+(design\s+)?(manager|director|lead|head)/i,
  /\b(aerospace|defense|naval|marine)\s+design/i,
  /\b(power\s+systems?|antenna|radar|sonar)\s+design/i,
  /\b(process|chemical|pipeline)\s+design/i,
  /\bembedded\s+(systems?\s+)?design/i,
  /\btest\s+(design\s+)?engineer/i,
  /\bquality\s+(design\s+)?engineer/i,
  /\bvalidation\s+engineer/i,
  /\bfirmware\s+(design|engineer)/i,
  /\broboti(cs?|x)\s+(design|engineer)/i,

  // ── Hardware design leadership (before creative "design manager") ──
  /\b(hardware|mechanical|electrical|structural|systems|civil|avionics|thermal|optical|battery|manufacturing|facilities?|mep|antenna)\s+design\s+(manager|director|lead|head)/i,

  // ── Fabrication / prototyping (hardware) ──────────────────────────────────
  /machinist/i,
  /fabrication\s+specialist/i,
  /\bshop\s+operations/i,
  /engineering\s+technician/i,
  /prototype\s+engineering\s+tech/i,
  /\bstudent\s+placement/i,

  // ── Non-creative brand management ─────────────────────────────────────────
  // Brand *designers* and brand strategists are creative; generic brand managers are marketing.
  /\b(employer|talent)\s+brand\s+manager/i,
  /brand\s+manager[\s,]*(tobacco|consumer|partnerships|new\s+zealand|nz|-)/i,
  /\bnew\s+zealand\s+brand\s+manager/i,

  // ── Sales ─────────────────────────────────────────────────────────────────
  /sales/i,
  /account\s+(executive|manager|director)/i,
  /business\s+development/i,
  /\brevenue\b/i,

  // ── Marketing (non-creative) ──────────────────────────────────────────────
  /\bmarketing\s+(manager|director|strategist|analyst|specialist|coordinator)/i,
  /growth\s+market/i,
  /demand\s+gen/i,
  /\bseo\b/i,

  // ── Support / success ─────────────────────────────────────────────────────
  /customer\s+(success|support|service|experience)/i,
  /help\s+desk/i,

  // ── Software engineering ──────────────────────────────────────────────────
  /\b(software|backend|frontend|full[\s-]?stack)\s+(engineer|developer)\b/i,
  /\b(devops|sre|site\s+reliability)\b/i,
  /\b(data|ml|machine\s+learning|ai)\s+engineer/i,
  /\bdata\s+scientist/i,
  /\b(security|infosec)\s+engineer/i,

  // ── Operations / admin / HR / finance / legal ─────────────────────────────
  /\b(hr|human\s+resources|recruiter|recruiting|talent\s+acq)/i,
  /\b(finance|accounting|accountant|payroll|controller)\b/i,
  /\b(legal|counsel|attorney|compliance|paralegal)\b/i,
  /\b(office\s+manager|executive\s+assistant|admin\s+assist)/i,

  // ── Product management (not product design) ───────────────────────────────
  /\bproduct\s+(manager|owner|ops|operations|strategist|analyst)\b/i,
  /\btechnical\s+program\s+manager\b/i,
  /\bprogram\s+manager\b/i,
  /\bproject\s+manager\b/i,
  /\bscrum\s+master\b/i,

  // ── Intern roles ──────────────────────────────────────────────────────────
  /\bintern(ship)?\b/i,

  // ── Game systems / balance (not visual design) ─────────────────────────────
  /\bnumerical\s+design/i,                                   // "Game Numerical Designer" = game balance, not creative
  /\bgame\s+balance\s+designer/i,
  /\bsystems\s+designer\b(?!.*(ux|experience))/i,            // game systems designer (not UX systems)
];

/**
 * Creative role patterns. Must clearly be a design or creative craft role.
 */
const CREATIVE_PATTERNS = [
  // Product & UX design
  /\b(product|ux|ui|visual|interaction|graphic|web)\s+designer\b/i,
  /\b(senior|staff|principal|lead|junior)?\s*(product|ux|ui)\s+designer\b/i,
  /\b(staff|senior|principal|lead)\s+designer\b/i,
  /\buser\s+(experience|interface)\b.*designer/i,
  /\bdesign\s+(manager|director|lead|head)\b/i,
  /\bvp\s+of\s+design/i,
  /\bhead\s+of\s+design/i,
  // Brand & visual
  /\bcreative\s+director\b/i,
  /\bbrand\s+designer\b/i,
  /\bbrand\s+(strategist|lead)\b/i,
  /\bart\s+director\b/i,
  /\bvisual\s+design/i,
  /\bgraphic\s+designer?\b/i,
  // UX research & writing
  /\buser\s+research/i,
  /\bux\s+research/i,
  /\bdesign\s+research/i,
  /\bux\s+writ/i,
  /\bcontent\s+designer\b/i,
  /\bcontent\s+strateg/i,
  // Design systems & ops
  /\bdesign\s+system/i,
  /\bdesign\s+ops/i,
  /\bdesign\s+operations/i,
  /\bdesign\s+technolog/i,
  // Creative engineering (digital/software, not hardware)
  /\bvibe\s+cod/i,
  /\bcreative\s+(coder|developer|engineer|technologist)\b/i,
  /\bdesign\s+engineer/i,
  /\bcreative\s+tech/i,
  // AI-native creative
  /\bai\s+(?:native\s+)?(?:product\s+)?designer\b/i,
  /\bai\s+(?:native\s+)?(?:ux|ui|visual|graphic|brand|motion|experience|interaction)\s+designer\b/i,
  /\bai\s+design(?:er)?\b/i,
  /\bgenai\s+design/i,
  // Specialised
  /\bservice\s+design/i,
  /\bexperience\s+design/i,
  /\binteraction\s+design/i,
  /\bproduct\s+design/i,
  /\bdesign\s+strateg/i,
  /\baccessibility\s+(designer|specialist|lead|manager)\b/i,
  /\bconversational\s+design/i,
  /\bvoice\s+design/i,
  /\bux\s+copywriter/i,
];

export function categorizeJob(
  title: string,
  _tags?: string[], // accepted for API compatibility but unused — title-only matching is more precise
): Category | null {
  const t = title.toLowerCase().trim();

  // Exclude first — prevents false positives
  for (const pattern of EXCLUDE_PATTERNS) {
    if (pattern.test(t)) return null;
  }

  // Must match a creative pattern
  for (const pattern of CREATIVE_PATTERNS) {
    if (pattern.test(t)) return "creative";
  }

  return null;
}
