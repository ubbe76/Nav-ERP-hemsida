import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { checkLinks, urlPathFor } from "@/lib/links";

function site(pages: Record<string, string>): string {
  const dir = mkdtempSync(path.join(os.tmpdir(), "out-"));
  for (const [rel, html] of Object.entries(pages)) {
    mkdirSync(path.dirname(path.join(dir, rel)), { recursive: true });
    writeFileSync(path.join(dir, rel), html);
  }
  return dir;
}

describe("urlPathFor", () => {
  it("översätter filer till URL:er", () => {
    expect(urlPathFor("/o", "/o/index.html")).toBe("/");
    expect(urlPathFor("/o", "/o/hjalp/lager/index.html")).toBe("/hjalp/lager/");
    expect(urlPathFor("/o", "/o/404.html")).toBe("/404.html");
  });
});

describe("checkLinks", () => {
  const pages = {
    "index.html": `<a id="top" href="#top">upp</a> <a href="/hjalp/">manual</a> <a href="/hjalp/lager/#saldon">saldon</a>
      <a href="https://github.com">gh</a> <a href="mailto:a@b.se">mejl</a> <img src="/bild.png">`,
    "hjalp/index.html": `<h1 id="manual">Manual</h1>`,
    "hjalp/lager/index.html": `<h2 id="saldon">Saldon</h2>`,
    "bild.png": "png",
  };

  it("godkänner länkar, ankare och filer som finns och hoppar över externa", () => {
    expect(checkLinks(site(pages))).toEqual([]);
  });

  it("hittar saknade sidor och saknade ankare", () => {
    const dir = site({ ...pages, "index.html": `<a href="/saknas/">x</a> <a href="/hjalp/lager/#nope">y</a> <a href="#borta">z</a>` });
    expect(checkLinks(dir)).toEqual([
      { page: "/", href: "/saknas/", reason: "sidan eller filen finns inte" },
      { page: "/", href: "/hjalp/lager/#nope", reason: "ankaret #nope finns inte" },
      { page: "/", href: "#borta", reason: "ankaret #borta finns inte" },
    ]);
  });

  it("kräver base path på rotrelativa länkar när sajten ligger under en underkatalog", () => {
    const dir = site({ "index.html": `<a href="/hemsida/hjalp/">ok</a> <a href="/hjalp/">fel</a>`, "hjalp/index.html": "" });
    expect(checkLinks(dir, "/hemsida")).toEqual([{ page: "/", href: "/hjalp/", reason: "saknar base path" }]);
  });
});
