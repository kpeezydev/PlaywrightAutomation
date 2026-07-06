Feature: Multi-Product Checkout UI

  Scenario: Order multiple products, check out, and log out
    Given I am authenticated on saucedemo
    When I add the following products to the cart: "sauce-labs-backpack, sauce-labs-bike-light"
    And I proceed to checkout
    And I fill in checkout information
    And I complete the order
    Then I should see the order confirmation message
    When I log out
    Then I should be redirected to the login page
