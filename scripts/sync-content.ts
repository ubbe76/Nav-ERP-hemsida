import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { gitDates } from "../lib/git-dates";
import { MANUAL_DATES_FILE, SyncError, syncContent } from "../lib/sync";

// Source: NAV_ERP_DIR, else the sibling checkout ../dev. Only when neither is
// set up do we shallow-clone the public repo (CI checks the repo out itself
// and sets NAV_ERP_DIR, so private repos work there with a token).
const REPO = "https://github.com/ubbe76/Nav-ERP.git";

async function main() {
  const root = process.cwd();
  const explicit = process.env.NAV_ERP_DIR;
  const configured = explicit ?? path.resolve(root, "..", "dev");
  let source = configured;
  let tmp: string | undefined;

  if (!existsSync(configured)) {
    if (explicit) throw new SyncError(`NAV_ERP_DIR pekar på ${configured}, som inte finns`);
    tmp = mkdtempSync(path.join(os.tmpdir(), "nav-erp-"));
    console.log(`sync: ${configured} saknas — klonar ${REPO}`);
    execFileSync("git", ["clone", "--depth", "1", REPO, tmp], { stdio: "inherit" });
    source = tmp;
  }

  try {
    const copied = await syncContent(source, root);
    console.log(`sync: ${copied.length} filer från ${tmp ? REPO : source}`);
    // The copies lose their history, so record each chapter's last commit date now.
    const chapters = copied.filter((f) => f.startsWith("content/manual/")).map((f) => path.basename(f));
    const dates = gitDates(source, chapters.map((f) => `docs/manual/${f}`));
    const byFile = Object.fromEntries(Object.entries(dates).map(([f, d]) => [path.basename(f), d]));
    writeFileSync(path.join(root, MANUAL_DATES_FILE), `${JSON.stringify(byFile, null, 2)}\n`);
    console.log(`sync: datum för ${Object.keys(byFile).length} av ${chapters.length} manualkapitel`);
    warnUnlistedChapters(source, chapters);
  } finally {
    if (tmp) rmSync(tmp, { recursive: true, force: true });
  }
}

// docs/manual/README.md links each chapter to its page here — the GitHub copy
// points readers to the site. Only a warning: a stale index shouldn't stop a deploy.
function warnUnlistedChapters(source: string, chapters: string[]) {
  let readme: string;
  try {
    readme = readFileSync(path.join(source, "docs/manual/README.md"), "utf8");
  } catch {
    console.warn("sync: varning: docs/manual/README.md saknas i Nav-ERP");
    return;
  }
  const missing = chapters.filter((f) => !readme.includes(`(${f})`));
  if (missing.length) console.warn(`sync: varning: docs/manual/README.md saknar ${missing.join(", ")}`);
}

main().catch((err: unknown) => {
  console.error(err instanceof SyncError ? `sync: ${err.message}` : err);
  process.exit(1);
});
