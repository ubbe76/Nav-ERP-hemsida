import { expect, test } from "@playwright/test";

test("temat följer systemet tills besökaren väljer, och valet sparas", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.getByRole("button", { name: "Dracula" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dracula");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dracula");
  await expect(page.getByRole("button", { name: "Dracula" })).toHaveAttribute("aria-pressed", "true");
});

test("menyn når alla huvudsidor", async ({ page, isMobile }) => {
  await page.goto("/");
  if (isMobile) await page.getByLabel("Meny", { exact: true }).click();
  const nav = page.getByRole("navigation", { name: isMobile ? "Huvudmeny (mobil)" : "Huvudmeny", exact: true });
  for (const name of ["Funktioner", "Kom igång", "Manual", "Öppen källkod"]) {
    await expect(nav.getByRole("link", { name })).toBeVisible();
  }
});

test("första tabbstoppet är hoppa till innehållet", async ({ page, isMobile }) => {
  test.skip(isMobile, "tangentbord testas på desktop");
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Hoppa till innehållet" })).toBeFocused();
});

test("sidan fungerar utan JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4321/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("img", { name: /Översikten i Nav\|ERP/ })).toBeVisible();
  await context.close();
});
