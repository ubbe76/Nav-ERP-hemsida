import { describe, expect, it } from "vitest";
import { GUIDE, STATUS_LABELS } from "@/content/guide";

describe("guiden för affärssystem inom tillverkning", () => {
  const items = GUIDE.flatMap((g) => g.items);

  it("har unika ankare och en etikett för varje status", () => {
    expect(new Set(items.map((i) => i.id)).size).toBe(items.length);
    for (const i of items) expect(STATUS_LABELS[i.status], i.id).toBeDefined();
  });

  it("ställer frågor och säger vad som saknas när en punkt bara finns delvis", () => {
    for (const i of items) {
      expect(i.question, i.id).toMatch(/\?$/);
      if (i.status !== "ja") expect(i.navErp, i.id).toMatch(/inte|ingen|saknas/i);
    }
  });
});
