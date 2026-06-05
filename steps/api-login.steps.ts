import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from './bdd-test';
import { UrlFactory } from '@/test-data/factories';
import { TestLogger } from '@/utils/logger';

const { When, Then } = createBdd(test);

When(
  'I send a POST request to {string} with username {string} and password {string}',
  async ({ request, apiWorld }, _path: string, username: string, password: string) => {
    const payload = { username, password };
    const log = TestLogger.forTest('API Login');
    log.request('POST', UrlFactory.dummyJsonLogin(), payload);
    apiWorld.response = await request.post(UrlFactory.dummyJsonLogin(), { data: payload });
    apiWorld.body = await apiWorld.response.json();
    log.response(apiWorld.response.status(), apiWorld.body);
  },
);

Then('the response should contain an access token', async ({ apiWorld }) => {
  expect(apiWorld.body).toBeDefined();
  expect(apiWorld.body!.accessToken).toBeDefined();
  expect(typeof apiWorld.body!.accessToken).toBe('string');
});

Then(
  'the response error message should be {string}',
  async ({ apiWorld }, expectedMessage: string) => {
    expect(apiWorld.body).toBeDefined();
    expect(apiWorld.body!.message).toBe(expectedMessage);
  },
);
