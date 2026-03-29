import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { BurgerWorld } from '../support/world';

Given('I navigate to the recipes page', async function (this: BurgerWorld) {
  await this.navigate('/recipe');
  await this.page.waitForTimeout(500);
});

// ─── Page structure ───────────────────────────────────────────────────────────

Then('I should see the {string} heading', async function (this: BurgerWorld, heading: string) {
  const el = this.page.getByRole('heading', { name: heading });
  await expect(el).toBeVisible();
});

Then('I should see the featured hero card', async function (this: BurgerWorld) {
  // Hero card is a div with role=button that contains the gradient overlay
  const hero = this.page.locator('[role="button"]').first();
  await expect(hero).toBeVisible();
});

Then('I should see the {string} label', async function (this: BurgerWorld, label: string) {
  await expect(this.page.getByText(label)).toBeVisible();
});

Then('I should see at least {int} recipe card(s)', async function (this: BurgerWorld, count: number) {
  await this.page.waitForTimeout(300);
  const cards = this.page.locator('[data-slot="card"]');
  await expect(cards.first()).toBeVisible();
  const actual = await cards.count();
  expect(actual).toBeGreaterThanOrEqual(count);
});

// ─── Difficulty badges ────────────────────────────────────────────────────────

Then('I should see difficulty badges on recipe cards', async function (this: BurgerWorld) {
  // Difficulty badges contain one of the known labels
  const badges = this.page.getByText(/^(Easy|Medium|Hard)$/);
  const count = await badges.count();
  expect(count).toBeGreaterThan(0);
});

Then(
  'each difficulty badge should show one of {string}, {string}, or {string}',
  async function (this: BurgerWorld, a: string, b: string, c: string) {
    const badges = this.page.getByText(new RegExp(`^(${a}|${b}|${c})$`));
    const count = await badges.count();
    expect(count).toBeGreaterThan(0);

    // Every badge text must be one of the three values
    const texts = await badges.allTextContents();
    for (const text of texts) {
      expect([a, b, c]).toContain(text.trim());
    }
  },
);

Then(
  'the {string} difficulty badge should be visually distinct',
  async function (this: BurgerWorld, difficulty: string) {
    const badge = this.page.getByText(difficulty).first();
    await expect(badge).toBeVisible();

    // Confirm badge has a non-transparent background class via screenshot / class check
    const className = await badge.getAttribute('class');
    expect(className).toBeTruthy();
    // Solid bg classes contain 'bg-' without '/15' opacity modifier
    const hasSolidBg = className?.includes('bg-') && !className?.includes('/15');
    expect(hasSolidBg).toBeTruthy();
  },
);

// ─── Category tabs ────────────────────────────────────────────────────────────

Then('I should see the category tabs', async function (this: BurgerWorld) {
  const allTab = this.page.getByRole('button', { name: 'All' }).first();
  await expect(allTab).toBeVisible();
});

Then('I should see the {string} tab', async function (this: BurgerWorld, label: string) {
  const tab = this.page.getByRole('button', { name: label }).first();
  await expect(tab).toBeVisible();
});

When('I click the {string} category tab', async function (this: BurgerWorld, label: string) {
  await this.page.getByRole('button', { name: label }).first().click();
  await this.page.waitForTimeout(300);
});

// ─── Recipe drawer ────────────────────────────────────────────────────────────

When('I click the first recipe card', async function (this: BurgerWorld) {
  const card = this.page.locator('[data-slot="card"]').first();
  await expect(card).toBeVisible();
  const viewBtn = card.getByRole('button', { name: /view recipe/i });
  await viewBtn.click();
  await this.page.waitForTimeout(400);
});

Then('the recipe drawer should be open', async function (this: BurgerWorld) {
  const ingredients = this.page.getByText('Ingredients');
  await expect(ingredients).toBeVisible();
});

Then('I should see the {string} section', async function (this: BurgerWorld, section: string) {
  await expect(this.page.getByText(section)).toBeVisible();
});

Then('the recipe drawer should contain a difficulty badge', async function (this: BurgerWorld) {
  const badge = this.page.getByText(/^(Easy|Medium|Hard)$/).first();
  await expect(badge).toBeVisible();
});

When('I close the recipe drawer', async function (this: BurgerWorld) {
  const closeBtn = this.page.getByLabel('Close recipe');
  await closeBtn.click();
  await this.page.waitForTimeout(300);
});

Then('the recipe drawer should be closed', async function (this: BurgerWorld) {
  const ingredients = this.page.getByText('Ingredients');
  await expect(ingredients).not.toBeVisible();
});

// ─── Time indicators ──────────────────────────────────────────────────────────

Then('I should see time indicators on recipe cards', async function (this: BurgerWorld) {
  // Cards show "<N>m" time pill and/or "prep" / "cook" labels
  const timeLabels = this.page.getByText(/\d+m(in)?/);
  const count = await timeLabels.count();
  expect(count).toBeGreaterThan(0);
});
