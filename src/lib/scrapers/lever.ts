import { Job, getCompanyLogoUrl } from "../types";
import { getJobRegion, isRemoteJob } from "../filter";
import { categorizeJob } from "../categorize";
import { createJobId, normalizeEmploymentType } from "../utils";
import { REMOTE_COMPANIES } from "../companies";
import { fetchWithRetry, CompanyResult } from "../fetch-retry";

export interface LeverResult {
  jobs: Job[];
  report: CompanyResult[];
}

/**
 * scrape jobs from lever-based companies.
 * api: https://api.lever.co/v0/postings/{slug}
 */
export async function scrapeLever(): Promise<LeverResult> {
  const companies = REMOTE_COMPANIES.filter(
    (c) => c.atsType === "lever" && c.atsSlug
  );

  const jobs: Job[] = [];
  const report: CompanyResult[] = [];

  for (let i = 0; i < companies.length; i += 3) {
    const batch = companies.slice(i, i + 3);
    const results = await Promise.allSettled(
      batch.map((c) => scrapeLeverCompany(c.atsSlug!, c.name, c.domain))
    );

    for (let j = 0; j < results.length; j++) {
      const r = results[j];
      const c = batch[j];
      if (r.status === "fulfilled") {
        jobs.push(...r.value.jobs);
        report.push({ company: c.name, ats: "lever", slug: c.atsSlug!, jobs: r.value.jobs.length, rawJobs: r.value.rawCount });
      } else {
        const msg = r.reason instanceof Error ? r.reason.message : String(r.reason);
        console.error(`[lever/${c.atsSlug}] failed after retries: ${msg}`);
        report.push({ company: c.name, ats: "lever", slug: c.atsSlug!, jobs: 0, rawJobs: 0, error: msg });
      }
    }

    if (i + 3 < companies.length) {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  const failed = report.filter((r) => r.error).length;
  console.log(
    `[lever] ${jobs.length} creative jobs from ${companies.length} companies` +
    (failed ? ` (${failed} failed)` : "")
  );
  return { jobs, report };
}

async function scrapeLeverCompany(
  slug: string,
  companyName: string,
  companyDomain?: string
): Promise<{ jobs: Job[]; rawCount: number }> {
  const res = await fetchWithRetry(
    `https://api.lever.co/v0/postings/${slug}?mode=json`,
    { headers: { "User-Agent": "worldglide-jobs/1.0" }, timeoutMs: 15000 }
  );

  if (!res.ok) {
    throw new Error(`api ${res.status}`);
  }

  const data = await res.json();
  if (!Array.isArray(data)) return { jobs: [], rawCount: 0 };

  const rawCount = data.length;
  const results: Job[] = [];

  for (const item of data) {
    const locationText =
      item.categories?.location || item.workplaceType || "";

    const fullDesc = item.descriptionPlain || "";

    const jobFilter = {
      title: item.text,
      description: fullDesc.slice(0, 200),
      location: locationText,
      companySlug: slug,
    };

    if (!isRemoteJob(jobFilter, fullDesc)) continue;

    const category = categorizeJob(item.text);
    if (!category) continue;

    const region = getJobRegion(jobFilter, fullDesc);

    results.push({
      id: createJobId("lever", `${slug}_${item.id}`),
      title: (item.text || "").trim(),
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
      region,
      employmentType: normalizeEmploymentType(item.categories?.commitment),
    });
  }

  return { jobs: results, rawCount };
}
