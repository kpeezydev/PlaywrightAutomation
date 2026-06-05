Feature: API CRUD Operations
  As an API consumer of dummyjson.com
  I want to perform CRUD operations on products
  So that I can manage product data

  Scenario: Fetch all products with limit
    When I send a GET request to "/products" with params limit=5
    Then the response status should be 200
    And the response should contain a products array with 5 items

  Scenario: Fetch a single product by ID
    When I send a GET request to "/products/1"
    Then the response status should be 200
    And the response should contain product with id 1
    And the response should include title, price, and category

  Scenario: Return 404 for non-existent product
    When I send a GET request to "/products/99999"
    Then the response status should be 404

  Scenario: Create a new product
    When I send a POST request to "/products/add" with title "CRUD Test Product", price 15.99, description "A sample product for API testing.", and category "test-category"
    Then the response status should be 201
    And the response should contain the created product with title "CRUD Test Product" and price 15.99

  Scenario: Update an existing product
    When I send a PUT request to "/products/1" with title "Updated Product Title" and price 49.99
    Then the response status should be 200
    And the response should contain the updated product with title "Updated Product Title" and price 49.99

  Scenario: Delete a product
    When I send a DELETE request to "/products/1"
    Then the response status should be 200
    And the response should confirm the product is deleted
