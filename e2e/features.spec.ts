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
  await expect(steps).toHaveText(["Installera Docker", "Hämta och konfigurera", "Starta", "Skapa första användaren", "Öppna bara webben"]);
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

test("installationsguiden kräver databaslösenordet och engångskoden", async ({ page }) => {
  await page.goto("/kom-igang/");
  const guide = page.getByRole("list", { name: "Installationssteg" });
  await expect(guide).toContainText("POSTGRES_PASSWORD");
  await expect(guide).toContainText("Engångskod");
  await expect(guide).toContainText("docker compose logs api");
  await expect(guide).not.toContainText("5432");
});

test("installationsguiden säger före stegen att Nav|ERP inte är redo för produktion", async ({ page }) => {
  await page.goto("/kom-igang/");
  const notice = page.getByRole("note", { name: "Ännu inte redo för produktion" });
  await expect(notice).toContainText("använd det ännu inte som ert enda affärssystem eller för er skarpa bokföring");
  await expect(notice.getByRole("link", { name: "berätta gärna" })).toHaveAttribute("href", "https://github.com/ubbe76/Nav-ERP/issues/new/choose");
  const noticeBox = await notice.boundingBox();
  const stepsBox = await page.getByRole("list", { name: "Installationssteg" }).boundingBox();
  expect(noticeBox!.y).toBeLessThan(stepsBox!.y);
});

test("installationsguiden beskriver Windows med Docker Desktop och länkar till manualen", async ({ page }) => {
  await page.goto("/kom-igang/");
  const windows = page.getByRole("region", { name: "På Windows" });
  await expect(windows).toContainText("Docker Desktop");
  await expect(windows).toContainText("inne i WSL");
  await expect(windows.getByRole("link", { name: "manualen" })).toHaveAttribute("href", /\/hjalp\/drift-utveckling\/#windows$/);
});

test("öppen källkod-sidan bjuder in till att hjälpa till, även utan att programmera", async ({ page }) => {
  await page.goto("/oppen-kallkod/");
  await expect(page.getByRole("heading", { level: 2, name: "Hjälp till att göra Nav|ERP bättre" })).toBeVisible();
  await expect(page.getByText("Ni behöver inte kunna programmera för att hjälpa till")).toBeVisible();
  await expect(page.getByRole("link", { name: "skapa ett ärende på GitHub" })).toHaveAttribute(
    "href",
    "https://github.com/ubbe76/Nav-ERP/issues/new/choose",
  );
  await expect(page.getByRole("link", { name: "privat" })).toHaveAttribute(
    "href",
    "https://github.com/ubbe76/Nav-ERP/security/advisories/new",
  );
});
