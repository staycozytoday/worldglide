import { scrapeGreenhouse } from "@/lib/scrapers/greenhouse";
import { scrapeLever } from "@/lib/scrapers/lever";
import { scrapeAshby } from "@/lib/scrapers/ashby";
import { deduplicateJobs } from "@/lib/deduplicate";
import { saveJobs, getApprovedSubmissionsAsJobs } from "@/lib/storage";
import { Job } from "@/lib/types";
import { CompanyResult } from "@/lib/fetch-retry";

export const maxDuration = 300;

/**
 * admin-only scrape trigger with streaming progress.
 * sends SSE events as each ats finishes, then a final "done" event.
 */
export async function POST() {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      function send(event: string, data: Record<string, unknown>) {
        controller.enqueue(
          encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`),
        );
      }

      try {
        const startTime = Date.now();
        const allJobs: Job[] = [];
        const allReport: CompanyResult[] = [];

        const sources = [
          { name: "greenhouse", fn: scrapeGreenhouse },
          { name: "lever", fn: scrapeLever },
          { name: "ashby", fn: scrapeAshby },
        ] as const;

        // launch all in parallel, report as each finishes
        let completed = 0;
        const total = sources.length;

        send("progress", { phase: "starting", completed: 0, total });

        await Promise.allSettled(
          sources.map(async (source) => {
            try {
              const result = await source.fn();
              allJobs.push(...result.jobs);
              allReport.push(...result.report);
              completed++;
              send("progress", {
                phase: source.name,
                status: "done",
                jobs: result.jobs.length,
                completed,
                total,
              });
            } catch (err) {
              completed++;
              send("progress", {
                phase: source.name,
                status: "failed",
                error: String(err),
                completed,
                total,
              });
            }
          }),
        );

        // dedup + filter
        send("progress", { phase: "saving", completed: total, total });

        const dedupedJobs = deduplicateJobs(allJobs);
        const cutoff = Date.now() - 14 * 24 * 60 * 60 * 1000;
        const recentJobs = dedupedJobs.filter(
          (job) => new Date(job.postedAt).getTime() > cutoff,
        );

        const submittedJobs = await getApprovedSubmissionsAsJobs();
        const finalJobs = [...recentJobs, ...submittedJobs];
        await saveJobs(finalJobs);

        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        const failures = allReport.filter((r) => r.error);

        send("done", {
          success: true,
          stats: {
            scraped: recentJobs.length,
            submitted: submittedJobs.length,
            total: finalJobs.length,
            elapsed: `${elapsed}s`,
          },
          report: {
            companies: allReport.length,
            succeeded: allReport.length - failures.length,
            failed: failures.length,
            ...(failures.length > 0 && {
              failures: failures.map((f) => ({
                company: f.company,
                ats: f.ats,
                error: f.error,
              })),
            }),
          },
        });
      } catch (err) {
        console.error("[admin/scrape] error:", err);
        send("error", { error: "scraping failed", details: String(err) });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
