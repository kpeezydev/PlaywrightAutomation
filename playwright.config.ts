import 'dotenv/config';
import { defineConfig, devices } from '@playwright/test';
import { defineBddProject } from 'playwright-bdd';

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
  timeout: 60000, // 60 seconds to allow self-healing (Gemini API call + retry)
  expect: {
    timeout: 5000, // 5 seconds for expect assertions
  },
  projects: [
    defineBddProject({
      name: 'bdd-api',
      features: 'tests/feature/API/*.feature',
      featuresRoot: 'tests/feature/API',
      steps: 'steps/**/*.steps.ts',
      outputDir: 'tests/playwright/API',
    }),
    defineBddProject({
      name: 'bdd-ui',
      features: 'tests/feature/UI/*.feature',
      featuresRoot: 'tests/feature/UI',
      steps: 'steps/**/*.steps.ts',
      outputDir: 'tests/playwright/UI',
    }),
    {
      name: 'chromium',
      testIgnore: 'tests/playwright/**',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
