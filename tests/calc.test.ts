import { describe, expect, it } from "vitest";
import { EXAMPLE, calcChain, formatKr } from "@/lib/calc";

// The chain from the manual (System → Kalkyler → "Så räknas försäljningspriset"):
// dM + MO%·dM + dL + TO%·dL + lego + LO%·lego + halvfabrikat = TVK;
// TVK + Affo%·TVK = SVK; SVK + generellt%·SVK = försäljningspris.
describe("calcChain", () => {
  it("räknar exemplet som manualens kedja", () => {
    const { tvk, svk, price } = calcChain(EXAMPLE);
    expect(tvk).toBeCloseTo(2150);
    expect(svk).toBeCloseTo(2322);
    expect(price).toBeCloseTo(2786.4);
  });

  it("lägger inget påslag på halvfabrikat", () => {
    const withSemi = calcChain({ ...EXAMPLE, semiFinished: 500 });
    expect(withSemi.tvk).toBeCloseTo(2650);
    expect(withSemi.lines.find((l) => l.label === "Halvfabrikat")?.kind).toBe("base");
  });

  it("visar inte halvfabrikat när det saknas", () => {
    expect(calcChain(EXAMPLE).lines.some((l) => l.label === "Halvfabrikat")).toBe(false);
  });

  it("slutar med försäljningspriset", () => {
    const { lines, price } = calcChain(EXAMPLE);
    expect(lines.at(-1)).toEqual({ label: "Försäljningspris", amount: price, kind: "subtotal" });
  });
});

describe("formatKr", () => {
  it("skriver hela kronor med svensk tusentalsavgränsning", () => {
    expect(formatKr(2786.4)).toMatch(/^2\s786 kr$/);
  });
});
