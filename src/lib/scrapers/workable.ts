import { Job, getCompanyLogoUrl } from "../types";
import { isWorldwideRemote } from "../filter";
import { categorizeJob } from "../categorize";
import { createJobId } from "../utils";
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
    `[workable] ${jobs.length} worldwide jobs from ${companies.length} companies` +
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
  const results: Job[] = [];

  for (const item of items) {
    const loc = item.location || {};
    const locationStr = loc.location_str || "";
    const isRemote =
      loc.telecommuting === true || loc.workplace_type === "remote";
    const fullLocation = isRemote
      ? `Remote${locationStr ? ` - ${locationStr}` : ""}`
      : locationStr;

    // TODO: Workable widget API doesn't return descriptions.
    // To enable description rescue, fetch individual jobs via
    // /api/v1/widget/accounts/{slug}/jobs/{shortcode} for trusted companies.
    const fullDesc = "";

    if (
      !isWorldwideRemote(
        {
          title: item.title || "",
          description: "",
          location: fullLocation,
          companySlug: slug,
        },
        fullDesc
      )
    ) {
      continue;
    }

    const category = categorizeJob(item.title || "");
    if (!category) continue;

    // Workable provides direct URLs
    const jobUrl =
      item.url ||
      item.shortlink ||
      `https://apply.workable.com/${slug}/j/${item.shortcode}/`;

    results.push({
      id: createJobId("workable", `${slug}_${item.shortcode || item.id}`),
      title: item.title || "",
      company: companyName,
      companyLogo: companyDomain
        ? getCompanyLogoUrl(companyDomain)
        : undefined,
      category,
      url: jobUrl,
      source: "workable",
      tags: item.department ? [item.department] : [],
      postedAt: item.created_at || new Date().toISOString(),
      scrapedAt: new Date().toISOString(),
      isWorldwide: true,
      employmentType: "Full-time",
    });
  }

  return { jobs: results, rawCount };
}
