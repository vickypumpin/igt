import { test, expect } from "@playwright/test";
import { login, logout, USERS } from "./helpers";

test.describe("Authentication", () => {
  test("login page renders", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByTestId("page-login")).toBeVisible();
  });

  test("invalid credentials shows error", async ({ page }) => {
    await page.goto("/login");
    await page.getByTestId("input-email").fill("wrong@example.com");
    await page.getByTestId("input-password").fill("wrongpassword");
    await page.getByTestId("button-login").click();
    await expect(page.getByText(/login failed|invalid email or password/i)).toBeVisible({ timeout: 5_000 });
  });

  test("admin login redirects to /admin", async ({ page }) => {
    await login(page, "admin");
    await expect(page).toHaveURL(/\/admin/);
    await logout(page);
  });

  test("brand login redirects to dashboard", async ({ page }) => {
    await login(page, "brand");
    await expect(page).toHaveURL(/\/dashboard|\/$/);
    await logout(page);
  });

  test("creator login redirects to dashboard", async ({ page }) => {
    await login(page, "creator");
    await expect(page.getByTestId("page-creator-dashboard")).toBeVisible({ timeout: 8_000 });
    await logout(page);
  });

  test("agency login redirects to agency dashboard", async ({ page }) => {
    await login(page, "agency");
    await expect(page).toHaveURL(/\/agency\/dashboard/);
    await logout(page);
  });
});
