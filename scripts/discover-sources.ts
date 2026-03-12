#!/usr/bin/env npx tsx
/**
 * Discovery sources — each function returns { name, domain } candidates
 * from a different source. The orchestrator (discover.ts) calls these
 * and feeds results to verify-slugs.ts.
 *
 * Sources:
 * 1. GitHub awesome-remote lists (markdown → parsed links)
 * 2. YC Startup Directory (Algolia API)
 * 3. remoteintech/remote-jobs (GitHub markdown)
 */

export interface DiscoveredCompany {
  name: string;
  domain: string;
  source: string;
}

const UA = "worldglide-discover/1.0";

/** Extract domain from a URL */
function extractDomain(url: string): string | null {
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return null;
  }
}

/**
 * Source 1: GitHub awesome-remote lists
 * Parses markdown for company links: [Company Name](https://company.com)
 */
export async function discoverFromGithubLists(): Promise<DiscoveredCompany[]> {
  const lists = [
    "https://raw.githubusercontent.com/remoteintech/remote-jobs/main/README.md",
    "https://raw.githubusercontent.com/lukasz-madon/awesome-remote-job/master/README.md",
  ];

  const results: DiscoveredCompany[] = [];
  const seen = new Set<string>();

  for (const url of lists) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": UA } });
      if (!res.ok) continue;
      const md = await res.text();

      // Match markdown links: [Name](url)
      const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g;
      let match;
      while ((match = linkRegex.exec(md)) !== null) {
        const name = match[1].trim();
        const link = match[2];
        const domain = extractDomain(link);

        if (!domain) continue;
        // Skip GitHub links, docs, generic sites
        if (domain.includes("github.com")) continue;
        if (domain.includes("wikipedia.org")) continue;
        if (domain.includes("stackoverflow.com")) continue;
        if (domain.includes("medium.com")) continue;

        const key = domain;
        if (seen.has(key)) continue;
        seen.add(key);

        results.push({
          name: name.replace(/[*_`]/g, "").trim(),
          domain,
          source: "github-list",
        });
      }
    } catch {
      // skip failed lists
    }
  }

  return results;
}

/**
 * Source 2: YC Startup Directory via Algolia
 * Searches for remote-friendly startups
 */
export async function discoverFromYC(): Promise<DiscoveredCompany[]> {
  const results: DiscoveredCompany[] = [];
  const seen = new Set<string>();

  // Algolia search — YC directory is publicly searchable
  const queries = ["remote", "distributed", "worldwide"];

  for (const query of queries) {
    try {
      const res = await fetch(
        "https://45bwzj1sgc-dsn.algolia.net/1/indexes/YCCompany_production/query",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Algolia-Application-Id": "45BWZJ1SGC",
            "X-Algolia-API-Key": "MjBjYjRiMzY0NzdhZWY0NjExY2NhZjYxMGIxYjc2MTAwNWFkNTkwNTc4NjgxYjU0YzFhYTY2ZGQ5OGY5NDMxZnJlc3RyaWN0SW5kaWNlcz0lNUIlMjJZQ0NvbXBhbnlfcHJvZHVjdGlvbiUyMiU1RCZ0YWdGaWx0ZXJzPSU1QiUyMiUyMiU1RCZhbmFseXRpY3NUYWdzPSU1QiUyMnljZGMlMjIlNUQ=",
            "User-Agent": UA,
          },
          body: JSON.stringify({
            query,
            hitsPerPage: 100,
            attributesToRetrieve: ["name", "website", "one_liner", "long_description"],
          }),
        },
      );

      if (!res.ok) continue;
      const data = await res.json();

      for (const hit of data.hits || []) {
        if (!hit.website) continue;
        const domain = extractDomain(
          hit.website.startsWith("http") ? hit.website : `https://${hit.website}`
        );
        if (!domain) continue;
        if (seen.has(domain)) continue;
        seen.add(domain);

        results.push({
          name: hit.name || domain.split(".")[0],
          domain,
          source: "yc-directory",
        });
      }
    } catch {
      // skip
    }

    await new Promise(r => setTimeout(r, 200));
  }

  return results;
}

/**
 * Source 3: Curated remote company directories
 * (Flexa, remote.co — fetched from their public pages)
 */
export async function discoverFromDirectories(): Promise<DiscoveredCompany[]> {
  const results: DiscoveredCompany[] = [];
  const seen = new Set<string>();

  // Flexa careers — has a public company listing
  try {
    const res = await fetch("https://flexa.careers/companies", {
      headers: { "User-Agent": UA },
    });
    if (res.ok) {
      const html = await res.text();
      // Extract company links from the page
      const linkRegex = /href="\/companies\/([^"]+)"/g;
      let match;
      while ((match = linkRegex.exec(html)) !== null) {
        const slug = match[1];
        // Clean slug to company name
        const name = slug
          .split("-")
          .map(w => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");

        if (!seen.has(slug)) {
          seen.add(slug);
          results.push({
            name,
            domain: `${slug.replace(/-/g, "")}.com`, // best guess
            source: "flexa",
          });
        }
      }
    }
  } catch {
    // skip
  }

  return results;
}

/** Run all sources and dedupe by domain */
export async function discoverAll(): Promise<DiscoveredCompany[]> {
  console.error("[discover] running all sources...");

  const [github, yc, dirs] = await Promise.all([
    discoverFromGithubLists(),
    discoverFromYC(),
    discoverFromDirectories(),
  ]);

  console.error(`[discover] github: ${github.length}, yc: ${yc.length}, directories: ${dirs.length}`);

  // Merge and dedupe by domain
  const all = [...github, ...yc, ...dirs];
  const seen = new Set<string>();
  const deduped: DiscoveredCompany[] = [];

  for (const c of all) {
    const key = c.domain.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(c);
  }

  console.error(`[discover] total unique: ${deduped.length}`);
  return deduped;
}

// When run directly, output all discovered companies
async function main() {
  const results = await discoverAll();
  console.log(JSON.stringify(results, null, 2));
}

main().catch(err => {
  console.error("[discover] fatal:", err);
  process.exit(1);
});
