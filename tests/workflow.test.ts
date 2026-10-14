import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const workflow = readFileSync(path.join(process.cwd(), ".github/workflows/deploy.yml"), "utf8");

describe("publiceringsflödet", () => {
  it("sparar inte checkout-tokens i git-konfigurationen", () => {
    const checkouts = workflow.match(/uses: actions\/checkout@v\d+/g) ?? [];
    const persistOff = workflow.match(/persist-credentials: false/g) ?? [];
    expect(checkouts.length).toBeGreaterThan(0);
    expect(persistOff.length).toBe(checkouts.length);
  });

  it("ger inte GITHUB_TOKEN till hela jobbet (npm ci kör tredjepartsskript)", () => {
    const jobEnv = /\n {4}env:\n((?: {6}.+\n)+)/.exec(workflow)?.[1] ?? "";
    expect(jobEnv).not.toMatch(/GITHUB_TOKEN/);
  });
});
