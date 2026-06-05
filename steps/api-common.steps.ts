import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from './bdd-test';

const { Then, Before } = createBdd(test);

Before(async ({ apiWorld }) => {
  apiWorld.response = null;
  apiWorld.body = null;
});

Then('the response status should be {int}', async ({ apiWorld }, expectedStatus: number) => {
  expect(apiWorld.response).not.toBeNull();
  expect(apiWorld.response!.status()).toBe(expectedStatus);
});
