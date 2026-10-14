import { expect, test } from "@playwright/test";

const toBottom = () => window.scrollTo(0, document.documentElement.scrollHeight);

test("till toppen-knappen dyker upp efter scrollning och tar en upp igen", async ({ page }) => {
  await page.goto("/hjalp/tillverkning/");
  const button = page.getByRole("button", { name: "Till toppen" });
  await expect(button).toBeHidden();
  await page.evaluate(toBottom);
  await expect(button).toBeVisible();
  await button.click();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await expect(page.getByRole("link", { name: "Nav|ERP, till startsidan" })).toBeFocused();
  await expect(button).toBeHidden();
});

test("till toppen-knappen hoppar direkt för den som vill ha mindre rörelse", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/hjalp/ekonomi/");
  await page.evaluate(toBottom);
  await page.getByRole("button", { name: "Till toppen" }).click();
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
});

test("avsnittslänkarna finns överst i kapitlet på mobil", async ({ page, isMobile }) => {
  test.skip(!isMobile, "på dator finns sidomenyn");
  await page.goto("/hjalp/tillverkning/");
  const list = page.locator("details", { hasText: "I det här kapitlet" });
  await expect(list.locator("summary")).toHaveText("I det här kapitlet (10 avsnitt)");
  // Under kapitelrubriken, före brödtexten.
  const [h1, summary, firstParagraph] = await Promise.all([
    page.getByRole("heading", { level: 1 }).boundingBox(),
    list.locator("summary").boundingBox(),
    page.locator("article p").first().boundingBox(),
  ]);
  expect(summary!.y).toBeGreaterThan(h1!.y);
  expect(summary!.y).toBeLessThan(firstParagraph!.y);

  await list.locator("summary").click();
  await list.getByRole("link", { name: "Behovsberäkning" }).click();
  await expect(page).toHaveURL(/#behovsberakning$/);
  await expect(page.locator("#behovsberakning")).toBeInViewport();
  await expect(list).not.toHaveAttribute("open");
});

test("avsnittslänkarna i kapitlet döljs på dator där sidomenyn finns", async ({ page, isMobile }) => {
  test.skip(isMobile, "gäller dator");
  await page.goto("/hjalp/tillverkning/");
  await expect(page.locator("details", { hasText: "I det här kapitlet" })).toBeHidden();
  await expect(page.getByRole("navigation", { name: "I det här kapitlet" })).toBeVisible();
});

test("sidomenyn markerar avsnittet man läser", async ({ page, isMobile }) => {
  test.skip(isMobile, "sidomenyn finns på dator");
  await page.goto("/hjalp/tillverkning/");
  const toc = page.getByRole("navigation", { name: "I det här kapitlet" });
  const current = toc.locator('a[aria-current="location"]');
  await expect(current).toHaveText("Översikt");

  await toc.getByRole("link", { name: "Legoresurser" }).click();
  await expect(current).toHaveText("Legoresurser");

  await page.evaluate(() => document.getElementById("belaggning")!.scrollIntoView());
  await expect(current).toHaveText("Beläggning");

  // Sista avsnittet är för kort för att nå upp till toppen — längst ner räknas det ändå.
  await page.evaluate(toBottom);
  await expect(current).toHaveText("Tidrapporter");
  await expect(current).toHaveCount(1);
});
