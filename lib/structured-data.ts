// Schema.org JSON-LD for the pages, rendered by components/JsonLd.tsx.
// The site-wide graph defines the website, the author and the software once;
// page-level objects point back to them by @id instead of repeating them.
import { FEATURE_AREAS } from "@/content/areas";
import { RELEASES } from "@/content/releases";
import { SITE, absoluteUrl } from "./site";
import type { ManualChapter } from "./manual";

const id = (fragment: string) => `${absoluteUrl("/")}#${fragment}`;
const WEBSITE_ID = () => id("website");
const AUTHOR_ID = () => id("author");
const SOFTWARE_ID = () => id("software");

const AUTHOR = { name: "Urban Källefors", profileUrl: "https://github.com/ubbe76" };

/** Ways people write the name — so "NavERP" or "Nav ERP" resolve to the same thing. */
const ALTERNATE_NAMES = ["NavERP", "Nav-ERP", "Nav ERP"];

/** WebSite, the person behind it and the software — on every page, from the root layout. */
export function siteGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID(),
        url: absoluteUrl("/"),
        name: SITE.name,
        alternateName: ALTERNATE_NAMES,
        inLanguage: "sv-SE",
        publisher: { "@id": AUTHOR_ID() },
      },
      {
        "@type": "Person",
        "@id": AUTHOR_ID(),
        name: AUTHOR.name,
        url: absoluteUrl("/om/"),
        email: SITE.email,
        sameAs: [AUTHOR.profileUrl],
      },
      softwareApplication(),
    ],
  };
}

function softwareApplication() {
  return {
    "@type": "SoftwareApplication",
    "@id": SOFTWARE_ID(),
    name: SITE.name,
    alternateName: ALTERNATE_NAMES,
    url: absoluteUrl("/"),
    description: SITE.description,
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "ERP",
    // What /kom-igang/ supports: a Linux server running Docker.
    operatingSystem: "Linux (Docker)",
    softwareVersion: RELEASES[0]!.version,
    inLanguage: "sv-SE",
    license: "https://www.gnu.org/licenses/gpl-3.0.html",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "SEK" },
    codeRepository: SITE.repoUrl,
    downloadUrl: SITE.repoUrl,
    screenshot: absoluteUrl("/screenshots/screenshot-dashboard.png"),
    featureList: FEATURE_AREAS.map((a) => a.title),
    author: { "@id": AUTHOR_ID() },
  };
}

/** Breadcrumb trail; the last item is the current page and carries no link. */
export function breadcrumbs(trail: Array<{ name: string; path?: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      ...(crumb.path ? { item: absoluteUrl(crumb.path) } : {}),
    })),
  };
}

/**
 * A manual chapter. `dateModified` is its file's last commit in Nav-ERP, when
 * known; no datePublished, as there is none we could vouch for.
 */
export function techArticle(chapter: ManualChapter, dateModified?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: chapter.title,
    description: chapter.description,
    url: absoluteUrl(`/hjalp/${chapter.slug}/`),
    inLanguage: "sv-SE",
    isPartOf: { "@id": WEBSITE_ID() },
    about: { "@id": SOFTWARE_ID() },
    author: { "@id": AUTHOR_ID() },
    ...(dateModified && { dateModified }),
  };
}
