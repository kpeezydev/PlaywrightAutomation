import { test, expect } from '@playwright/test';
import { ApiTestDataFactory, UrlFactory } from '@/test-data/factories';

test.describe('API PUT and DELETE scenarios', () => {
  test.beforeEach(() => {
    // apiClient not used in these tests, removed to avoid lint error
  });

  test('should successfully send PUT request and echo back data via API', async ({ request }) => {
    // Send PUT request with sample data to postman-echo.com/put
    const putPayload = ApiTestDataFactory.orderPayload(); // Reusing existing payload factory

    // Using fetch API directly since apiClient not needed for this test
    const response = await request.put(UrlFactory.postmanEchoPut(), {
      data: putPayload,
    });

    // Assert response contains our sent data (postman-echo echoes back the request)
    expect(response.ok()).toBeTruthy();
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('data');
    expect(responseBody.data).toHaveProperty('orderId', 12345);
    expect(responseBody.data).toHaveProperty('status', 'COMPLETED');
  });

  test('should successfully send DELETE request and return response via API', async ({
    request,
  }) => {
    // Send DELETE request to postman-echo.com/delete
    // We can send query parameters or body data - postman-echo will echo them back
    const deletePayload = {
      resourceId: 999,
      action: 'delete',
    };

    // Using fetch API directly since apiClient not needed for this test
    const response = await request.delete(UrlFactory.postmanEchoDelete(), {
      data: deletePayload,
    });

    // Assert response contains our sent data (postman-echo echoes back the request)
    expect(response.ok()).toBeTruthy();
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('data');
    expect(responseBody.data).toHaveProperty('resourceId', 999);
    expect(responseBody.data).toHaveProperty('action', 'delete');
  });
});
