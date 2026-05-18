import { type Page, type Locator, expect } from "@playwright/test";
import { validateCheckoutInformation } from "../logic/data_validation";

export class CheckOutPage {
  readonly page: Page;
  readonly firstNameLocator: Locator;
  readonly lastNameLocator: Locator;
  readonly postalCodeLocator: Locator;
  readonly cancelBtnLocator: Locator;
  readonly continueBtnLocator: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameLocator = page.getByTestId("firstName");
    this.lastNameLocator = page.getByTestId("lastName");
    this.postalCodeLocator = page.getByTestId("postalCode");
    this.cancelBtnLocator = page.getByRole("button", { name: "Cancel" });
    this.continueBtnLocator = page.getByTestId("continue");
  }

  async gotoCheckOutPage() {
    await this.page.goto(process.env.CHECKOUT_PAGE_URL!);
    await expect(this.page.getByTestId("title")).toHaveText(
      "Checkout: Your Information",
    );
  }

  async fillCheckOutDetails(fName: string, lName: string, zipcode: number) {
    await expect(
      validateCheckoutInformation(fName, lName, zipcode),
    ).toBeTruthy();
    await this.firstNameLocator.fill(fName);
    await this.lastNameLocator.fill(lName);
    await this.postalCodeLocator.fill(zipcode.toString());
  }

  async clickOnCancelBtn() {
    await this.cancelBtnLocator.click();
    await expect(this.page).toHaveURL(process.env.CART_PAGE_URL!);
    await expect(this.page.getByTestId("title")).toHaveText("Your Cart");
  }

  async clickOnContinueWithEmptyForm() {
    await this.continueBtnLocator.click();
    await expect(this.page.getByTestId("error")).toBeVisible();
  }

  async clickOnContinueWithFilledForm(
    fName: string,
    lName: string,
    zipcode: number,
  ) {
    await this.fillCheckOutDetails(fName, lName, zipcode);
    await this.continueBtnLocator.click();
    await expect(this.page).toHaveURL(process.env.CHECKOUT_OVERVIEW_PAGE_URL!);
    await expect(this.page.getByTestId("title")).toHaveText(
      "Checkout: Overview",
    );
  }
}
