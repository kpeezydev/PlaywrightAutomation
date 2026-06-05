Feature: API PUT and DELETE
  As an API consumer of postman-echo.com
  I want to test PUT and DELETE echo endpoints
  So that I can verify request/response integrity

  Scenario: Send PUT request and verify echo
    When I send a PUT request to "https://postman-echo.com/put" with orderId 12345 and status "COMPLETED"
    Then the response status should be 200
    And the echoed data should contain orderId 12345 and status "COMPLETED"

  Scenario: Send DELETE request and verify echo
    When I send a DELETE request to "https://postman-echo.com/delete" with resourceId 999 and action "delete"
    Then the response status should be 200
    And the echoed data should contain resourceId 999 and action "delete"
