import { chromium } from "@playwright/test";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 390, height: 844 } });
await p.goto("http://127.0.0.1:4321/");
console.log(await p.evaluate(() => [...document.querySelectorAll("header .container > *, header [class*=actions] > *")].map((e) => `${e.tagName}.${String(e.className).slice(0,40)} x=${Math.round(e.getBoundingClientRect().left)} w=${Math.round(e.getBoundingClientRect().width)}`).join("\n")));
await b.close();
