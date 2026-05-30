import { test, expect } from '@playwright/test';
import { ApiTestDataFactory, UrlFactory } from '@/test-data/factories';
import { TestLogger } from '@/utils/logger';

test.describe('API CRUD operations on dummyjson products', () => {
  test('GET - should fetch all products', async ({ request }, testInfo) => {
    const log = TestLogger.forTest(testInfo.title);
    log.request('GET', UrlFactory.dummyJsonProducts(), { params: { limit: 5 } });
    const response = await request.get(UrlFactory.dummyJsonProducts(), {
      params: { limit: 5 },
    });

    const body = await response.json();
    log.response(response.status(), body);

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    expect(body.products).toBeDefined();
    expect(Array.isArray(body.products)).toBe(true);
    expect(body.products.length).toBe(5);
    expect(body.total).toBeGreaterThan(0);
  });

  test('GET - should fetch a single product by ID', async ({ request }, testInfo) => {
    const log = TestLogger.forTest(testInfo.title);
    log.request('GET', UrlFactory.dummyJsonProduct(1));
    const response = await request.get(UrlFactory.dummyJsonProduct(1));

    const body = await response.json();
    log.response(response.status(), body);

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    expect(body.id).toBe(1);
    expect(body.title).toBeDefined();
    expect(body.price).toBeDefined();
    expect(body.category).toBeDefined();
  });

  test('GET - should return 404 for a non-existent product', async ({ request }, testInfo) => {
    const log = TestLogger.forTest(testInfo.title);
    log.request('GET', UrlFactory.dummyJsonProduct(99999));
    const response = await request.get(UrlFactory.dummyJsonProduct(99999));

    log.response(response.status());

    expect(response.status()).toBe(404);
    expect(response.ok()).toBeFalsy();
  });

  test('POST - should create a new product', async ({ request }, testInfo) => {
    const log = TestLogger.forTest(testInfo.title);
    log.step('building product payload');
    const payload = ApiTestDataFactory.productPayload('CRUD Test Product', 15.99);

    log.request('POST', UrlFactory.dummyJsonProductsAdd(), payload);
    const response = await request.post(UrlFactory.dummyJsonProductsAdd(), {
      data: payload,
    });

    const body = await response.json();
    log.response(response.status(), body);

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(201);
    expect(body.id).toBeDefined();
    expect(body.title).toBe('CRUD Test Product');
    expect(body.price).toBe(15.99);
    expect(body.description).toBe('A sample product for API testing.');
  });

  test('PUT - should update an existing product', async ({ request }, testInfo) => {
    const log = TestLogger.forTest(testInfo.title);
    log.step('building update payload');
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

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    expect(body.id).toBe(1);
    expect(body.title).toBe('Updated Product Title');
    expect(body.price).toBe(49.99);
  });

  test('DELETE - should delete a product', async ({ request }, testInfo) => {
    const log = TestLogger.forTest(testInfo.title);
    log.request('DELETE', UrlFactory.dummyJsonProduct(1));
    const response = await request.delete(UrlFactory.dummyJsonProduct(1));

    const body = await response.json();
    log.response(response.status(), body);

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    expect(body.id).toBe(1);
    expect(body.isDeleted).toBe(true);
    expect(body.deletedOn).toBeDefined();
  });
});
