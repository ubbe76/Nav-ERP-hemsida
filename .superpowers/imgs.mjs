import { chromium } from "@playwright/test";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
await p.goto("http://127.0.0.1:4321/");
for (let y = 0; y < 8000; y += 600) { await p.mouse.wheel(0, 600); await p.waitForTimeout(150); }
await p.waitForLoadState("networkidle");
console.log(await p.evaluate(() => [...document.images].filter((i) => getComputedStyle(i).display !== "none").map((i) => `${i.src.split("/").pop()} complete=${i.complete} nw=${i.naturalWidth}`).join("\n")));
await p.locator("footer").screenshot({ path: "e2e-screens/footer.png" });
await b.close();
