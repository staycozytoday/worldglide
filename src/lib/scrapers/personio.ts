import { Job, getCompanyLogoUrl } from "../types";
import { isWorldwideRemote } from "../filter";
import { categorizeJob } from "../categorize";
import { createJobId } from "../utils";
import { REMOTE_COMPANIES } from "../companies";
import { fetchWithRetry, CompanyResult } from "../fetch-retry";

export interface PersonioResult {
  jobs: Job[];
  report: CompanyResult[];
}

/**
 * scrape jobs from personio-based companies.
 * api: https://{slug}.jobs.personio.de/xml
 */
export async function scrapePersonio(): Promise<PersonioResult> {
  const companies = REMOTE_COMPANIES.filter(
    (c) => c.atsType === "personio" && c.atsSlug
  );

  const jobs: Job[] = [];
  const report: CompanyResult[] = [];

  for (let i = 0; i < companies.length; i += 10) {
    const batch = companies.slice(i, i + 10);
    const results = await Promise.allSettled(
      batch.map((c) => scrapePersonioCompany(c.atsSlug!, c.name, c.domain))
    );

    for (let j = 0; j < results.length; j++) {
      const r = results[j];
      const c = batch[j];
      if (r.status === "fulfilled") {
        jobs.push(...r.value.jobs);
        report.push({ company: c.name, ats: "personio", slug: c.atsSlug!, jobs: r.value.jobs.length, rawJobs: r.value.rawCount });
      } else {
        const msg = r.reason instanceof Error ? r.reason.message : String(r.reason);
        console.error(`[personio/${c.atsSlug}] failed after retries: ${msg}`);
        report.push({ company: c.name, ats: "personio", slug: c.atsSlug!, jobs: 0, rawJobs: 0, error: msg });
      }
    }

    if (i + 10 < companies.length) {
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  const failed = report.filter((r) => r.error).length;
  console.log(
    `[personio] ${jobs.length} worldwide jobs from ${companies.length} companies` +
    (failed ? ` (${failed} failed)` : "")
  );
  return { jobs, report };
}

async function scrapePersonioCompany(
  slug: string,
  companyName: string,
  companyDomain?: string
): Promise<{ jobs: Job[]; rawCount: number }> {
  const res = await fetchWithRetry(
    `https://${slug}.jobs.personio.de/xml`,
    { headers: { "User-Agent": "worldglide-jobs/1.0" }, timeoutMs: 15000 }
  );

  if (!res.ok) {
    throw new Error(`api ${res.status}`);
  }

  const xml = await res.text();
  const positions = parsePersonioXml(xml);
  const rawCount = positions.length;
  const results: Job[] = [];

  for (const pos of positions) {
    const descriptionText = pos.descriptions.map((d) => d.value).join(" ");

    if (
      !isWorldwideRemote({
        title: pos.name,
        description: descriptionText,
        location: pos.office + " " + pos.additionalOffices.join(" "),
        companySlug: slug,
      })
    ) {
      continue;
    }

    const category = categorizeJob(pos.name);
    if (!category) continue;

    results.push({
      id: createJobId("personio", `${slug}_${pos.id}`),
      title: pos.name,
      company: companyName,
      companyLogo: companyDomain ? getCompanyLogoUrl(companyDomain) : undefined,
      category,
      url: `https://${slug}.jobs.personio.de/job/${pos.id}`,
      source: "personio",
      tags: pos.department ? [pos.department] : [],
      postedAt: pos.createdAt || new Date().toISOString(),
      scrapedAt: new Date().toISOString(),
      description: stripHtml(descriptionText).slice(0, 200) || undefined,
      isWorldwide: true,
      employmentType: pos.schedule || "Full-time",
    });
  }

  return { jobs: results, rawCount };
}

interface PersonioPosition {
  id: string;
  name: string;
  office: string;
  additionalOffices: string[];
  department: string;
  schedule: string;
  createdAt: string;
  subcompany: string;
  descriptions: { name: string; value: string }[];
}

/**
 * Simple XML parser for Personio's workzag-jobs XML format.
 * No external XML library needed — the schema is flat and predictable.
 */
function parsePersonioXml(xml: string): PersonioPosition[] {
  const positions: PersonioPosition[] = [];

  // Split by <position> tags
  const positionBlocks = xml.split("<position>").slice(1);

  for (const block of positionBlocks) {
    const endIdx = block.indexOf("</position>");
    const posXml = endIdx >= 0 ? block.substring(0, endIdx) : block;

    const id = extractTag(posXml, "id");
    const name = decodeXmlEntities(extractTag(posXml, "name") || "");
    const office = decodeXmlEntities(extractTag(posXml, "office") || "");
    const department = decodeXmlEntities(extractTag(posXml, "department") || "");
    const schedule = extractTag(posXml, "schedule") || "";
    const createdAt = extractTag(posXml, "createdAt") || "";
    const subcompany = decodeXmlEntities(extractTag(posXml, "subcompany") || "");

    // Extract additional offices
    const additionalOffices: string[] = [];
    const addOfficesMatch = posXml.match(/<additionalOffices>([\s\S]*?)<\/additionalOffices>/);
    if (addOfficesMatch) {
      const officeMatches = addOfficesMatch[1].matchAll(/<office>(.*?)<\/office>/g);
      for (const m of officeMatches) {
        additionalOffices.push(decodeXmlEntities(m[1]));
      }
    }

    // Extract job descriptions
    const descriptions: { name: string; value: string }[] = [];
    const descMatches = posXml.matchAll(/<jobDescription>\s*<name>(.*?)<\/name>\s*<value>\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*<\/value>\s*<\/jobDescription>/g);
    for (const m of descMatches) {
      descriptions.push({
        name: decodeXmlEntities(m[1]),
        value: m[2],
      });
    }

    if (id && name) {
      positions.push({
        id,
        name,
        office,
        additionalOffices,
        department,
        schedule,
        createdAt,
        subcompany,
        descriptions,
      });
    }
  }

  return positions;
}

function extractTag(xml: string, tag: string): string {
  const match = xml.match(new RegExp(`<${tag}>([^<]*)</${tag}>`));
  return match ? match[1].trim() : "";
}

function decodeXmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'");
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
