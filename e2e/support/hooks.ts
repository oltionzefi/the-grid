import { BeforeAll, AfterAll, Before, After, Status } from '@cucumber/cucumber';
import { chromium, type Browser } from '@playwright/test';
import { BurgerWorld, BASE_URL } from './world';

let browser: Browser;

BeforeAll({ timeout: 30_000 }, async function () {
  // Wait for the vite preview server to be ready (started externally via npm script)
  const start = Date.now();
  while (Date.now() - start < 25_000) {
    try {
      const res = await fetch(BASE_URL);
      if (res.ok || res.status === 200 || res.status === 304) break;
    } catch { /* not ready yet */ }
    await new Promise((r) => setTimeout(r, 400));
  }
  browser = await chromium.launch({ headless: true });
});

AfterAll(async function () {
  await browser?.close();
});

Before({ timeout: 20_000 }, async function (this: BurgerWorld) {
  this.context = await browser.newContext();
  this.page = await this.context.newPage();
  await this.page.goto(`${BASE_URL}/#/`);
  await this.page.waitForLoadState('networkidle');
  // Wait for React to mount (first interactive element)
  await this.page.waitForSelector('header', { timeout: 10_000 });
});

After(async function (this: BurgerWorld, scenario) {
  if (scenario.result?.status === Status.FAILED) {
    const name = scenario.pickle.name.replace(/\s+/g, '-').toLowerCase();
    const screenshot = await this.page.screenshot({ fullPage: true });
    this.attach(screenshot, 'image/png');
    await this.page.screenshot({ path: `e2e/screenshots/fail-${name}.png` });
  }
  await this.context?.close();
});
