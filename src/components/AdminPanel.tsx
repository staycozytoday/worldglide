"use client";

import { JobSubmission, JOB_EXPIRY_MS } from "@/lib/types";
import { formatRelativeTime } from "@/lib/utils";
import { useState } from "react";

interface AdminPanelProps {
  pending: JobSubmission[];
  approved: JobSubmission[];
  declined: JobSubmission[];
}

type Status = "pending" | "live" | "expired" | "declined";

function getStatus(sub: JobSubmission): Status {
  if (sub.rejected) return "declined";
  if (sub.approved) {
    return Date.now() - new Date(sub.submittedAt).getTime() > JOB_EXPIRY_MS
      ? "expired"
      : "live";
  }
  return "pending";
}

// text-link buttons — matches homepage's minimal interaction style
const BTN =
  "text-[11px] font-mono text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed";
const BTN_ACTION =
  "text-[11px] font-mono text-[var(--color-text)] hover:opacity-60 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed";

export default function AdminPanel({
  pending: initialPending,
  approved: initialApproved,
  declined: initialDeclined,
}: AdminPanelProps) {
  const [pending, setPending] = useState(initialPending);
  const [approved, setApproved] = useState(initialApproved);
  const [declined, setDeclined] = useState(initialDeclined);
  const [loading, setLoading] = useState<string | null>(null);

  async function handleAction(
    id: string,
    action: "approve" | "reject" | "resurrect",
    from: "pending" | "approved" | "declined",
  ) {
    setLoading(id);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });

      if (res.ok) {
        if (action === "approve" && from === "pending") {
          const sub = pending.find((s) => s.id === id);
          setPending(pending.filter((s) => s.id !== id));
          if (sub) setApproved([...approved, { ...sub, approved: true }]);
        }
        if (action === "reject" && from === "pending") {
          const sub = pending.find((s) => s.id === id);
          setPending(pending.filter((s) => s.id !== id));
          if (sub) setDeclined([...declined, { ...sub, rejected: true }]);
        }
        if (action === "reject" && from === "approved") {
          const sub = approved.find((s) => s.id === id);
          setApproved(approved.filter((s) => s.id !== id));
          if (sub)
            setDeclined([
              ...declined,
              { ...sub, approved: false, rejected: true },
            ]);
        }
        if (action === "resurrect") {
          const sub = declined.find((s) => s.id === id);
          setDeclined(declined.filter((s) => s.id !== id));
          if (sub)
            setPending([
              ...pending,
              { ...sub, approved: false, rejected: false },
            ]);
        }
      }
    } catch (err) {
      console.error("Action failed:", err);
    } finally {
      setLoading(null);
    }
  }

  // build unified rows: pending → live → expired → declined
  type Row = {
    sub: JobSubmission;
    status: Status;
    from: "pending" | "approved" | "declined";
  };
  const rows: Row[] = [
    ...pending.map(
      (sub) =>
        ({ sub, status: "pending" as Status, from: "pending" as const }),
    ),
    ...approved
      .filter((s) => getStatus(s) === "live")
      .map(
        (sub) =>
          ({ sub, status: "live" as Status, from: "approved" as const }),
      ),
    ...approved
      .filter((s) => getStatus(s) === "expired")
      .map(
        (sub) =>
          ({ sub, status: "expired" as Status, from: "approved" as const }),
      ),
    ...declined.map(
      (sub) =>
        ({ sub, status: "declined" as Status, from: "declined" as const }),
    ),
  ];

  return (
    <div>
      {/* column headers — border-[var(--color-text)] matches homepage */}
      <div className="h-[32px] flex items-center border-b border-[var(--color-text)] text-[10px] text-[var(--color-text-muted)] font-mono">
        <span className="w-[56px] shrink-0 text-right">status</span>
        <span className="w-[72px] shrink-0 hidden sm:block px-4">age</span>
        <span className="w-[120px] shrink-0 px-4">company</span>
        <span className="flex-1 min-w-0">position</span>
        <span className="w-[72px] shrink-0 hidden lg:block text-right px-4">type</span>
        <span className="w-[120px] shrink-0 text-right">actions</span>
      </div>

      {rows.length === 0 ? (
        <p className="text-[11px] text-[var(--color-text-muted)] font-mono py-6">
          no submissions yet.
        </p>
      ) : (
        rows.map(({ sub, status, from }) => (
          <div
            key={sub.id}
            className={`h-[40px] border-b border-[var(--color-border)] flex items-center transition-colors hover:bg-[var(--color-text)]/[0.02] -mx-2 px-2 ${
              status === "expired" ? "opacity-30" : status === "declined" ? "opacity-50" : ""
            }`}
          >
            {/* status */}
            <span className="text-[11px] text-[var(--color-text-muted)] w-[56px] shrink-0 font-mono text-right flex items-center justify-end gap-1.5">
              {status === "live" && (
                <span className="shrink-0 w-1.5 h-1.5 bg-[#FF6432] rounded-full animate-rec" />
              )}
              {status}
            </span>

            {/* age */}
            <span className="text-[11px] text-[var(--color-text-muted)] w-[72px] shrink-0 hidden sm:block font-mono px-4">
              {formatRelativeTime(sub.submittedAt)}
            </span>

            {/* company */}
            <span className="text-[12px] text-[var(--color-text-secondary)] w-[120px] shrink-0 truncate px-4">
              {sub.company}
            </span>

            {/* title — flex-1 */}
            <span className="flex-1 min-w-0 flex items-center gap-2">
              <span className="text-[13px] text-[var(--color-text)] truncate">
                {sub.title}
              </span>
            </span>

            {/* category */}
            <span className="text-[11px] text-[var(--color-text-muted)] w-[72px] shrink-0 hidden lg:block font-mono text-right px-4">
              {sub.category}
            </span>

            {/* actions */}
            <span className="w-[120px] shrink-0 flex items-center justify-end gap-4">
              {status === "pending" && (
                <button
                  onClick={() => handleAction(sub.id, "approve", from)}
                  disabled={loading === sub.id}
                  className={BTN_ACTION}
                >
                  approve
                </button>
              )}
              <a
                href={sub.url}
                target="_blank"
                rel="noopener noreferrer"
                className={BTN}
              >
                view ↗
              </a>
              {status === "pending" && (
                <button
                  onClick={() => handleAction(sub.id, "reject", from)}
                  disabled={loading === sub.id}
                  className={BTN}
                >
                  reject
                </button>
              )}
              {(status === "live" || status === "expired") && (
                <button
                  onClick={() => handleAction(sub.id, "reject", from)}
                  disabled={loading === sub.id}
                  className={BTN}
                >
                  disable
                </button>
              )}
              {status === "declined" && (
                <button
                  onClick={() => handleAction(sub.id, "resurrect", from)}
                  disabled={loading === sub.id}
                  className={BTN}
                >
                  resurrect
                </button>
              )}
            </span>
          </div>
        ))
      )}
    </div>
  );
}
