import { afterEach, describe, expect, it, vi } from "vitest";
import { RELEASES } from "@/content/releases";
import { MANUAL_CHAPTERS } from "@/lib/manual";
import { breadcrumbs, siteGraph, softwareGraph, techArticle, withSoftware } from "@/lib/structured-data";

afterEach(() => vi.unstubAllEnvs());

function stubSite() {
  vi.stubEnv("SITE_URL", "https://naverp.se");
  vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "");
}

describe("siteGraph", () => {
  it("beskriver webbplatsen, organisationen och personen med absoluta id:n", () => {
    stubSite();
    const graph = siteGraph()["@graph"];
    expect(graph.map((node) => node["@type"])).toEqual(["WebSite", "Organization", "Person"]);
    for (const node of graph) expect(node["@id"]).toMatch(/^https:\/\/naverp\.se\/#/);
  });

  it("ger ut webbplatsen som organisationen Nav|ERP, grundad av personen och med GitHub som sameAs", () => {
    stubSite();
    const [website, org] = siteGraph()["@graph"] as Array<Record<string, unknown>>;
    expect(website!.publisher).toEqual({ "@id": "https://naverp.se/#org" });
    expect(org).toMatchObject({
      name: "Nav|ERP",
      founder: { "@id": "https://naverp.se/#author" },
      sameAs: ["https://github.com/ubbe76/Nav-ERP"],
    });
  });

  it("lämnar inte ut någon e-postadress", () => {
    stubSite();
    expect(JSON.stringify([siteGraph(), softwareGraph()])).not.toMatch(/email|@kallefors/);
  });

  it("beskriver programmet och källkoden för sig, med källkoden kopplad till programmet", () => {
    stubSite();
    const [software, source] = softwareGraph()["@graph"] as Array<Record<string, unknown>>;
    expect(software!["@type"]).toBe("SoftwareApplication");
    expect(software).not.toHaveProperty("codeRepository");
    expect(source!["@type"]).toBe("SoftwareSourceCode");
    expect(source!.targetProduct).toEqual({ "@id": "https://naverp.se/#software" });
  });

  it("anger gratis licens, GPL och den senaste versionen", () => {
    stubSite();
    const software = softwareGraph()["@graph"][0] as Record<string, unknown>;
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

describe("referenserna", () => {
  // Every { "@id": … } that only points must be defined in a block on the same page.
  function ids(blocks: object[]) {
    const defined = new Set<string>();
    const referred = new Set<string>();
    const walk = (value: unknown) => {
      if (Array.isArray(value)) return value.forEach(walk);
      if (!value || typeof value !== "object") return;
      const node = value as Record<string, unknown>;
      const keys = Object.keys(node);
      if (typeof node["@id"] === "string") (keys.length === 1 ? referred : defined).add(node["@id"]);
      keys.forEach((k) => walk(node[k]));
    };
    blocks.forEach(walk);
    return { defined, referred };
  }

  it("startsidan definierar allt den pekar på", () => {
    stubSite();
    const { defined, referred } = ids([siteGraph(), softwareGraph()]);
    expect([...referred].filter((r) => !defined.has(r))).toEqual([]);
  });

  it("ett manualkapitel definierar programmet det handlar om, på samma sida", () => {
    stubSite();
    const article = withSoftware(techArticle(MANUAL_CHAPTERS[0]!, "2026-10-18"));
    const { defined, referred } = ids([siteGraph(), article]);
    expect(referred).toContain("https://naverp.se/#software");
    expect([...referred].filter((r) => !defined.has(r))).toEqual([]);
    expect(article["@graph"].map((n) => (n as Record<string, unknown>)["@type"])).toEqual([
      "TechArticle",
      "SoftwareApplication",
    ]);
  });

  it("kapitlet anger utgivare och bild", () => {
    stubSite();
    const article = techArticle(MANUAL_CHAPTERS[0]!);
    expect(article.publisher).toEqual({ "@id": "https://naverp.se/#org" });
    expect(article.image).toMatch(/^https:\/\/naverp\.se\/screenshots\/.+/);
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
