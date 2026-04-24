import { JOB_EXPIRY_DAYS } from "./types";

/**
 * Check if a job is expired (older than JOB_EXPIRY_DAYS)
 */
export function isExpired(postedAt: string): boolean {
  const posted = new Date(postedAt).getTime();
  const now = Date.now();
  const diffDays = (now - posted) / (1000 * 60 * 60 * 24);
  return diffDays > JOB_EXPIRY_DAYS;
}

/**
 * Check if a job is new (posted within 24 hours)
 */
export function isNew(postedAt: string): boolean {
  const posted = new Date(postedAt).getTime();
  const now = Date.now();
  const diffHours = (now - posted) / (1000 * 60 * 60);
  return diffHours <= 24;
}

/**
 * Format a date string to a relative time (e.g., "2h ago", "3d ago", "2w ago").
 * Jobs older than JOB_EXPIRY_DAYS (30) are filtered out upstream.
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString).getTime();
  const now = Date.now();
  const diffMs = now - date;

  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(days / 7);

  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 7) return `${days}d`;
  return `${weeks}w`;
}

/**
 * Group jobs by time period
 */
export function groupJobsByDate(
  jobs: { postedAt: string }[]
): { label: string; startIndex: number; endIndex: number }[] {
  const groups: { label: string; startIndex: number; endIndex: number }[] = [];
  let currentLabel = "";
  let startIndex = 0;

  jobs.forEach((job, index) => {
    const label = getDateLabel(job.postedAt);
    if (label !== currentLabel) {
      if (currentLabel) {
        groups.push({ label: currentLabel, startIndex, endIndex: index });
      }
      currentLabel = label;
      startIndex = index;
    }
  });

  if (currentLabel) {
    groups.push({
      label: currentLabel,
      startIndex,
      endIndex: jobs.length,
    });
  }

  return groups;
}

function getDateLabel(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) return "today";
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return "this week";
  if (diffDays < 14) return "last week";
  if (diffDays < 30) return "this month";
  return "expired";
}

/**
 * Normalize employment type strings from ATS APIs to a consistent lowercase format.
 * APIs return wildly different formats: "Full-time", "FULL_TIME", "fulltime", "Perm - Full-Time", etc.
 */
export function normalizeEmploymentType(raw?: string): string {
  if (!raw) return "full-time";
  const s = raw.toLowerCase().replace(/_/g, "-").trim();
  if (/full.?time|permanent|regular|perm\b/.test(s)) return "full-time";
  if (/part.?time/.test(s)) return "part-time";
  if (/contract|freelance|temp/.test(s)) return "contract";
  if (/intern/.test(s)) return "intern";
  // fallback: keep whatever came in, just lowercased + dashes
  return s.replace(/\s+/g, "-");
}

/**
 * Strip HTML tags and decode common HTML entities from a string.
 * Handles double-encoded content (e.g. Greenhouse API returns &lt;div&gt; literally).
 */
export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/<[^>]*>/g, " ") // second pass after entity decode
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Create a simple hash-based ID
 */
export function createJobId(source: string, identifier: string): string {
  const str = `${source}-${identifier}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `${source}_${Math.abs(hash).toString(36)}`;
}
