import { expect } from '@playwright/test';
import { When, Then } from '@/steps/fixtures.steps';
import { ApiTestDataFactory, UrlFactory } from '@/test-data/factories';

When(
  'I send a PUT request to postman-echo with an order payload',
  async ({ request, apiContext }) => {
    const payload = ApiTestDataFactory.orderPayload();
    const response = await request.put(UrlFactory.postmanEchoPut(), { data: payload });
    apiContext.response = { status: response.status(), body: await response.json() };
  },
);

Then('the PUT response should echo back the order data', async ({ apiContext }) => {
  expect(apiContext.response.body.data).toBeDefined();
  expect(apiContext.response.body.data).toHaveProperty('orderId', 12345);
  expect(apiContext.response.body.data).toHaveProperty('status', 'COMPLETED');
});

When(
  'I send a DELETE request to postman-echo with a resource payload',
  async ({ request, apiContext }) => {
    const payload = { resourceId: 999, action: 'delete' };
    const response = await request.delete(UrlFactory.postmanEchoDelete(), {
      data: payload,
    });
    apiContext.response = { status: response.status(), body: await response.json() };
  },
);

Then('the DELETE response should echo back the resource data', async ({ apiContext }) => {
  expect(apiContext.response.body.data).toBeDefined();
  expect(apiContext.response.body.data).toHaveProperty('resourceId', 999);
  expect(apiContext.response.body.data).toHaveProperty('action', 'delete');
});
