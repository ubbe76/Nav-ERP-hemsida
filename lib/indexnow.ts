// IndexNow (indexnow.org): after a deploy, the workflow tells Bing and the
// other IndexNow engines which pages changed, so they needn't wait for their
// next crawl. The key is public by design — the engines check that the site
// serves it at keyLocation (public/<key>.txt) before accepting a submission.
export const INDEXNOW_KEY = "b814d70a9ea4bd4e0d5f2c74e8cbcdbb";

/** URL → lastmod, if the entry has one. */
export type Sitemap = Map<string, string | undefined>;

export function parseSitemap(xml: string): Sitemap {
  const entries: Sitemap = new Map();
  for (const [, block] of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const loc = /<loc>([^<]+)<\/loc>/.exec(block!)?.[1]?.trim();
    if (loc) entries.set(loc, /<lastmod>([^<]+)<\/lastmod>/.exec(block!)?.[1]?.trim());
  }
  return entries;
}

/**
 * URLs that are new in `next` or whose lastmod differs from `previous` (the
 * sitemap now live). Without a previous sitemap, every URL counts as new.
 */
export function changedUrls(next: Sitemap, previous?: Sitemap): string[] {
  return [...next].filter(([url, lastmod]) => !previous?.has(url) || previous.get(url) !== lastmod).map(([url]) => url);
}

/** The request body for POST https://api.indexnow.org/indexnow. `siteUrl` is the site's root URL. */
export function indexNowBody(siteUrl: string, urls: string[]) {
  const root = siteUrl.replace(/\/+$/, "");
  return { host: new URL(root).host, key: INDEXNOW_KEY, keyLocation: `${root}/${INDEXNOW_KEY}.txt`, urlList: urls };
}
