import { getSubmissions } from "@/lib/storage";
import AdminPanel from "@/components/AdminPanel";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin — worldglide",
};

// Don't cache the admin page
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const submissions = await getSubmissions();
  const pending = submissions.filter((s) => !s.approved);
  const approved = submissions.filter((s) => s.approved);

  return (
    <div className="max-w-[960px] mx-auto px-8 pt-16 pb-24">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-[24px] font-medium tracking-tight">
            admin
          </h1>
          <p className="text-[12px] text-[var(--color-text-muted)] mt-2 max-w-[320px]">
            review and approve job submissions.
          </p>
        </div>
        <a
          href="/api/auth/logout"
          className="text-[11px] text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors mt-2"
        >
          logout
        </a>
      </div>

      <AdminPanel pending={pending} approved={approved} />
    </div>
  );
}
