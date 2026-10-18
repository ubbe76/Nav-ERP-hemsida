import { readFileSync } from "node:fs";
import path from "node:path";
import { MANUAL_CHAPTERS } from "./manual";
import { splitIntoSections, type ManualSection } from "./upstream/manualSearch";

const MANUAL_DIR = path.join(process.cwd(), "content", "manual");

/** One section per heading across all chapters — serialised to /hjalp/index.json at build time. */
export function buildManualIndex(dir: string = MANUAL_DIR): ManualSection[] {
  return MANUAL_CHAPTERS.flatMap((c) =>
    splitIntoSections(c.slug, c.title, readFileSync(path.join(dir, c.file), "utf8")),
  );
}
