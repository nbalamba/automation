const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    specPattern: '*.cy.js',  // 👈 Look directly in this folder!
    baseUrl: 'https://pr-1011-next.au-uw2-dev.autodesk.com/autodesk-university',
    supportFile: false
  }
});
