import { describe, expect, it } from "vitest";
import { FEATURE_AREAS } from "@/content/areas";
import { MANUAL_META } from "@/content/manual-meta";
import { MANUAL_CHAPTERS } from "@/lib/manual";

// What the pages put in <title> (the layout appends " · Nav|ERP") and the meta description.
const pages = [
  ...FEATURE_AREAS.map((a) => ({ page: `/funktioner/${a.slug}/`, title: a.seoTitle, description: a.description })),
  ...Object.entries(MANUAL_META).map(([slug, m]) => ({
    page: `/hjalp/${slug}/`,
    title: `${m.title} — manual`,
    description: m.description,
  })),
];

describe("sökträffarna", () => {
  it("varje manualkapitel har en egen titel och beskrivning, och inga överblivna", () => {
    expect(Object.keys(MANUAL_META).sort()).toEqual(MANUAL_CHAPTERS.map((c) => c.slug).sort());
  });

  it("beskrivningarna får plats hela i ett sökresultat men säger tillräckligt", () => {
    for (const { page, description } of pages) {
      expect(description.length, page).toBeGreaterThanOrEqual(110);
      expect(description.length, page).toBeLessThanOrEqual(160);
    }
  });

  it("titlarna är unika och inte längre än ett sökresultat visar", () => {
    const titles = pages.map((p) => `${p.title} · Nav|ERP`);
    expect(new Set(titles).size).toBe(titles.length);
    for (const title of titles) expect(title.length, title).toBeLessThanOrEqual(65);
  });
});
