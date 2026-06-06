Feature: API PUT and DELETE

  Scenario: Send PUT request with order payload
    When I send a PUT request to postman-echo with an order payload
    Then the PUT response should echo back the order data

  Scenario: Send DELETE request with resource payload
    When I send a DELETE request to postman-echo with a resource payload
    Then the DELETE response should echo back the resource data
