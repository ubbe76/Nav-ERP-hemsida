import { afterEach, describe, expect, it, vi } from "vitest";
import { absoluteUrl, withBase } from "@/lib/site";

afterEach(() => vi.unstubAllEnvs());

describe("withBase", () => {
  it("lämnar sökvägen orörd utan base path", () => {
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "");
    expect(withBase("/hjalp/")).toBe("/hjalp/");
  });

  it("lägger base path före rotrelativa sökvägar", () => {
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "/hemsida");
    expect(withBase("/screenshots/a.png")).toBe("/hemsida/screenshots/a.png");
  });

  it("rör aldrig externa, protokollrelativa eller ankarlänkar", () => {
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "/hemsida");
    expect(withBase("https://github.com")).toBe("https://github.com");
    expect(withBase("//cdn.example.com/x")).toBe("//cdn.example.com/x");
    expect(withBase("#kalkyler")).toBe("#kalkyler");
  });
});

describe("absoluteUrl", () => {
  it("sätter ihop origin, base path och sökväg", () => {
    vi.stubEnv("SITE_URL", "https://ubbe76.github.io/");
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "/hemsida");
    expect(absoluteUrl("/kom-igang/")).toBe("https://ubbe76.github.io/hemsida/kom-igang/");
  });
});
