"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "favorite-jobs";

/**
 * Track favorite/saved jobs.
 * Stored in localStorage as a JSON object: { [jobId]: { savedAt, title, company, url, category } }
 */

export interface SavedJob {
  savedAt: number;
  title: string;
  company: string;
  url: string;
  category: string;
}

type FavStore = Record<string, SavedJob>;

let cache: FavStore | null = null;
let snapshot: FavStore = {};
const listeners = new Set<() => void>();

function getStore(): FavStore {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) { cache = {}; snapshot = cache; return cache; }
    cache = JSON.parse(raw) as FavStore;
    snapshot = cache;
    return cache;
  } catch {
    cache = {};
    snapshot = cache;
    return cache;
  }
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  } catch { /* quota exceeded */ }
  snapshot = { ...cache! };
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

function getSnapshot(): FavStore {
  if (!cache) getStore();
  return snapshot;
}

function getServerSnapshot(): FavStore {
  return {};
}

export function useFavorites() {
  const store = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const isFavorited = useCallback(
    (jobId: string) => jobId in store,
    [store],
  );

  const toggleFavorite = useCallback((jobId: string, job: { title: string; company: string; url: string; category: string }) => {
    const s = getStore();
    if (jobId in s) {
      delete s[jobId];
    } else {
      s[jobId] = {
        savedAt: Date.now(),
        title: job.title,
        company: job.company,
        url: job.url,
        category: job.category,
      };
    }
    cache = { ...s };
    persist();
  }, []);

  const favorites = Object.entries(store)
    .map(([id, job]) => ({ id, ...job }))
    .sort((a, b) => b.savedAt - a.savedAt);

  const count = favorites.length;

  return { isFavorited, toggleFavorite, favorites, count };
}
