export type Category = "engineering" | "product" | "design";

export type Source =
  | "greenhouse"
  | "lever"
  | "ashby"
  | "gem"
  | "smartrecruiters"
  | "workable"
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
  isWorldwide: boolean;
  employmentType?: string;
  expired?: boolean; // true if older than 14 days
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
  atsType?: "greenhouse" | "lever" | "ashby" | "gem" | "smartrecruiters" | "workable" | "custom";
  atsSlug?: string; // e.g. "gitlab" for boards.greenhouse.io/gitlab
}

// Generate a company logo URL from their domain
// Google's favicon API is reliable and free — returns high-res favicons
export function getCompanyLogoUrl(domain: string): string {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
}

// 14 days (2 weeks) — matches scraper cutoff and "live for 2 weeks" copy
export const JOB_EXPIRY_DAYS = 14;
export const JOB_EXPIRY_MS = JOB_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
