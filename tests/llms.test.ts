import { afterEach, describe, expect, it, vi } from "vitest";
import { llmsTxt } from "@/lib/llms";
import { allRoutes } from "@/lib/routes";

afterEach(() => vi.unstubAllEnvs());

describe("llmsTxt", () => {
  it("börjar med namnet och en sammanfattning, som llmstxt.org kräver", () => {
    const lines = llmsTxt().split("\n");
    expect(lines[0]).toBe("# Nav|ERP");
    expect(lines[2]).toMatch(/^> Nav\|ERP är ett affärssystem/);
  });

  it("länkar varje sida på sajten med absolut adress", () => {
    vi.stubEnv("SITE_URL", "https://naverp.se");
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "");
    const text = llmsTxt();
    for (const route of allRoutes().filter((r) => r !== "/funktioner/" && r !== "/hjalp/")) {
      expect(text, route).toContain(`(https://naverp.se${route})`);
    }
  });
});
