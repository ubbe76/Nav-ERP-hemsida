import { test } from "@playwright/test";

// Not an assertion — full-page screenshots in all three themes for a human to
// look through. Run with `npm run test:visual`; images land in e2e-screens/.
const PAGES = ["/", "/funktioner/kalkyl/", "/kom-igang/", "/hjalp/tillverkning/"];
const THEMES = ["light", "dark", "dracula"] as const;

test.skip(!process.env.VISUAL, "kör med npm run test:visual");

for (const route of PAGES) {
  for (const theme of THEMES) {
    test(`skärmdump ${route} ${theme}`, async ({ page }, info) => {
      await page.addInitScript((t) => localStorage.setItem("nav-erp-theme", t), theme);
      await page.goto(route);
      await page.evaluate(() => {
        document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => (el.dataset.reveal = "done"));
        document.querySelectorAll<HTMLImageElement>('img[loading="lazy"]').forEach((img) => (img.loading = "eager"));
      });
      await page.waitForLoadState("networkidle");
      const name = route === "/" ? "start" : route.replace(/^\/|\/$/g, "").replaceAll("/", "_");
      await page.screenshot({ path: `e2e-screens/${info.project.name}/${name}-${theme}.png`, fullPage: true });
    });
  }
}
