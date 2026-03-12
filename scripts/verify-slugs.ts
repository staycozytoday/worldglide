#!/usr/bin/env npx tsx
/**
 * ATS slug verifier — detects ATS type from company name/domain,
 * generates candidate slugs, and verifies them against live APIs.
 *
 * Input:  JSON array of { name, domain } on stdin or a file path arg
 * Output: JSON array of verified { name, domain, atsType, atsSlug, jobCount }
 *
 * Usage:
 *   echo '[{"name":"Stripe","domain":"stripe.com"}]' | npx tsx scripts/verify-slugs.ts
 *   npx tsx scripts/verify-slugs.ts candidates.json
 */

import { readFileSync } from "fs";
import { REMOTE_COMPANIES } from "../src/lib/companies";

interface Candidate {
  name: string;
  domain: string;
}

interface VerifiedCompany {
  name: string;
  domain: string;
  atsType: "greenhouse" | "lever" | "ashby" | "workable";
  atsSlug: string;
  jobCount: number;
  careersUrl: string;
}

// ATS API endpoints
const ATS_ENDPOINTS: Record<string, (slug: string) => string> = {
  greenhouse: (s) => `https://boards-api.greenhouse.io/v1/boards/${s}/jobs`,
  lever: (s) => `https://api.lever.co/v0/postings/${s}?mode=json`,
  ashby: (s) => `https://api.ashbyhq.com/posting-api/job-board/${s}`,
  workable: (s) => `https://apply.workable.com/api/v3/accounts/${s}/jobs`,
};

const ATS_CAREERS_URLS: Record<string, (slug: string) => string> = {
  greenhouse: (s) => `https://boards.greenhouse.io/${s}`,
  lever: (s) => `https://jobs.lever.co/${s}`,
  ashby: (s) => `https://jobs.ashbyhq.com/${s}`,
  workable: (s) => `https://apply.workable.com/${s}`,
};

/** Generate slug candidates from a company name + domain */
function generateSlugs(name: string, domain: string): string[] {
  const slugs = new Set<string>();

  // From name: lowercase, remove special chars
  const nameSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, "");
  slugs.add(nameSlug);

  // With hyphens instead of spaces
  const hyphenSlug = name.toLowerCase().replace(/[^a-z0-9\s]+/g, "").replace(/\s+/g, "-");
  if (hyphenSlug !== nameSlug) slugs.add(hyphenSlug);

  // Domain prefix (e.g. stripe.com → stripe)
  const domainSlug = domain.split(".")[0].toLowerCase();
  slugs.add(domainSlug);

  // Common variations
  if (nameSlug.endsWith("io") || nameSlug.endsWith("ai") || nameSlug.endsWith("co")) {
    slugs.add(nameSlug.slice(0, -2));
  }

  // "Labs" suffix removal
  if (nameSlug.endsWith("labs")) {
    slugs.add(nameSlug.slice(0, -4));
  }

  // HQ suffix
  slugs.add(nameSlug + "hq");
  slugs.add(domainSlug + "hq");

  return [...slugs].filter(s => s.length >= 2);
}

/** Try to fetch a slug from an ATS and return job count, or -1 if not found */
async function tryAts(
  atsType: string,
  slug: string,
): Promise<number> {
  const url = ATS_ENDPOINTS[atsType](slug);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);

  try {
    const opts: RequestInit = {
      signal: controller.signal,
      headers: { "User-Agent": "worldglide-verify/1.0" },
    };

    // Workable needs POST
    if (atsType === "workable") {
      Object.assign(opts, {
        method: "POST",
        headers: { ...opts.headers, "Content-Type": "application/json" },
        body: JSON.stringify({ query: "", location: [], department: [], worktype: [], remote: [] }),
      });
    }

    const res = await fetch(url, opts);
    clearTimeout(timer);

    if (!res.ok) return -1;
    const data = await res.json();

    // Extract job count per ATS
    if (atsType === "greenhouse") return data.jobs?.length ?? 0;
    if (atsType === "lever") return Array.isArray(data) ? data.length : 0;
    if (atsType === "ashby") return data.jobs?.length ?? 0;
    if (atsType === "workable") return data.results?.length ?? 0;
    return 0;
  } catch {
    clearTimeout(timer);
    return -1;
  }
}

/** Verify a single candidate across all ATS platforms */
async function verifyCandidate(candidate: Candidate): Promise<VerifiedCompany | null> {
  const slugs = generateSlugs(candidate.name, candidate.domain);
  const atsTypes = Object.keys(ATS_ENDPOINTS);

  // Try each ATS × slug combination
  for (const atsType of atsTypes) {
    for (const slug of slugs) {
      const count = await tryAts(atsType, slug);
      if (count >= 0) {
        return {
          name: candidate.name,
          domain: candidate.domain,
          atsType: atsType as VerifiedCompany["atsType"],
          atsSlug: slug,
          jobCount: count,
          careersUrl: ATS_CAREERS_URLS[atsType](slug),
        };
      }
    }
  }

  return null;
}

async function main() {
  // Read input
  let input: string;
  const arg = process.argv[2];
  if (arg) {
    input = readFileSync(arg, "utf-8");
  } else {
    // Read from stdin
    const chunks: Buffer[] = [];
    for await (const chunk of process.stdin) chunks.push(chunk);
    input = Buffer.concat(chunks).toString();
  }

  const candidates: Candidate[] = JSON.parse(input);

  // Filter out companies already in our list
  const existingSlugs = new Set(REMOTE_COMPANIES.map(c => c.atsSlug?.toLowerCase()).filter(Boolean));
  const existingDomains = new Set(REMOTE_COMPANIES.map(c => c.domain.toLowerCase()));
  const newCandidates = candidates.filter(c =>
    !existingDomains.has(c.domain.toLowerCase())
  );

  console.error(`[verify] ${candidates.length} candidates, ${newCandidates.length} new (${candidates.length - newCandidates.length} already exist)`);

  // Verify in batches of 5
  const BATCH_SIZE = 5;
  const verified: VerifiedCompany[] = [];

  for (let i = 0; i < newCandidates.length; i += BATCH_SIZE) {
    const batch = newCandidates.slice(i, i + BATCH_SIZE);
    const results = await Promise.all(batch.map(c => verifyCandidate(c)));

    for (const result of results) {
      if (result) {
        // Double-check the slug isn't already used
        if (!existingSlugs.has(result.atsSlug.toLowerCase())) {
          verified.push(result);
          existingSlugs.add(result.atsSlug.toLowerCase());
        }
      }
    }

    if (i + BATCH_SIZE < newCandidates.length) {
      await new Promise(r => setTimeout(r, 500));
    }

    console.error(`[verify] progress: ${Math.min(i + BATCH_SIZE, newCandidates.length)}/${newCandidates.length}`);
  }

  console.error(`[verify] found ${verified.length} verified companies`);

  // Output as JSON to stdout
  console.log(JSON.stringify(verified, null, 2));
}

main().catch(err => {
  console.error("[verify] fatal:", err);
  process.exit(1);
});
