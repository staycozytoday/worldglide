"use client";

import { useFavorites } from "@/lib/useFavorites";
import { formatRelativeTime } from "@/lib/utils";

export default function SavedPage() {
  const { favorites, toggleFavorite } = useFavorites();

  return (
    <div className="max-w-[960px] mx-auto px-8 pt-16 md:pt-24 pb-24">
      <div className="mb-16">
        <h1 className="text-[32px] md:text-[40px] font-medium tracking-tight leading-[1.1] text-[var(--color-text)]">
          saved
        </h1>
        <p className="text-[12px] text-[var(--color-text-muted)] mt-4 max-w-[320px] leading-relaxed">
          jobs you&#39;ve bookmarked. stored locally in your browser.
        </p>
        <p className="text-[10px] text-[var(--color-text-muted)] mt-4 font-mono">
          {favorites.length} saved
        </p>
      </div>

      {favorites.length === 0 ? (
        <p className="text-[12px] text-[var(--color-text-muted)] py-24">
          no saved jobs yet. click ❋ on any job to save it.
        </p>
      ) : (
        <div>
          {/* header */}
          <div className="h-[32px] flex items-center gap-2 sm:gap-6 -mx-2 px-4 border-b border-[var(--color-border)] text-[10px] font-mono text-[var(--color-text-muted)]">
            <span className="w-[20px] shrink-0" />
            <span className="w-[32px] shrink-0 hidden sm:block">saved</span>
            <span className="flex-1">title</span>
            <span className="w-[100px] sm:w-[160px] shrink-0 text-right">company</span>
            <span className="w-[80px] shrink-0 hidden lg:block text-right">type</span>
          </div>

          {/* saved jobs */}
          {favorites.map((fav) => (
            <div
              key={fav.id}
              className="flex items-center h-[40px] border-b border-[var(--color-border)] -mx-2 px-4 gap-2 sm:gap-6 job-row-wrap"
            >
              {/* unfavorite */}
              <button
                onClick={() =>
                  toggleFavorite(fav.id, {
                    title: fav.title,
                    company: fav.company,
                    url: fav.url,
                    category: fav.category,
                  })
                }
                className="shrink-0 w-[20px] h-[40px] flex items-center justify-center"
                aria-label="unsave job"
              >
                <span className="text-[13px] leading-none text-[var(--color-fav)]">
                  ❋
                </span>
              </button>

              {/* saved ago */}
              <span className="text-[11px] text-[var(--color-text-muted)] w-[32px] shrink-0 hidden sm:block font-mono">
                {formatRelativeTime(new Date(fav.savedAt).toISOString())}
              </span>

              {/* title — link */}
              <a
                href={fav.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-0 flex items-center h-full"
              >
                <span className="text-[13px] text-[var(--color-text)] truncate">
                  {fav.title}
                </span>
              </a>

              {/* company */}
              <a
                href={fav.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-[100px] sm:w-[160px] shrink-0 flex items-center justify-end h-full"
              >
                <span className="text-[13px] text-[var(--color-text)] truncate">
                  {fav.company}
                </span>
              </a>

              {/* type */}
              <span className="text-[11px] text-[var(--color-text-muted)] w-[80px] shrink-0 hidden lg:block font-mono text-right">
                {fav.category}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
