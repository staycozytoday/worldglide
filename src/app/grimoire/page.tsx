import { getSubmissions, getJobs } from "@/lib/storage";
import AdminPanel from "@/components/AdminPanel";
import ScrapeButton from "@/components/ScrapeButton";
import StatsPanel from "@/components/StatsPanel";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "grimoire ･ worldglide",
};

// Don't cache the admin page
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [submissions, jobs] = await Promise.all([getSubmissions(), getJobs()]);
  const pending = submissions.filter((s) => !s.approved && !s.rejected);
  const approved = submissions.filter((s) => s.approved);
  const declined = submissions.filter((s) => s.rejected);

  const activeJobs = jobs.filter((j) => !j.expired);

  // Sparkline data: daily job counts over last 14 days
  const DAY_MS = 86_400_000;
  const now = Date.now();
  const dailyCounts = Array.from({ length: 14 }, (_, i) => {
    const dayStart = now - (14 - i) * DAY_MS;
    const dayEnd = now - (13 - i) * DAY_MS;
    const count = jobs.filter((j) => {
      const t = new Date(j.postedAt).getTime();
      return t >= dayStart && t < dayEnd;
    }).length;
    const d = new Date(dayStart);
    return {
      date: `${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`,
      count,
    };
  });

  const categories = [
    {
      label: "engineering",
      count: activeJobs.filter((j) => j.category === "engineering").length,
    },
    {
      label: "product",
      count: activeJobs.filter((j) => j.category === "product").length,
    },
    {
      label: "design",
      count: activeJobs.filter((j) => j.category === "design").length,
    },
  ];

  return (
    <div className="max-w-[960px] mx-auto px-8 pt-16 pb-8">
      <div className="mb-16 flex flex-col md:flex-row md:items-start md:justify-between gap-8 md:gap-16">
        {/* left: title + description */}
        <div>
          <h1 className="text-[32px] md:text-[40px] font-medium tracking-tight leading-[1.1] text-[var(--color-text)]">
            grimoire
          </h1>
          <p className="text-[12px] text-[var(--color-text-muted)] max-w-[320px] leading-relaxed mt-4">
            jobs arrive like fresh constellations, drift through review, &
            are either gently blessed into the board or whisked back into the
            void.
          </p>
        </div>

        {/* right: stats panel + button — fixed width for balanced visuals */}
        <div className="w-full md:w-[360px] md:shrink-0">
          <StatsPanel
            dailyCounts={dailyCounts}
            categories={categories}
            total={activeJobs.length}
          />

          {/* button row — 50/50 */}
          <div className="mt-4 flex items-start gap-4">
            <div className="w-1/2 min-w-0">
              <ScrapeButton />
            </div>
            <div className="w-1/2">
              <a
                href="/api/auth/logout"
                className="flex items-center justify-center w-full h-[40px] text-[11px] font-mono text-[var(--color-text-muted)] border border-transparent hover:border-[var(--color-border)] hover:text-[var(--color-text)] transition-all duration-300 cursor-pointer"
              >
                log out
              </a>
            </div>
          </div>
        </div>
      </div>

      <AdminPanel pending={pending} approved={approved} declined={declined} />
    </div>
  );
}
