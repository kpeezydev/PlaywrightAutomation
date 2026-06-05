Feature: API Checkout
  As an API consumer of dummyjson.com
  I want to simulate checkout operations
  So that I can test order workflows

  Scenario: Add products to cart
    When I send a POST request to add to cart for user 1 with 2 products
    Then the response status should be 201
    And the cart should contain 2 products with total quantity 3

  Scenario: Simulate order completion
    When I send a POST request to "https://postman-echo.com/post" with orderId 12345 and status "COMPLETED"
    Then the response status should be 200
    And the response should reflect the order with id 12345 and status "COMPLETED"
