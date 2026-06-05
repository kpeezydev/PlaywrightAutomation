import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from './bdd-test';
import { ApiTestDataFactory, UrlFactory } from '@/test-data/factories';
import { TestLogger } from '@/utils/logger';

const { When, Then } = createBdd(test);

When(
  'I send a POST request to add to cart for user {int} with {int} products',
  async ({ request, apiWorld }, userId: number, productCount: number) => {
    const products = Array.from({ length: productCount }, (_, i) => ({
      id: i + 1,
      quantity: i === 0 ? 2 : 1,
    }));
    const payload = ApiTestDataFactory.checkoutPayload(userId, products);
    const log = TestLogger.forTest('API Checkout');
    log.request('POST', UrlFactory.dummyJsonCartsAdd(), payload);
    apiWorld.response = await request.post(UrlFactory.dummyJsonCartsAdd(), { data: payload });
    apiWorld.body = await apiWorld.response.json();
    log.response(apiWorld.response.status(), apiWorld.body);
  },
);

When(
  'I send a POST request to {string} with orderId {int} and status {string}',
  async ({ request, apiWorld }, url: string, orderId: number, status: string) => {
    const payload = ApiTestDataFactory.orderPayload(orderId, status);
    const log = TestLogger.forTest('API Checkout');
    log.request('POST', url, payload);
    apiWorld.response = await request.post(url, { data: payload });
    apiWorld.body = await apiWorld.response.json();
    log.response(apiWorld.response.status(), apiWorld.body);
  },
);

Then(
  'the cart should contain {int} products with total quantity {int}',
  async ({ apiWorld }, totalProducts: number, totalQuantity: number) => {
    expect(apiWorld.body).toBeDefined();
    expect(apiWorld.body!.id).toBeDefined();
    expect(apiWorld.body!.totalProducts).toBe(totalProducts);
    expect(apiWorld.body!.totalQuantity).toBe(totalQuantity);
    expect(apiWorld.body!.products.length).toBe(totalProducts);
  },
);

Then(
  'the response should reflect the order with id {int} and status {string}',
  async ({ apiWorld }, orderId: number, status: string) => {
    expect(apiWorld.body).toBeDefined();
    expect(apiWorld.body!.data).toBeDefined();
    expect(apiWorld.body!.data.orderId).toBe(orderId);
    expect(apiWorld.body!.data.status).toBe(status);
  },
);
