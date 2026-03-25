import { Job, getCompanyLogoUrl } from "../types";
import { isWorldwideRemote } from "../filter";
import { categorizeJob } from "../categorize";
import { createJobId } from "../utils";
import { REMOTE_COMPANIES } from "../companies";
import { fetchWithRetry, CompanyResult } from "../fetch-retry";

export interface BreezyHRResult {
  jobs: Job[];
  report: CompanyResult[];
}

/**
 * scrape jobs from breezy-hr-based companies.
 * api: https://{slug}.breezy.hr/json
 */
export async function scrapeBreezyHR(): Promise<BreezyHRResult> {
  const companies = REMOTE_COMPANIES.filter(
    (c) => c.atsType === "breezyhr" && c.atsSlug
  );

  const jobs: Job[] = [];
  const report: CompanyResult[] = [];

  for (let i = 0; i < companies.length; i += 5) {
    const batch = companies.slice(i, i + 5);
    const results = await Promise.allSettled(
      batch.map((c) => scrapeBreezyHRCompany(c.atsSlug!, c.name, c.domain))
    );

    for (let j = 0; j < results.length; j++) {
      const r = results[j];
      const c = batch[j];
      if (r.status === "fulfilled") {
        jobs.push(...r.value.jobs);
        report.push({ company: c.name, ats: "breezyhr", slug: c.atsSlug!, jobs: r.value.jobs.length, rawJobs: r.value.rawCount });
      } else {
        const msg = r.reason instanceof Error ? r.reason.message : String(r.reason);
        console.error(`[breezyhr/${c.atsSlug}] failed after retries: ${msg}`);
        report.push({ company: c.name, ats: "breezyhr", slug: c.atsSlug!, jobs: 0, rawJobs: 0, error: msg });
      }
    }

    if (i + 5 < companies.length) {
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  const failed = report.filter((r) => r.error).length;
  console.log(
    `[breezyhr] ${jobs.length} worldwide jobs from ${companies.length} companies` +
    (failed ? ` (${failed} failed)` : "")
  );
  return { jobs, report };
}

async function scrapeBreezyHRCompany(
  slug: string,
  companyName: string,
  companyDomain?: string
): Promise<{ jobs: Job[]; rawCount: number }> {
  if (!/^[a-z0-9-]+$/i.test(slug)) throw new Error(`invalid slug: ${slug}`);
  const res = await fetchWithRetry(
    `https://${slug}.breezy.hr/json`,
    { headers: { "User-Agent": "worldglide-jobs/1.0" }, timeoutMs: 15000 }
  );

  if (!res.ok) {
    throw new Error(`api ${res.status}`);
  }

  const text = await res.text();
  // Breezy returns HTML redirect for non-existent slugs
  if (text.startsWith("Found. Redirecting") || text.startsWith("<!")) {
    return { jobs: [], rawCount: 0 };
  }

  const data = JSON.parse(text);
  if (!Array.isArray(data)) return { jobs: [], rawCount: 0 };

  const rawCount = data.length;
  const results: Job[] = [];

  for (const item of data) {
    const locationName = item.location?.city
      ? `${item.location.city}, ${item.location.country?.name || ""}`
      : item.location?.country?.name || "";
    const isRemote = item.location?.is_remote === true ||
      (item.locations || []).some((l: { is_remote?: boolean }) => l.is_remote === true);

    if (
      !isWorldwideRemote({
        title: item.name,
        description: "",
        location: isRemote ? "Remote" : locationName,
        companySlug: slug,
      })
    ) {
      continue;
    }

    const category = categorizeJob(
      item.name,
      item.department ? [item.department] : []
    );
    if (!category) continue;

    const companyData = item.company || {};
    const logoUrl = companyData.logo_url || (companyDomain ? getCompanyLogoUrl(companyDomain) : undefined);

    results.push({
      id: createJobId("breezyhr", `${slug}_${item.id}`),
      title: item.name || "",
      company: companyName,
      companyLogo: logoUrl,
      category,
      url: item.url || `https://${slug}.breezy.hr/p/${item.friendly_id}`,
      source: "breezyhr",
      tags: [item.department].filter(Boolean) as string[],
      postedAt: item.published_date || new Date().toISOString(),
      scrapedAt: new Date().toISOString(),
      region: "ww",
      employmentType: item.type?.name || "Full-time",
    });
  }

  return { jobs: results, rawCount };
}
