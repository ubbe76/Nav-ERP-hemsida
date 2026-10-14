import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { THEMES, type ThemeId } from "./themes";

// Screenshots come from Nav-ERP's docs/assets (synced to public/screenshots/)
// and are named screenshot-<key>.png (light), screenshot-<key>-dark.png and
// screenshot-<key>-dracula.png. Not every key exists in every theme, so each
// theme falls back to the closest variant that does.
export const FALLBACK: Record<ThemeId, ThemeId[]> = {
  light: ["light", "dark", "dracula"],
  dark: ["dark", "dracula", "light"],
  dracula: ["dracula", "dark", "light"],
};

export type Variants = Partial<Record<ThemeId, string>>;

export interface ScreenshotImage {
  src: string;
  themes: ThemeId[];
  width: number;
  height: number;
}

export function parseScreenshotName(file: string): { key: string; theme: ThemeId } | null {
  const m = /^screenshot-(.+?)(?:-(dark|dracula))?\.png$/.exec(file);
  if (!m || !m[1]) return null;
  return { key: m[1], theme: (m[2] as ThemeId | undefined) ?? "light" };
}

export function buildRegistry(files: string[]): Map<string, Variants> {
  const registry = new Map<string, Variants>();
  for (const file of files) {
    const parsed = parseScreenshotName(file);
    if (!parsed) continue;
    const variants = registry.get(parsed.key) ?? {};
    variants[parsed.theme] = file;
    registry.set(parsed.key, variants);
  }
  return registry;
}

/** One entry per distinct file, listing the themes that should show it. */
export function resolveVariants(variants: Variants): Array<{ file: string; themes: ThemeId[] }> {
  const byFile = new Map<string, ThemeId[]>();
  for (const { id } of THEMES) {
    const pick = FALLBACK[id].map((t) => variants[t]).find((f): f is string => !!f);
    if (!pick) continue;
    byFile.set(pick, [...(byFile.get(pick) ?? []), id]);
  }
  return [...byFile].map(([file, themes]) => ({ file, themes }));
}

/** Width/height from a PNG's IHDR chunk, so <img> reserves its space before loading. */
export function pngSize(buf: Buffer): { width: number; height: number } {
  if (buf.length < 24 || buf.toString("ascii", 12, 16) !== "IHDR") throw new Error("Inte en PNG-fil");
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

const DEFAULT_DIR = path.join(process.cwd(), "public", "screenshots");

export function loadScreenshot(key: string, dir: string = DEFAULT_DIR): ScreenshotImage[] {
  const variants = buildRegistry(readdirSync(dir)).get(key);
  if (!variants) {
    throw new Error(`Skärmdumpen "${key}" saknas i ${dir} — finns screenshot-${key}*.png i Nav-ERP/docs/assets?`);
  }
  return resolveVariants(variants).map(({ file, themes }) => ({
    src: `/screenshots/${file}`,
    themes,
    ...pngSize(readFileSync(path.join(dir, file))),
  }));
}
