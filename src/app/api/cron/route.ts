import { NextResponse } from "next/server";
import { scrapeAllSources } from "@/lib/scraper";
import { saveJobs, getApprovedSubmissionsAsJobs, saveStats } from "@/lib/storage";

export const maxDuration = 300;

/**
 * daily cron endpoint — triggered by vercel cron.
 * scrapes all job sources, merges with approved submissions, saves to storage.
 * returns report with per-company success/failure details.
 */
export async function GET(request: Request) {
  if (process.env.NODE_ENV === "production") {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
  }

  try {
    const startTime = Date.now();

    const { jobs: scrapedJobs, report } = await scrapeAllSources();
    const submittedJobs = await getApprovedSubmissionsAsJobs();
    const allJobs = [...scrapedJobs, ...submittedJobs];

    await saveJobs(allJobs);

    // save stats for homepage pass-rate display
    await saveStats({
      rawJobsScanned: report.rawJobsTotal,
      worldwideJobs: scrapedJobs.length,
      companiesScraped: report.companies,
      lastUpdated: new Date().toISOString(),
    });

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

    return NextResponse.json({
      success: true,
      stats: {
        scraped: scrapedJobs.length,
        submitted: submittedJobs.length,
        total: allJobs.length,
        elapsed: `${elapsed}s`,
      },
      report: {
        companies: report.companies,
        succeeded: report.succeeded,
        failed: report.failed,
        ...(report.failures.length > 0 && {
          failures: report.failures.map((f) => ({
            company: f.company,
            ats: f.ats,
            error: f.error,
          })),
        }),
      },
    });
  } catch (err) {
    console.error("[cron] error:", err);
    return NextResponse.json(
      { error: "scraping failed", details: String(err) },
      { status: 500 }
    );
  }
}
