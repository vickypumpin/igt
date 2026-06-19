import { test, expect } from "@playwright/test";
import { login, logout } from "./helpers";

test.describe("Campaign Flow — Brand creates, Creator applies", () => {
  test("brand can view campaigns list", async ({ page }) => {
    await login(page, "brand");
    await expect(page).toHaveURL(/^\//);
    await page.goto("/campaigns");
    await expect(page.getByTestId("page-campaigns")).toBeVisible({ timeout: 8_000 });
    await logout(page);
  });

  test("brand new campaign page renders", async ({ page }) => {
    await login(page, "brand");
    await page.goto("/campaigns/new");
    await expect(page.getByTestId("page-campaign-new")).toBeVisible({ timeout: 8_000 });
    await logout(page);
  });

  test("brand campaign form has required fields", async ({ page }) => {
    await login(page, "brand");
    await page.goto("/campaigns/new");
    await page.waitForLoadState("networkidle");
    await expect(page.getByTestId("input-campaign-name")).toBeVisible();
    await expect(page.getByTestId("input-campaign-sponsor")).toBeVisible();
    await logout(page);
  });

  test("creator can view discover campaigns", async ({ page }) => {
    await login(page, "creator");
    await page.goto("/campaigns");
    await expect(page.getByTestId("page-creator-campaigns")).toBeVisible({ timeout: 8_000 });
    await logout(page);
  });

  test("creator invites page renders", async ({ page }) => {
    await login(page, "creator");
    await page.goto("/invites");
    await expect(page.getByTestId("page-creator-invites")).toBeVisible({ timeout: 8_000 });
    await logout(page);
  });

  test("creator can view their earnings", async ({ page }) => {
    await login(page, "creator");
    await page.goto("/earnings");
    await expect(page.getByTestId("page-creator-earnings")).toBeVisible({ timeout: 8_000 });
    await logout(page);
  });

  test("brand can discover creators", async ({ page }) => {
    await login(page, "brand");
    await page.goto("/creators");
    await expect(page.getByTestId("page-creators")).toBeVisible({ timeout: 8_000 });
    await logout(page);
  });
});

test.describe("Campaign Flow — Admin moderation", () => {
  test.beforeEach(async ({ page }) => {
    await login(page, "admin");
  });

  test.afterEach(async ({ page }) => {
    await logout(page);
  });

  test("admin can view all campaigns", async ({ page }) => {
    await page.goto("/admin/campaigns");
    await expect(page.getByTestId("page-admin-campaigns")).toBeVisible({ timeout: 8_000 });
  });

  test("admin submissions page loads", async ({ page }) => {
    await page.goto("/admin/submissions");
    await expect(page.getByTestId("page-admin-submissions")).toBeVisible({ timeout: 8_000 });
  });

  test("admin payouts page loads", async ({ page }) => {
    await page.goto("/admin/payouts");
    await expect(page.getByTestId("page-admin-payouts")).toBeVisible({ timeout: 8_000 });
  });
});
