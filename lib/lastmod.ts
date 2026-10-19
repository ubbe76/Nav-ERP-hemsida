import { readFileSync } from "node:fs";
import path from "node:path";
import { gitDates, latest } from "./git-dates";
import { getChapter, type ManualChapter } from "./manual";
import { MANUAL_DATES_FILE } from "./sync";

// When each page last changed, for the sitemap's lastmod and the manual's
// "uppdaterad" line. Site pages are dated from this repo's history; manual
// chapters from Nav-ERP's, recorded by `npm run sync` in MANUAL_DATES_FILE
// (the synced copies carry no history of their own).

/** Files in this repo whose changes count as a change to the page's content. */
export function routeSources(route: string): string[] {
  if (route === "/") return ["app/page.tsx", "content/releases.ts", "content/faq.ts"];
  if (route === "/affarssystem-for-tillverkning/") return ["app/affarssystem-for-tillverkning/page.tsx", "content/guide.ts"];
  if (route === "/fragor/") return ["app/fragor/page.tsx", "content/faq.ts"];
  if (route === "/verktyg/paslagskalkyl/") return ["app/verktyg/paslagskalkyl/page.tsx", "lib/calc.ts"];
  if (route === "/funktioner/") return ["app/funktioner/page.tsx", "content/areas.ts"];
  if (route.startsWith("/funktioner/")) return ["app/funktioner/[omrade]/page.tsx", "content/areas.ts"];
  if (route === "/versioner/") return ["app/versioner/page.tsx", "content/releases.ts"];
  if (route === "/hjalp/") return ["app/hjalp/page.tsx", "content/manual-meta.ts"];
  if (route === "/kom-igang/") return ["app/kom-igang/page.tsx", "content/hardware.ts"];
  if (route === "/gratis-affarssystem/") return ["app/gratis-affarssystem/page.tsx", "content/hardware.ts", "lib/tco.ts"];
  return [`app${route}page.tsx`];
}

let manualDates: Record<string, string> | undefined;

/** Last commit date of a chapter's file in Nav-ERP, when the sync could tell. */
export function manualDate(chapter: ManualChapter): string | undefined {
  if (!manualDates) {
    try {
      const file = path.join(process.cwd(), MANUAL_DATES_FILE);
      manualDates = JSON.parse(readFileSync(file, "utf8")) as Record<string, string>;
    } catch {
      manualDates = {};
    }
  }
  return manualDates[chapter.file];
}

export function lastModified(route: string): string | undefined {
  const chapter = /^\/hjalp\/([^/]+)\/$/.exec(route)?.[1];
  if (chapter) {
    const c = getChapter(chapter);
    return c && manualDate(c);
  }
  return latest(Object.values(gitDates(process.cwd(), routeSources(route))));
}
