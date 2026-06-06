Feature: Product Checkout API

  Scenario: Add products to cart via API
    When I add products to cart via the dummyjson API
    Then the cart response should contain correct product totals

  Scenario: Simulate order completion via API
    When I send an order completion request to postman-echo
    Then the order response should echo back the order details
