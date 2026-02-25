/**
 * Fetch with retry + exponential backoff for transient failures.
 * Retries on: timeouts, 429 (rate-limited), 5xx (server errors).
 * Does NOT retry on: 4xx (except 429) — those are permanent.
 */

const MAX_RETRIES = 2; // 3 total attempts
const BASE_DELAY_MS = 1000;

function isRetryable(status: number): boolean {
  return status === 429 || status >= 500;
}

export async function fetchWithRetry(
  url: string,
  opts: RequestInit & { timeoutMs?: number } = {},
): Promise<Response> {
  const { timeoutMs = 15000, ...fetchOpts } = opts;
  let lastError: unknown;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch(url, {
        ...fetchOpts,
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (res.ok) return res;

      // permanent failure → don't retry
      if (!isRetryable(res.status)) return res;

      // retryable status → log and continue
      lastError = new Error(`HTTP ${res.status}`);
    } catch (err) {
      clearTimeout(timer);
      lastError = err;
      // network errors + aborts are retryable
    }

    // backoff before next attempt (skip if last attempt)
    if (attempt < MAX_RETRIES) {
      const delay = BASE_DELAY_MS * 2 ** attempt; // 1s, 2s
      await new Promise((r) => setTimeout(r, delay));
    }
  }

  throw lastError;
}

/**
 * Per-company scrape result for reporting.
 */
export interface CompanyResult {
  company: string;
  ats: string;
  slug: string;
  jobs: number;
  error?: string;
}

/**
 * Aggregate scrape report returned alongside jobs.
 */
export interface ScrapeReport {
  companies: number;
  succeeded: number;
  failed: number;
  failures: CompanyResult[];
  elapsed: string;
}
