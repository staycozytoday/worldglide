import { Job, getCompanyLogoUrl } from "../types";
import { isWorldwideRemote } from "../filter";
import { categorizeJob } from "../categorize";
import { createJobId } from "../utils";
import { REMOTE_COMPANIES } from "../companies";

/**
 * Scrape jobs from Greenhouse-based companies.
 * API: https://boards-api.greenhouse.io/v1/boards/{slug}/jobs
 */
export async function scrapeGreenhouse(): Promise<Job[]> {
  const greenhouseCompanies = REMOTE_COMPANIES.filter(
    (c) => c.atsType === "greenhouse" && c.atsSlug
  );

  const results: Job[] = [];

  // Process companies in parallel batches of 10
  for (let i = 0; i < greenhouseCompanies.length; i += 10) {
    const batch = greenhouseCompanies.slice(i, i + 10);
    const batchResults = await Promise.allSettled(
      batch.map((company) => scrapeGreenhouseCompany(company.atsSlug!, company.name, company.domain))
    );

    for (const result of batchResults) {
      if (result.status === "fulfilled") {
        results.push(...result.value);
      }
    }

    // Brief pause between batches
    if (i + 10 < greenhouseCompanies.length) {
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  console.log(`[Greenhouse] Scraped ${results.length} worldwide jobs from ${greenhouseCompanies.length} companies`);
  return results;
}

async function scrapeGreenhouseCompany(
  slug: string,
  companyName: string,
  companyDomain?: string
): Promise<Job[]> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const res = await fetch(
      `https://boards-api.greenhouse.io/v1/boards/${slug}/jobs?content=true`,
      {
        headers: { "User-Agent": "worldglide-jobs/1.0" },
        signal: controller.signal,
      }
    );
    clearTimeout(timeout);

    if (!res.ok) {
      console.error(`[Greenhouse/${slug}] API error: ${res.status}`);
      return [];
    }

    const data = await res.json();
    const jobs = data.jobs || [];
    const results: Job[] = [];

    for (const item of jobs) {
      const locationName = item.location?.name || "";
      const content = item.content || "";

      if (
        !isWorldwideRemote({
          title: item.title,
          description: content,
          location: locationName,
        })
      ) {
        continue;
      }

      const category = categorizeJob(item.title);
      if (!category) continue;

      results.push({
        id: createJobId("greenhouse", `${slug}_${item.id}`),
        title: item.title || "",
        company: companyName,
        companyLogo: companyDomain ? getCompanyLogoUrl(companyDomain) : undefined,
        category,
        url:
          item.absolute_url ||
          `https://boards.greenhouse.io/${slug}/jobs/${item.id}`,
        source: "greenhouse",
        tags: (item.departments || []).map((d: { name: string }) => d.name),
        postedAt: item.updated_at || new Date().toISOString(),
        scrapedAt: new Date().toISOString(),
        description: content ? stripHtml(content).slice(0, 200) : undefined,
        isWorldwide: true,
        employmentType: "Full-time",
      });
    }

    return results;
  } catch (err) {
    console.error(`[Greenhouse/${slug}] Error:`, err);
    return [];
  }
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
