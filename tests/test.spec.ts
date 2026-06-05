import {
  _android as android,
  AndroidDevice,
  BrowserContext,
  Page,
} from "playwright";
import { test } from "@playwright/test";
import { LoginPage } from "../pages/loginPage";
import users from "../data/users.json" with { type: "json" };
// import { selectors } from "playwright";

test.describe("Android browser automation", () => {
  let device: AndroidDevice;
  let context: BrowserContext;
  let page: Page;

  test.beforeEach("Create context and page in connect device", async () => {
    [device] = await android.devices();
    context = await device.launchBrowser();
    page = await context.newPage();
  });

  test.afterEach("Close the context", async () => {
    await context?.close();
    await device?.close();
  });

  test("Valid Login", async () => {
    const loginPage = new LoginPage(page);
    await loginPage.gotoLoginPage();
    await loginPage.loginWithValidCredentials(
      users.validCredentials.userName,
      users.validCredentials.password,
    );
  });
  test("InValid Login", async () => {
    const loginPage = new LoginPage(page);
    await loginPage.gotoLoginPage();
    await loginPage.loginWithInvalidCredentials(
      users.invalidCredentials.userName,
      users.invalidCredentials.password,
    );
  });
});
