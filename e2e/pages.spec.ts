import { expect, test } from "@playwright/test";
import { allRoutes } from "../lib/routes";

test.describe("alla sidor", () => {
  test.skip(({ isMobile }) => isMobile, "bredderna sätts per test");

  for (const route of allRoutes()) {
    test(`${route} har en h1 och ingen sidledsscroll`, async ({ page }) => {
      for (const width of [320, 768, 1280]) {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(route);
        await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        expect(overflow, `${route} vid ${width} px`).toBeLessThanOrEqual(0);
      }
    });
  }
});
