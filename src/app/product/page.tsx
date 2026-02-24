import JobList from "@/components/JobList";
import { getJobsByCategory } from "@/lib/storage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "worldglide — product",
  description: "100% remote product jobs. no country restrictions. worldwide.",
};

export default async function ProductPage() {
  const jobs = await getJobsByCategory("product");

  return (
    <div className="max-w-[960px] mx-auto px-8 pt-16 pb-24">
      <JobList
        jobs={jobs}
        title="product"
        subtitle="product roles that blend strategy, growth, analytics, & hands-on execution, from discovery to launch."
      />
    </div>
  );
}
