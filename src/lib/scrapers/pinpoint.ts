import { Job, getCompanyLogoUrl } from "../types";
import { isWorldwideRemote } from "../filter";
import { categorizeJob } from "../categorize";
import { createJobId } from "../utils";
import { REMOTE_COMPANIES } from "../companies";
import { fetchWithRetry, CompanyResult } from "../fetch-retry";

export interface PinpointResult {
  jobs: Job[];
  report: CompanyResult[];
}

/**
 * scrape jobs from pinpoint-based companies.
 * api: https://{slug}.pinpointhq.com/postings.json
 */
export async function scrapePinpoint(): Promise<PinpointResult> {
  const companies = REMOTE_COMPANIES.filter(
    (c) => c.atsType === "pinpoint" && c.atsSlug
  );

  const jobs: Job[] = [];
  const report: CompanyResult[] = [];

  for (let i = 0; i < companies.length; i += 5) {
    const batch = companies.slice(i, i + 5);
    const results = await Promise.allSettled(
      batch.map((c) => scrapePinpointCompany(c.atsSlug!, c.name, c.domain))
    );

    for (let j = 0; j < results.length; j++) {
      const r = results[j];
      const c = batch[j];
      if (r.status === "fulfilled") {
        jobs.push(...r.value.jobs);
        report.push({ company: c.name, ats: "pinpoint", slug: c.atsSlug!, jobs: r.value.jobs.length, rawJobs: r.value.rawCount });
      } else {
        const msg = r.reason instanceof Error ? r.reason.message : String(r.reason);
        console.error(`[pinpoint/${c.atsSlug}] failed after retries: ${msg}`);
        report.push({ company: c.name, ats: "pinpoint", slug: c.atsSlug!, jobs: 0, rawJobs: 0, error: msg });
      }
    }

    if (i + 5 < companies.length) {
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  const failed = report.filter((r) => r.error).length;
  console.log(
    `[pinpoint] ${jobs.length} worldwide jobs from ${companies.length} companies` +
    (failed ? ` (${failed} failed)` : "")
  );
  return { jobs, report };
}

async function scrapePinpointCompany(
  slug: string,
  companyName: string,
  companyDomain?: string
): Promise<{ jobs: Job[]; rawCount: number }> {
  if (!/^[a-z0-9-]+$/i.test(slug)) throw new Error(`invalid slug: ${slug}`);
  const res = await fetchWithRetry(
    `https://${slug}.pinpointhq.com/postings.json`,
    { headers: { "User-Agent": "worldglide-jobs/1.0" }, timeoutMs: 15000 }
  );

  if (!res.ok) {
    throw new Error(`api ${res.status}`);
  }

  const data = await res.json();
  const items = data.data || [];
  const rawCount = items.length;
  const results: Job[] = [];

  for (const item of items) {
    const locationName = item.location?.name || item.location?.city || "";
    const workplaceType = item.workplace_type || "";

    if (
      !isWorldwideRemote({
        title: item.title,
        description: stripHtml(item.description || ""),
        location: workplaceType === "remote" ? "Remote" : locationName,
        companySlug: slug,
      })
    ) {
      continue;
    }

    const category = categorizeJob(
      item.title,
      item.job?.department?.name ? [item.job.department.name] : []
    );
    if (!category) continue;

    const salary = item.compensation_visible && item.compensation
      ? item.compensation
      : undefined;

    results.push({
      id: createJobId("pinpoint", `${slug}_${item.id}`),
      title: item.title || "",
      company: companyName,
      companyLogo: companyDomain ? getCompanyLogoUrl(companyDomain) : undefined,
      category,
      url: item.url || `https://${slug}.pinpointhq.com${item.path || ""}`,
      source: "pinpoint",
      tags: [
        item.job?.department?.name,
        item.job?.division?.name,
      ].filter(Boolean) as string[],
      salary,
      postedAt: item.published_at || item.created_at || new Date().toISOString(),
      scrapedAt: new Date().toISOString(),
      description: item.description ? stripHtml(item.description).slice(0, 200) : undefined,
      region: "ww",
      employmentType: item.employment_type_text || "Full-time",
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
