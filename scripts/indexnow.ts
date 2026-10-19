import { readFileSync } from "node:fs";
import { changedUrls, indexNowBody, parseSitemap, type Sitemap } from "../lib/indexnow";

// Usage: tsx scripts/indexnow.ts <built sitemap.xml> <site root URL>
// Compares the built sitemap with the one live at <site root URL> and prints
// `body=<json>` (for $GITHUB_OUTPUT) with the pages to submit once the build
// is deployed — or `body=` when nothing changed.
const [builtPath, siteUrl] = process.argv.slice(2);
if (!builtPath || !siteUrl) {
  console.error("Användning: tsx scripts/indexnow.ts <sitemap.xml> <webbplatsens adress>");
  process.exit(1);
}

async function live(url: string): Promise<Sitemap | undefined> {
  try {
    const res = await fetch(url);
    if (res.ok) return parseSitemap(await res.text());
    console.error(`indexnow: ${url} svarade ${res.status} — skickar alla sidor`);
  } catch (err) {
    console.error(`indexnow: kunde inte hämta ${url} (${String(err)}) — skickar alla sidor`);
  }
  return undefined;
}

async function main(built: string, site: string) {
  const root = site.replace(/\/+$/, "");
  const urls = changedUrls(parseSitemap(readFileSync(built, "utf8")), await live(`${root}/sitemap.xml`));
  console.error(`indexnow: ${urls.length} nya eller ändrade sidor${urls.length ? `:\n  ${urls.join("\n  ")}` : ""}`);
  console.log(`body=${urls.length ? JSON.stringify(indexNowBody(root, urls)) : ""}`);
}

main(builtPath, siteUrl).catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
