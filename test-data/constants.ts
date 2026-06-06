// Test Data Constants
export const TEST_USERS = {
  VALID: {
    username: 'standard_user',
    password: 'secret_sauce',
  },
  LOCKED_OUT: {
    username: 'locked_out_user',
    password: 'secret_sauce',
  },
};

export const API_TEST_USERS = {
  VALID: {
    username: 'emilys',
    password: 'emilyspass',
  },
};

export const TEST_DATA = {
  CHECKOUT: {
    firstName: 'John',
    lastName: 'Doe',
    postalCode: '12345',
  },
  SHIPPING: {
    firstName: 'Jane',
    lastName: 'Smith',
    postalCode: '54321',
  },
};

export const URLS = {
  BASE_URL: 'https://www.saucedemo.com',
  DUMMY_JSON_LOGIN: 'https://dummyjson.com/auth/login',
  DUMMY_JSON_CARTS_ADD: 'https://dummyjson.com/carts/add',
  POSTMAN_ECHO_POST: 'https://postman-echo.com/post',
  POSTMAN_ECHO_PUT: 'https://postman-echo.com/put',
  POSTMAN_ECHO_DELETE: 'https://postman-echo.com/delete',
  DUMMY_JSON_PRODUCTS: 'https://dummyjson.com/products',
  DUMMY_JSON_PRODUCT: (id: number) => `https://dummyjson.com/products/${id}`,
  DUMMY_JSON_PRODUCTS_ADD: 'https://dummyjson.com/products/add',
};

export const SAUCE_PRODUCTS: readonly string[] = [
  'sauce-labs-backpack',
  'sauce-labs-bike-light',
  'sauce-labs-bolt-t-shirt',
  'sauce-labs-fleece-jacket',
  'sauce-labs-onesie',
  'test.allthethings()-t-shirt-(red)',
];
