import { chromium } from "@playwright/test";
const [url, out, w, h, theme] = process.argv.slice(2);
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: +w, height: +h }, reducedMotion: "reduce" });
const p = await ctx.newPage();
if (theme) await p.addInitScript((t) => localStorage.setItem("nav-erp-theme", t), theme);
await p.goto(url);
await p.evaluate(() => document.querySelectorAll('img[loading="lazy"]').forEach((i) => (i.loading = "eager")));
await p.waitForLoadState("networkidle");
const info = await p.evaluate(() => {
  const vw = document.documentElement.clientWidth;
  const wide = [...document.querySelectorAll("body *")].filter((e) => e.getBoundingClientRect().right > vw + 1).slice(0, 8).map((e) => `${e.tagName}.${e.className}`.slice(0, 80) + " r=" + Math.round(e.getBoundingClientRect().right));
  return { sw: document.documentElement.scrollWidth, vw, wide };
});
console.log(JSON.stringify(info));
await p.screenshot({ path: out, fullPage: true });
await b.close();
