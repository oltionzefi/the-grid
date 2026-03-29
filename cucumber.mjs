export default {
  paths: ['e2e/features/**/*.feature'],
  require: ['e2e/support/**/*.ts', 'e2e/steps/**/*.ts'],
  requireModule: ['tsx/cjs'],
  format: [
    'progress-bar',
    'html:e2e/reports/cucumber-report.html',
    'json:e2e/reports/cucumber-results.json',
  ],
  formatOptions: { snippetInterface: 'async-await' },
  parallel: 1,
  worldParameters: {},
};
