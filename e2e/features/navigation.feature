Feature: App Navigation
  As a user
  I want to navigate between pages
  So that I can access all features of the app

  Background:
    Given I open the app

  Scenario: Navigate to the Locations page
    When I click the locations nav link
    Then I should be on the locations page
    And I should see the locations heading

  Scenario: Navigate to the Recipe page
    When I click the recipes nav link
    Then I should be on the recipe page

  Scenario: Navigate to the Settings page via menu
    When I open the dropdown menu
    And I click "Settings" in the menu
    Then I should be on the settings page

  Scenario: Navigate to the FAQ page via menu
    When I open the dropdown menu
    And I click "FAQ" in the menu
    Then I should be on the FAQ page

  Scenario: Navigate to the Account page via menu
    When I open the dropdown menu
    And I click "Account" in the menu
    Then I should be on the account page

  Scenario: Return to home from another page
    When I click the locations nav link
    And I click the home nav link
    Then I should see the burger menu
