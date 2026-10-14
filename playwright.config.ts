import { defineConfig, devices } from "@playwright/test";

// Tests run against the static export in out/ — run `npm run build` first.
// Python's http.server serves directory index.html files the way a static host does.
export default defineConfig({
  testDir: "e2e",
  outputDir: "test-results",
  fullyParallel: true,
  reporter: process.env.CI ? "github" : "list",
  use: { baseURL: "http://127.0.0.1:4321", trace: "retain-on-failure" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: "python3 -m http.server 4321 --bind 127.0.0.1 --directory out",
    url: "http://127.0.0.1:4321/",
    reuseExistingServer: !process.env.CI,
  },
});
