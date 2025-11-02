const { defineConfig } = require("cypress");

module.exports = defineConfig({
  retries: {
    openMode: 0,
    runMode: 2
  },
  e2e: {
    reporter: 'cypress-mochawesome-reporter',
    reporterOptions: {
      reportDir: 'cypress/reports/html',
      charts: true,
      reportPageTitle: 'PGATS - Automation Exercise',
      embeddedScreenshots: true,
      inlineAssets: true,
      saveAllAttempts: true,
      // Gera o arquivo simples de configuração para permitir uso do CLI
      configOutput: true,
    },
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);
    },
  },
});
