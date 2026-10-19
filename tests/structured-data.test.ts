import { afterEach, describe, expect, it, vi } from "vitest";
import { RELEASES } from "@/content/releases";
import { MANUAL_CHAPTERS } from "@/lib/manual";
import { breadcrumbs, siteGraph, techArticle } from "@/lib/structured-data";

afterEach(() => vi.unstubAllEnvs());

function stubSite() {
  vi.stubEnv("SITE_URL", "https://naverp.se");
  vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "");
}

describe("siteGraph", () => {
  it("beskriver webbplatsen, personen och programmet med absoluta id:n", () => {
    stubSite();
    const graph = siteGraph()["@graph"];
    expect(graph.map((node) => node["@type"])).toEqual(["WebSite", "Person", "SoftwareApplication"]);
    for (const node of graph) expect(node["@id"]).toMatch(/^https:\/\/naverp\.se\/#/);
  });

  it("anger gratis licens, GPL och den senaste versionen", () => {
    stubSite();
    const software = siteGraph()["@graph"][2] as Record<string, unknown>;
    expect(software.offers).toEqual({ "@type": "Offer", price: "0", priceCurrency: "SEK" });
    expect(software.license).toBe("https://www.gnu.org/licenses/gpl-3.0.html");
    expect(software.softwareVersion).toBe(RELEASES[0]!.version);
  });

  it("följer base path", () => {
    vi.stubEnv("SITE_URL", "https://ubbe76.github.io");
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "/hemsida");
    expect(siteGraph()["@graph"][0]!["@id"]).toBe("https://ubbe76.github.io/hemsida/#website");
  });
});

describe("breadcrumbs", () => {
  it("numrerar stegen och länkar alla utom den aktuella sidan", () => {
    stubSite();
    const items = breadcrumbs([{ name: "Nav|ERP", path: "/" }, { name: "Manual", path: "/hjalp/" }, { name: "Lager" }])
      .itemListElement;
    expect(items.map((i) => i.position)).toEqual([1, 2, 3]);
    expect(items[1]).toMatchObject({ name: "Manual", item: "https://naverp.se/hjalp/" });
    expect(items[2]).not.toHaveProperty("item");
  });
});

describe("techArticle", () => {
  it("pekar på kapitlets sida och knyter an till programmet", () => {
    stubSite();
    const chapter = MANUAL_CHAPTERS[0]!;
    const article = techArticle(chapter);
    expect(article.url).toBe(`https://naverp.se/hjalp/${chapter.slug}/`);
    expect(article.headline).toBe(chapter.title);
    expect(article.about).toEqual({ "@id": "https://naverp.se/#software" });
  });
});

describe("techArticle med datum", () => {
  it("anger dateModified bara när datumet är känt", () => {
    stubSite();
    const chapter = MANUAL_CHAPTERS[0]!;
    expect(techArticle(chapter, "2026-10-18").dateModified).toBe("2026-10-18");
    expect(techArticle(chapter)).not.toHaveProperty("dateModified");
  });
});
