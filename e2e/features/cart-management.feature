Feature: Cart Management
  As a customer
  I want to manage my shopping cart
  So that I can review and adjust my order

  Background:
    Given I open the app

  Scenario: Add a burger to the cart
    When I click the add button on the first burger
    And I confirm adding the burger
    Then the cart icon should show 1 item

  Scenario: Open the cart drawer
    When I click the cart icon
    Then I should see the cart drawer

  Scenario: Cart is empty by default
    When I click the cart icon
    Then the cart should be empty

  Scenario: View cart total after adding
    When I click the add button on the first burger
    And I confirm adding the burger
    And I click the cart icon
    Then I should see a price total in the cart
