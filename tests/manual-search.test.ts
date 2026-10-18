import { describe, expect, it } from "vitest";
import { buildManualIndex } from "@/lib/manual-index";
import { MANUAL_CHAPTERS } from "@/lib/manual";
import { searchSections, splitIntoSections } from "@/lib/upstream/manualSearch";

describe("manualsökning", () => {
  it("delar upp per rubrik och ger ankar-id som appen", () => {
    const s = splitIntoSections("lager", "Lager", "Intro\n\n## Lagervärdering\n\nGlidande **medelpris**.\n\n```\n# kod\n```\n");
    expect(s.map((x) => x.id)).toEqual(["", "lagervardering"]);
    expect(s[1]!.text).toContain("Glidande medelpris");
  });

  it("ignorerar skiftläge och å/ä/ö, kräver alla ord och rankar rubriker först", () => {
    const s = splitIntoSections("l", "L", "## Inventering\n\nRäkna lagervärdering.\n\n## Lagervärdering\n\nText om pris.\n");
    expect(searchSections(s, "LAGERVARDERING").map((h) => h.id)).toEqual(["lagervardering", "inventering"]);
    expect(searchSections(s, "pris inventering")).toEqual([]);
  });

  it("markerar träffen i utdraget", () => {
    const s = splitIntoSections("l", "L", "## A\n\nEn lång text med ordet Saldo mitt i.\n");
    expect(searchSections(s, "saldo")[0]!.snippet.filter((p) => p.hit).map((p) => p.text)).toEqual(["Saldo"]);
  });

  it("indexerar den riktiga manualen och hittar rubriker med deras ankare", () => {
    const index = buildManualIndex();
    expect(new Set(index.map((x) => x.chapter))).toEqual(new Set(MANUAL_CHAPTERS.map((c) => c.slug)));
    expect(searchSections(index, "lagervärdering")[0]!.id).toBe("lagervardering");
  });
});
