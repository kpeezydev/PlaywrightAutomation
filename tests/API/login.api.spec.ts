import { test, expect } from '@playwright/test';
import { ApiClient } from '../../utils/api-client';
import { API_TEST_USERS } from '@/test-data/constants';
import { UrlFactory } from '@/test-data/factories';

test.describe('API Login scenarios', () => {
  let apiClient: ApiClient;

  test.beforeEach(({ request }) => {
    apiClient = new ApiClient(request);
  });

  test('should authenticate successfully with valid credentials via API', async ({ request }) => {
    // Utilizing a public dummy API (dummyjson.com) to demonstrate a working login test
    const user = API_TEST_USERS.VALID;
    const response = await request.post(UrlFactory.dummyJsonLogin(), {
      data: {
        username: user.username,
        password: user.password
      }
    });

    // Assert status code
    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();

    // Assert response body schema
    const body = await response.json();
    expect(body.accessToken).toBeDefined();
    expect(typeof body.accessToken).toBe('string');
  });

  test('should return error with invalid credentials via API', async ({ request }) => {
    const response = await request.post(UrlFactory.dummyJsonLogin(), {
      data: {
        username: API_TEST_USERS.VALID.username,
        password: 'wrongpassword'
      }
    });

    // Assert error status
    expect(response.status()).toBe(400);
    expect(response.ok()).toBeFalsy();

    // Assert error message
    const body = await response.json();
    expect(body.message).toBe('Invalid credentials');
  });
});
