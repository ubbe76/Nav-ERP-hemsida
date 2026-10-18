// Site-wide constants and URL helpers. BASE_PATH/SITE_URL come from the
// environment so one build works on a custom domain and under
// <user>.github.io/<repo>/ (see next.config.ts and the deploy workflow).
export const SITE = {
  name: "Nav|ERP",
  description:
    // Under 160 characters, so search results show it whole.
    "Affärssystem med öppen källkod för svensk tillverkning: lager, inköp, försäljning, tillverkning, kalkyl och bokföring i ett system. Gratis och självhostat.",
  email: "erp@kallefors.se",
  repoUrl: "https://github.com/ubbe76/Nav-ERP",
  cloneUrl: "https://github.com/ubbe76/Nav-ERP.git",
  // The issue chooser: Felrapport, Förslag and the private security report.
  newIssueUrl: "https://github.com/ubbe76/Nav-ERP/issues/new/choose",
  securityUrl: "https://github.com/ubbe76/Nav-ERP/security/advisories/new",
} as const;

export function basePath(): string {
  return process.env.NEXT_PUBLIC_BASE_PATH ?? "";
}

/** Prefix a root-relative path with the base path. For raw HTML and <img> — next/link adds it itself. */
export function withBase(p: string): string {
  return p.startsWith("/") && !p.startsWith("//") ? `${basePath()}${p}` : p;
}

/** Origin the site is served from, without trailing slash. */
export function siteUrl(): string {
  return (process.env.SITE_URL ?? "http://localhost:3000").replace(/\/+$/, "");
}

export function absoluteUrl(p: string): string {
  return `${siteUrl()}${withBase(p)}`;
}

export const NAV_ITEMS = [
  { href: "/funktioner/", label: "Funktioner" },
  { href: "/kom-igang/", label: "Kom igång" },
  { href: "/hjalp/", label: "Manual" },
  { href: "/oppen-kallkod/", label: "Öppen källkod" },
] as const;
