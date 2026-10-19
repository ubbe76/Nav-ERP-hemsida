import { describe, expect, it } from "vitest";
import { FEATURE_AREAS } from "@/content/areas";
import { MANUAL_CHAPTERS } from "@/lib/manual";
import { allRoutes } from "@/lib/routes";

describe("allRoutes", () => {
  it("listar varje sida en gång med avslutande snedstreck", () => {
    const routes = allRoutes();
    expect(new Set(routes).size).toBe(routes.length);
    expect(routes.every((r) => r.startsWith("/") && r.endsWith("/"))).toBe(true);
  });

  it("täcker startsidan, alla funktionsområden och alla manualkapitel", () => {
    const routes = allRoutes();
    expect(routes).toContain("/");
    expect(routes).toContain("/kom-igang/");
    expect(routes).toContain("/oppen-kallkod/");
    expect(routes).toContain("/om/");
    expect(routes).toContain("/versioner/");
    expect(routes).toContain("/gratis-affarssystem/");
    expect(routes).toContain("/fragor/");
    expect(routes).toContain("/verktyg/paslagskalkyl/");
    expect(routes).toContain("/affarssystem-for-tillverkning/");
    expect(routes).toHaveLength(11 + FEATURE_AREAS.length + MANUAL_CHAPTERS.length);
  });
});
