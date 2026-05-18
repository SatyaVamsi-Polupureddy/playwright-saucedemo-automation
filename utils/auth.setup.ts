import { chromium, expect } from "@playwright/test";
import users from "../data/users.json" with { type: "json" };
import "dotenv/config";
const saveLoginInfo = async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(process.env.BASE_URL!);
  await page
    .locator('[data-test="username"]')
    .fill(users.validCredentials.userName);
  await page
    .locator('[data-test="password"]')
    .fill(users.validCredentials.password);
  await page.locator('[data-test="login-button"]').click();
  await expect(page).toHaveURL(process.env.INVENTORY_PAGE_URL!);
  await expect(page.getByText(/Swag Labs/)).toBeVisible();

  await page.context().storageState({
    path: "state.json",
  });
  await browser.close();
};

export default saveLoginInfo;
