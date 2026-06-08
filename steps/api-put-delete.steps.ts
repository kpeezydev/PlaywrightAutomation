import { expect } from '@playwright/test';
import { When, Then } from '@/steps/fixtures.steps';
import { ApiTestDataFactory, UrlFactory } from '@/test-data/factories';
import { TestLogger } from '@/utils/logger';
import { apiRequest } from '@/utils/api-helper';

When(
  'I send a PUT request to postman-echo with an order payload',
  async ({ request, apiContext, $testInfo }) => {
    await apiRequest(request, apiContext, $testInfo, {
      method: 'PUT',
      url: UrlFactory.postmanEchoPut(),
      data: ApiTestDataFactory.orderPayload(),
    });
  },
);

Then('the PUT response should echo back the order data', async ({ apiContext, $testInfo }) => {
  const log = TestLogger.forTest($testInfo.title);
  log.step('Verifying PUT response echoes back order data');
  expect(apiContext.response.body.data).toBeDefined();
  expect(apiContext.response.body.data).toHaveProperty('orderId', 12345);
  expect(apiContext.response.body.data).toHaveProperty('status', 'COMPLETED');
});

When(
  'I send a DELETE request to postman-echo with a resource payload',
  async ({ request, apiContext, $testInfo }) => {
    await apiRequest(request, apiContext, $testInfo, {
      method: 'DELETE',
      url: UrlFactory.postmanEchoDelete(),
      data: { resourceId: 999, action: 'delete' },
    });
  },
);

Then(
  'the DELETE response should echo back the resource data',
  async ({ apiContext, $testInfo }) => {
    const log = TestLogger.forTest($testInfo.title);
    log.step('Verifying DELETE response echoes back resource data');
    expect(apiContext.response.body.data).toBeDefined();
    expect(apiContext.response.body.data).toHaveProperty('resourceId', 999);
    expect(apiContext.response.body.data).toHaveProperty('action', 'delete');
  },
);
