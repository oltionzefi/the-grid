Feature: Custom Burger Builder
  As a customer
  I want to build my own custom burger
  So that I can get exactly the burger I want

  Background:
    Given I open the app

  Scenario: Navigate to the burger builder page
    When I click the "Build Your Own Burger" button
    Then I should be on the burger builder page
    And I should see the ingredient picker

  Scenario: Ingredient picker shows categories
    When I click the "Build Your Own Burger" button
    Then I should see the "Bun" category tab
    And I should see the "Patty" category tab

  Scenario: Select a bun ingredient
    When I click the "Build Your Own Burger" button
    And I select a bun ingredient
    Then the burger board should show a bun layer

  Scenario: Select a patty ingredient
    When I click the "Build Your Own Burger" button
    And I switch to the "Patty" tab
    And I select a patty ingredient
    Then the burger board should show the added ingredient

  Scenario: Price updates when adding ingredients
    When I click the "Build Your Own Burger" button
    And I select a bun ingredient
    Then I should see a price greater than 0
