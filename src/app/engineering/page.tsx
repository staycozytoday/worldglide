import JobList from "@/components/JobList";
import { getJobsByCategory } from "@/lib/storage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "worldglide ･ engineering",
  description: "100% remote engineering jobs. no country restrictions. worldwide.",
};

export const dynamic = "force-dynamic";

export default async function EngineeringPage() {
  const { jobs, totalCount } = await getJobsByCategory("engineering");

  return (
    <div className="max-w-[960px] mx-auto px-8 pt-16 pb-24">
      <JobList
        jobs={jobs}
        totalCount={totalCount}
        title="engineering"
        subtitle="engineering roles across frontend, backend, full-stack, devops, mobile, data, ml, & infrastructure."
      />
    </div>
  );
}
