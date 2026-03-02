"use client";

import { Job, JobSubmission } from "@/lib/types";
import { formatRelativeTime } from "@/lib/utils";
import { useState } from "react";

interface AdminPanelProps {
  pending: JobSubmission[];
  approved: JobSubmission[];
  declined: JobSubmission[];
  expiredJobs: Job[];
}

type Status = "pending" | "live" | "declined";

// text-link action styles
const BTN =
  "text-[11px] font-mono text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors disabled:opacity-40 whitespace-nowrap";

export default function AdminPanel({
  pending: initialPending,
  approved: initialApproved,
  declined: initialDeclined,
  expiredJobs: initialExpired,
}: AdminPanelProps) {
  const [pending, setPending] = useState(initialPending);
  const [approved, setApproved] = useState(initialApproved);
  const [declined, setDeclined] = useState(initialDeclined);
  const [expired, setExpired] = useState(initialExpired);
  const [loading, setLoading] = useState<string | null>(null);
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(["pending", "live"]),
  );

  function toggleSection(key: string) {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  async function handleAction(
    id: string,
    action: "approve" | "reject" | "resurrect" | "delete",
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
        if (action === "resurrect" && from === "declined") {
          const sub = declined.find((s) => s.id === id);
          setDeclined(declined.filter((s) => s.id !== id));
          if (sub)
            setPending([
              ...pending,
              { ...sub, approved: false, rejected: false },
            ]);
        }
        if (action === "delete") {
          setPending(pending.filter((s) => s.id !== id));
          setApproved(approved.filter((s) => s.id !== id));
          setDeclined(declined.filter((s) => s.id !== id));
        }
      }
    } catch (err) {
      console.error("Action failed:", err);
    } finally {
      setLoading(null);
    }
  }

  // all approved submissions are live
  const liveRows = approved;

  const allEmpty =
    pending.length === 0 &&
    liveRows.length === 0 &&
    declined.length === 0 &&
    expired.length === 0;

  // ── section label ──────────────────────────────────

  function renderSectionLabel(key: string, label: string, count: number, isFirst: boolean) {
    const isOpen = openSections.has(key);
    return (
      <button
        onClick={() => toggleSection(key)}
        className={`${isFirst ? "mt-2" : "mt-8"} w-full h-[32px] flex items-center justify-between -mx-2 px-4 text-[10px] font-mono ${isOpen ? "text-[var(--color-text)]" : "text-[var(--color-text-muted)]"} hover:text-[var(--color-text)] border-b border-[var(--color-border)] transition-colors`}
      >
        <span>{label} · {count}</span>
        <span>{isOpen ? "−" : "+"}</span>
      </button>
    );
  }

  // ── submission row ─────────────────────────────────

  function renderSubmissionRow(
    sub: JobSubmission,
    status: Status,
    from: "pending" | "approved" | "declined",
  ) {
    return (
      <div
        key={sub.id}
        className="group relative h-[40px] border-b border-[var(--color-border)] flex items-center gap-6 -mx-2 px-4 transition-colors hover:bg-[var(--color-bg-hover)]"
      >
        {/* age */}
        <span className="w-[32px] shrink-0 hidden sm:block text-[11px] text-[var(--color-text-muted)] font-mono">
          {formatRelativeTime(sub.submittedAt)}
        </span>

        {/* title + company */}
        <span className="flex-1 min-w-0 flex items-center gap-2 text-[13px] text-[var(--color-text)]">
          <span className="truncate">{sub.title}</span>
          <span className="hidden sm:inline text-[var(--color-text-muted)] shrink-0">·</span>
          <span className="hidden sm:inline shrink-0">{sub.company}</span>
        </span>

        {/* email */}
        {sub.contactEmail && (
          <span className="hidden sm:inline text-[13px] text-[var(--color-text)] w-[180px] shrink-0 truncate text-right">
            {sub.contactEmail}
          </span>
        )}

        {/* mobile actions — always visible, compact */}
        <span className="flex items-center gap-2 lg:hidden shrink-0">
          <a
            href={sub.url}
            target="_blank"
            rel="noopener noreferrer"
            className={BTN}
          >
            ↗
          </a>
          {status === "pending" && (
            <>
              <button
                onClick={() => handleAction(sub.id, "approve", from)}
                disabled={loading === sub.id}
                className={BTN}
              >
                ✓
              </button>
              <button
                onClick={() => handleAction(sub.id, "reject", from)}
                disabled={loading === sub.id}
                className={BTN}
              >
                ✗
              </button>
            </>
          )}
        </span>

        {/* type — desktop only */}
        <span className="text-[11px] text-[var(--color-text-muted)] w-[80px] shrink-0 hidden lg:block font-mono text-right">
          {sub.category}
        </span>

        {/* desktop hover actions — centered overlay */}
        <span className="absolute inset-0 hidden lg:group-hover:flex items-center justify-center [background:linear-gradient(90deg,transparent,var(--color-bg-hover)_30%,var(--color-bg-hover)_70%,transparent)] gap-4">
          <a
            href={sub.url}
            target="_blank"
            rel="noopener noreferrer"
            className={BTN}
          >
            view
          </a>
          {status === "pending" && (
            <>
              <button
                onClick={() => handleAction(sub.id, "approve", from)}
                disabled={loading === sub.id}
                className={BTN}
              >
                approve
              </button>
              <button
                onClick={() => handleAction(sub.id, "reject", from)}
                disabled={loading === sub.id}
                className={BTN}
              >
                reject
              </button>
            </>
          )}
          {status === "live" && (
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
          <button
            onClick={() => handleAction(sub.id, "delete", from)}
            disabled={loading === sub.id}
            className={BTN}
          >
            archive
          </button>
        </span>
      </div>
    );
  }

  // ── scraped job row (archive) ──────────────────────

  function renderScrapedRow(job: Job) {
    return (
      <div
        key={job.id}
        className="group relative h-[40px] border-b border-[var(--color-border)] flex items-center gap-6 -mx-2 px-4 transition-colors hover:bg-[var(--color-bg-hover)]"
      >
        {/* age */}
        <span className="w-[32px] shrink-0 hidden sm:block text-[11px] text-[var(--color-text-muted)] font-mono">
          {formatRelativeTime(job.postedAt)}
        </span>

        {/* title + company */}
        <span className="flex-1 min-w-0 flex items-center gap-2 text-[13px] text-[var(--color-text)]">
          <span className="truncate">{job.title}</span>
          <span className="hidden sm:inline text-[var(--color-text-muted)] shrink-0">·</span>
          <span className="hidden sm:inline shrink-0">{job.company}</span>
        </span>

        {/* mobile actions */}
        <span className="flex items-center gap-2 lg:hidden shrink-0">
          <a href={job.url} target="_blank" rel="noopener noreferrer" className={BTN}>↗</a>
        </span>

        {/* type — desktop only */}
        <span className="text-[11px] text-[var(--color-text-muted)] w-[80px] shrink-0 hidden lg:block font-mono text-right">
          {job.category}
        </span>

        {/* desktop hover actions — centered */}
        <span className="absolute inset-0 hidden lg:group-hover:flex items-center justify-center [background:linear-gradient(90deg,transparent,var(--color-bg-hover)_30%,var(--color-bg-hover)_70%,transparent)] gap-4">
          <a href={job.url} target="_blank" rel="noopener noreferrer" className={BTN}>view</a>
          <button onClick={() => setExpired(expired.filter((j) => j.id !== job.id))} className={BTN}>delete</button>
        </span>
      </div>
    );
  }

  // ── track which is first section for spacing ───────

  let sectionIndex = 0;

  return (
    <div>
      {allEmpty && (
        <p className="text-[11px] text-[var(--color-text-muted)] font-mono py-6">
          no submissions yet.
        </p>
      )}

      {/* pending */}
      {pending.length > 0 && (
        <div>
          {renderSectionLabel("pending", "pending", pending.length, sectionIndex++ === 0)}
          {openSections.has("pending") &&
            pending.map((sub) =>
              renderSubmissionRow(sub, "pending", "pending"),
            )}
        </div>
      )}

      {/* live */}
      {liveRows.length > 0 && (
        <div>
          {renderSectionLabel("live", "live", liveRows.length, sectionIndex++ === 0)}
          {openSections.has("live") &&
            liveRows.map((sub) =>
              renderSubmissionRow(sub, "live", "approved"),
            )}
        </div>
      )}

      {/* declined */}
      {declined.length > 0 && (
        <div>
          {renderSectionLabel("declined", "declined", declined.length, sectionIndex++ === 0)}
          {openSections.has("declined") &&
            declined.map((sub) =>
              renderSubmissionRow(sub, "declined", "declined"),
            )}
        </div>
      )}

      {/* archive — scraped jobs past 14-day window */}
      {expired.length > 0 && (
        <div>
          {renderSectionLabel("archive", "archive", expired.length, sectionIndex++ === 0)}
          {openSections.has("archive") &&
            expired.map(renderScrapedRow)}
        </div>
      )}
    </div>
  );
}
