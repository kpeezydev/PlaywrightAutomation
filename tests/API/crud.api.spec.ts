import { test, expect } from '@playwright/test';
import { ApiTestDataFactory, UrlFactory } from '@/test-data/factories';

test.describe('API CRUD operations on dummyjson products', () => {
  test('GET - should fetch all products', async ({ request }) => {
    const response = await request.get(UrlFactory.dummyJsonProducts(), {
      params: { limit: 5 },
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.products).toBeDefined();
    expect(Array.isArray(body.products)).toBe(true);
    expect(body.products.length).toBe(5);
    expect(body.total).toBeGreaterThan(0);
  });

  test('GET - should fetch a single product by ID', async ({ request }) => {
    const response = await request.get(UrlFactory.dummyJsonProduct(1));

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.id).toBe(1);
    expect(body.title).toBeDefined();
    expect(body.price).toBeDefined();
    expect(body.category).toBeDefined();
  });

  test('GET - should return 404 for a non-existent product', async ({ request }) => {
    const response = await request.get(UrlFactory.dummyJsonProduct(99999));

    expect(response.status()).toBe(404);
    expect(response.ok()).toBeFalsy();
  });

  test('POST - should create a new product', async ({ request }) => {
    const payload = ApiTestDataFactory.productPayload('CRUD Test Product', 15.99);
    const response = await request.post(UrlFactory.dummyJsonProductsAdd(), {
      data: payload,
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body.id).toBeDefined();
    expect(body.title).toBe('CRUD Test Product');
    expect(body.price).toBe(15.99);
    expect(body.description).toBe('A sample product for API testing.');
  });

  test('PUT - should update an existing product', async ({ request }) => {
    const updatePayload = {
      title: 'Updated Product Title',
      price: 49.99,
    };
    const response = await request.put(UrlFactory.dummyJsonProduct(1), {
      data: updatePayload,
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.id).toBe(1);
    expect(body.title).toBe('Updated Product Title');
    expect(body.price).toBe(49.99);
  });

  test('DELETE - should delete a product', async ({ request }) => {
    const response = await request.delete(UrlFactory.dummyJsonProduct(1));

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.id).toBe(1);
    expect(body.isDeleted).toBe(true);
    expect(body.deletedOn).toBeDefined();
  });
});
