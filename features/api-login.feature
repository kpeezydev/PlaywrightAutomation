Feature: API Login
  As an API consumer of dummyjson.com
  I want to authenticate via the login endpoint
  So that I can obtain an access token

  Scenario: Authenticate with valid credentials
    When I send a POST request to "/auth/login" with username "emilys" and password "emilyspass"
    Then the response status should be 200
    And the response should contain an access token

  Scenario: Authenticate with invalid password
    When I send a POST request to "/auth/login" with username "emilys" and password "wrongpassword"
    Then the response status should be 400
    And the response error message should be "Invalid credentials"
