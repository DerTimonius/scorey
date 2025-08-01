import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI
    ? 'list'
    : [['html', { outputFolder: 'playwright/report/' }]],
  use: {
    baseURL: process.env.CI
      ? process.env.PLAYWRIGHT_TEST_BASE_URL
      : 'http://localhost:5173',
    screenshot: 'only-on-failure',
    testIdAttribute: 'data-test-id',
    trace: 'on-first-retry',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
  ],
});
