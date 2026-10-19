import { cp, mkdir, readdir, rm, stat } from "node:fs/promises";
import path from "node:path";

// Content shared with the ERP repo: the manual, screenshots, colour tokens,
// the chapter list and the logo. Copied in at build time so each has one
// source of truth; the copies are gitignored.
export interface SyncItem {
  /** Path inside the Nav-ERP repo. */
  from: string;
  /** Path inside hemsida. */
  to: string;
  /** For directories: which file names to copy. Absent means `from` is a single file. */
  match?: RegExp;
}

export const SYNC_ITEMS: SyncItem[] = [
  // README.md is the folder's index on GitHub, not a chapter.
  { from: "docs/manual", to: "content/manual", match: /^(?!README\.md$).+\.md$/ },
  { from: "docs/assets", to: "public/screenshots", match: /^screenshot-.+\.png$/ },
  { from: "apps/web/styles/tokens.css", to: "styles/tokens.css" },
  { from: "apps/web/lib/manual.ts", to: "lib/upstream/manual.ts" },
  { from: "apps/web/lib/manualSearch.ts", to: "lib/upstream/manualSearch.ts" },
  { from: "apps/web/components/ui/Wordmark.tsx", to: "components/upstream/Wordmark.tsx" },
  { from: "apps/web/components/ui/Wordmark.module.css", to: "components/upstream/Wordmark.module.css" },
];

/** Chapter file → date of its last commit in Nav-ERP, written by scripts/sync-content.ts. */
export const MANUAL_DATES_FILE = path.join("content", "manual-dates.json");

export class SyncError extends Error {}

async function exists(p: string): Promise<boolean> {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

export async function syncContent(sourceDir: string, targetDir: string, items: SyncItem[] = SYNC_ITEMS): Promise<string[]> {
  // Validate everything before touching the target, so a missing file never
  // leaves a half-synced tree behind.
  const plan: Array<{ src: string; dest: string }> = [];
  for (const item of items) {
    const src = path.join(sourceDir, item.from);
    if (!(await exists(src))) throw new SyncError(`Saknas i Nav-ERP: ${item.from} (letade i ${sourceDir})`);
    const match = item.match;
    if (match) {
      const files = (await readdir(src)).filter((f) => match.test(f)).sort();
      if (files.length === 0) throw new SyncError(`Inga filer matchar ${match} i ${item.from}`);
      for (const f of files) plan.push({ src: path.join(src, f), dest: path.join(item.to, f) });
    } else {
      plan.push({ src, dest: item.to });
    }
  }

  // Directories are replaced wholesale so a removed chapter or screenshot disappears too.
  for (const item of items) {
    if (item.match) await rm(path.join(targetDir, item.to), { recursive: true, force: true });
  }
  for (const { src, dest } of plan) {
    const out = path.join(targetDir, dest);
    await mkdir(path.dirname(out), { recursive: true });
    await cp(src, out);
  }
  return plan.map((p) => p.dest);
}
