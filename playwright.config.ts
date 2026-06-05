import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

const bddTestDir = defineBddConfig({
  features: 'features/*.feature',
  steps: ['steps/*.steps.ts', 'steps/bdd-test.ts'],
  outputDir: 'features/generated',
  importTestFrom: 'steps/bdd-test.ts',
  disableWarnings: { importTestFrom: true },
});

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['allure-playwright'],
    ...(process.env.CI ? [['html', { open: 'never' }]] : [['html', { open: 'on-failure' }]]),
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
    {
      name: 'bdd',
      testDir: bddTestDir,
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
