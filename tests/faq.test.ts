import { describe, expect, it } from "vitest";
import { FAQ_GROUPS, HOME_FAQ_IDS, getFaq } from "@/content/faq";

describe("vanliga frågor", () => {
  const all = FAQ_GROUPS.flatMap((g) => g.items);

  it("har unika ankare", () => {
    const ids = all.map((f) => f.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("ställer frågor och svarar med hela meningar", () => {
    for (const f of all) {
      expect(f.question, f.id).toMatch(/\?$/);
      expect(f.answer, f.id).toMatch(/\.$/);
    }
  });

  it("visar bara frågor som finns på startsidan", () => {
    for (const id of HOME_FAQ_IDS) expect(getFaq(id), id).toBeDefined();
  });
});
