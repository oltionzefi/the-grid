import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { BurgerWorld } from '../support/world';

When('I click the locations nav link', async function (this: BurgerWorld) {
  const btn = this.page.getByRole('button', { name: /^locations?$/i });
  await btn.waitFor({ state: 'visible', timeout: 8000 });
  await btn.click();
  await this.page.waitForTimeout(500);
});

When('I click the recipes nav link', async function (this: BurgerWorld) {
  const btn = this.page.getByRole('button', { name: /^recipes?$/i });
  await btn.waitFor({ state: 'visible', timeout: 8000 });
  await btn.click();
  await this.page.waitForTimeout(500);
});

When('I click the home nav link', async function (this: BurgerWorld) {
  const btn = this.page.getByRole('button', { name: /^burgers?$/i });
  await btn.waitFor({ state: 'visible', timeout: 8000 });
  await btn.click();
  await this.page.waitForTimeout(500);
});

Then('I should be on the locations page', async function (this: BurgerWorld) {
  await this.page.waitForTimeout(400);
  const body = await this.page.textContent('body');
  expect(body?.toLowerCase()).toMatch(/location|map|delivery|use my location/i);
});

Then('I should see the locations heading', async function (this: BurgerWorld) {
  const body = await this.page.textContent('body');
  expect(body?.toLowerCase()).toMatch(/location|map|delivery/i);
});

Then('I should be on the recipe page', async function (this: BurgerWorld) {
  await this.page.waitForTimeout(400);
  const body = await this.page.textContent('body');
  expect(body?.toLowerCase()).toMatch(/recipe|ingredient|cook|homemade/i);
});

When('I open the dropdown menu', async function (this: BurgerWorld) {
  // The hamburger menu is the last button in the header
  const menuBtn = this.page.locator('header').getByRole('button').last();
  await menuBtn.waitFor({ state: 'visible', timeout: 8000 });
  await menuBtn.click();
  await this.page.waitForTimeout(600);
});

When('I click {string} in the menu', async function (this: BurgerWorld, item: string) {
  // HeroUI Dropdown.Item renders as a li/button; items may contain icons
  // Use locator that finds element containing the text (not exact match)
  const menuItem = this.page.locator(`[role="menuitem"]`).filter({ hasText: new RegExp(item, 'i') })
    .or(this.page.locator(`[role="option"]`).filter({ hasText: new RegExp(item, 'i') }))
    .or(this.page.locator(`li, [data-key]`).filter({ hasText: new RegExp(`^${item}$`, 'i') }));
  await menuItem.first().waitFor({ state: 'visible', timeout: 8000 });
  await menuItem.first().click();
  await this.page.waitForTimeout(600);
});

Then('I should be on the settings page', async function (this: BurgerWorld) {
  const body = await this.page.textContent('body');
  expect(body?.toLowerCase()).toMatch(/settings?|appearance|theme|dark mode|notification/i);
});

Then('I should be on the FAQ page', async function (this: BurgerWorld) {
  const body = await this.page.textContent('body');
  expect(body?.toLowerCase()).toMatch(/faq|frequently|question/i);
});

Then('I should be on the account page', async function (this: BurgerWorld) {
  const body = await this.page.textContent('body');
  expect(body?.toLowerCase()).toMatch(/account|loyalty|member|profile/i);
});
