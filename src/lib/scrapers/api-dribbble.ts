import { Job, getCompanyLogoUrl } from "../types";
import { isWorldwideRemote } from "../filter";
import { categorizeJob } from "../categorize";
import { createJobId } from "../utils";
import { fetchWithRetry } from "../fetch-retry";

export interface DribbbleResult {
  jobs: Job[];
  rawCount: number;
}

interface ParsedDribbbleJob {
  id: string;
  title: string;
  company: string;
  location: string;
  url: string;
  logoUrl?: string;
}

/**
 * Scrape design jobs from Dribbble's job board.
 *
 * Dribbble has no public JSON API, so we parse the HTML from
 * https://dribbble.com/jobs. Each <li class="job-list-item"> contains:
 *   - Company: <span class="job-board-job-company">
 *   - Title: <h4 class="job-title job-board-job-title">
 *   - Location: <span class="location"> (inside location-container)
 *   - Remote indicator: <div class="color-deep-blue-sea-light-40">Remote</div>
 *   - Link: <a ... href="/jobs/{id}-{slug}">
 */
export async function scrapeDribbble(): Promise<DribbbleResult> {
  let html: string;

  try {
    const res = await fetchWithRetry("https://dribbble.com/jobs", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; worldglide-jobs/1.0; +https://worldglide.dev)",
        Accept: "text/html",
      },
      timeoutMs: 20000,
    });

    if (!res.ok) {
      console.warn(`[dribbble] returned ${res.status}`);
      return { jobs: [], rawCount: 0 };
    }

    html = await res.text();
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[dribbble] fetch failed: ${msg}`);
    return { jobs: [], rawCount: 0 };
  }

  // Parse job list items from HTML
  const parsed = parseDribbbleHTML(html);
  const rawCount = parsed.length;
  const jobs: Job[] = [];

  for (const item of parsed) {
    // Filter for worldwide remote
    if (
      !isWorldwideRemote({
        title: item.title,
        description: "",
        location: item.location,
      })
    ) {
      continue;
    }

    // Categorize — Dribbble is mostly design, but categorizeJob will confirm
    const category = categorizeJob(item.title, ["design"]);
    if (!category) continue;

    // Extract domain from job URL for logo fallback
    const companyLogo =
      item.logoUrl || getCompanyLogoUrl("dribbble.com");

    jobs.push({
      id: createJobId("dribbble", item.id),
      title: item.title,
      company: item.company,
      companyLogo,
      category,
      url: item.url,
      source: "dribbble",
      tags: ["design"],
      postedAt: new Date().toISOString(), // Dribbble HTML doesn't include dates
      scrapedAt: new Date().toISOString(),
      isWorldwide: true,
      employmentType: "Full-time",
    });
  }

  console.log(`[dribbble] ${jobs.length} worldwide jobs from ${rawCount} raw`);
  return { jobs, rawCount };
}

/**
 * Parse the Dribbble jobs HTML page into structured job listings.
 */
function parseDribbbleHTML(html: string): ParsedDribbbleJob[] {
  const jobs: ParsedDribbbleJob[] = [];

  // Match each job list item
  const itemPattern =
    /<li[^>]*class="job-list-item[^"]*"[^>]*>([\s\S]*?)<\/li>/g;
  let itemMatch: RegExpExecArray | null;

  while ((itemMatch = itemPattern.exec(html)) !== null) {
    const block = itemMatch[1];

    // Extract company
    const companyMatch = block.match(
      /job-board-job-company[^>]*>([\s\S]*?)</,
    );
    const company = companyMatch ? companyMatch[1].trim() : "";

    // Extract title
    const titleMatch = block.match(
      /job-board-job-title[^>]*>([\s\S]*?)</,
    );
    const title = titleMatch ? titleMatch[1].trim() : "";

    // Extract location from <span class="location">
    const locationMatch = block.match(
      /<span\s+class="location">\s*([\s\S]*?)\s*<\/span>/,
    );
    const rawLocation = locationMatch ? locationMatch[1].trim() : "";

    // Check for "Remote" in the mobile details div
    const remoteMatch = block.match(
      /color-deep-blue-sea-light-40[^>]*>\s*([\s\S]*?)\s*</,
    );
    const remoteText = remoteMatch ? remoteMatch[1].trim() : "";

    // Combine location info
    let location = rawLocation || remoteText || "";
    if (
      remoteText.toLowerCase() === "remote" &&
      rawLocation &&
      !rawLocation.toLowerCase().includes("remote")
    ) {
      location = `${rawLocation}, Remote`;
    }

    // Extract job link and ID
    const linkMatch = block.match(/href="\/jobs\/(\d+)-([^"?]+)/);
    if (!linkMatch) continue; // Skip items without proper job links

    const jobId = linkMatch[1];
    const jobUrl = `https://dribbble.com/jobs/${linkMatch[1]}-${linkMatch[2]}`;

    // Extract logo URL from srcset or data-src
    const logoMatch = block.match(
      /data-src="(https:\/\/cdn\.dribbble\.com[^"]*\?resize=\d+x\d+)"/,
    );
    const logoUrl = logoMatch ? logoMatch[1] : undefined;

    if (!company || !title) continue;

    jobs.push({
      id: jobId,
      title: decodeHtmlEntities(title),
      company: decodeHtmlEntities(company),
      location,
      url: jobUrl,
      logoUrl,
    });
  }

  return jobs;
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&#x27;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x2F;/g, "/")
    .trim();
}
