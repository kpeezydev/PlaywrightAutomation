import { APIRequestContext } from '@playwright/test';
import { TestLogger } from '@/utils/logger';

type ApiRequestOptions = {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  data?: unknown;
  params?: Record<string, string | number | undefined>;
};

type ApiResponseStore = { status: number; body?: unknown };

async function apiRequest(
  request: APIRequestContext,
  apiContext: { response: ApiResponseStore },
  testInfo: { title: string },
  options: ApiRequestOptions,
): Promise<ApiResponseStore> {
  const log = TestLogger.forTest(testInfo.title);
  const { method, url, data, params } = options;

  log.request(method, url, data as Record<string, unknown>);

  const response = await request.fetch(url, {
    method,
    ...(data !== undefined && { data }),
    ...(params !== undefined && { params }),
  });

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    body = undefined;
  }

  log.response(response.status(), body as Record<string, unknown>);
  apiContext.response = { status: response.status(), body };

  return apiContext.response;
}

export { apiRequest };
export type { ApiRequestOptions, ApiResponseStore };
