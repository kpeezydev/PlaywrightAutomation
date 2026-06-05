Feature: UI Login
  As a user of saucedemo.com
  I want to log in to the application
  So that I can access the inventory

  Background:
    Given I am on the login page

  Scenario: Successful login with valid credentials
    When I enter username "standard_user" and password "secret_sauce"
    And I click on the login button
    Then I should be redirected to the inventory page

  Scenario: Locked-out user sees error message
    When I enter username "locked_out_user" and password "secret_sauce"
    And I click on the login button
    Then I should see an error message containing "Sorry, this user has been locked out."
