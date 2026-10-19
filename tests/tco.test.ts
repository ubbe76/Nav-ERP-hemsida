import { describe, expect, it } from "vitest";
import { TCO_EXAMPLE, tco } from "@/lib/tco";

describe("tco", () => {
  it("räknar fem år av server, backup, installation och drift mot licenser per användare", () => {
    const r = tco(TCO_EXAMPLE);
    // (300 + 50) × 60 + 8 × 700 + 2 × 60 × 700
    expect(r.navErp.total).toBe(21_000 + 5_600 + 84_000);
    // 10 × 500 × 60
    expect(r.licensed.total).toBe(300_000);
    expect(r.difference).toBe(300_000 - 110_600);
  });

  it("har licensen 0 kr som egen rad", () => {
    expect(tco(TCO_EXAMPLE).navErp.lines[0]).toEqual({ label: "Licens", amount: 0 });
  });

  it("räknar tomma och negativa fält som noll", () => {
    const r = tco({ ...TCO_EXAMPLE, users: Number.NaN, serverMonth: -100 });
    expect(r.licensed.total).toBe(0);
    expect(r.navErp.lines.find((l) => l.label === "Server")!.amount).toBe(0);
  });
});
