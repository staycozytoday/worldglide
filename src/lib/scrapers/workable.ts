import { Job, getCompanyLogoUrl } from "../types";
import { getJobRegion, isRemoteJob } from "../filter";
import { categorizeJob } from "../categorize";
import { createJobId, normalizeEmploymentType, stripHtml } from "../utils";
import { REMOTE_COMPANIES } from "../companies";
import { fetchWithRetry, CompanyResult } from "../fetch-retry";

export interface WorkableResult {
  jobs: Job[];
  report: CompanyResult[];
}

/**
 * scrape jobs from workable-based companies.
 * api: https://apply.workable.com/api/v1/widget/accounts/{slug}
 *
 * public widget endpoint, no auth required.
 * returns all jobs at once — no pagination needed.
 */
export async function scrapeWorkable(): Promise<WorkableResult> {
  const companies = REMOTE_COMPANIES.filter(
    (c) => c.atsType === "workable" && c.atsSlug
  );

  const jobs: Job[] = [];
  const report: CompanyResult[] = [];

  // batch of 10
  for (let i = 0; i < companies.length; i += 10) {
    const batch = companies.slice(i, i + 10);
    const results = await Promise.allSettled(
      batch.map((c) =>
        scrapeWorkableCompany(c.atsSlug!, c.name, c.domain)
      )
    );

    for (let j = 0; j < results.length; j++) {
      const r = results[j];
      const c = batch[j];
      if (r.status === "fulfilled") {
        jobs.push(...r.value.jobs);
        report.push({
          company: c.name,
          ats: "workable",
          slug: c.atsSlug!,
          jobs: r.value.jobs.length,
          rawJobs: r.value.rawCount,
        });
      } else {
        const msg =
          r.reason instanceof Error ? r.reason.message : String(r.reason);
        console.error(`[workable/${c.atsSlug}] failed: ${msg}`);
        report.push({
          company: c.name,
          ats: "workable",
          slug: c.atsSlug!,
          jobs: 0,
          rawJobs: 0,
          error: msg,
        });
      }
    }

    if (i + 10 < companies.length) {
      await new Promise((r) => setTimeout(r, 300));
    }
  }

  const failed = report.filter((r) => r.error).length;
  console.log(
    `[workable] ${jobs.length} creative jobs from ${companies.length} companies` +
      (failed ? ` (${failed} failed)` : "")
  );
  return { jobs, report };
}

async function scrapeWorkableCompany(
  slug: string,
  companyName: string,
  companyDomain?: string
): Promise<{ jobs: Job[]; rawCount: number }> {
  const res = await fetchWithRetry(
    `https://apply.workable.com/api/v1/widget/accounts/${slug}`,
    { headers: { "User-Agent": "worldglide-jobs/1.0" }, timeoutMs: 12000 }
  );

  if (!res.ok) {
    throw new Error(`api ${res.status}`);
  }

  const data = await res.json();
  const items = data.jobs || [];
  const rawCount = items.length;

  // Phase 1: filter to creative remote candidates using list data only
  type Candidate = { item: any; fullLocation: string };
  const candidates: Candidate[] = [];

  for (const item of items) {
    const loc = item.location || {};
    const locationStr = loc.location_str || "";
    const isRemote =
      loc.telecommuting === true || loc.workplace_type === "remote";
    const fullLocation = isRemote
      ? `Remote${locationStr ? ` - ${locationStr}` : ""}`
      : locationStr;

    const jobFilter = { title: item.title || "", description: "", location: fullLocation, companySlug: slug };
    if (!isRemoteJob(jobFilter, "")) continue;
    if (!categorizeJob(item.title || "")) continue;
    candidates.push({ item, fullLocation });
  }

  // Phase 2: enrich candidates with individual descriptions (batches of 5)
  const results: Job[] = [];

  for (let i = 0; i < candidates.length; i += 5) {
    const batch = candidates.slice(i, i + 5);
    const descriptions = await Promise.allSettled(
      batch.map(({ item }) =>
        fetchWorkableDesc(slug, item.shortcode || item.id)
      )
    );

    for (let j = 0; j < batch.length; j++) {
      const { item, fullLocation } = batch[j];
      const desc = descriptions[j];
      const fullDesc = desc.status === "fulfilled" ? desc.value : "";
      const jobFilter = { title: item.title || "", description: fullDesc.slice(0, 200), location: fullLocation, companySlug: slug };

      if (!isRemoteJob(jobFilter, fullDesc)) continue;
      const category = categorizeJob(item.title || "");
      if (!category) continue;
      const region = getJobRegion(jobFilter, fullDesc);

      const jobUrl = item.url || item.shortlink || `https://apply.workable.com/${slug}/j/${item.shortcode}/`;

      results.push({
        id: createJobId("workable", `${slug}_${item.shortcode || item.id}`),
        title: (item.title || "").trim(),
        company: companyName,
        companyLogo: companyDomain ? getCompanyLogoUrl(companyDomain) : undefined,
        category,
        url: jobUrl,
        source: "workable",
        tags: item.department ? [item.department] : [],
        postedAt: item.created_at || new Date().toISOString(),
        scrapedAt: new Date().toISOString(),
        description: fullDesc ? fullDesc.slice(0, 200) : undefined,
        region,
        employmentType: normalizeEmploymentType(item.employment_type),
      });
    }

    if (i + 5 < candidates.length) {
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  return { jobs: results, rawCount };
}

async function fetchWorkableDesc(slug: string, shortcode: string): Promise<string> {
  const res = await fetchWithRetry(
    `https://apply.workable.com/api/v1/widget/accounts/${slug}/jobs/${shortcode}`,
    { headers: { "User-Agent": "worldglide-jobs/1.0" }, timeoutMs: 10000 }
  );
  if (!res.ok) return "";
  const detail = await res.json();
  const html = [detail.description, detail.requirements, detail.benefits]
    .filter(Boolean).join(" ");
  return html ? stripHtml(html) : "";
}

