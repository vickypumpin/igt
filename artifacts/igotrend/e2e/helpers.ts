import { Page } from "@playwright/test";

export const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:23464";

export const USERS = {
  admin:   { email: "admin@igotrend.com",    password: "password" },
  brand:   { email: "brand@igotrend.com",    password: "password123" },
  creator: { email: "creator1@igotrend.com", password: "password123" },
  agency:  { email: "agency@igotrend.com",   password: "password123" },
};

export async function login(page: Page, role: keyof typeof USERS) {
  const { email, password } = USERS[role];
  await page.goto("/login");
  await page.getByTestId("input-email").fill(email);
  await page.getByTestId("input-password").fill(password);
  await page.getByTestId("button-login").click();
  await page.waitForURL((url) => !url.pathname.includes("/login"), { timeout: 10_000 });
}

export async function logout(page: Page) {
  await page.getByTestId("button-user-menu").click();
  await page.getByTestId("button-logout").click();
  await page.waitForURL("**/login", { timeout: 8_000 });
}
