import { readFileSync } from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MANUAL_CHAPTERS, chapterAnchors, loadChapter, renderManual } from "@/lib/manual";

afterEach(() => vi.unstubAllEnvs());

describe("renderManual", () => {
  it("ger rubrikerna samma id som appen", () => {
    const { html } = renderManual("## Lagervärdering\n\ntext");
    expect(html).toContain('<h2 id="lagervardering">Lagervärdering</h2>');
  });

  it("bygger innehållsförteckningen av ##-rubrikerna, utan markdown", () => {
    const { toc } = renderManual("# Kapitel\n\n## **Frakt**\n\n### Detalj\n\n## Bankfiler (inbetalningar)\n");
    expect(toc).toEqual([
      { id: "frakt", text: "Frakt" },
      { id: "bankfiler-inbetalningar", text: "Bankfiler (inbetalningar)" },
    ]);
  });

  it("lägger base path på rotrelativa länkar men inte på andra", () => {
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "/hemsida");
    const { html } = renderManual("[a](/hjalp/system#kalkyler) [b](#frakt) [c](https://draculatheme.com)");
    expect(html).toContain('href="/hemsida/hjalp/system#kalkyler"');
    expect(html).toContain('href="#frakt"');
    expect(html).toContain('href="https://draculatheme.com"');
  });
});

describe("den riktiga manualen", () => {
  it("har en fil för varje kapitel i appens lista", () => {
    for (const chapter of MANUAL_CHAPTERS) {
      expect(loadChapter(chapter).html.length, chapter.slug).toBeGreaterThan(100);
    }
  });

  it("har bara interna länkar som pekar på kapitel och rubriker som finns", () => {
    const broken: string[] = [];
    for (const chapter of MANUAL_CHAPTERS) {
      const md = readFileSync(path.join(process.cwd(), "content/manual", chapter.file), "utf8");
      for (const [, href] of md.matchAll(/\]\((\/hjalp\/[^)\s]*|#[^)\s]+)\)/g)) {
        const [p = "", anchor] = href!.split("#");
        const slug = p ? p.replace(/^\/hjalp\//, "").replace(/\/$/, "") : chapter.slug;
        const known = MANUAL_CHAPTERS.some((c) => c.slug === slug);
        if (!known || (anchor && !chapterAnchors(slug).has(anchor))) broken.push(`${chapter.slug}: ${href}`);
      }
    }
    expect(broken).toEqual([]);
  });
});
