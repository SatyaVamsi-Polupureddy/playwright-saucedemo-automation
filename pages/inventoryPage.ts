import { type Page, type Locator, expect } from "@playwright/test";

export class InventoryPage {
  readonly page: Page;
  readonly inventoryItems: Locator;
  readonly cartIcon: Locator;

  constructor(page: Page) {
    this.page = page;
    this.inventoryItems = page.getByTestId("inventory-item");
    this.cartIcon = page.getByTestId("shopping-cart-link");
  }

  async gotoInventoryPage() {
    await this.page.goto(process.env.INVENTORY_PAGE_URL!);
    await expect(this.page.getByTestId("title")).toHaveText("Products");
  }

  async addItemToCart(itemNo: number) {
    const count = await this.inventoryItems.count();
    if (itemNo < 0 || itemNo >= count) {
      throw new Error("Item index out of bounds");
    }
    await this.inventoryItems
      .nth(itemNo)
      .getByRole("button", {
        name: "Add to cart",
      })
      .click();

    await expect(
      this.inventoryItems.nth(itemNo).getByRole("button", {
        name: "Remove",
      }),
    ).toBeVisible();
  }

  async removeItemFromCart(itemNo: number) {
    const count: number = await this.inventoryItems.count();
    if (itemNo >= count) {
      throw new Error("Item index out of bounds");
    }
    for (let i = 0; i < count; i++) {
      if (i == itemNo) {
        await this.addItemToCart(parseInt(process.env.ITEM_NUM_TO_ADD!, 10));
        await this.inventoryItems
          .nth(i)
          .getByRole("button", { name: "Remove" })
          .click();
        expect(
          this.inventoryItems
            .nth(i)
            .getByRole("button", { name: "Add to cart" }),
        ).toBeVisible();
      }
    }
  }

  async openProductPage(itemNo: number) {
    const count: number = await this.inventoryItems.count();
    if (itemNo >= count) {
      throw new Error("Item index out of bounds");
    }
    for (let i = 0; i < count; i++) {
      if (i == itemNo) {
        await this.inventoryItems
          .nth(i)
          .locator('[data-test$="title-link"]')
          .click();
        await expect(this.page).toHaveURL(/inventory-item\.html\?id=\d+/);
        await this.page.getByRole("button", { name: "Add to cart" }).click();
        await expect(
          await this.page.getByRole("button", { name: "Remove" }),
        ).toBeVisible();
      }
    }
  }

  async gotoCartPage() {
    await this.cartIcon.click();
    await expect(this.page).toHaveURL(process.env.CART_PAGE_URL!);
    await expect(this.page.getByText(/Your Cart/)).toBeVisible();
  }
}
