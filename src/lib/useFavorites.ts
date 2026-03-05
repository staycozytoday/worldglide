"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "favorite-jobs";

/**
 * Track favorite jobs by ID.
 * Stored in localStorage as a JSON array of job IDs.
 * No metadata needed — just toggle on/off.
 */

let cache: Set<string> | null = null;
let snapshot: ReadonlySet<string> = new Set();
const listeners = new Set<() => void>();

function getStore(): Set<string> {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) { cache = new Set(); snapshot = cache; return cache; }
    cache = new Set(JSON.parse(raw) as string[]);
    snapshot = cache;
    return cache;
  } catch {
    cache = new Set();
    snapshot = cache;
    return cache;
  }
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...cache!]));
  } catch { /* quota exceeded */ }
  snapshot = new Set(cache!);
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

function getSnapshot(): ReadonlySet<string> {
  if (!cache) getStore();
  return snapshot;
}

function getServerSnapshot(): ReadonlySet<string> {
  return new Set();
}

export function useFavorites() {
  const store = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const isFavorited = useCallback(
    (jobId: string) => store.has(jobId),
    [store],
  );

  const toggleFavorite = useCallback((jobId: string) => {
    const s = getStore();
    if (s.has(jobId)) {
      s.delete(jobId);
    } else {
      s.add(jobId);
    }
    cache = new Set(s);
    persist();
  }, []);

  const count = store.size;

  return { isFavorited, toggleFavorite, count };
}
