import { JOB_EXPIRY_DAYS } from "./types";

/**
 * Check if a job is expired (older than 14 days)
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
 * Format a date string to a relative time (e.g., "2h ago", "3d ago")
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString).getTime();
  const now = Date.now();
  const diffMs = now - date;

  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 7) return `${days}d`;
  if (days < 30) return `${Math.floor(days / 7)}w`;
  return `${Math.floor(days / 30)}mo`;
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

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return "This Week";
  if (diffDays < 14) return "Last Week";
  return "Expired";
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
