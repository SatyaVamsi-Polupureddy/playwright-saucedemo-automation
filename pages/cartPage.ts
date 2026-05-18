import { type Page, type Locator, expect } from "@playwright/test";

export class CartPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly contineShoppingBtn: Locator;
  readonly checkOutBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.getByTestId("inventory-item");
    this.contineShoppingBtn = page.getByRole("button", {
      name: "Continue Shopping",
    });
    this.checkOutBtn = page.getByRole("button", { name: "Checkout" });
  }

  async gotoCartPage() {
    await this.page.goto(process.env.CART_PAGE_URL!);
    await expect(this.page.getByTestId("title")).toHaveText("Your Cart");
  }

  // async removeItemFromCart(itemNo: number) {
  //   const count = await this.cartItems.count();
  //   if (itemNo < 0 || itemNo >= count) {
  //     throw new Error("Item index out of bounds");
  //   }
  //   await this.cartItems
  //     .nth(itemNo)
  //     .getByRole("button", { name: "Remove" })
  //     .click();
  //   await expect(this.cartItems).toHaveCount(count - 1);
  // }

  async removeItemFromCart(itemNo: number) {
    const count = await this.cartItems.count();

    if (itemNo < 0 || itemNo >= count) {
      throw new Error(
        `Item index ${itemNo} out of bounds. Cart count: ${count}`,
      );
    }

    await this.cartItems
      .nth(itemNo)
      .getByRole("button", {
        name: "Remove",
      })
      .click();

    await expect(this.cartItems).toHaveCount(count - 1);
  }

  async clickOnContinueShopping() {
    await this.contineShoppingBtn.click();
    await expect(this.page).toHaveURL(process.env.INVENTORY_PAGE_URL!);
    await expect(this.page.getByTestId("title")).toHaveText("Products");
  }

  async checkOut() {
    await this.checkOutBtn.click();
    await expect(this.page).toHaveURL(process.env.CHECKOUT_PAGE_URL!);
    await expect(this.page.getByTestId("title")).toHaveText(
      "Checkout: Your Information",
    );
  }
}
