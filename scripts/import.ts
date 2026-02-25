#!/usr/bin/env npx tsx
/**
 * Company Import Script
 *
 * Reads discovered/approved companies from CSV and adds them
 * to src/lib/companies.ts in the correct ATS sections.
 *
 * Usage:
 *   npx tsx scripts/import.ts                          # imports from discovered-new.csv
 *   npx tsx scripts/import.ts scripts/output/approved.csv  # imports from custom file
 *
 * Workflow:
 *   1. Run discover.ts → generates discovered-new.csv
 *   2. (Optional) Copy to approved.csv, remove rows you don't want
 *   3. Run import.ts → updates companies.ts
 */

import { readFileSync, writeFileSync } from "fs";
import { REMOTE_COMPANIES } from "../src/lib/companies";

// ─── Config ────────────────────────────────────────────────────────
const COMPANIES_FILE = "src/lib/companies.ts";
const DEFAULT_CSV = "scripts/output/discovered-new.csv";

// ─── Types ─────────────────────────────────────────────────────────
interface CSVRow {
  name: string;
  domain: string;
  atsType: string;
  atsSlug: string;
  totalJobs: number;
  worldwideJobs: number;
  status: string;
  careersUrl: string;
}

// ─── CSV Parsing ───────────────────────────────────────────────────
function parseCSV(content: string): CSVRow[] {
  const lines = content.trim().split("\n");
  if (lines.length < 2) return [];

  // Skip header
  return lines.slice(1).map((line) => {
    // Handle quoted CSV fields
    const fields: string[] = [];
    let current = "";
    let inQuotes = false;

    for (const char of line) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        fields.push(current);
        current = "";
      } else {
        current += char;
      }
    }
    fields.push(current);

    return {
      name: fields[0] || "",
      domain: fields[1] || "",
      atsType: fields[2] || "",
      atsSlug: fields[3] || "",
      totalJobs: parseInt(fields[4] || "0", 10),
      worldwideJobs: parseInt(fields[5] || "0", 10),
      status: fields[6] || "",
      careersUrl: fields[7] || "",
    };
  });
}

// ─── Generate Entry Line ───────────────────────────────────────────
function toEntryLine(row: CSVRow): string {
  const parts = [
    `name: "${row.name}"`,
    `domain: "${row.domain}"`,
    `careersUrl: "${row.careersUrl}"`,
    `atsType: "${row.atsType}"`,
    `atsSlug: "${row.atsSlug}"`,
  ];
  return `  { ${parts.join(", ")} },`;
}

// ─── Section Markers ───────────────────────────────────────────────
// We find the ATS section boundaries in companies.ts and insert before
// the next section or end of array.
const SECTION_MARKERS: Record<string, { start: RegExp; label: string }> = {
  greenhouse: {
    start: /^\s*\/\/.*GREENHOUSE/,
    label: "GREENHOUSE",
  },
  lever: {
    start: /^\s*\/\/.*LEVER/,
    label: "LEVER",
  },
  ashby: {
    start: /^\s*\/\/.*ASHBY/,
    label: "ASHBY",
  },
};

const SECTION_ORDER = ["greenhouse", "lever", "ashby", "custom"];

function findSectionEnd(
  lines: string[],
  sectionType: string
): number {
  const currentIdx = SECTION_ORDER.indexOf(sectionType);
  if (currentIdx === -1) return -1;

  // Find where this section starts
  const marker = SECTION_MARKERS[sectionType];
  if (!marker) return -1;

  let sectionStart = -1;
  for (let i = 0; i < lines.length; i++) {
    if (marker.start.test(lines[i])) {
      sectionStart = i;
      break;
    }
  }
  if (sectionStart === -1) return -1;

  // Find where the next section starts (that's where we stop)
  const nextSections = SECTION_ORDER.slice(currentIdx + 1);
  for (const next of nextSections) {
    const nextMarker = SECTION_MARKERS[next];
    if (!nextMarker) {
      // Custom section — look for the CUSTOM marker
      for (let i = sectionStart + 1; i < lines.length; i++) {
        if (/^\s*\/\/.*CUSTOM/.test(lines[i])) {
          // Go back to find the last non-empty, non-comment line before this
          for (let j = i - 1; j > sectionStart; j--) {
            if (lines[j].trim() && !lines[j].trim().startsWith("//")) {
              return j + 1;
            }
          }
          return i;
        }
      }
      continue;
    }

    for (let i = sectionStart + 1; i < lines.length; i++) {
      if (nextMarker.start.test(lines[i])) {
        // Go back to find the last entry line before this section
        for (let j = i - 1; j > sectionStart; j--) {
          if (lines[j].trim() && !lines[j].trim().startsWith("//")) {
            return j + 1;
          }
        }
        return i;
      }
    }
  }

  // No next section found — find the closing bracket of the array
  for (let i = lines.length - 1; i > sectionStart; i--) {
    if (lines[i].trim() === "];") {
      // Go back to last entry
      for (let j = i - 1; j > sectionStart; j--) {
        if (lines[j].trim() && !lines[j].trim().startsWith("//")) {
          return j + 1;
        }
      }
      return i;
    }
  }

  return -1;
}

// ─── Main ──────────────────────────────────────────────────────────
function main() {
  const csvPath = process.argv[2] || DEFAULT_CSV;

  console.log(`\nImporting companies from: ${csvPath}\n`);

  // Read CSV
  const csvContent = readFileSync(csvPath, "utf-8");
  const rows = parseCSV(csvContent).filter((r) => r.status === "NEW");

  if (rows.length === 0) {
    console.log("No NEW companies found in CSV. Nothing to import.");
    return;
  }

  // Check for duplicates against existing companies
  const existingDomains = new Set(REMOTE_COMPANIES.map((c) => c.domain));
  const toImport = rows.filter((r) => {
    if (existingDomains.has(r.domain)) {
      console.log(`  SKIP (already exists): ${r.name} (${r.domain})`);
      return false;
    }
    return true;
  });

  if (toImport.length === 0) {
    console.log("\nAll companies already exist. Nothing to import.");
    return;
  }

  // Group by ATS type
  const byAts: Record<string, CSVRow[]> = {};
  for (const row of toImport) {
    const type = row.atsType || "custom";
    if (!byAts[type]) byAts[type] = [];
    byAts[type].push(row);
  }

  // Sort each group alphabetically
  for (const type of Object.keys(byAts)) {
    byAts[type].sort((a, b) => a.name.localeCompare(b.name));
  }

  // Read companies.ts
  const fileContent = readFileSync(COMPANIES_FILE, "utf-8");
  let lines = fileContent.split("\n");

  let totalAdded = 0;
  const addedByType: Record<string, number> = {};

  // Insert into each section (process in reverse order so line numbers don't shift)
  const typesToProcess = Object.keys(byAts).sort(
    (a, b) => SECTION_ORDER.indexOf(b) - SECTION_ORDER.indexOf(a)
  );

  for (const atsType of typesToProcess) {
    const entries = byAts[atsType];
    if (!entries || entries.length === 0) continue;

    const insertAt = findSectionEnd(lines, atsType);
    if (insertAt === -1) {
      console.log(`  WARNING: Could not find ${atsType} section. Skipping ${entries.length} entries.`);
      continue;
    }

    // Build lines to insert
    const newLines = [
      "",
      `  // imported ${new Date().toISOString().split("T")[0]}`,
      ...entries.map(toEntryLine),
    ];

    lines.splice(insertAt, 0, ...newLines);
    totalAdded += entries.length;
    addedByType[atsType] = entries.length;

    for (const entry of entries) {
      console.log(`  ADD: ${entry.name} (${entry.atsType}/${entry.atsSlug})`);
    }
  }

  // Write back
  writeFileSync(COMPANIES_FILE, lines.join("\n"), "utf-8");

  // Summary
  console.log(`\n${"=".repeat(50)}`);
  console.log(`IMPORT COMPLETE`);
  console.log(`${"=".repeat(50)}`);
  console.log(`Added ${totalAdded} new companies:`);
  for (const [type, count] of Object.entries(addedByType)) {
    console.log(`  ${type}: ${count}`);
  }
  console.log(`\nFile updated: ${COMPANIES_FILE}`);
  console.log(`Run "npm run build" to verify, then test with "curl http://localhost:3000/api/cron"`);
}

main();
