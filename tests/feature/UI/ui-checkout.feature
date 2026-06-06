Feature: Product Checkout UI

  Scenario: Successful checkout completion
    Given I am authenticated on saucedemo
    When I add a product to the cart
    And I proceed to checkout
    And I fill in checkout information
    And I complete the order
    Then I should see the order confirmation message
