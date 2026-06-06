import { expect } from '@playwright/test';
import { When, Then } from '@/steps/fixtures.steps';
import { ApiTestDataFactory, UrlFactory } from '@/test-data/factories';
import { TestLogger } from '@/utils/logger';

When(
  'I request all products from the dummyjson API',
  async ({ request, apiContext, $testInfo }) => {
    const log = TestLogger.forTest($testInfo.title);
    log.request('GET', UrlFactory.dummyJsonProducts());
    const response = await request.get(UrlFactory.dummyJsonProducts(), {
      params: { limit: 5 },
    });
    const body = await response.json();
    log.response(response.status(), body);
    apiContext.response = { status: response.status(), body };
  },
);

Then(
  'I should receive a list of products limited to 5 items',
  async ({ apiContext, $testInfo }) => {
    const log = TestLogger.forTest($testInfo.title);
    log.step('Verifying product list is limited to 5 items');
    expect(apiContext.response.status).toBe(200);
    expect(apiContext.response.body.products).toBeDefined();
    expect(Array.isArray(apiContext.response.body.products)).toBe(true);
    expect(apiContext.response.body.products.length).toBe(5);
    expect(apiContext.response.body.total).toBeGreaterThan(0);
  },
);

When(
  'I request a product by ID 1 from the dummyjson API',
  async ({ request, apiContext, $testInfo }) => {
    const log = TestLogger.forTest($testInfo.title);
    log.request('GET', UrlFactory.dummyJsonProduct(1));
    const response = await request.get(UrlFactory.dummyJsonProduct(1));
    const body = await response.json();
    log.response(response.status(), body);
    apiContext.response = { status: response.status(), body };
  },
);

Then('I should receive the product with ID 1', async ({ apiContext, $testInfo }) => {
  const log = TestLogger.forTest($testInfo.title);
  log.step('Verifying product response contains ID 1');
  expect(apiContext.response.status).toBe(200);
  expect(apiContext.response.body.id).toBe(1);
  expect(apiContext.response.body.title).toBeDefined();
  expect(apiContext.response.body.price).toBeDefined();
  expect(apiContext.response.body.category).toBeDefined();
});

When(
  'I request a non-existent product with ID 99999 from the dummyjson API',
  async ({ request, apiContext, $testInfo }) => {
    const log = TestLogger.forTest($testInfo.title);
    log.request('GET', UrlFactory.dummyJsonProduct(99999));
    const response = await request.get(UrlFactory.dummyJsonProduct(99999));
    log.response(response.status());
    apiContext.response = { status: response.status() };
  },
);

Then('I should receive a 404 status code', async ({ apiContext, $testInfo }) => {
  const log = TestLogger.forTest($testInfo.title);
  log.step('Verifying 404 status code for non-existent product');
  expect(apiContext.response.status).toBe(404);
});

When('I create a new product via the dummyjson API', async ({ request, apiContext, $testInfo }) => {
  const log = TestLogger.forTest($testInfo.title);
  const payload = ApiTestDataFactory.productPayload('CRUD Test Product', 15.99);
  log.request('POST', UrlFactory.dummyJsonProductsAdd(), payload);
  const response = await request.post(UrlFactory.dummyJsonProductsAdd(), {
    data: payload,
  });
  const body = await response.json();
  log.response(response.status(), body);
  apiContext.response = { status: response.status(), body };
});

Then(
  'the creation response should contain the new product ID',
  async ({ apiContext, $testInfo }) => {
    const log = TestLogger.forTest($testInfo.title);
    log.step('Verifying creation response contains new product ID');
    expect(apiContext.response.status).toBe(201);
    expect(apiContext.response.body.id).toBeDefined();
    expect(apiContext.response.body.title).toBe('CRUD Test Product');
    expect(apiContext.response.body.price).toBe(15.99);
  },
);

When(
  'I update a product with ID 1 via the dummyjson API',
  async ({ request, apiContext, $testInfo }) => {
    const log = TestLogger.forTest($testInfo.title);
    const updatePayload = {
      title: 'Updated Product Title',
      price: 49.99,
    };
    log.request('PUT', UrlFactory.dummyJsonProduct(1), updatePayload);
    const response = await request.put(UrlFactory.dummyJsonProduct(1), {
      data: updatePayload,
    });
    const body = await response.json();
    log.response(response.status(), body);
    apiContext.response = { status: response.status(), body };
  },
);

Then(
  'the update response should contain the updated product details',
  async ({ apiContext, $testInfo }) => {
    const log = TestLogger.forTest($testInfo.title);
    log.step('Verifying update response contains updated details');
    expect(apiContext.response.status).toBe(200);
    expect(apiContext.response.body.id).toBe(1);
    expect(apiContext.response.body.title).toBe('Updated Product Title');
    expect(apiContext.response.body.price).toBe(49.99);
  },
);

When(
  'I delete a product with ID 1 via the dummyjson API',
  async ({ request, apiContext, $testInfo }) => {
    const log = TestLogger.forTest($testInfo.title);
    log.request('DELETE', UrlFactory.dummyJsonProduct(1));
    const response = await request.delete(UrlFactory.dummyJsonProduct(1));
    const body = await response.json();
    log.response(response.status(), body);
    apiContext.response = { status: response.status(), body };
  },
);

Then(
  'the deletion response should confirm the product was deleted',
  async ({ apiContext, $testInfo }) => {
    const log = TestLogger.forTest($testInfo.title);
    log.step('Verifying deletion response confirms product deleted');
    expect(apiContext.response.status).toBe(200);
    expect(apiContext.response.body.id).toBe(1);
    expect(apiContext.response.body.isDeleted).toBe(true);
    expect(apiContext.response.body.deletedOn).toBeDefined();
  },
);
