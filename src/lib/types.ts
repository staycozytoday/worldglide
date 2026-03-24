export type Category = "creative";

export type Region = "ww" | "noam" | "eur" | "apac" | "latam" | "mena" | "ssa";

export type Source =
  | "greenhouse"
  | "lever"
  | "ashby"
  | "gem"
  | "smartrecruiters"
  | "workable"
  | "teamtailor"
  | "bamboohr"
  | "recruitee"
  | "jazzhr"
  | "personio"
  | "breezyhr"
  | "pinpoint"
  | "dover"
  | "comeet"
  | "gohire"
  | "rippling"
  | "zoho"
  | "himalayas"
  | "remoteok"
  | "remotive"
  | "jobicy"
  | "arbeitnow"
  | "adzuna"
  | "themuse"
  | "hn-whoishiring"
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
  region: Region;
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
  atsType?: "greenhouse" | "lever" | "ashby" | "gem" | "smartrecruiters" | "workable" | "teamtailor" | "bamboohr" | "recruitee" | "jazzhr" | "personio" | "breezyhr" | "pinpoint" | "dover" | "comeet" | "gohire" | "rippling" | "zoho" | "custom";
  atsSlug?: string; // e.g. "gitlab" for boards.greenhouse.io/gitlab
}

// Generate a company logo URL from their domain
// Google's favicon API is reliable and free — returns high-res favicons
export function getCompanyLogoUrl(domain: string): string {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
}

// 8 days — keeps listings fresh, peak application window is days 1–7
export const JOB_EXPIRY_DAYS = 8;
export const JOB_EXPIRY_MS = JOB_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
