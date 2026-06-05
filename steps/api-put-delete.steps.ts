import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from './bdd-test';
import { TestLogger } from '@/utils/logger';

const { When, Then } = createBdd(test);

When(
  'I send a PUT request to {string} with orderId {int} and status {string}',
  async ({ request, apiWorld }, url: string, orderId: number, status: string) => {
    const payload = { orderId, status };
    const log = TestLogger.forTest('API PUT/DELETE');
    log.request('PUT', url, payload);
    apiWorld.response = await request.put(url, { data: payload });
    apiWorld.body = await apiWorld.response.json();
    log.response(apiWorld.response.status(), apiWorld.body);
  },
);

When(
  'I send a DELETE request to {string} with resourceId {int} and action {string}',
  async ({ request, apiWorld }, url: string, resourceId: number, action: string) => {
    const payload = { resourceId, action };
    const log = TestLogger.forTest('API PUT/DELETE');
    log.request('DELETE', url, payload);
    apiWorld.response = await request.delete(url, { data: payload });
    apiWorld.body = await apiWorld.response.json();
    log.response(apiWorld.response.status(), apiWorld.body);
  },
);

Then(
  'the echoed data should contain orderId {int} and status {string}',
  async ({ apiWorld }, orderId: number, status: string) => {
    expect(apiWorld.body).toBeDefined();
    expect(apiWorld.body!.data).toBeDefined();
    expect(apiWorld.body!.data.orderId).toBe(orderId);
    expect(apiWorld.body!.data.status).toBe(status);
  },
);

Then(
  'the echoed data should contain resourceId {int} and action {string}',
  async ({ apiWorld }, resourceId: number, action: string) => {
    expect(apiWorld.body).toBeDefined();
    expect(apiWorld.body!.data).toBeDefined();
    expect(apiWorld.body!.data.resourceId).toBe(resourceId);
    expect(apiWorld.body!.data.action).toBe(action);
  },
);
