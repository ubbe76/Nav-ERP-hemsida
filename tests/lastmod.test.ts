import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdtemp, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { gitDates, latest } from "@/lib/git-dates";
import { routeSources } from "@/lib/lastmod";
import { allRoutes } from "@/lib/routes";
import { SYNC_ITEMS } from "@/lib/sync";

function git(cwd: string, args: string[], date?: string) {
  const env = date ? { GIT_AUTHOR_DATE: date, GIT_COMMITTER_DATE: date } : {};
  execFileSync("git", ["-C", cwd, ...args], { env: { ...process.env, ...env }, stdio: "ignore" });
}

async function repo(): Promise<string> {
  const dir = await mkdtemp(path.join(os.tmpdir(), "lastmod-"));
  git(dir, ["init", "-q"]);
  git(dir, ["config", "user.email", "test@example.com"]);
  git(dir, ["config", "user.name", "Test"]);
  await writeFile(path.join(dir, "a.md"), "a");
  await writeFile(path.join(dir, "b.md"), "b");
  git(dir, ["add", "."]);
  git(dir, ["commit", "-qm", "första"], "2026-01-02T10:00:00Z");
  await writeFile(path.join(dir, "b.md"), "b2");
  git(dir, ["commit", "-qam", "andra"], "2026-03-04T10:00:00Z");
  return dir;
}

describe("gitDates", () => {
  it("ger varje fils senaste commitdatum och hoppar över filer utan commit", async () => {
    const dir = await repo();
    await writeFile(path.join(dir, "ny.md"), "ny");
    expect(gitDates(dir, ["a.md", "b.md", "ny.md"])).toEqual({ "a.md": "2026-01-02", "b.md": "2026-03-04" });
  });

  it("ger inga datum från en grund klon, där alla filer skulle få samma datum", async () => {
    const dir = await repo();
    const clone = await mkdtemp(path.join(os.tmpdir(), "lastmod-clone-"));
    git(clone, ["clone", "-q", "--depth", "1", `file://${dir}`, "."]);
    expect(gitDates(clone, ["a.md"])).toEqual({});
  });

  it("ger inga datum utanför ett git-repo", async () => {
    expect(gitDates(await mkdtemp(path.join(os.tmpdir(), "lastmod-none-")), ["a.md"])).toEqual({});
  });
});

describe("latest", () => {
  it("väljer det senaste datumet och tål luckor", () => {
    expect(latest(["2026-01-02", undefined, "2026-03-04"])).toBe("2026-03-04");
    expect(latest([undefined])).toBeUndefined();
  });
});

describe("routeSources", () => {
  it("pekar på filer som finns för varje sida utom manualkapitlen", () => {
    const pages = allRoutes().filter((r) => !/^\/hjalp\/[^/]+\/$/.test(r));
    for (const route of pages) {
      for (const file of routeSources(route)) expect(existsSync(file), `${route}: ${file}`).toBe(true);
    }
  });
});

describe("manualens synk", () => {
  it("kopierar inte mappens README, som inte är ett kapitel", () => {
    const manual = SYNC_ITEMS.find((i) => i.from === "docs/manual")!;
    expect(manual.match?.test("README.md")).toBe(false);
    expect(manual.match?.test("lager.md")).toBe(true);
  });
});
