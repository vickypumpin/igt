import { test, expect } from "@playwright/test";

test.describe("Public pages", () => {
  test("home page renders", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText(/iGoTrend|Influencer|Creator/i)).toBeVisible({ timeout: 8_000 });
  });

  test("login page is accessible", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByTestId("page-login")).toBeVisible();
  });

  test("register page is accessible", async ({ page }) => {
    await page.goto("/register");
    await expect(page.getByTestId("page-register")).toBeVisible({ timeout: 6_000 });
  });

  test("FAQ page is accessible without login", async ({ page }) => {
    await page.goto("/help");
    await expect(page).toHaveURL(/help/);
  });

  test("public creator profile 404 is graceful", async ({ page }) => {
    await page.goto("/c/nonexistent-user-xyz");
    await expect(page.getByText(/not found|private|no creator/i)).toBeVisible({ timeout: 6_000 });
  });
});
