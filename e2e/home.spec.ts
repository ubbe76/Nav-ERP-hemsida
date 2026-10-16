import { expect, test } from "@playwright/test";
import { RELEASES } from "../content/releases";

test("huvudknappen leder till installationen", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Kom igång gratis" }).first().click();
  await expect(page).toHaveURL(/\/kom-igang\/$/);
});

test("navets eker Inköp landar på inköpsavsnittet", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /^Inköp\s*Förfrågan till inleverans/ }).click();
  await expect(page).toHaveURL(/\/funktioner\/inkop-och-forsaljning\/#inkop$/);
  await expect(page.locator("#inkop")).toBeInViewport();
});

test("navet tonas in när det rullas fram", async ({ page, isMobile }) => {
  test.skip(isMobile, "på mobil ritas navet som lista");
  await page.goto("/");
  const hub = page.locator("[data-reveal]").filter({ has: page.getByRole("link", { name: /^Kalkyl/ }) });
  await expect(hub).toHaveAttribute("data-reveal", "pending");
  await hub.scrollIntoViewIfNeeded();
  await expect(hub).toHaveAttribute("data-reveal", "done");
});

test("navet och värdena syns utan JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4321/");
  await expect(page.getByRole("link", { name: /^Tillverkning\s*Order, beredning/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Ingen licenskostnad, ingen inlåsning" })).toBeVisible();
  await context.close();
});

test("startsidan säger att Nav|ERP är en tidig version, mellan sidhuvudet och heron", async ({ page }) => {
  await page.goto("/");
  const notice = page.getByRole("region", { name: "Tidig version" });
  await expect(notice).toContainText(`Nav|ERP ${RELEASES[0]!.version} finns som öppen källkod`);
  await expect(notice.getByRole("link", { name: "på GitHub" })).toHaveAttribute("href", "https://github.com/ubbe76/Nav-ERP");
  await expect(notice.getByRole("link", { name: "se vad som är nytt" })).toHaveAttribute("href", /\/versioner\/$/);
  await expect(notice).toContainText("ännu inte är redo för skarp drift");
  const header = await page.locator("header").first().boundingBox();
  const box = await notice.boundingBox();
  const h1 = await page.getByRole("heading", { level: 1 }).boundingBox();
  expect(box!.y).toBeGreaterThanOrEqual(header!.y + header!.height - 1);
  expect(box!.y + box!.height).toBeLessThanOrEqual(h1!.y);
});

test("meddelandet om den tidiga versionen syns utan JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4321/");
  await expect(page.getByRole("region", { name: "Tidig version" })).toBeVisible();
  await context.close();
});
