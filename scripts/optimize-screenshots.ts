import { readdirSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { OG_IMAGE, WEBP_WIDTHS, parseScreenshotName, webpName } from "../lib/screenshots";

// Runs after the sync: the PNGs from Nav-ERP are 2880 px wide and ~300 KB each.
// Every one gets WebP copies in WEBP_WIDTHS for <img srcset>, and the light
// dashboard a 1200×630 card for link previews. The sync replaces the directory
// wholesale, so there is never a stale copy to skip.
const dir = path.resolve(process.argv[2] ?? "public/screenshots");

async function main() {
  const pngs = readdirSync(dir).filter((f) => parseScreenshotName(f));
  let written = 0;
  for (const file of pngs) {
    const src = path.join(dir, file);
    const { width = 0 } = await sharp(src).metadata();
    for (const w of WEBP_WIDTHS.filter((w) => w <= width)) {
      await sharp(src).resize({ width: w }).webp({ quality: 80 }).toFile(path.join(dir, webpName(file, w)));
      written++;
    }
  }

  const dashboard = path.join(dir, "screenshot-dashboard.png");
  if (pngs.includes("screenshot-dashboard.png")) {
    await sharp(dashboard)
      .resize({ width: OG_IMAGE.width, height: OG_IMAGE.height, fit: "cover", position: "top" })
      .jpeg({ quality: 85 })
      .toFile(path.join(dir, OG_IMAGE.file));
    written++;
  }
  console.log(`screenshots: ${written} optimerade filer i ${path.relative(process.cwd(), dir)}`);
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
