import { type Page, type Locator, expect } from "@playwright/test";

export class CheckOutOverViewPage {
  readonly page: Page;
  readonly cancelBtnLocator: Locator;
  readonly finishBtnLocator: Locator;
  readonly items: Locator;
  readonly itemTotal: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cancelBtnLocator = page.getByRole("button", { name: "Cancel" });
    this.finishBtnLocator = page.getByRole("button", { name: "Finish" });
    this.items = page.getByTestId("inventory-item");
    this.itemTotal = page.getByTestId("subtotal-label");
  }

  async gotoCheckOutOverViewPage() {
    await this.page.goto(process.env.CHECKOUT_OVERVIEW_PAGE_URL!);
    await expect(this.page.getByTestId("title")).toHaveText(
      "Checkout: Overview",
    );
  }

  async validatePrice() {
    const count = await this.items.count();
    let sum = 0;
    for (let i = 0; i < count; i++) {
      const priceText = await this.items
        .nth(i)
        .getByTestId("inventory-item-price")
        .innerText();
      const price = parseFloat(priceText.replace("$", ""));
      sum += price;
    }
    const totalText = await this.itemTotal.innerText();
    const total = parseFloat(totalText.match(/\d+(\.\d+)?/)![0]);
    expect(sum).toBe(total);
  }

  async clickOnCancelBtnOfOverview() {
    await this.cancelBtnLocator.click();
    await expect(this.page).toHaveURL(process.env.INVENTORY_PAGE_URL!);
    await expect(this.page.getByTestId("title")).toHaveText("Products");
  }

  async clickOnFinish() {
    await this.finishBtnLocator.click();
    await expect(this.page).toHaveURL(process.env.COMPLETE_PAGE_URL!);
    await expect(this.page.getByTestId("title")).toHaveText(
      "Checkout: Complete!",
    );
    await expect(
      this.page.getByRole("heading", { name: "Thank you for your order!" }),
    ).toBeVisible();
  }
}
