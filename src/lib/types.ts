export type Category = "creative";

export type Region = "ww" | "noam" | "latam" | "eur" | "mena" | "ssa" | "apac";

export type Source =
  | "greenhouse"
  | "lever"
  | "ashby"
  | "gem"
  | "smartrecruiters"
  | "workable"
  | "personio"
  | "breezyhr"
  | "pinpoint"
  | "himalayas"
  | "remoteok"
  | "remotive"
  | "jobicy"
  | "arbeitnow"
  | "hn"
  | "hn-whoishiring"
  | "wwr"
  | "workingnomads"
  | "dribbble"
  | "user-submitted";

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  category: Category;
  url: string;
  source: Source;
  tags: string[];
  salary?: string;
  postedAt: string; // ISO date
  scrapedAt: string; // ISO date
  description?: string;
  isWorldwide?: boolean;
  region?: Region;
  employmentType?: string;
  expired?: boolean; // true if older than 7 days
}

export interface JobSubmission {
  id: string;
  title: string;
  company: string;
  category: Category;
  url: string;
  contactEmail: string;
  submittedAt: string; // ISO date
  approved: boolean; // requires admin approval
  rejected?: boolean; // declined by admin
}

export interface RemoteCompany {
  name: string;
  domain: string; // e.g. "gitlab.com" — used for logo via logo.clearbit.com
  careersUrl: string;
  atsType?: "greenhouse" | "lever" | "ashby" | "gem" | "smartrecruiters" | "workable" | "personio" | "breezyhr" | "pinpoint" | "custom";
  atsSlug?: string; // e.g. "gitlab" for boards.greenhouse.io/gitlab
}

// Generate a company logo URL from their domain
// Google's favicon API is reliable and free — returns high-res favicons
export function getCompanyLogoUrl(domain: string): string {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
}

// 30 days — WWR and other sources list jobs for weeks; 8d was cutting too aggressively
export const JOB_EXPIRY_DAYS = 30;
export const JOB_EXPIRY_MS = JOB_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
