"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "visited-jobs";

/**
 * Track which individual jobs the user has clicked on.
 * Stored in localStorage as a JSON object: { [jobId]: timestamp }
 * Expires entries older than 30 days to avoid bloat.
 */

let cache: Record<string, number> | null = null;
const listeners = new Set<() => void>();

function getStore(): Record<string, number> {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) { cache = {}; return cache; }
    const parsed = JSON.parse(raw) as Record<string, number>;
    // prune entries older than 30 days
    const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const pruned: Record<string, number> = {};
    for (const [k, v] of Object.entries(parsed)) {
      if (v > cutoff) pruned[k] = v;
    }
    cache = pruned;
    return cache;
  } catch {
    cache = {};
    return cache;
  }
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  } catch { /* quota exceeded, ignore */ }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

function getSnapshot(): Record<string, number> {
  return getStore();
}

function getServerSnapshot(): Record<string, number> {
  return {};
}

export function useVisited() {
  const store = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const isVisited = useCallback(
    (jobId: string) => jobId in store,
    [store],
  );

  const markVisited = useCallback((jobId: string) => {
    const s = getStore();
    s[jobId] = Date.now();
    cache = { ...s };
    persist();
  }, []);

  const visitedCount = Object.keys(store).length;

  return { isVisited, markVisited, visitedCount };
}
