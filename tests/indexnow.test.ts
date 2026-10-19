import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { INDEXNOW_KEY, changedUrls, indexNowBody, parseSitemap } from "@/lib/indexnow";

const sitemap = (entries: Array<[string, string?]>) =>
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries
    .map(([loc, lastmod]) => `<url>\n<loc>${loc}</loc>\n${lastmod ? `<lastmod>${lastmod}</lastmod>\n` : ""}</url>`)
    .join("\n")}\n</urlset>`;

describe("IndexNow", () => {
  it("nyckelfilen finns i public/ och innehåller nyckeln", () => {
    expect(INDEXNOW_KEY).toMatch(/^[a-f0-9]{32}$/);
    expect(readFileSync(path.join(process.cwd(), "public", `${INDEXNOW_KEY}.txt`), "utf8")).toBe(INDEXNOW_KEY);
  });

  it("läser adress och lastmod ur en sitemap", () => {
    const parsed = parseSitemap(sitemap([["https://naverp.se/", "2026-10-18"], ["https://naverp.se/om/"]]));
    expect([...parsed]).toEqual([
      ["https://naverp.se/", "2026-10-18"],
      ["https://naverp.se/om/", undefined],
    ]);
  });

  it("skickar nya sidor och sidor med ändrat datum, inte oförändrade", () => {
    const live = parseSitemap(sitemap([["https://naverp.se/", "2026-10-18"], ["https://naverp.se/om/", "2026-10-18"]]));
    const built = parseSitemap(
      sitemap([
        ["https://naverp.se/", "2026-10-18"],
        ["https://naverp.se/om/", "2026-10-19"],
        ["https://naverp.se/fragor/", "2026-10-19"],
      ]),
    );
    expect(changedUrls(built, live)).toEqual(["https://naverp.se/om/", "https://naverp.se/fragor/"]);
  });

  it("skickar alla sidor när den publicerade sitemapen inte gick att hämta", () => {
    const built = parseSitemap(sitemap([["https://naverp.se/", "2026-10-18"]]));
    expect(changedUrls(built)).toEqual(["https://naverp.se/"]);
  });

  it("anger värd och nyckelfilens adress", () => {
    expect(indexNowBody("https://naverp.se/", ["https://naverp.se/om/"])).toEqual({
      host: "naverp.se",
      key: INDEXNOW_KEY,
      keyLocation: `https://naverp.se/${INDEXNOW_KEY}.txt`,
      urlList: ["https://naverp.se/om/"],
    });
  });
});
