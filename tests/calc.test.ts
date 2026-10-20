import { describe, expect, it } from "vitest";
import { EXAMPLE, calcChain, formatKr } from "@/lib/calc";

// The chain from the manual (System → Kalkyler → "Så räknas försäljningspriset"):
// dM + MO%·dM + dL + lego + LO%·lego + halvfabrikat = TVK (no TO);
// TVK + Affo%·TVK = SVK; SVK + generellt%·SVK + TO%·dL = försäljningspris.
// Example: TVK 1910, Affo 152,8, SVK 2062,8, generellt 412,56, TO 240, pris 2715,36.
describe("calcChain", () => {
  it("räknar exemplet som manualens kedja", () => {
    const { tvk, svk, price } = calcChain(EXAMPLE);
    expect(tvk).toBeCloseTo(1910);
    expect(svk).toBeCloseTo(2062.8);
    expect(price).toBeCloseTo(2715.36);
  });

  it("lägger inget påslag på halvfabrikat", () => {
    const withSemi = calcChain({ ...EXAMPLE, semiFinished: 500 });
    expect(withSemi.tvk).toBeCloseTo(2410);
    expect(withSemi.lines.find((l) => l.label === "Halvfabrikat")?.kind).toBe("base");
  });

  it("visar inte halvfabrikat när det saknas", () => {
    expect(calcChain(EXAMPLE).lines.some((l) => l.label === "Halvfabrikat")).toBe(false);
  });

  it("lägger TO sist, utan vinstpåslag, och utanför TVK och SVK", () => {
    const { lines, tvk, svk, price } = calcChain(EXAMPLE);
    expect(lines.map((l) => l.label.replace(/ \d.*$/, ""))).toEqual([
      "Direkt material", "MO-påslag", "Direkt lön", "Legokostnad", "LO-påslag", "Tillverkningskostnad",
      "Affo-påslag", "Självkostnad", "Generellt påslag", "TO-påslag", "Försäljningspris",
    ]);
    expect(lines.find((l) => l.label.startsWith("TO-påslag"))?.amount).toBeCloseTo(240);
    expect(price).toBeCloseTo(svk + svk * 0.2 + 240);
    expect(svk).toBeCloseTo(tvk * 1.08);
  });

  it("slutar med försäljningspriset", () => {
    const { lines, price } = calcChain(EXAMPLE);
    expect(lines.at(-1)).toEqual({ label: "Försäljningspris", amount: price, kind: "subtotal" });
  });
});

describe("formatKr", () => {
  it("skriver hela kronor med svensk tusentalsavgränsning", () => {
    expect(formatKr(2715.36)).toMatch(/^2\s715 kr$/);
  });
});
