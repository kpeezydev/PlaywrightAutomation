import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from './bdd-test';
import { ApiTestDataFactory, UrlFactory } from '@/test-data/factories';
import { TestLogger } from '@/utils/logger';

const { When, Then } = createBdd(test);

When(
  'I send a GET request to {string} with params limit={int}',
  async ({ request, apiWorld }, _path: string, limit: number) => {
    const log = TestLogger.forTest('API CRUD');
    log.request('GET', UrlFactory.dummyJsonProducts(), { params: { limit } });
    apiWorld.response = await request.get(UrlFactory.dummyJsonProducts(), { params: { limit } });
    apiWorld.body = await apiWorld.response.json();
    log.response(apiWorld.response.status(), apiWorld.body);
  },
);

When(
  'I send a GET request to {string}',
  async ({ request, apiWorld }, path: string) => {
    const log = TestLogger.forTest('API CRUD');
    const url = path.startsWith('http') ? path : `https://dummyjson.com${path}`;
    log.request('GET', url);
    apiWorld.response = await request.get(url);
    apiWorld.body = await apiWorld.response.json();
    log.response(apiWorld.response.status(), apiWorld.body);
  },
);

When(
  'I send a POST request to {string} with title {string}, price {float}, description {string}, and category {string}',
  async ({ request, apiWorld }, _path: string, title: string, price: number, description: string, category: string) => {
    const payload = { title, price, description, category };
    const log = TestLogger.forTest('API CRUD');
    log.request('POST', UrlFactory.dummyJsonProductsAdd(), payload);
    apiWorld.response = await request.post(UrlFactory.dummyJsonProductsAdd(), { data: payload });
    apiWorld.body = await apiWorld.response.json();
    log.response(apiWorld.response.status(), apiWorld.body);
  },
);

When(
  'I send a PUT request to {string} with title {string} and price {float}',
  async ({ request, apiWorld }, path: string, title: string, price: number) => {
    const payload = { title, price };
    const url = path.startsWith('http') ? path : `https://dummyjson.com${path}`;
    const log = TestLogger.forTest('API CRUD');
    log.request('PUT', url, payload);
    apiWorld.response = await request.put(url, { data: payload });
    apiWorld.body = await apiWorld.response.json();
    log.response(apiWorld.response.status(), apiWorld.body);
  },
);

When(
  'I send a DELETE request to {string}',
  async ({ request, apiWorld }, path: string) => {
    const url = path.startsWith('http') ? path : `https://dummyjson.com${path}`;
    const log = TestLogger.forTest('API CRUD');
    log.request('DELETE', url);
    apiWorld.response = await request.delete(url);
    apiWorld.body = await apiWorld.response.json();
    log.response(apiWorld.response.status(), apiWorld.body);
  },
);

Then(
  'the response should contain a products array with {int} items',
  async ({ apiWorld }, expectedCount: number) => {
    expect(apiWorld.body).toBeDefined();
    expect(apiWorld.body!.products).toBeDefined();
    expect(Array.isArray(apiWorld.body!.products)).toBe(true);
    expect(apiWorld.body!.products).toHaveLength(expectedCount);
    expect(apiWorld.body!.total).toBeGreaterThan(0);
  },
);

Then(
  'the response should contain product with id {int}',
  async ({ apiWorld }, id: number) => {
    expect(apiWorld.body).toBeDefined();
    expect(apiWorld.body!.id).toBe(id);
  },
);

Then('the response should include title, price, and category', async ({ apiWorld }) => {
  expect(apiWorld.body!.title).toBeDefined();
  expect(apiWorld.body!.price).toBeDefined();
  expect(apiWorld.body!.category).toBeDefined();
});

Then(
  'the response should contain the created product with title {string} and price {float}',
  async ({ apiWorld }, title: string, price: number) => {
    expect(apiWorld.body).toBeDefined();
    expect(apiWorld.body!.id).toBeDefined();
    expect(apiWorld.body!.title).toBe(title);
    expect(apiWorld.body!.price).toBe(price);
  },
);

Then(
  'the response should contain the updated product with title {string} and price {float}',
  async ({ apiWorld }, title: string, price: number) => {
    expect(apiWorld.body).toBeDefined();
    expect(apiWorld.body!.id).toBe(1);
    expect(apiWorld.body!.title).toBe(title);
    expect(apiWorld.body!.price).toBe(price);
  },
);

Then('the response should confirm the product is deleted', async ({ apiWorld }) => {
  expect(apiWorld.body).toBeDefined();
  expect(apiWorld.body!.id).toBe(1);
  expect(apiWorld.body!.isDeleted).toBe(true);
  expect(apiWorld.body!.deletedOn).toBeDefined();
});
