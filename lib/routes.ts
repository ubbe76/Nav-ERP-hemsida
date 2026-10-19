import { FEATURE_AREAS } from "@/content/areas";
import { MANUAL_CHAPTERS } from "@/lib/manual";

/** Every page of the site — feeds the sitemap and the e2e page sweep. */
export function allRoutes(): string[] {
  return [
    "/",
    "/funktioner/",
    ...FEATURE_AREAS.map((a) => `/funktioner/${a.slug}/`),
    "/kom-igang/",
    "/gratis-affarssystem/",
    "/oppen-kallkod/",
    "/om/",
    "/versioner/",
    "/hjalp/",
    ...MANUAL_CHAPTERS.map((c) => `/hjalp/${c.slug}/`),
  ];
}
