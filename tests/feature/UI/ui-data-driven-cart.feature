Feature: Data-Driven Cart Additions

  Scenario Outline: Add a product to the cart from the data-driven Examples table
    Given I am on the inventory page
    When I add the <product> to the cart
    Then the cart badge should show 1 item
    And every product in the canonical product list is visible on the inventory page

    Examples:
      | product                              |
      | sauce-labs-backpack                  |
      | sauce-labs-bike-light                |
      | sauce-labs-bolt-t-shirt              |
      | sauce-labs-fleece-jacket             |
      | sauce-labs-onesie                    |
      | test.allthethings()-t-shirt-(red)    |
