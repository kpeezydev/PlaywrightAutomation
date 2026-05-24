import { APIRequestContext } from '@playwright/test';

export class ApiClient {
  constructor(private request: APIRequestContext) {}

  /**
   * Example wrapper method for making API requests.
   * Playwright's request context can be passed here to create test data,
   * verify database states via internal APIs, etc.
   */
  async get(endpoint: string) {
    const response = await this.request.get(endpoint);
    return response.json();
  }

  async post(endpoint: string, data: any) {
    const response = await this.request.post(endpoint, {
      data,
    });
    return response.json();
  }

  async put(endpoint: string, data: any) {
    const response = await this.request.put(endpoint, {
      data,
    });
    return response.json();
  }

  async delete(endpoint: string, data: any = {}) {
    const response = await this.request.delete(endpoint, {
      data,
    });
    return response.json();
  }
}
