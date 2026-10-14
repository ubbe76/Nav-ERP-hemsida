import { readFileSync } from "node:fs";
import path from "node:path";
import { Marked, type Tokens } from "marked";
import { withBase } from "./site";
import { MANUAL_CHAPTERS, getChapter, slugifyHeading, type ManualChapter } from "./upstream/manual";

// The chapter list and the heading slug rule come from the app (synced), so
// /hjalp/<kapitel>#<rubrik> means the same thing on the site and in the app.
// The app's own loader reads a path relative to apps/web, so we load from
// content/manual/ ourselves.
export { MANUAL_CHAPTERS, getChapter, type ManualChapter };

export interface TocEntry {
  id: string;
  text: string;
}

export interface RenderedChapter {
  html: string;
  toc: TocEntry[];
}

const MANUAL_DIR = path.join(process.cwd(), "content", "manual");

const attr = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
const plainText = (md: string) => md.replace(/\*\*|__|`/g, "");

// Created per call so withBase() reads the environment at render time.
function createMarked(): Marked {
  return new Marked({
    renderer: {
      heading({ tokens, depth, text }) {
        return `<h${depth} id="${slugifyHeading(text)}">${this.parser.parseInline(tokens)}</h${depth}>\n`;
      },
      link({ href, title, tokens }) {
        const titleAttr = title ? ` title="${attr(title)}"` : "";
        return `<a href="${attr(withBase(href))}"${titleAttr}>${this.parser.parseInline(tokens)}</a>`;
      },
    },
  });
}

export function renderManual(markdown: string): RenderedChapter {
  const marked = createMarked();
  const toc = marked
    .lexer(markdown)
    .filter((t): t is Tokens.Heading => t.type === "heading" && t.depth === 2)
    .map((t) => ({ id: slugifyHeading(t.text), text: plainText(t.text) }));
  return { html: marked.parse(markdown, { async: false }) as string, toc };
}

function readChapter(chapter: ManualChapter, dir: string): string {
  const file = path.join(dir, chapter.file);
  try {
    return readFileSync(file, "utf8");
  } catch {
    throw new Error(`Manualkapitlet "${chapter.slug}" saknar fil: ${file} — kör npm run sync`);
  }
}

export function loadChapter(chapter: ManualChapter, dir: string = MANUAL_DIR): RenderedChapter {
  return renderManual(readChapter(chapter, dir));
}

/** Ids of every heading in a chapter — used to validate deep links into the manual. */
export function chapterAnchors(slug: string, dir: string = MANUAL_DIR): Set<string> {
  const chapter = getChapter(slug);
  if (!chapter) throw new Error(`Okänt manualkapitel: ${slug}`);
  return new Set(
    new Marked()
      .lexer(readChapter(chapter, dir))
      .filter((t): t is Tokens.Heading => t.type === "heading")
      .map((t) => slugifyHeading(t.text)),
  );
}
