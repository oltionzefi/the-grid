Feature: Recipes
  As a customer
  I want to browse burger recipes
  So that I can learn how to make them at home

  Background:
    Given I navigate to the recipes page

  Scenario: View the recipe page heading
    Then I should see the "Recipes" heading

  Scenario: Featured recipe hero is displayed
    Then I should see the featured hero card
    And I should see the "Chef's Pick" label

  Scenario: Recipe cards are displayed in the grid
    Then I should see at least 3 recipe cards

  Scenario: Difficulty badges are visible on cards
    Then I should see difficulty badges on recipe cards
    And each difficulty badge should show one of "Easy", "Medium", or "Hard"

  Scenario: Easy difficulty badge is green
    Then the "Easy" difficulty badge should be visually distinct

  Scenario: Hard difficulty badge is red
    Then the "Hard" difficulty badge should be visually distinct

  Scenario: Category tabs are displayed
    Then I should see the category tabs
    And I should see the "All" tab
    And I should see the "Beef" tab
    And I should see the "Chicken" tab
    And I should see the "Vegan" tab

  Scenario: Category filter shows relevant recipes
    When I click the "Beef" category tab
    Then I should see at least 1 recipe card

  Scenario: Clicking a recipe card opens the drawer
    When I click the first recipe card
    Then the recipe drawer should be open
    And I should see the "Ingredients" section
    And I should see the "Steps" section

  Scenario: Recipe drawer shows difficulty badge
    When I click the first recipe card
    Then the recipe drawer should contain a difficulty badge

  Scenario: Recipe drawer can be closed
    When I click the first recipe card
    Then the recipe drawer should be open
    When I close the recipe drawer
    Then the recipe drawer should be closed

  Scenario: Total time is shown on cards
    Then I should see time indicators on recipe cards
