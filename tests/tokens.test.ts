import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { contrastRatio, parseThemeBlocks, resolveToken } from "@/lib/css-tokens";

const root = process.cwd();
const tokensCss = readFileSync(path.join(root, "styles/tokens.css"), "utf8");
const siteCss = readFileSync(path.join(root, "styles/site.css"), "utf8");
const blocks = parseThemeBlocks(tokensCss);
const THEMES = ["light", "dark", "dracula"] as const;

// Our own stylesheets: everything except the synced upstream ones.
function ourCss(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return e.name === "upstream" ? [] : ourCss(p);
    return e.name.endsWith(".css") ? [p] : [];
  });
}
const OUR_CSS = [...ourCss(path.join(root, "app")), ...ourCss(path.join(root, "components")), path.join(root, "styles/site.css")];
const stripComments = (css: string) => css.replace(/\/\*[\s\S]*?\*\//g, "");

describe("css-tokens", () => {
  it("räknar kontrast enligt WCAG", () => {
    expect(contrastRatio("#ffffff", "#000000")).toBeCloseTo(21);
    expect(contrastRatio("#fff", "#fff")).toBeCloseTo(1);
  });

  it("löser upp var() inom temat och faller tillbaka på :root", () => {
    const b = parseThemeBlocks(`:root{--r:4px} :root[data-theme="x"]{--a:#111111;--b:var(--a)}`);
    expect(resolveToken(b, "x", "--b")).toBe("#111111");
    expect(resolveToken(b, "x", "--r")).toBe("4px");
  });
});

describe("temakontraktet", () => {
  it("alla tre teman definierar samma tokens", () => {
    const names = (t: string) => Object.keys(blocks[t] ?? {}).sort();
    expect(names("light").length).toBeGreaterThan(20);
    expect(names("dark")).toEqual(names("light"));
    expect(names("dracula")).toEqual(names("light"));
  });

  it.each(THEMES)("texten är läsbar i temat %s (WCAG AA 4,5:1)", (theme) => {
    const pairs: Array<[string, string]> = [
      ["--btn-primary-text", "--btn-primary-bg"],
      ["--accent-text", "--accent"],
      ["--color-text-primary", "--color-bg"],
      ["--color-text-secondary", "--color-bg"],
      ["--color-text-muted", "--color-bg"],
      ["--color-text-muted", "--color-surface"],
      ["--accent-fg", "--color-bg"],
      ["--accent-fg", "--color-surface"],
      ["--color-heading-accent", "--color-bg"],
    ];
    for (const [fg, bg] of pairs) {
      const ratio = contrastRatio(resolveToken(blocks, theme, fg), resolveToken(blocks, theme, bg));
      expect(ratio, `${fg} på ${bg}`).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("hemsidans CSS har inga egna färgvärden", () => {
    for (const file of OUR_CSS) {
      expect(stripComments(readFileSync(file, "utf8")), path.relative(root, file)).not.toMatch(/#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(/i);
    }
  });

  it("varje var(--x) som hemsidan använder är definierad", () => {
    const defined = new Set<string>(["--font-space-grotesk", "--font-figtree"]);
    for (const css of [tokensCss, siteCss]) for (const m of css.matchAll(/(--[\w-]+)\s*:/g)) defined.add(m[1]!);
    const missing: string[] = [];
    for (const file of OUR_CSS) {
      for (const m of readFileSync(file, "utf8").matchAll(/var\((--[\w-]+)/g)) {
        if (!defined.has(m[1]!)) missing.push(`${path.relative(root, file)}: ${m[1]}`);
      }
    }
    expect(missing).toEqual([]);
  });
});
