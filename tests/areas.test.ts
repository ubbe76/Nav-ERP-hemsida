import { describe, expect, it } from "vitest";
import { FEATURE_AREAS, HUB_CENTER, HUB_SPOKES, getArea, manualHref } from "@/content/areas";
import { MANUAL_CHAPTERS, chapterAnchors } from "@/lib/manual";

describe("funktionsområdena", () => {
  it("är sex med unika slugs", () => {
    const slugs = FEATURE_AREAS.map((a) => a.slug);
    expect(slugs).toHaveLength(6);
    expect(new Set(slugs).size).toBe(6);
  });

  it("har unika grupp-id:n inom varje område och minst två punkter per grupp", () => {
    for (const area of FEATURE_AREAS) {
      const ids = area.groups.map((g) => g.id);
      expect(new Set(ids).size, area.slug).toBe(ids.length);
      for (const g of area.groups) expect(g.points.length, `${area.slug}#${g.id}`).toBeGreaterThanOrEqual(2);
    }
  });

  it("länkar bara till manualkapitel och rubriker som finns", () => {
    for (const area of FEATURE_AREAS) {
      for (const ref of area.manual) {
        expect(MANUAL_CHAPTERS.some((c) => c.slug === ref.chapter), `${area.slug}: ${ref.chapter}`).toBe(true);
        if (ref.anchor) expect(chapterAnchors(ref.chapter).has(ref.anchor), `${area.slug}: ${manualHref(ref)}`).toBe(true);
      }
    }
  });
});

describe("navet", () => {
  it("har sex ekrar och kalkylen i mitten", () => {
    expect(HUB_SPOKES).toHaveLength(6);
    expect(HUB_CENTER.href).toBe("/funktioner/kalkyl/");
  });

  it("pekar på områden och sektioner som finns", () => {
    for (const { href } of [...HUB_SPOKES, HUB_CENTER]) {
      const m = /^\/funktioner\/([^/]+)\/(?:#(.+))?$/.exec(href);
      expect(m, href).not.toBeNull();
      const area = getArea(m![1]!);
      expect(area, href).toBeDefined();
      if (m![2]) expect(area!.groups.some((g) => g.id === m![2]), href).toBe(true);
    }
  });
});

describe("manualHref", () => {
  it("bygger länken med avslutande snedstreck och ankare", () => {
    expect(manualHref({ chapter: "lager", anchor: "inventering", label: "x" })).toBe("/hjalp/lager/#inventering");
    expect(manualHref({ chapter: "lager", label: "x" })).toBe("/hjalp/lager/");
  });
});
