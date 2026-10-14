import { expect, test } from "@playwright/test";

test("en djuplänk i manualen landar på rubriken", async ({ page }) => {
  await page.goto("/hjalp/system/#kalkyler");
  await expect(page.locator("#kalkyler")).toBeInViewport();
});

test("innehållsförteckningen leder till kapitlet", async ({ page }) => {
  await page.goto("/hjalp/");
  await page.getByRole("link", { name: /^Tillverkning/ }).click();
  await expect(page).toHaveURL(/\/hjalp\/tillverkning\/$/);
  await expect(page.getByRole("heading", { level: 1, name: "Tillverkning" })).toBeVisible();
});

test("manualen går att läsa utan JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4321/hjalp/lager/");
  await expect(page.getByRole("heading", { level: 1, name: "Lager" })).toBeVisible();
  await context.close();
});
