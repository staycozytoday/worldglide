import { Job, getCompanyLogoUrl } from "../types";
import { isWorldwideRemote } from "../filter";
import { categorizeJob } from "../categorize";
import { createJobId } from "../utils";
import { REMOTE_COMPANIES } from "../companies";
import { fetchWithRetry, CompanyResult } from "../fetch-retry";

export interface AshbyResult {
  jobs: Job[];
  report: CompanyResult[];
}

/**
 * scrape jobs from ashby-based companies.
 * api: GET https://api.ashbyhq.com/posting-api/job-board/{slug}
 */
export async function scrapeAshby(): Promise<AshbyResult> {
  const companies = REMOTE_COMPANIES.filter(
    (c) => c.atsType === "ashby" && c.atsSlug
  );

  const jobs: Job[] = [];
  const report: CompanyResult[] = [];

  for (let i = 0; i < companies.length; i += 10) {
    const batch = companies.slice(i, i + 10);
    const results = await Promise.allSettled(
      batch.map((c) =>
        scrapeAshbyCompany(c.atsSlug!, c.name, c.domain)
      )
    );

    for (let j = 0; j < results.length; j++) {
      const r = results[j];
      const c = batch[j];
      if (r.status === "fulfilled") {
        jobs.push(...r.value.jobs);
        report.push({ company: c.name, ats: "ashby", slug: c.atsSlug!, jobs: r.value.jobs.length, rawJobs: r.value.rawCount });
      } else {
        const msg = r.reason instanceof Error ? r.reason.message : String(r.reason);
        console.error(`[ashby/${c.atsSlug}] failed after retries: ${msg}`);
        report.push({ company: c.name, ats: "ashby", slug: c.atsSlug!, jobs: 0, rawJobs: 0, error: msg });
      }
    }

    if (i + 10 < companies.length) {
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  const failed = report.filter((r) => r.error).length;
  console.log(
    `[ashby] ${jobs.length} worldwide jobs from ${companies.length} companies` +
    (failed ? ` (${failed} failed)` : "")
  );
  return { jobs, report };
}

async function scrapeAshbyCompany(
  slug: string,
  companyName: string,
  companyDomain?: string
): Promise<{ jobs: Job[]; rawCount: number }> {
  const res = await fetchWithRetry(
    `https://api.ashbyhq.com/posting-api/job-board/${slug}`,
    {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "User-Agent": "worldglide-jobs/1.0",
      },
      timeoutMs: 15000,
    }
  );

  if (!res.ok) {
    throw new Error(`api ${res.status}`);
  }

  const data = await res.json();
  const items = data.jobs || [];
  const rawCount = items.length;
  const results: Job[] = [];

  for (const item of items) {
    const locationParts: string[] = [];
    if (item.location) locationParts.push(item.location);
    if (Array.isArray(item.secondaryLocations)) {
      for (const loc of item.secondaryLocations) {
        if (typeof loc === "string") locationParts.push(loc);
      }
    }
    const addressCountry = item.address?.postalAddress?.addressCountry || "";
    if (
      addressCountry &&
      typeof addressCountry === "string" &&
      !locationParts.some((l) => typeof l === "string" && l.includes(addressCountry))
    ) {
      locationParts.push(addressCountry);
    }

    const locationText = locationParts.join(", ");

    if (!item.isRemote) continue;

    if (
      !isWorldwideRemote({
        title: item.title,
        description: item.descriptionHtml ? stripHtml(item.descriptionHtml) : "",
        location: locationText,
        companySlug: slug,
      })
    ) {
      continue;
    }

    const category = categorizeJob(item.title);
    if (!category) continue;

    results.push({
      id: createJobId("ashby", `${slug}_${item.id}`),
      title: item.title || "",
      company: companyName,
      companyLogo: companyDomain
        ? getCompanyLogoUrl(companyDomain)
        : undefined,
      category,
      url:
        item.jobUrl ||
        item.applyUrl ||
        `https://jobs.ashbyhq.com/${slug}/${item.id}`,
      source: "ashby" as const,
      tags: [item.team, item.department].filter(Boolean) as string[],
      salary: item.compensationTierSummary || undefined,
      postedAt: item.publishedAt
        ? new Date(item.publishedAt).toISOString()
        : new Date().toISOString(),
      scrapedAt: new Date().toISOString(),
      description: item.descriptionHtml
        ? stripHtml(item.descriptionHtml).slice(0, 200)
        : undefined,
      isWorldwide: true,
      employmentType: item.employmentType || "Full-time",
    });
  }

  return { jobs: results, rawCount };
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
