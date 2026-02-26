"use client";

import { Job, JobSubmission, JOB_EXPIRY_MS } from "@/lib/types";
import { formatRelativeTime } from "@/lib/utils";
import { useState } from "react";

interface AdminPanelProps {
  pending: JobSubmission[];
  approved: JobSubmission[];
  declined: JobSubmission[];
  expiredJobs: Job[];
}

type Status = "pending" | "live" | "expired" | "declined";

function getStatus(sub: JobSubmission): Status {
  if (sub.rejected) return "declined";
  if (sub.approved) {
    const age = Date.now() - new Date(sub.submittedAt).getTime();
    if (age > JOB_EXPIRY_MS) return "expired";
    return "live";
  }
  return "pending";
}

// text-link action styles
const BTN =
  "text-[11px] font-mono text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap";
const BTN_ACTION =
  "text-[11px] font-mono text-[var(--color-text)] hover:opacity-60 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap";

export default function AdminPanel({
  pending: initialPending,
  approved: initialApproved,
  declined: initialDeclined,
  expiredJobs,
}: AdminPanelProps) {
  const [pending, setPending] = useState(initialPending);
  const [approved, setApproved] = useState(initialApproved);
  const [declined, setDeclined] = useState(initialDeclined);
  const [loading, setLoading] = useState<string | null>(null);
  const [archiveOpen, setArchiveOpen] = useState(false);

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
        if (action === "resurrect" && from === "approved") {
          const sub = approved.find((s) => s.id === id);
          setApproved(approved.filter((s) => s.id !== id));
          if (sub)
            setPending([
              ...pending,
              { ...sub, approved: false, rejected: false },
            ]);
        }
        if (action === "delete") {
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

  // group approved by status
  const liveRows = approved
    .map((sub) => ({ sub, status: getStatus(sub) as Status, from: "approved" as const }))
    .filter((r) => r.status === "live");

  const expiredSubRows = approved
    .map((sub) => ({ sub, status: getStatus(sub) as Status, from: "approved" as const }))
    .filter((r) => r.status === "expired");

  const allEmpty =
    pending.length === 0 &&
    liveRows.length === 0 &&
    declined.length === 0 &&
    expiredSubRows.length === 0 &&
    expiredJobs.length === 0;

  // ── section label ──────────────────────────────────

  function renderSectionLabel(label: string, count: number, isFirst: boolean) {
    return (
      <div className={`flex items-center gap-3 ${isFirst ? "mt-2" : "mt-6"}`}>
        <span className="text-[10px] font-mono text-[var(--color-text-muted)] whitespace-nowrap">
          {label} · {count}
        </span>
        <span className="flex-1 h-px bg-[var(--color-border)]" />
      </div>
    );
  }

  // ── submission row ─────────────────────────────────

  function renderSubmissionRow(
    sub: JobSubmission,
    status: Status,
    from: "pending" | "approved" | "declined",
  ) {
    const dimmed = status === "expired" || status === "declined";
    return (
      <div
        key={sub.id}
        className={`group relative h-[40px] border-b border-[var(--color-border)] flex items-center gap-6 -mx-2 px-4 transition-colors hover:bg-[var(--color-bg-hover)] ${
          dimmed ? "opacity-40" : ""
        }`}
      >
        {/* age */}
        <span className="w-[32px] shrink-0 hidden sm:block text-[11px] text-[var(--color-text-muted)] font-mono">
          {formatRelativeTime(sub.submittedAt)}
        </span>

        {/* title + live dot */}
        <span className="flex-1 min-w-0 flex items-center gap-2">
          {status === "live" && (
            <span className="shrink-0 w-1.5 h-1.5 bg-[var(--color-text)] rounded-full animate-rec" />
          )}
          <span className="text-[13px] text-[var(--color-text)] truncate">
            {sub.title}
          </span>
        </span>

        {/* company */}
        <span className="text-[13px] text-[var(--color-text)] w-[120px] shrink-0 truncate text-right">
          {sub.company}
        </span>

        {/* mobile actions — always visible, compact */}
        <span className="flex items-center gap-2 lg:hidden shrink-0">
          {status === "pending" && (
            <>
              <button
                onClick={() => handleAction(sub.id, "approve", from)}
                disabled={loading === sub.id}
                className={BTN_ACTION}
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
          <a
            href={sub.url}
            target="_blank"
            rel="noopener noreferrer"
            className={BTN}
          >
            ↗
          </a>
        </span>

        {/* type — desktop only, invisible on hover when actions show */}
        <span className="text-[11px] text-[var(--color-text-muted)] w-[80px] shrink-0 hidden lg:block font-mono text-right lg:group-hover:invisible">
          {sub.category}
        </span>

        {/* desktop hover actions — gradient overlay from right */}
        <span className="absolute right-0 inset-y-0 hidden lg:group-hover:flex items-center">
          <span className="w-8 h-full bg-gradient-to-r from-transparent to-[var(--color-bg-hover)]" />
          <span className="h-full bg-[var(--color-bg-hover)] flex items-center gap-3 pr-4">
            {status === "pending" && (
              <>
                <button
                  onClick={() => handleAction(sub.id, "approve", from)}
                  disabled={loading === sub.id}
                  className={BTN_ACTION}
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
            <a
              href={sub.url}
              target="_blank"
              rel="noopener noreferrer"
              className={BTN}
            >
              view ↗
            </a>
            {status === "live" && (
              <button
                onClick={() => handleAction(sub.id, "reject", from)}
                disabled={loading === sub.id}
                className={BTN}
              >
                disable
              </button>
            )}
            {(status === "expired" || status === "declined") && (
              <button
                onClick={() => handleAction(sub.id, "resurrect", from)}
                disabled={loading === sub.id}
                className={BTN}
              >
                resurrect
              </button>
            )}
          </span>
        </span>
      </div>
    );
  }

  // ── scraped job row (archive) ──────────────────────

  function renderScrapedRow(job: Job) {
    return (
      <a
        key={job.id}
        href={job.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group block"
      >
        <div className="h-[40px] border-b border-[var(--color-border)] flex items-center gap-6 -mx-2 px-4 transition-colors group-hover:bg-[var(--color-bg-hover)]">
          <span className="w-[32px] shrink-0 hidden sm:block text-[11px] text-[var(--color-text-muted)] font-mono">
            {formatRelativeTime(job.postedAt)}
          </span>
          <span className="flex-1 min-w-0 text-[13px] text-[var(--color-text)] truncate">
            {job.title}
          </span>
          <span className="text-[13px] text-[var(--color-text)] w-[120px] shrink-0 truncate text-right">
            {job.company}
          </span>
          <span className="text-[11px] text-[var(--color-text-muted)] w-[80px] shrink-0 hidden lg:block font-mono text-right">
            {job.category}
          </span>
        </div>
      </a>
    );
  }

  // ── track which is first section for spacing ───────

  let sectionIndex = 0;

  return (
    <div>
      {/* column headers — matches homepage exactly */}
      <div className="h-[32px] flex items-center gap-6 -mx-2 px-4 border-b border-[var(--color-text)] text-[10px] text-[var(--color-text-muted)] font-mono">
        <span className="w-[32px] shrink-0 hidden sm:block">age</span>
        <span className="flex-1">title</span>
        <span className="w-[120px] shrink-0 text-right">company</span>
        <span className="w-[80px] shrink-0 hidden lg:block text-right">type</span>
      </div>

      {allEmpty && (
        <p className="text-[11px] text-[var(--color-text-muted)] font-mono py-6">
          no submissions yet.
        </p>
      )}

      {/* pending */}
      {pending.length > 0 && (
        <div>
          {renderSectionLabel("pending", pending.length, sectionIndex++ === 0)}
          {pending.map((sub) =>
            renderSubmissionRow(sub, "pending", "pending"),
          )}
        </div>
      )}

      {/* live */}
      {liveRows.length > 0 && (
        <div>
          {renderSectionLabel("live", liveRows.length, sectionIndex++ === 0)}
          {liveRows.map((r) =>
            renderSubmissionRow(r.sub, "live", r.from),
          )}
        </div>
      )}

      {/* declined */}
      {declined.length > 0 && (
        <div>
          {renderSectionLabel("declined", declined.length, sectionIndex++ === 0)}
          {declined.map((sub) =>
            renderSubmissionRow(sub, "declined", "declined"),
          )}
        </div>
      )}

      {/* expired submissions */}
      {expiredSubRows.length > 0 && (
        <div>
          {renderSectionLabel("expired", expiredSubRows.length, sectionIndex++ === 0)}
          {expiredSubRows.map((r) =>
            renderSubmissionRow(r.sub, "expired", r.from),
          )}
        </div>
      )}

      {/* archive — expired scraped jobs from homepage */}
      {expiredJobs.length > 0 && (
        <div className="mt-8">
          <button
            onClick={() => setArchiveOpen(!archiveOpen)}
            className="text-[10px] font-mono text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
          >
            archive · {expiredJobs.length} {archiveOpen ? "↑" : "↓"}
          </button>
          {archiveOpen && (
            <div className="mt-2 opacity-30">
              {expiredJobs.map(renderScrapedRow)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
