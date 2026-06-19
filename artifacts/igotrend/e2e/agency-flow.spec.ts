import { test, expect } from "@playwright/test";
import { login, logout } from "./helpers";

test.describe("Agency Portal", () => {
  test.beforeEach(async ({ page }) => {
    await login(page, "agency");
  });

  test.afterEach(async ({ page }) => {
    await logout(page);
  });

  test("agency dashboard loads with stats", async ({ page }) => {
    await expect(page.getByTestId("page-agency-dashboard")).toBeVisible({ timeout: 8_000 });
  });

  test("agency clients page loads", async ({ page }) => {
    await page.goto("/agency/clients");
    await expect(page.getByTestId("page-agency-clients")).toBeVisible({ timeout: 8_000 });
  });

  test("agency campaigns page loads", async ({ page }) => {
    await page.goto("/agency/campaigns");
    await expect(page.getByTestId("page-agency-campaigns")).toBeVisible({ timeout: 8_000 });
  });

  test("agency messages page loads", async ({ page }) => {
    await page.goto("/agency/messages");
    await expect(page.getByTestId("page-agency-messages")).toBeVisible({ timeout: 8_000 });
  });

  test("agency sidebar FAQ link works", async ({ page }) => {
    await page.goto("/faq");
    await expect(page.getByTestId("page-faq")).toBeVisible({ timeout: 8_000 });
  });

  test("agency sidebar Settings link works", async ({ page }) => {
    await page.goto("/agency/settings");
    await expect(page.getByTestId("page-settings")).toBeVisible({ timeout: 8_000 });
  });
});
