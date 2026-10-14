import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

export interface BrokenLink {
  page: string;
  href: string;
  reason: string;
}

function htmlFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) return htmlFiles(p);
    return entry.name.endsWith(".html") ? [p] : [];
  });
}

/** out/hjalp/lager/index.html → /hjalp/lager/ ; out/404.html → /404.html */
export function urlPathFor(outDir: string, file: string): string {
  const rel = path.relative(outDir, file).split(path.sep).join("/");
  if (rel === "index.html") return "/";
  return `/${rel.endsWith("/index.html") ? rel.slice(0, -"index.html".length) : rel}`;
}

/** The output file a URL path resolves to, the way a static host serves it. */
export function fileFor(outDir: string, urlPath: string): string | null {
  const p = decodeURIComponent(urlPath);
  const candidates = p.endsWith("/") ? [`${p}index.html`] : [p, `${p}.html`, `${p}/index.html`];
  for (const candidate of candidates) {
    const file = path.join(outDir, candidate);
    if (existsSync(file) && statSync(file).isFile()) return file;
  }
  return null;
}

const idsIn = (html: string) => new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1] ?? ""));
const refsIn = (html: string) => [...html.matchAll(/\s(?:href|src)="([^"]*)"/g)].map((m) => (m[1] ?? "").replace(/&amp;/g, "&"));

/** Every internal href/src in the export must reach a file, and every #anchor an id on that page. */
export function checkLinks(outDir: string, basePath = ""): BrokenLink[] {
  const idCache = new Map<string, Set<string>>();
  const idsOf = (file: string) => {
    let ids = idCache.get(file);
    if (!ids) {
      ids = idsIn(readFileSync(file, "utf8"));
      idCache.set(file, ids);
    }
    return ids;
  };

  const broken: BrokenLink[] = [];
  for (const file of htmlFiles(outDir).sort()) {
    const page = urlPathFor(outDir, file);
    for (const href of refsIn(readFileSync(file, "utf8"))) {
      if (!href || /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(href)) continue; // external, mailto:, data:
      const url = new URL(href, `http://site${basePath}${page}`);
      if (basePath && url.pathname !== basePath && !url.pathname.startsWith(`${basePath}/`)) {
        broken.push({ page, href, reason: "saknar base path" });
        continue;
      }
      const target = fileFor(outDir, url.pathname.slice(basePath.length) || "/");
      if (!target) {
        broken.push({ page, href, reason: "sidan eller filen finns inte" });
        continue;
      }
      const anchor = decodeURIComponent(url.hash.slice(1));
      if (anchor && target.endsWith(".html") && !idsOf(target).has(anchor)) {
        broken.push({ page, href, reason: `ankaret #${anchor} finns inte` });
      }
    }
  }
  return broken;
}
