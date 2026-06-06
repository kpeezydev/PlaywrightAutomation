Feature: User Login API

  Scenario: Successful API authentication
    When I authenticate via API with valid credentials
    Then the API authentication response should be valid

  Scenario: API authentication failure with invalid credentials
    When I authenticate via API with invalid credentials
    Then the API authentication response should indicate an error
