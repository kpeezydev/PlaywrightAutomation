import { expect } from '@playwright/test';
import { When, Then } from '@/steps/fixtures.steps';
import { ApiTestDataFactory, UrlFactory } from '@/test-data/factories';
import { TestLogger } from '@/utils/logger';

When(
  'I send a PUT request to postman-echo with an order payload',
  async ({ request, apiContext, $testInfo }) => {
    const log = TestLogger.forTest($testInfo.title);
    const payload = ApiTestDataFactory.orderPayload();
    log.request('PUT', UrlFactory.postmanEchoPut(), payload);
    const response = await request.put(UrlFactory.postmanEchoPut(), { data: payload });
    const body = await response.json();
    log.response(response.status(), body);
    apiContext.response = { status: response.status(), body };
  },
);

Then('the PUT response should echo back the order data', async ({ apiContext, $testInfo }) => {
  const log = TestLogger.forTest($testInfo.title);
  log.step('Verifying PUT response echoes order data');
  expect(apiContext.response.body.data).toBeDefined();
  expect(apiContext.response.body.data).toHaveProperty('orderId', 12345);
  expect(apiContext.response.body.data).toHaveProperty('status', 'COMPLETED');
});

When(
  'I send a DELETE request to postman-echo with a resource payload',
  async ({ request, apiContext, $testInfo }) => {
    const log = TestLogger.forTest($testInfo.title);
    const payload = { resourceId: 999, action: 'delete' };
    log.request('DELETE', UrlFactory.postmanEchoDelete(), payload);
    const response = await request.delete(UrlFactory.postmanEchoDelete(), {
      data: payload,
    });
    const body = await response.json();
    log.response(response.status(), body);
    apiContext.response = { status: response.status(), body };
  },
);

Then(
  'the DELETE response should echo back the resource data',
  async ({ apiContext, $testInfo }) => {
    const log = TestLogger.forTest($testInfo.title);
    log.step('Verifying DELETE response echoes resource data');
    expect(apiContext.response.body.data).toBeDefined();
    expect(apiContext.response.body.data).toHaveProperty('resourceId', 999);
    expect(apiContext.response.body.data).toHaveProperty('action', 'delete');
  },
);
