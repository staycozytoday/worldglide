import { Job, getCompanyLogoUrl } from "../types";
import { isWorldwideRemote } from "../filter";
import { categorizeJob } from "../categorize";
import { createJobId } from "../utils";
import { REMOTE_COMPANIES } from "../companies";

/**
 * Scrape jobs from Ashby-based companies.
 * API: GET https://api.ashbyhq.com/posting-api/job-board/{slug}
 *
 * Returns { jobs: [...] } with each job having:
 * title, location, team, department, employmentType,
 * publishedAt, isRemote, jobUrl, applyUrl, descriptionHtml,
 * address.postalAddress.addressCountry, compensationTierSummary
 */
export async function scrapeAshby(): Promise<Job[]> {
  const ashbyCompanies = REMOTE_COMPANIES.filter(
    (c) => c.atsType === "ashby" && c.atsSlug
  );

  const results: Job[] = [];

  // Process in batches of 10
  for (let i = 0; i < ashbyCompanies.length; i += 10) {
    const batch = ashbyCompanies.slice(i, i + 10);
    const batchResults = await Promise.allSettled(
      batch.map((company) =>
        scrapeAshbyCompany(company.atsSlug!, company.name, company.domain)
      )
    );

    for (const result of batchResults) {
      if (result.status === "fulfilled") {
        results.push(...result.value);
      }
    }

    if (i + 10 < ashbyCompanies.length) {
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  console.log(
    `[Ashby] Scraped ${results.length} worldwide jobs from ${ashbyCompanies.length} companies`
  );
  return results;
}

async function scrapeAshbyCompany(
  slug: string,
  companyName: string,
  companyDomain?: string
): Promise<Job[]> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const res = await fetch(
      `https://api.ashbyhq.com/posting-api/job-board/${slug}`,
      {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "User-Agent": "worldglide-jobs/1.0",
        },
        signal: controller.signal,
      }
    );
    clearTimeout(timeout);

    if (!res.ok) {
      console.error(`[Ashby/${slug}] API error: ${res.status}`);
      return [];
    }

    const data = await res.json();
    const jobs = data.jobs || [];
    const results: Job[] = [];

    for (const item of jobs) {
      // Build location string from Ashby's structured data
      const locationParts: string[] = [];
      if (item.location) locationParts.push(item.location);
      if (Array.isArray(item.secondaryLocations)) {
        for (const loc of item.secondaryLocations) {
          if (typeof loc === "string") locationParts.push(loc);
        }
      }
      // Also check address country
      const addressCountry = item.address?.postalAddress?.addressCountry || "";
      if (addressCountry && typeof addressCountry === "string" && !locationParts.some(l => typeof l === "string" && l.includes(addressCountry))) {
        locationParts.push(addressCountry);
      }

      const locationText = locationParts.join(", ");

      // Use isRemote flag from Ashby as additional signal
      if (!item.isRemote) continue;

      if (
        !isWorldwideRemote({
          title: item.title,
          description: item.descriptionHtml ? stripHtml(item.descriptionHtml) : "",
          location: locationText,
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

    return results;
  } catch (err) {
    console.error(`[Ashby/${slug}] Error:`, err);
    return [];
  }
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
