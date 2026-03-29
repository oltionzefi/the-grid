import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { BurgerWorld } from '../support/world';

Then('I should see the admin PIN screen', async function (this: BurgerWorld) {
  await this.page.waitForTimeout(400);
  const body = await this.page.textContent('body');
  expect(body?.toLowerCase()).toMatch(/admin|pin|unlock/i);
});

When('I enter the admin PIN {string}', async function (this: BurgerWorld, pin: string) {
  const pinInput = this.page.locator('input[type="password"]');
  await pinInput.waitFor({ state: 'visible', timeout: 8000 });
  await pinInput.fill(pin);
  const unlockBtn = this.page.getByRole('button', { name: /unlock|enter|submit/i });
  await unlockBtn.click();
  await this.page.waitForTimeout(600);
});

Then('I should see the admin dashboard', async function (this: BurgerWorld) {
  const body = await this.page.textContent('body');
  expect(body?.toLowerCase()).toMatch(/dashboard|menu item|location|admin/i);
});

Then('I should see an admin PIN error', async function (this: BurgerWorld) {
  const body = await this.page.textContent('body');
  expect(body?.toLowerCase()).toMatch(/incorrect|wrong|invalid|try again/i);
});

Then('I should see the admin sidebar with {string}', async function (this: BurgerWorld, section: string) {
  const body = await this.page.textContent('body');
  expect(body?.toLowerCase()).toContain(section.toLowerCase());
});

When('I click {string} in the admin sidebar', async function (this: BurgerWorld, section: string) {
  // Scope to the <aside> element to avoid conflict with top nav buttons
  const sidebar = this.page.locator('aside');
  const btn = sidebar.getByRole('button', { name: new RegExp(`^${section}$`, 'i') });
  await btn.waitFor({ state: 'visible', timeout: 8000 });
  await btn.click();
  await this.page.waitForTimeout(400);
});

Then('I should see the burgers admin table', async function (this: BurgerWorld) {
  const body = await this.page.textContent('body');
  expect(body?.toLowerCase()).toMatch(/menu burger|menu item|category|price|action/i);
});

Then('I should see the store configuration form', async function (this: BurgerWorld) {
  const body = await this.page.textContent('body');
  expect(body?.toLowerCase()).toMatch(/store name|store emoji|store config|identity/i);
});
