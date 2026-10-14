import { mkdir, mkdtemp, readFile, readdir, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { beforeEach, describe, expect, it } from "vitest";
import { SyncError, syncContent, type SyncItem } from "@/lib/sync";

const ITEMS: SyncItem[] = [
  { from: "docs/manual", to: "content/manual", match: /\.md$/ },
  { from: "styles/tokens.css", to: "styles/tokens.css" },
];

let src: string;
let dest: string;

async function put(root: string, rel: string, body = rel) {
  const p = path.join(root, rel);
  await mkdir(path.dirname(p), { recursive: true });
  await writeFile(p, body);
}

beforeEach(async () => {
  src = await mkdtemp(path.join(os.tmpdir(), "sync-src-"));
  dest = await mkdtemp(path.join(os.tmpdir(), "sync-dest-"));
  await put(src, "docs/manual/lager.md", "# Lager");
  await put(src, "docs/manual/anteckningar.txt");
  await put(src, "styles/tokens.css", ":root{}");
});

describe("syncContent", () => {
  it("kopierar matchande filer ur kataloger och enskilda filer", async () => {
    const copied = await syncContent(src, dest, ITEMS);
    expect(copied).toEqual(["content/manual/lager.md", "styles/tokens.css"]);
    expect(await readFile(path.join(dest, "content/manual/lager.md"), "utf8")).toBe("# Lager");
    expect(await readdir(path.join(dest, "content/manual"))).toEqual(["lager.md"]);
  });

  it("tar bort filer som inte längre finns i Nav-ERP", async () => {
    await put(dest, "content/manual/borttagen.md");
    await syncContent(src, dest, ITEMS);
    expect(await readdir(path.join(dest, "content/manual"))).toEqual(["lager.md"]);
  });

  it("avbryter med filens namn och lämnar målet orört när en fil saknas", async () => {
    await put(dest, "content/manual/gammal.md", "kvar");
    const items = [...ITEMS, { from: "apps/web/lib/manual.ts", to: "lib/upstream/manual.ts" }];
    await expect(syncContent(src, dest, items)).rejects.toBeInstanceOf(SyncError);
    await expect(syncContent(src, dest, items)).rejects.toThrow(/apps\/web\/lib\/manual\.ts/);
    expect(await readFile(path.join(dest, "content/manual/gammal.md"), "utf8")).toBe("kvar");
  });

  it("avbryter när en katalog saknar matchande filer", async () => {
    await expect(syncContent(src, dest, [{ from: "docs/manual", to: "x", match: /\.png$/ }])).rejects.toThrow(/Inga filer/);
  });
});
