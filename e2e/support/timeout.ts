import { setDefaultTimeout } from '@cucumber/cucumber';

// Increase default step timeout to 15 seconds (Playwright needs time for async actions)
setDefaultTimeout(15_000);
