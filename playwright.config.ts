import { defineConfig, devices } from "@playwright/test";

/**
 * §64 / §65 — Playwright s'exécute contre un Preview Deployment Vercel,
 * jamais contre un serveur local. L'URL est injectée par le workflow GitHub.
 */
const baseURL =
  process.env.PLAYWRIGHT_BASE_URL ??
  (process.env.VERCEL_PREVIEW_URL ? `https://${process.env.VERCEL_PREVIEW_URL}` : undefined);

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : [["list"]],
  timeout: 30_000,
  use: {
    baseURL,
    locale: "fr-FR",
    timezoneId: "Europe/Paris",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
});
