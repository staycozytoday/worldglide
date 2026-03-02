import JobList from "@/components/JobList";
import { getJobsByCategory } from "@/lib/storage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "worldglide ･ design",
  description: "100% remote design jobs. no country restrictions. worldwide.",
};

export const dynamic = "force-dynamic";

export default async function DesignPage() {
  const { jobs, totalCount } = await getJobsByCategory("design");

  return (
    <div className="max-w-[960px] mx-auto px-8 pt-16 md:pt-24 pb-24">
      <JobList
        jobs={jobs}
        totalCount={totalCount}
        title="design"
        subtitle="design roles across product design, ux/ui, brand, motion, design systems, & user research."
      />
    </div>
  );
}
