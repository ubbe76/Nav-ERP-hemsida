import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { SyncError, syncContent } from "../lib/sync";

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
  } finally {
    if (tmp) rmSync(tmp, { recursive: true, force: true });
  }
}

main().catch((err: unknown) => {
  console.error(err instanceof SyncError ? `sync: ${err.message}` : err);
  process.exit(1);
});
