import { World, IWorldOptions, setWorldConstructor } from '@cucumber/cucumber';
import type { BrowserContext, Page } from '@playwright/test';

export const BASE_URL = 'http://localhost:4173';

export class BurgerWorld extends World {
  context!: BrowserContext;
  page!: Page;

  constructor(options: IWorldOptions) {
    super(options);
  }

  // App uses HashRouter — routes are /#/path
  async navigate(route: string) {
    await this.page.goto(`${BASE_URL}/#${route}`);
    await this.page.waitForLoadState('networkidle');
  }
}

setWorldConstructor(BurgerWorld);
