Feature: Browse Burgers
  As a customer
  I want to browse available burgers
  So that I can decide what to order

  Background:
    Given I open the app

  Scenario: View the burger menu on homepage
    Then I should see the burger menu
    And I should see at least 1 burger card

  Scenario: View burger category filters
    Then I should see a category filter
    And I should see the "All" filter option

  Scenario: Filter burgers by Beef category
    When I filter burgers by "Beef"
    Then I should see only "Beef" burgers

  Scenario: Filter burgers by Veggie category
    When I filter burgers by "Veggie"
    Then I should see only "Veggie" burgers

  Scenario: Show all burgers after selecting All filter
    When I filter burgers by "Beef"
    And I filter burgers by "All"
    Then I should see at least 3 burger cards

  Scenario: Search burgers by name
    When I type "Veggie" in the search box
    Then I should see burger cards matching "Veggie"

  Scenario: Empty search shows no results message
    When I type "xyznotexistent999" in the search box
    Then I should see no burgers found message
