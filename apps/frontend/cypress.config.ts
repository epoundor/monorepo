import { defineConfig } from "cypress";

export default defineConfig({
  projectId: 'ur26j3',
  //   projectId: "v6h3g6",
  component: {
    devServer: {
      framework: "vue",
      bundler: "vite",
    },
  },
  e2e: {
    baseUrl: "http://localhost:8089/",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    specPattern: "src/pages/__tests__/**/*.cy.{js,jsx,ts,tsx}",
    viewportWidth: 1440,
    viewportHeight: 850,
  },
});
