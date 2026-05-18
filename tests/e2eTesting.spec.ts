import { test } from "@playwright/test";
import { LoginPage } from "../pages/loginPage";
import users from "../data/users.json" with { type: "json" };
import { InventoryPage } from "../pages/inventoryPage";
import { CartPage } from "../pages/cartPage";
import { CheckOutPage } from "../pages/checkOutPage";
import process from "node:process";
import { CheckOutOverViewPage } from "../pages/checkOutOverviewPage";

test.describe("Testing different test cases during a user login", () => {
  test.beforeEach("Navigate to login page and validate", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.gotoLoginPage();
  });

  test("Login with valid credentials => successful login", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginWithValidCredentials(
      users.validCredentials.userName,
      users.validCredentials.password,
    );
  });

  test("Login with invalid credentials => failed login", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginWithInvalidCredentials(
      users.invalidCredentials.userName,
      users.invalidCredentials.password,
    );
  });

  test("Login with locked user credentials => failed login", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginWithLockedCredentials(
      users.lockedUserCredentials.userName,
      users.lockedUserCredentials.password,
    );
  });
});

test.describe("Testing products in inventory page and product page to add/remove to cart", () => {
  test.use({
    storageState: "./state.json",
  });
  test.beforeEach(
    "Navigate to products/inventory page before each test",
    async ({ page }) => {
      const inventoryPage = new InventoryPage(page);
      await inventoryPage.gotoInventoryPage();
    },
  );

  test("Add item to cart", async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.addItemToCart(
      parseInt(process.env.ITEM_NUM_TO_ADD!, 10),
    );
  });

  test("Remove particular item from cart", async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.removeItemFromCart(
      parseInt(process.env.ITEM_NUM_TO_REMOVE!, 10),
    );
  });

  test("Navigate to a Product page and add that item to cart", async ({
    page,
  }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.openProductPage(
      parseInt(process.env.PRODUCT_ITEM_PAGE_NUM!, 10),
    );
  });

  test("Testing if cart icon navigates to cart page:", async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.gotoCartPage();
  });
});

test.describe("Testing Cart page functionalities", () => {
  test.use({
    storageState: "./state.json",
  });
  test.beforeEach(
    "Navigating to Cart Page before each test",
    async ({ page }) => {
      const cartPage = new CartPage(page);
      await cartPage.gotoCartPage();
    },
  );
  test("Remove item from cart before checkout in cartPage", async ({
    page,
  }) => {
    const cartPage = new CartPage(page);
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.gotoInventoryPage();
    await inventoryPage.addItemToCart(
      parseInt(process.env.ITEM_NUM_TO_ADD!, 10),
    );
    await cartPage.gotoCartPage();
    await cartPage.removeItemFromCart(
      parseInt(process.env.ITEM_NUM_TO_REMOVE!, 10),
    );
  });

  test("Testing continue shopping btn ", async ({ page }) => {
    const cartPage = new CartPage(page);
    await cartPage.clickOnContinueShopping();
  });

  test("Testing checkout btn ", async ({ page }) => {
    const cartPage = new CartPage(page);
    await cartPage.checkOut();
  });
});

test.describe("Testing checkout page functionalities", () => {
  test.use({
    storageState: "state.json",
  });
  test.beforeEach(
    "Navigate to checkout page before each test",
    async ({ page }) => {
      const checkoutPage = new CheckOutPage(page);
      await checkoutPage.gotoCheckOutPage();
    },
  );

  test("Click cancel button to view cart page", async ({ page }) => {
    const checkoutPage = new CheckOutPage(page);
    await checkoutPage.clickOnCancelBtn();
  });

  test("click continue button to checkout without input fields filled", async ({
    page,
  }) => {
    const checkoutPage = new CheckOutPage(page);
    await checkoutPage.clickOnContinueWithEmptyForm();
  });

  test("click continue button to checkout with input fields filled", async ({
    page,
  }) => {
    const checkoutPage = new CheckOutPage(page);
    await checkoutPage.clickOnContinueWithFilledForm(
      process.env.FNAME,
      process.env.LNAME,
      parseInt(process.env.ZIPCODE, 10),
    );
  });
});

test.describe("Testing checkout overview page", () => {
  test.use({
    storageState: "./state.json",
  });
  test.beforeEach("Navigate to checkout overview page", async ({ page }) => {
    const checkOutOverviewPage = new CheckOutOverViewPage(page);
    await checkOutOverviewPage.gotoCheckOutOverViewPage();
  });

  test("Validating total item price by adding up all items price", async ({
    page,
  }) => {
    const checkOutOverviewPage = new CheckOutOverViewPage(page);
    await checkOutOverviewPage.validatePrice();
  });

  test("Click cancel button", async ({ page }) => {
    const checkOutOverviewPage = new CheckOutOverViewPage(page);
    await checkOutOverviewPage.clickOnCancelBtnOfOverview();
  });

  test("Testing finish button functionality", async ({ page }) => {
    const checkOutOverviewPage = new CheckOutOverViewPage(page);
    await checkOutOverviewPage.clickOnFinish();
  });
});
