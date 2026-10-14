import { describe, expect, it } from "vitest";
import { THEME_STORAGE_KEY, isThemeId, themeBootScript } from "@/lib/themes";

// Runs the inline <head> script against fake browser globals.
function boot(opts: { stored?: string | null; storageThrows?: boolean; prefersDark?: boolean }): string | undefined {
  const attrs: Record<string, string> = {};
  const document = { documentElement: { setAttribute: (k: string, v: string) => void (attrs[k] = v) } };
  const localStorage = {
    getItem: (k: string) => {
      if (opts.storageThrows) throw new Error("blockerad");
      return k === THEME_STORAGE_KEY ? (opts.stored ?? null) : null;
    },
  };
  const window = {
    matchMedia: (q: string) => ({ matches: q === "(prefers-color-scheme: dark)" && !!opts.prefersDark }),
  };
  new Function("document", "localStorage", "window", themeBootScript)(document, localStorage, window);
  return attrs["data-theme"];
}

describe("themeBootScript", () => {
  it("använder det sparade temat", () => {
    expect(boot({ stored: "dracula", prefersDark: false })).toBe("dracula");
  });

  it("följer systemet när inget är sparat", () => {
    expect(boot({ prefersDark: true })).toBe("dark");
    expect(boot({ prefersDark: false })).toBe("light");
  });

  it("ignorerar ett okänt sparat tema", () => {
    expect(boot({ stored: "solarized", prefersDark: true })).toBe("dark");
  });

  it("klarar blockerad lagring", () => {
    expect(boot({ storageThrows: true, prefersDark: false })).toBe("light");
  });
});

describe("isThemeId", () => {
  it("godtar bara de tre temana", () => {
    expect(["light", "dark", "dracula"].every(isThemeId)).toBe(true);
    expect(isThemeId("solarized")).toBe(false);
    expect(isThemeId(null)).toBe(false);
  });
});
