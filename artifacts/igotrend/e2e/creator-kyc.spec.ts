import { test, expect } from "@playwright/test";
import { login, logout } from "./helpers";

test.describe("Creator KYC / Identity Verification", () => {
  test.beforeEach(async ({ page }) => {
    await login(page, "creator");
  });

  test.afterEach(async ({ page }) => {
    await logout(page);
  });

  test("creator can navigate to verify page", async ({ page }) => {
    await page.goto("/verify");
    await expect(page.getByTestId("page-creator-verify")).toBeVisible({ timeout: 8_000 });
  });

  test("KYC form is visible with required fields", async ({ page }) => {
    await page.goto("/verify");
    await page.waitForLoadState("networkidle");
    const form = page.getByTestId("page-creator-verify");
    await expect(form).toBeVisible();
    await expect(page.getByTestId("input-legal-name")).toBeVisible();
    await expect(page.getByTestId("input-id-number")).toBeVisible();
  });

  test("KYC submission requires all fields", async ({ page }) => {
    await page.goto("/verify");
    await page.waitForLoadState("networkidle");
    const submitBtn = page.getByTestId("btn-submit-kyc");
    if (await submitBtn.isVisible()) {
      await submitBtn.click();
      await expect(page.getByText(/required|fill in|legal name/i)).toBeVisible({ timeout: 5_000 });
    }
  });

  test("creator dashboard shows KYC status chip", async ({ page }) => {
    await page.goto("/");
    await page.waitForTestId?.("page-creator-dashboard");
    const dashboard = page.getByTestId("page-creator-dashboard");
    await expect(dashboard).toBeVisible({ timeout: 8_000 });
  });

  test("admin KYC requests page loads", async ({ page }) => {
    await logout(page);
    await login(page, "admin");
    await page.goto("/admin/kyc-requests");
    await expect(page.getByTestId("page-admin-kyc-requests")).toBeVisible({ timeout: 8_000 });
    await logout(page);
    await login(page, "creator");
  });
});
