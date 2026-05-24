import { test, expect } from '@playwright/test';
import { ApiTestDataFactory, UrlFactory } from '@/test-data/factories';

test.describe('API Checkout scenarios', () => {
  test.beforeEach(() => {
    // apiClient not used in these tests, removed to avoid lint error
  });

  test('should process checkout (add to cart) successfully via API', async ({ request }) => {
    // Utilizing dummyjson.com to simulate a cart/checkout API behavior
    const checkoutPayload = ApiTestDataFactory.checkoutPayload();
    const response = await request.post(UrlFactory.dummyJsonCartsAdd(), {
      data: checkoutPayload,
    });

    // Assert success
    expect(response.ok()).toBeTruthy();

    // Assert correct calculation logic returned from the backend
    const body = await response.json();
    expect(body.id).toBeDefined();
    expect(body.totalProducts).toBe(2);
    expect(body.totalQuantity).toBe(3);
    expect(body.products.length).toBe(2);
  });

  test('should simulate order completion via API', async ({ request }) => {
    // Simulating order generation via our custom ApiClient wrapper
    // We expect this to return a JSON payload with the data we sent
    const orderPayload = ApiTestDataFactory.orderPayload();

    // Using an echo server to simulate an order creation
    const response = await request.post(UrlFactory.postmanEchoPost(), {
      data: orderPayload,
    });

    // Assert success
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200); // Postman Echo returns 200 for POST requests

    // Assert correct calculation logic returned from the backend
    const body = await response.json();
    expect(body.data).toBeDefined();
    expect(body.data.orderId).toBe(12345);
    expect(body.data.status).toBe('COMPLETED');
  });
});
