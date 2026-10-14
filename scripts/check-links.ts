import path from "node:path";
import { checkLinks } from "../lib/links";

const outDir = path.resolve(process.argv[2] ?? "out");
const broken = checkLinks(outDir, process.env.BASE_PATH ?? "");

if (broken.length > 0) {
  for (const b of broken) console.error(`✗ ${b.page} → ${b.href} (${b.reason})`);
  console.error(`${broken.length} trasiga länkar i ${outDir}`);
  process.exit(1);
}
console.log("Alla interna länkar och ankare finns.");
