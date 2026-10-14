import { expect, test } from "@playwright/test";

test("funktionsöversikten leder till varje område", async ({ page }) => {
  await page.goto("/funktioner/");
  await page.getByRole("link", { name: /^Kalkyl/ }).click();
  await expect(page).toHaveURL(/\/funktioner\/kalkyl\/$/);
  await expect(page.getByRole("heading", { level: 1, name: "Kalkyl" })).toBeVisible();
});

test("manuallänkarna på en funktionssida landar på rätt rubrik", async ({ page }) => {
  await page.goto("/funktioner/lager-och-artiklar/");
  await page.getByRole("link", { name: "Inventering", exact: true }).click();
  await expect(page).toHaveURL(/\/hjalp\/lager\/#inventering$/);
  await expect(page.locator("#inventering")).toBeInViewport();
});
