import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  globalSetup: require.resolve('./global-setup'),
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ...(process.env.CI
      ? [['dot'] as const, ['github'] as const, ['html', { open: 'never' }] as const]
      : [['list'] as const, ['html', { open: 'on-failure' }] as const]),
    ...(process.env.ALLURE_REPORT === 'true' || process.env.CI
      ? [['allure-playwright'] as const]
      : []),
  ],
  outputDir: 'test-results/',
  use: {
    baseURL: 'https://www.saucedemo.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: !!process.env.CI,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
