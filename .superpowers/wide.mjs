import { chromium } from "@playwright/test";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 320, height: 900 } });
for (const r of process.argv.slice(2)) {
  await p.goto("http://127.0.0.1:4321" + r);
  console.log(r, await p.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    return document.documentElement.scrollWidth + " | " + [...document.querySelectorAll("body *")].filter((e) => e.getBoundingClientRect().right > vw + 1 && !e.closest("details")).slice(0, 5).map((e) => `${e.tagName} r=${Math.round(e.getBoundingClientRect().right)} "${(e.textContent || "").slice(0, 60)}"`).join(" || ");
  }));
}
await b.close();
