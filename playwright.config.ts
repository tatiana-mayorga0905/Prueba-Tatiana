import { defineConfig, devices } from "@playwright/test";
import environments from "./configs/environments";
import dotenv from "dotenv";

dotenv.config();

const ENV = process.env.TARGET_ENV || "dev";
const envConfig = environments[ENV as keyof typeof environments];

export default defineConfig({
  testDir: "./tests",

  timeout: 200_000, // Tiempo máximo TOTAL que puede durar el test completo.
  expect: {
    timeout: 30_000, // Tiempo máximo que Playwright espera a que se cumpla una validación (expect),
  },

  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [
    ["list"],
    ["html", { open: "never" }],
    ["json", { outputFile: "test-results/results.json" }],
    ["junit", { outputFile: "test-results/junit.xml" }],
  ],

  use: {
    baseURL: envConfig.baseUrl,
    trace: "on-first-retry",
    headless: !!process.env.CI,
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],
});
