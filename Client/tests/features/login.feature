Feature: User Login
  As a MedTrack user
  I want to log into my health dashboard
  So that I can manage my medical schedule

  Scenario: Successful login leads to Dashboard
    Given I am on the MedTrack login page
    When I fill in "Username" with "health_user"
    And I fill in "Password" with "securePassword123"
    And I click the "Log In" button
    Then I should see the loading spinner
    And I should eventually be redirected to the dashboard

  Scenario: Failed login shows error message
    Given I am on the MedTrack login page
    When I fill in "Username" with "wrong_user"
    And I fill in "Password" with "wrong_pass"
    And I click the "Log In" button
    Then I should see an error message "Invalid username or password."