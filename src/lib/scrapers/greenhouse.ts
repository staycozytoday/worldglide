import { Job, getCompanyLogoUrl } from "../types";
import { getJobRegion, isRemoteJob } from "../filter";
import { categorizeJob } from "../categorize";
import { createJobId, normalizeEmploymentType, stripHtml } from "../utils";
import { REMOTE_COMPANIES } from "../companies";
import { fetchWithRetry, CompanyResult } from "../fetch-retry";

export interface GreenhouseResult {
  jobs: Job[];
  report: CompanyResult[];
}

/**
 * scrape jobs from greenhouse-based companies.
 * api: https://boards-api.greenhouse.io/v1/boards/{slug}/jobs
 */
export async function scrapeGreenhouse(): Promise<GreenhouseResult> {
  const companies = REMOTE_COMPANIES.filter(
    (c) => c.atsType === "greenhouse" && c.atsSlug
  );

  const jobs: Job[] = [];
  const report: CompanyResult[] = [];

  for (let i = 0; i < companies.length; i += 10) {
    const batch = companies.slice(i, i + 10);
    const results = await Promise.allSettled(
      batch.map((c) => scrapeGreenhouseCompany(c.atsSlug!, c.name, c.domain))
    );

    for (let j = 0; j < results.length; j++) {
      const r = results[j];
      const c = batch[j];
      if (r.status === "fulfilled") {
        jobs.push(...r.value.jobs);
        report.push({ company: c.name, ats: "greenhouse", slug: c.atsSlug!, jobs: r.value.jobs.length, rawJobs: r.value.rawCount });
      } else {
        const msg = r.reason instanceof Error ? r.reason.message : String(r.reason);
        console.error(`[greenhouse/${c.atsSlug}] failed after retries: ${msg}`);
        report.push({ company: c.name, ats: "greenhouse", slug: c.atsSlug!, jobs: 0, rawJobs: 0, error: msg });
      }
    }

    if (i + 10 < companies.length) {
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  const failed = report.filter((r) => r.error).length;
  console.log(
    `[greenhouse] ${jobs.length} creative jobs from ${companies.length} companies` +
    (failed ? ` (${failed} failed)` : "")
  );
  return { jobs, report };
}

async function scrapeGreenhouseCompany(
  slug: string,
  companyName: string,
  companyDomain?: string
): Promise<{ jobs: Job[]; rawCount: number }> {
  const res = await fetchWithRetry(
    `https://boards-api.greenhouse.io/v1/boards/${slug}/jobs?content=true`,
    { headers: { "User-Agent": "worldglide-jobs/1.0" }, timeoutMs: 15000 }
  );

  if (!res.ok) {
    throw new Error(`api ${res.status}`);
  }

  const data = await res.json();
  const items = data.jobs || [];
  const rawCount = items.length;
  const results: Job[] = [];

  for (const item of items) {
    const locationName = item.location?.name || "";
    const content = item.content || "";
    const fullDesc = content ? stripHtml(content) : "";

    const jobFilter = {
      title: item.title,
      description: fullDesc.slice(0, 200),
      location: locationName,
      companySlug: slug,
    };

    if (!isRemoteJob(jobFilter, fullDesc)) continue;

    const category = categorizeJob(item.title);
    if (!category) continue;

    const region = getJobRegion(jobFilter, fullDesc);

    results.push({
      id: createJobId("greenhouse", `${slug}_${item.id}`),
      title: (item.title || "").trim(),
      company: companyName,
      companyLogo: companyDomain ? getCompanyLogoUrl(companyDomain) : undefined,
      category,
      url:
        item.absolute_url ||
        `https://job-boards.greenhouse.io/${slug}/jobs/${item.id}`,
      source: "greenhouse",
      tags: (item.departments || []).map((d: { name: string }) => d.name),
      postedAt: item.updated_at || new Date().toISOString(),
      scrapedAt: new Date().toISOString(),
      description: content ? stripHtml(content).slice(0, 200) : undefined,
      region,
      employmentType: normalizeEmploymentType(undefined), // Greenhouse list API has no employment type field
    });
  }

  return { jobs: results, rawCount };
}

