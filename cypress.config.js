const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://sandbox.elabjournal.com",
    viewportWidth: 1600,
    viewportHeight: 900,
    env: {
      ELAB_USERNAME: "developer+assessment@elabnext.com",
      ELAB_PASSWORD: "{[O_F?V."
    }
  }
});