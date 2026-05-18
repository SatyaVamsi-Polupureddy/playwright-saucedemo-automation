import { type Page, type Locator, expect } from "@playwright/test";
import { validateUserCredentials } from "../logic/data_validation";
export class LoginPage {
  readonly page: Page;
  readonly userNameLocator: Locator;
  readonly passwordLocator: Locator;
  readonly loginBtnLocator: Locator;

  constructor(page: Page) {
    this.page = page;
    this.userNameLocator = page.getByTestId("username");
    this.passwordLocator = page.getByTestId("password");
    this.loginBtnLocator = page.getByTestId("login-button");
  }

  async gotoLoginPage() {
    await this.page.goto("/");
    console.log("redirected");
    await expect(this.page.getByText(/Swag Labs/)).toBeVisible();
  }

  async fillCredentials(username: string, password: string) {
    await this.userNameLocator.fill(username);
    await this.passwordLocator.fill(password);
  }

  async loginWithValidCredentials(username: string, password: string) {
    await expect(validateUserCredentials(username, password)).toBeTruthy();
    await this.fillCredentials(username, password);
    await this.loginBtnLocator.click();
    await expect(this.page).toHaveURL(process.env.INVENTORY_PAGE_URL!);
    await expect(this.page.getByText(/Swag Labs/)).toBeVisible();
  }

  async loginWithInvalidCredentials(username: string, password: string) {
    await expect(validateUserCredentials(username, password)).toBeTruthy();
    await this.fillCredentials(username, password);
    await this.loginBtnLocator.click();
    await expect(this.page.getByTestId("error")).toHaveText(
      "Epic sadface: Username and password do not match any user in this service",
    );
  }

  async loginWithLockedCredentials(username: string, password: string) {
    await expect(validateUserCredentials(username, password)).toBeTruthy();
    await this.fillCredentials(username, password);
    await this.loginBtnLocator.click();
    await expect(this.page.getByTestId("error")).toHaveText(
      "Epic sadface: Sorry, this user has been locked out.",
    );
  }
}
