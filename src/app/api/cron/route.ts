import { NextResponse } from "next/server";
import { scrapeAllSources } from "@/lib/scraper";
import { saveJobs, getApprovedSubmissionsAsJobs, getJobs } from "@/lib/storage";

// Allow up to 5 minutes for scraping (Vercel Pro/Enterprise)
// Free tier: 60s max, but locally there's no limit
export const maxDuration = 300;

/**
 * Daily cron endpoint — triggered by Vercel Cron.
 * Scrapes all job sources, merges with approved submissions, saves to storage.
 *
 * In development: visit http://localhost:3000/api/cron to trigger manually.
 * In production: secured via CRON_SECRET.
 */
export async function GET(request: Request) {
  // Verify cron secret in production
  if (process.env.NODE_ENV === "production") {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const startTime = Date.now();

    // 1. Scrape all sources
    const scrapedJobs = await scrapeAllSources();

    // 2. Get approved user submissions
    const submittedJobs = await getApprovedSubmissionsAsJobs();

    // 3. Merge (scraped + submitted)
    const allJobs = [...scrapedJobs, ...submittedJobs];

    // 4. Save
    await saveJobs(allJobs);

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

    return NextResponse.json({
      success: true,
      stats: {
        scraped: scrapedJobs.length,
        submitted: submittedJobs.length,
        total: allJobs.length,
        elapsed: `${elapsed}s`,
      },
    });
  } catch (err) {
    console.error("[Cron] Error:", err);
    return NextResponse.json(
      { error: "Scraping failed", details: String(err) },
      { status: 500 }
    );
  }
}
