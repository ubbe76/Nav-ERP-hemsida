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

test("installationsguiden visar stegen i ordning", async ({ page }) => {
  await page.goto("/kom-igang/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Från noll till inloggad på några minuter");
  const steps = page.getByRole("list", { name: "Installationssteg" }).getByRole("heading", { level: 3 });
  await expect(steps).toHaveText(["Installera Docker", "Hämta och konfigurera", "Starta", "Skapa första användaren", "Stäng databasporten"]);
});

test("öppen källkod-sidan nämner licensen och Dracula-attributionen", async ({ page }) => {
  await page.goto("/oppen-kallkod/");
  await expect(page.getByText("GNU General Public License version 3 eller senare")).toBeVisible();
  await expect(page.getByRole("link", { name: "Dracula-paletten" })).toHaveAttribute("href", "https://draculatheme.com");
});

test("installationsguiden säger att API-adressen lämnas tom och att bara port 3000 behövs", async ({ page }) => {
  await page.goto("/kom-igang/");
  const guide = page.getByRole("list", { name: "Installationssteg" });
  await expect(guide).toContainText("Lämna NEXT_PUBLIC_API_URL tom");
  await expect(guide).toContainText("WEB_ORIGIN");
  await expect(guide).not.toContainText("4000");
});
