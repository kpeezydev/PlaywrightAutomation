Feature: Product CRUD API

  Scenario: Fetch all products
    When I request all products from the dummyjson API
    Then I should receive a list of products limited to 5 items

  Scenario: Fetch a single product by ID
    When I request a product by ID 1 from the dummyjson API
    Then I should receive the product with ID 1

  Scenario: Fetch a non-existent product returns 404
    When I request a non-existent product with ID 99999 from the dummyjson API
    Then I should receive a 404 status code

  Scenario: Create a new product
    When I create a new product via the dummyjson API
    Then the creation response should contain the new product ID

  Scenario: Update an existing product
    When I update a product with ID 1 via the dummyjson API
    Then the update response should contain the updated product details

  Scenario: Delete a product
    When I delete a product with ID 1 via the dummyjson API
    Then the deletion response should confirm the product was deleted
