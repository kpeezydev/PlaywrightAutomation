// Test Data Factories
import { TEST_USERS, TEST_DATA, URLS } from './constants';

/**
 * Factory for generating user credentials
 */
export class UserFactory {
  static validUser() {
    return { ...TEST_USERS.VALID };
  }

  static lockedOutUser() {
    return { ...TEST_USERS.LOCKED_OUT };
  }

  static customUser(username: string, password: string) {
    return { username, password };
  }
}

/**
 * Factory for generating checkout information
 */
export class CheckoutDataFactory {
  static defaultCheckout() {
    return { ...TEST_DATA.CHECKOUT };
  }

  static alternativeCheckout() {
    return { ...TEST_DATA.SHIPPING };
  }

  static customCheckout(firstName: string, lastName: string, postalCode: string) {
    return { firstName, lastName, postalCode };
  }
}

/**
 * Factory for API test data
 */
export class ApiTestDataFactory {
  static loginPayload(user: { username: string; password: string }) {
    return {
      username: user.username,
      password: user.password,
    };
  }

  static checkoutPayload(
    userId: number = 1,
    products: { id: number; quantity: number }[] = [
      { id: 1, quantity: 2 },
      { id: 2, quantity: 1 },
    ],
  ) {
    return {
      userId,
      products,
    };
  }

  static orderPayload(orderId: number = 12345, status: string = 'COMPLETED') {
    return {
      orderId,
      status,
    };
  }

  static productPayload(title?: string, price?: number) {
    return {
      title: title ?? 'Test Product',
      price: price ?? 29.99,
      description: 'A sample product for API testing.',
      category: 'test-category',
    };
  }
}

/**
 * URL factory
 */
export class UrlFactory {
  static baseUrl() {
    return URLS.BASE_URL;
  }

  static dummyJsonLogin() {
    return URLS.DUMMY_JSON_LOGIN;
  }

  static dummyJsonCartsAdd() {
    return URLS.DUMMY_JSON_CARTS_ADD;
  }

  static postmanEchoPost() {
    return URLS.POSTMAN_ECHO_POST;
  }

  static postmanEchoPut() {
    return URLS.POSTMAN_ECHO_PUT;
  }

  static postmanEchoDelete() {
    return URLS.POSTMAN_ECHO_DELETE;
  }

  static dummyJsonProducts() {
    return URLS.DUMMY_JSON_PRODUCTS;
  }

  static dummyJsonProduct(id: number) {
    return URLS.DUMMY_JSON_PRODUCT(id);
  }

  static dummyJsonProductsAdd() {
    return URLS.DUMMY_JSON_PRODUCTS_ADD;
  }
}
