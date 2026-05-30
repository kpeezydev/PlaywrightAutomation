import { APIRequestContext } from '@playwright/test';
import { TestLogger } from './logger';

export class ApiClient {
  constructor(private request: APIRequestContext) {}

  async get(endpoint: string) {
    TestLogger.request('GET', endpoint);
    const response = await this.request.get(endpoint);
    const body = await response.json();
    TestLogger.response(response.status(), body);
    return body;
  }

  async post(endpoint: string, data: any) {
    TestLogger.request('POST', endpoint, data);
    const response = await this.request.post(endpoint, { data });
    const body = await response.json();
    TestLogger.response(response.status(), body);
    return body;
  }

  async put(endpoint: string, data: any) {
    TestLogger.request('PUT', endpoint, data);
    const response = await this.request.put(endpoint, { data });
    const body = await response.json();
    TestLogger.response(response.status(), body);
    return body;
  }

  async delete(endpoint: string, data: any = {}) {
    TestLogger.request('DELETE', endpoint, data);
    const response = await this.request.delete(endpoint, { data });
    const body = await response.json();
    TestLogger.response(response.status(), body);
    return body;
  }
}
