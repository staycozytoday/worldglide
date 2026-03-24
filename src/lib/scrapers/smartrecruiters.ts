import { Job, getCompanyLogoUrl } from "../types";
import { getJobRegion, isRemoteJob } from "../filter";
import { categorizeJob } from "../categorize";
import { createJobId, normalizeEmploymentType } from "../utils";
import { REMOTE_COMPANIES } from "../companies";
import { fetchWithRetry, CompanyResult } from "../fetch-retry";

export interface SmartRecruitersResult {
  jobs: Job[];
  report: CompanyResult[];
}

/**
 * scrape jobs from smartrecruiters-based companies.
 * api: https://api.smartrecruiters.com/v1/companies/{slug}/postings
 *
 * public JSON API, no auth required.
 * rate limit: 10 req/s, 8 concurrent max.
 */
export async function scrapeSmartRecruiters(): Promise<SmartRecruitersResult> {
  const companies = REMOTE_COMPANIES.filter(
    (c) => c.atsType === "smartrecruiters" && c.atsSlug
  );

  const jobs: Job[] = [];
  const report: CompanyResult[] = [];

  // batch of 8 (SmartRecruiters allows 8 concurrent)
  for (let i = 0; i < companies.length; i += 8) {
    const batch = companies.slice(i, i + 8);
    const results = await Promise.allSettled(
      batch.map((c) =>
        scrapeSmartRecruitersCompany(c.atsSlug!, c.name, c.domain)
      )
    );

    for (let j = 0; j < results.length; j++) {
      const r = results[j];
      const c = batch[j];
      if (r.status === "fulfilled") {
        jobs.push(...r.value.jobs);
        report.push({
          company: c.name,
          ats: "smartrecruiters",
          slug: c.atsSlug!,
          jobs: r.value.jobs.length,
          rawJobs: r.value.rawCount,
        });
      } else {
        const msg =
          r.reason instanceof Error ? r.reason.message : String(r.reason);
        console.error(`[smartrecruiters/${c.atsSlug}] failed: ${msg}`);
        report.push({
          company: c.name,
          ats: "smartrecruiters",
          slug: c.atsSlug!,
          jobs: 0,
          rawJobs: 0,
          error: msg,
        });
      }
    }

    if (i + 8 < companies.length) {
      await new Promise((r) => setTimeout(r, 300));
    }
  }

  const failed = report.filter((r) => r.error).length;
  console.log(
    `[smartrecruiters] ${jobs.length} creative jobs from ${companies.length} companies` +
      (failed ? ` (${failed} failed)` : "")
  );
  return { jobs, report };
}

async function scrapeSmartRecruitersCompany(
  slug: string,
  companyName: string,
  companyDomain?: string
): Promise<{ jobs: Job[]; rawCount: number }> {
  // SmartRecruiters paginates with limit/offset, max 100 per page
  let allItems: any[] = [];
  let offset = 0;
  const limit = 100;

  while (true) {
    const res = await fetchWithRetry(
      `https://api.smartrecruiters.com/v1/companies/${slug}/postings?limit=${limit}&offset=${offset}`,
      { headers: { "User-Agent": "worldglide-jobs/1.0" }, timeoutMs: 12000 }
    );

    if (!res.ok) {
      throw new Error(`api ${res.status}`);
    }

    const data = await res.json();
    const items = data.content || [];
    allItems.push(...items);

    // if fewer than limit returned, we've reached the end
    if (items.length < limit) break;
    offset += limit;

    // safety cap
    if (offset > 2000) break;
  }

  const rawCount = allItems.length;

  // Phase 1: filter to creative remote candidates using list data only
  type Candidate = { item: any; locationStr: string; jobFilter: ReturnType<typeof buildJobFilter> };
  const candidates: Candidate[] = [];

  for (const item of allItems) {
    const loc = item.location || {};
    const locationParts = [loc.city, loc.region, loc.country]
      .filter(Boolean)
      .join(", ");
    const isRemoteField = loc.remote === true;
    const locationStr = isRemoteField
      ? `Remote${locationParts ? ` - ${locationParts}` : ""}`
      : locationParts;

    const jobFilter = buildJobFilter(item.name || "", locationStr, slug);
    if (!isRemoteJob(jobFilter, "")) continue;
    if (!categorizeJob(item.name || "")) continue;
    candidates.push({ item, locationStr, jobFilter });
  }

  // Phase 2: enrich candidates with individual descriptions (batches of 5)
  const results: Job[] = [];

  for (let i = 0; i < candidates.length; i += 5) {
    const batch = candidates.slice(i, i + 5);
    const descriptions = await Promise.allSettled(
      batch.map(({ item }) =>
        fetchSmartRecruitersDesc(slug, item.id)
      )
    );

    for (let j = 0; j < batch.length; j++) {
      const { item, locationStr, jobFilter } = batch[j];
      const desc = descriptions[j];
      const fullDesc = desc.status === "fulfilled" ? desc.value : "";

      // re-run with description for more accurate remote check and region
      if (!isRemoteJob(jobFilter, fullDesc)) continue;
      const category = categorizeJob(item.name || "");
      if (!category) continue;
      const region = getJobRegion(jobFilter, fullDesc);
      const jobUrl = `https://jobs.smartrecruiters.com/${slug}/${item.id}`;

      results.push({
        id: createJobId("smartrecruiters", `${slug}_${item.id}`),
        title: (item.name || "").trim(),
        company: companyName,
        companyLogo: companyDomain ? getCompanyLogoUrl(companyDomain) : undefined,
        category,
        url: jobUrl,
        source: "smartrecruiters",
        tags: item.department ? [item.department.label] : [],
        postedAt: item.releasedDate || new Date().toISOString(),
        scrapedAt: new Date().toISOString(),
        description: fullDesc ? fullDesc.slice(0, 200) : undefined,
        region,
        employmentType: normalizeEmploymentType(item.typeOfEmployment?.label),
      });
    }

    if (i + 5 < candidates.length) {
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  return { jobs: results, rawCount };
}

function buildJobFilter(title: string, location: string, slug: string) {
  return { title, description: "", location, companySlug: slug };
}

async function fetchSmartRecruitersDesc(slug: string, jobId: string): Promise<string> {
  const res = await fetchWithRetry(
    `https://api.smartrecruiters.com/v1/companies/${slug}/postings/${jobId}`,
    { headers: { "User-Agent": "worldglide-jobs/1.0" }, timeoutMs: 10000 }
  );
  if (!res.ok) return "";
  const detail = await res.json();
  const sections = detail.jobAd?.sections || {};
  const html = [
    sections.companyDescription?.text,
    sections.jobDescription?.text,
    sections.qualifications?.text,
  ].filter(Boolean).join(" ");
  return html ? stripHtml(html) : "";
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}
