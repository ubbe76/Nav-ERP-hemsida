export type ThemeBlocks = Record<string, Record<string, string>>;

/**
 * Custom properties per theme, read from :root[data-theme="…"] blocks.
 * Theme-independent `:root { … }` blocks are collected under "base".
 */
export function parseThemeBlocks(css: string): ThemeBlocks {
  const blocks: ThemeBlocks = {};
  const clean = css.replace(/\/\*[\s\S]*?\*\//g, "");
  for (const m of clean.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const selector = (m[1] ?? "").trim();
    const themes = [...selector.matchAll(/data-theme="([\w-]+)"/g)].map((t) => t[1] ?? "");
    const keys = themes.length > 0 ? themes : selector === ":root" ? ["base"] : [];
    for (const key of keys) {
      const block = (blocks[key] ??= {});
      for (const d of (m[2] ?? "").matchAll(/(--[\w-]+)\s*:\s*([^;]+)(?:;|$)/g)) block[d[1] ?? ""] = (d[2] ?? "").trim();
    }
  }
  return blocks;
}

export function resolveToken(blocks: ThemeBlocks, theme: string, name: string, depth = 0): string {
  const value = blocks[theme]?.[name] ?? blocks.base?.[name];
  if (value === undefined) throw new Error(`${name} saknas i temat ${theme}`);
  const ref = /^var\((--[\w-]+)\)$/.exec(value);
  if (ref?.[1] && depth < 10) return resolveToken(blocks, theme, ref[1], depth + 1);
  return value;
}

function luminance(hex: string): number {
  let h = hex.replace("#", "");
  if (h.length === 3) h = [...h].map((c) => c + c).join("");
  if (!/^[0-9a-f]{6}$/i.test(h)) throw new Error(`Inte en hex-färg: ${hex}`);
  const [r, g, b] = [0, 2, 4].map((i) => {
    const v = parseInt(h.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG 2 contrast ratio between two hex colours. */
export function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}
