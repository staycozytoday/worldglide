import { Job, getCompanyLogoUrl } from "../types";
import { getJobRegion, isRemoteJob } from "../filter";
import { categorizeJob } from "../categorize";
import { createJobId, normalizeEmploymentType } from "../utils";
import { REMOTE_COMPANIES } from "../companies";
import { fetchWithRetry, CompanyResult } from "../fetch-retry";

export interface GemResult {
  jobs: Job[];
  report: CompanyResult[];
}

/**
 * scrape jobs from gem-based companies.
 * api: GET https://api.gem.com/job_board/v0/{slug}/job_posts/
 *
 * gem has a nice `location_type` field ("remote", "hybrid", "on_site")
 * which makes remote filtering more reliable than other ATS platforms.
 */
export async function scrapeGem(): Promise<GemResult> {
  const companies = REMOTE_COMPANIES.filter(
    (c) => c.atsType === "gem" && c.atsSlug
  );

  const jobs: Job[] = [];
  const report: CompanyResult[] = [];

  for (let i = 0; i < companies.length; i += 10) {
    const batch = companies.slice(i, i + 10);
    const results = await Promise.allSettled(
      batch.map((c) => scrapeGemCompany(c.atsSlug!, c.name, c.domain))
    );

    for (let j = 0; j < results.length; j++) {
      const r = results[j];
      const c = batch[j];
      if (r.status === "fulfilled") {
        jobs.push(...r.value.jobs);
        report.push({ company: c.name, ats: "gem", slug: c.atsSlug!, jobs: r.value.jobs.length, rawJobs: r.value.rawCount });
      } else {
        const msg = r.reason instanceof Error ? r.reason.message : String(r.reason);
        console.error(`[gem/${c.atsSlug}] failed after retries: ${msg}`);
        report.push({ company: c.name, ats: "gem", slug: c.atsSlug!, jobs: 0, rawJobs: 0, error: msg });
      }
    }

    if (i + 10 < companies.length) {
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  const failed = report.filter((r) => r.error).length;
  console.log(
    `[gem] ${jobs.length} creative jobs from ${companies.length} companies` +
    (failed ? ` (${failed} failed)` : "")
  );
  return { jobs, report };
}

async function scrapeGemCompany(
  slug: string,
  companyName: string,
  companyDomain?: string
): Promise<{ jobs: Job[]; rawCount: number }> {
  const res = await fetchWithRetry(
    `https://api.gem.com/job_board/v0/${slug}/job_posts/`,
    {
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

  const items: GemJobPost[] = await res.json();
  const rawCount = items.length;
  const results: Job[] = [];

  for (const item of items) {
    const locationName = item.location?.name || "";

    // gem gives us location_type — use it as a fast pre-filter
    if (item.location_type !== "remote") continue;

    const fullDesc = item.content_plain || "";

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
      id: createJobId("gem", `${slug}_${item.id}`),
      title: (item.title || "").trim(),
      company: companyName,
      companyLogo: companyDomain ? getCompanyLogoUrl(companyDomain) : undefined,
      category,
      url: item.absolute_url || `https://jobs.gem.com/${slug}/${item.id}`,
      source: "gem" as const,
      tags: (item.departments || []).map((d) => d.name).filter(Boolean),
      salary: undefined,
      postedAt: item.first_published_at || item.created_at || new Date().toISOString(),
      scrapedAt: new Date().toISOString(),
      description: item.content_plain ? item.content_plain.slice(0, 200) : undefined,
      region,
      employmentType: normalizeEmploymentType(item.employment_type),
    });
  }

  return { jobs: results, rawCount };
}

/** gem job post shape from the api */
interface GemJobPost {
  id: string;
  internal_job_id?: string;
  requisition_id?: string;
  title: string;
  absolute_url?: string;
  content?: string;
  content_plain?: string;
  created_at?: string;
  first_published_at?: string;
  updated_at?: string;
  employment_type?: string;
  location?: { name: string };
  location_type?: string; // "remote" | "hybrid" | "on_site"
  offices?: { id: string; name: string; location?: string }[];
  departments?: { id: string; name: string }[];
}
