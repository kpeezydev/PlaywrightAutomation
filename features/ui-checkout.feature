Feature: UI Checkout
  As an authenticated user of saucedemo.com
  I want to complete a purchase
  So that I can order products

  Background:
    Given I am authenticated on saucedemo.com

  Scenario: Complete checkout successfully
    When I add "Sauce Labs Backpack" to the cart
    And I navigate to the cart and proceed to checkout
    And I fill checkout information with first name "John", last name "Doe", and postal code "12345"
    And I continue to checkout overview
    And I finish the checkout
    Then I should see the order completion message "Thank you for your order!"
