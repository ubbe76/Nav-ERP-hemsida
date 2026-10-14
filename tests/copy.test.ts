import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Spec rule: no competitor is ever named on the site. Scans everything that
// can end up on a page, including the synced manual.
const root = process.cwd();
function files(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return files(p);
    return /\.(tsx?|md|css)$/.test(e.name) ? [p] : [];
  });
}

describe("texterna", () => {
  it("nämner aldrig Monitor", () => {
    const hits = ["app", "components", "content", "lib"]
      .flatMap((d) => files(path.join(root, d)))
      .filter((f) => /\bmonitor\b/i.test(readFileSync(f, "utf8")))
      .map((f) => path.relative(root, f));
    expect(hits).toEqual([]);
  });
});
