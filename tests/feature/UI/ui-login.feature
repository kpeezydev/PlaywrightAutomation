Feature: User Login UI

  Scenario: Successful login with valid credentials
    Given I am on the login page
    When I enter valid credentials
    Then I should be redirected to the inventory page

  Scenario: Login failure with locked-out user
    Given I am on the login page
    When I enter locked-out user credentials
    Then I should see an error message indicating the user has been locked out
