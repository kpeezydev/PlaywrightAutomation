import { test, expect } from '@playwright/test';
import { API_TEST_USERS } from '@/test-data/constants';
import { UrlFactory } from '@/test-data/factories';
import { TestLogger } from '@/utils/logger';

test.describe('API Login scenarios', () => {
  test('should authenticate successfully with valid credentials via API', async ({ request }) => {
    const user = API_TEST_USERS.VALID;
    const payload = { username: user.username, password: user.password };

    TestLogger.request('POST', UrlFactory.dummyJsonLogin(), payload);
    const response = await request.post(UrlFactory.dummyJsonLogin(), {
      data: payload,
    });

    const body = await response.json();
    TestLogger.response(response.status(), body);

    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();
    expect(body.accessToken).toBeDefined();
    expect(typeof body.accessToken).toBe('string');
  });

  test('should return error with invalid credentials via API', async ({ request }) => {
    const payload = { username: API_TEST_USERS.VALID.username, password: 'wrongpassword' };

    TestLogger.request('POST', UrlFactory.dummyJsonLogin(), payload);
    const response = await request.post(UrlFactory.dummyJsonLogin(), {
      data: payload,
    });

    const body = await response.json();
    TestLogger.response(response.status(), body);

    expect(response.status()).toBe(400);
    expect(response.ok()).toBeFalsy();
    expect(body.message).toBe('Invalid credentials');
  });
});
