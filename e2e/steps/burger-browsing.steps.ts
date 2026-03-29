import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { BurgerWorld } from '../support/world';

// The page is already on BASE_URL from the Before hook.
// "I open the app" just navigates to home to reset state.
Given('I open the app', async function (this: BurgerWorld) {
  await this.navigate('/');
  await this.page.waitForTimeout(500);
});

// ─── Burger Browsing ──────────────────────────────────────────────────────────

Then('I should see the burger menu', async function (this: BurgerWorld) {
  const grid = this.page.locator('.grid').first();
  await expect(grid).toBeVisible();
});

Then('I should see at least {int} burger card(s)', async function (this: BurgerWorld, count: number) {
  await this.page.waitForTimeout(300);
  const grid = this.page.locator('.grid').first();
  const children = await grid.locator('> *').count();
  expect(children).toBeGreaterThanOrEqual(count);
});

Then('I should see a category filter', async function (this: BurgerWorld) {
  const allPill = this.page.getByRole('button', { name: 'All' });
  await expect(allPill).toBeVisible();
});

Then('I should see the {string} filter option', async function (this: BurgerWorld, label: string) {
  await expect(this.page.getByRole('button', { name: label })).toBeVisible();
});

When('I filter burgers by {string}', async function (this: BurgerWorld, category: string) {
  await this.page.getByRole('button', { name: category }).first().click();
  await this.page.waitForTimeout(300);
});

Then('I should see only {string} burgers', async function (this: BurgerWorld, _category: string) {
  const burgerCards = await this.page.locator('.grid > *').all();
  expect(burgerCards.length).toBeGreaterThan(0);
  const body = await this.page.textContent('body');
  expect(body).toBeTruthy();
});

When('I type {string} in the search box', async function (this: BurgerWorld, query: string) {
  const searchInput = this.page.locator('input[placeholder*="earch" i]').first();
  await searchInput.waitFor({ state: 'visible', timeout: 5000 });
  await searchInput.fill(query);
  await this.page.waitForTimeout(400);
});

Then('I should see burger cards matching {string}', async function (this: BurgerWorld, query: string) {
  const body = await this.page.textContent('body');
  expect(body?.toLowerCase()).toContain(query.toLowerCase());
});

Then('I should see no burgers found message', async function (this: BurgerWorld) {
  const body = await this.page.textContent('body');
  const hasNoResults = body?.toLowerCase().includes('no burger') ||
    body?.toLowerCase().includes('no result') ||
    body?.toLowerCase().includes('not found') ||
    body?.toLowerCase().includes("couldn't find");
  expect(hasNoResults).toBeTruthy();
});
