import { test, expect } from '@playwright/test';
import { ApiTestDataFactory, UrlFactory } from '@/test-data/factories';
import { TestLogger } from '@/utils/logger';

test.describe('API PUT and DELETE scenarios', () => {
  test('should successfully send PUT request and echo back data via API', async ({
    request,
  }, testInfo) => {
    const log = TestLogger.forTest(testInfo.title);
    log.step('building PUT payload');
    const putPayload = ApiTestDataFactory.orderPayload();

    log.request('PUT', UrlFactory.postmanEchoPut(), putPayload);
    const response = await request.put(UrlFactory.postmanEchoPut(), {
      data: putPayload,
    });

    const responseBody = await response.json();
    log.response(response.status(), responseBody);

    expect(response.ok()).toBeTruthy();
    expect(responseBody).toHaveProperty('data');
    expect(responseBody.data).toHaveProperty('orderId', 12345);
    expect(responseBody.data).toHaveProperty('status', 'COMPLETED');
  });

  test('should successfully send DELETE request and return response via API', async ({
    request,
  }, testInfo) => {
    const log = TestLogger.forTest(testInfo.title);
    const deletePayload = {
      resourceId: 999,
      action: 'delete',
    };

    log.request('DELETE', UrlFactory.postmanEchoDelete(), deletePayload);
    const response = await request.delete(UrlFactory.postmanEchoDelete(), {
      data: deletePayload,
    });

    const responseBody = await response.json();
    log.response(response.status(), responseBody);

    expect(response.ok()).toBeTruthy();
    expect(responseBody).toHaveProperty('data');
    expect(responseBody.data).toHaveProperty('resourceId', 999);
    expect(responseBody.data).toHaveProperty('action', 'delete');
  });
});
