Feature: Admin Panel
  As a store administrator
  I want to access and manage the admin panel
  So that I can configure the store

  Background:
    Given I open the app

  Scenario: Access admin panel via menu
    When I open the dropdown menu
    And I click "Admin" in the menu
    Then I should see the admin PIN screen

  Scenario: Enter correct PIN unlocks admin
    When I open the dropdown menu
    And I click "Admin" in the menu
    And I enter the admin PIN "1234"
    Then I should see the admin dashboard

  Scenario: Entering wrong PIN shows error
    When I open the dropdown menu
    And I click "Admin" in the menu
    And I enter the admin PIN "0000"
    Then I should see an admin PIN error

  Scenario: Admin dashboard shows section navigation
    When I open the dropdown menu
    And I click "Admin" in the menu
    And I enter the admin PIN "1234"
    Then I should see the admin sidebar with "Burgers"
    And I should see the admin sidebar with "Locations"

  Scenario: Navigate to Burgers section in admin
    When I open the dropdown menu
    And I click "Admin" in the menu
    And I enter the admin PIN "1234"
    And I click "Burgers" in the admin sidebar
    Then I should see the burgers admin table

  Scenario: Navigate to Store section in admin
    When I open the dropdown menu
    And I click "Admin" in the menu
    And I enter the admin PIN "1234"
    And I click "Store" in the admin sidebar
    Then I should see the store configuration form
