"use client";

import { JobSubmission } from "@/lib/types";
import { useState } from "react";

interface AdminPanelProps {
  pending: JobSubmission[];
  approved: JobSubmission[];
}

export default function AdminPanel({
  pending: initialPending,
  approved: initialApproved,
}: AdminPanelProps) {
  const [pending, setPending] = useState(initialPending);
  const [approved, setApproved] = useState(initialApproved);
  const [loading, setLoading] = useState<string | null>(null);

  async function handleAction(id: string, action: "approve" | "reject") {
    setLoading(id);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });

      if (res.ok) {
        const sub = pending.find((s) => s.id === id);
        setPending(pending.filter((s) => s.id !== id));
        if (action === "approve" && sub) {
          setApproved([...approved, { ...sub, approved: true }]);
        }
      }
    } catch (err) {
      console.error("Action failed:", err);
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="space-y-12">
      {/* Pending */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-[16px] font-semibold">
            Pending Review
          </h2>
          <span className="text-[12px] font-medium text-[var(--color-text-muted)] bg-[var(--color-border-light)] px-2 py-0.5 rounded-full">
            {pending.length}
          </span>
        </div>

        {pending.length === 0 ? (
          <p className="text-[13px] text-[var(--color-text-muted)]">
            No pending submissions.
          </p>
        ) : (
          <div className="space-y-3">
            {pending.map((sub) => (
              <div
                key={sub.id}
                className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-[var(--color-border)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-[14px] font-semibold">
                      {sub.title}
                    </h3>
                    <p className="text-[12px] text-[var(--color-text-secondary)] mt-0.5">
                      {sub.company}
                    </p>
                    <div className="flex items-center gap-3 mt-3 flex-wrap">
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[var(--color-border-light)] text-[var(--color-text-muted)] capitalize">
                        {sub.category}
                      </span>
                      <a
                        href={sub.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-[var(--color-text-muted)] underline"
                      >
                        View posting ↗
                      </a>
                      <span className="text-[10px] text-[var(--color-text-muted)]">
                        {sub.contactEmail}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleAction(sub.id, "approve")}
                      disabled={loading === sub.id}
                      className="px-3 py-1.5 text-[12px] font-medium rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors disabled:opacity-50"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleAction(sub.id, "reject")}
                      disabled={loading === sub.id}
                      className="px-3 py-1.5 text-[12px] font-medium rounded-md bg-red-50 text-red-700 hover:bg-red-100 transition-colors disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Approved */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-[16px] font-semibold">Approved</h2>
          <span className="text-[12px] font-medium text-[var(--color-text-muted)] bg-[var(--color-border-light)] px-2 py-0.5 rounded-full">
            {approved.length}
          </span>
        </div>

        {approved.length === 0 ? (
          <p className="text-[13px] text-[var(--color-text-muted)]">
            No approved submissions yet.
          </p>
        ) : (
          <div className="space-y-2">
            {approved.map((sub) => (
              <div
                key={sub.id}
                className="bg-[var(--color-bg-card)] rounded-lg px-5 py-3 flex items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  <p className="text-[13px] font-medium truncate">
                    {sub.title}{" "}
                    <span className="text-[var(--color-text-muted)]">
                      at {sub.company}
                    </span>
                  </p>
                </div>
                <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full shrink-0">
                  Live
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
