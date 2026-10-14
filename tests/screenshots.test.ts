import { mkdtempSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { buildRegistry, loadScreenshot, parseScreenshotName, pngSize, resolveVariants } from "@/lib/screenshots";

// The six files that exist in Nav-ERP/docs/assets today.
const FILES = [
  "screenshot-dashboard.png",
  "screenshot-dashboard-dark.png",
  "screenshot-dashboard-dracula.png",
  "screenshot-article.png",
  "screenshot-article-overview-dracula.png",
  "screenshot-manufacturing-orders-dark.png",
];

function fakePng(width: number, height: number): Buffer {
  const buf = Buffer.alloc(24);
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]).copy(buf, 0);
  buf.writeUInt32BE(13, 8);
  buf.write("IHDR", 12, "ascii");
  buf.writeUInt32BE(width, 16);
  buf.writeUInt32BE(height, 20);
  return buf;
}

describe("parseScreenshotName", () => {
  it("läser nyckel och tema ur filnamnet", () => {
    expect(parseScreenshotName("screenshot-dashboard.png")).toEqual({ key: "dashboard", theme: "light" });
    expect(parseScreenshotName("screenshot-dashboard-dark.png")).toEqual({ key: "dashboard", theme: "dark" });
    expect(parseScreenshotName("screenshot-article-overview-dracula.png")).toEqual({ key: "article-overview", theme: "dracula" });
  });

  it("ignorerar andra filer", () => {
    expect(parseScreenshotName("nav-erp-logo.svg")).toBeNull();
  });
});

describe("resolveVariants", () => {
  const reg = buildRegistry(FILES);

  it("visar varje temas egen bild när alla tre finns", () => {
    expect(resolveVariants(reg.get("dashboard")!)).toEqual([
      { file: "screenshot-dashboard.png", themes: ["light"] },
      { file: "screenshot-dashboard-dark.png", themes: ["dark"] },
      { file: "screenshot-dashboard-dracula.png", themes: ["dracula"] },
    ]);
  });

  it("använder den enda bilden i alla teman", () => {
    expect(resolveVariants(reg.get("manufacturing-orders")!)).toEqual([
      { file: "screenshot-manufacturing-orders-dark.png", themes: ["light", "dark", "dracula"] },
    ]);
  });

  it("låter mörkt falla tillbaka på Dracula före ljust", () => {
    expect(resolveVariants({ light: "l.png", dracula: "d.png" })).toEqual([
      { file: "l.png", themes: ["light"] },
      { file: "d.png", themes: ["dark", "dracula"] },
    ]);
  });
});

describe("pngSize", () => {
  it("läser bredd och höjd ur IHDR", () => {
    expect(pngSize(fakePng(2880, 1800))).toEqual({ width: 2880, height: 1800 });
  });

  it("vägrar filer som inte är PNG", () => {
    expect(() => pngSize(Buffer.from("inte en png, definitivt inte"))).toThrow(/PNG/);
  });
});

describe("loadScreenshot", () => {
  it("ger src, teman och storlek", () => {
    const dir = mkdtempSync(path.join(os.tmpdir(), "shots-"));
    writeFileSync(path.join(dir, "screenshot-article.png"), fakePng(100, 50));
    expect(loadScreenshot("article", dir)).toEqual([
      { src: "/screenshots/screenshot-article.png", themes: ["light", "dark", "dracula"], width: 100, height: 50 },
    ]);
  });

  it("avbryter bygget och namnger nyckeln när bilden saknas", () => {
    const dir = mkdtempSync(path.join(os.tmpdir(), "shots-"));
    expect(() => loadScreenshot("terminal", dir)).toThrow(/terminal/);
  });
});
