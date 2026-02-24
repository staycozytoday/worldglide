import { Job, getCompanyLogoUrl } from "../types";
import { isWorldwideRemote } from "../filter";
import { categorizeJob } from "../categorize";
import { createJobId } from "../utils";
import { REMOTE_COMPANIES } from "../companies";

/**
 * Scrape jobs from Lever-based companies.
 * API: https://api.lever.co/v0/postings/{slug}
 */
export async function scrapeLever(): Promise<Job[]> {
  const leverCompanies = REMOTE_COMPANIES.filter(
    (c) => c.atsType === "lever" && c.atsSlug
  );

  const results: Job[] = [];

  for (let i = 0; i < leverCompanies.length; i += 3) {
    const batch = leverCompanies.slice(i, i + 3);
    const batchResults = await Promise.allSettled(
      batch.map((company) => scrapeLeverCompany(company.atsSlug!, company.name, company.domain))
    );

    for (const result of batchResults) {
      if (result.status === "fulfilled") {
        results.push(...result.value);
      }
    }

    if (i + 3 < leverCompanies.length) {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  console.log(`[Lever] Scraped ${results.length} worldwide jobs from ${leverCompanies.length} companies`);
  return results;
}

async function scrapeLeverCompany(
  slug: string,
  companyName: string,
  companyDomain?: string
): Promise<Job[]> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const res = await fetch(
      `https://api.lever.co/v0/postings/${slug}?mode=json`,
      {
        headers: { "User-Agent": "worldglide-jobs/1.0" },
        signal: controller.signal,
      }
    );
    clearTimeout(timeout);

    if (!res.ok) {
      console.error(`[Lever/${slug}] API error: ${res.status}`);
      return [];
    }

    const jobs = await res.json();
    if (!Array.isArray(jobs)) return [];

    const results: Job[] = [];

    for (const item of jobs) {
      const locationText =
        item.categories?.location || item.workplaceType || "";

      if (
        !isWorldwideRemote({
          title: item.text,
          description: item.descriptionPlain || "",
          location: locationText,
        })
      ) {
        continue;
      }

      const category = categorizeJob(
        item.text,
        item.categories?.team ? [item.categories.team] : []
      );
      if (!category) continue;

      results.push({
        id: createJobId("lever", `${slug}_${item.id}`),
        title: item.text || "",
        company: companyName,
        companyLogo: companyDomain ? getCompanyLogoUrl(companyDomain) : undefined,
        category,
        url: item.hostedUrl || item.applyUrl || `https://jobs.lever.co/${slug}/${item.id}`,
        source: "lever",
        tags: [
          item.categories?.team,
          item.categories?.department,
        ].filter(Boolean) as string[],
        postedAt: item.createdAt
          ? new Date(item.createdAt).toISOString()
          : new Date().toISOString(),
        scrapedAt: new Date().toISOString(),
        description: item.descriptionPlain?.slice(0, 200) || undefined,
        isWorldwide: true,
        employmentType: item.categories?.commitment || "Full-time",
      });
    }

    return results;
  } catch (err) {
    console.error(`[Lever/${slug}] Error:`, err);
    return [];
  }
}
