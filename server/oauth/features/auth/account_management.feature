Feature: Account Management
  As an authenticated user
  I want to manage my account
  So that I can control my data

  Background:
    Given a user exists with:
      | username | email | password |
      | testuser | test@example.com | TestPass123! |
    And I am authenticated as "testuser"

  Scenario: Verify email successfully
    When I send a POST request to "/api/auth/verify-email/"
    Then the response status code should be 200
    And the response should contain "message" equal to "Email verified successfully"
    And the user "testuser" should have is_email_verified "True"

  Scenario: Verify phone successfully
    When I send a POST request to "/api/auth/verify-phone/"
    Then the response status code should be 200
    And the response should contain "message" equal to "Phone verified successfully"
    And the user "testuser" should have is_phone_verified "True"

  Scenario: Delete account with correct password
    When I send a DELETE request to "/api/auth/delete-account/" with body:
      """
      {
        "password": "TestPass123!"
      }
      """
    Then the response status code should be 200
    And the response should contain "message" equal to "Account deleted successfully"
    And no user should exist with username "testuser"

  Scenario: Delete account with wrong password
    When I send a DELETE request to "/api/auth/delete-account/" with body:
      """
      {
        "password": "WrongPass123!"
      }
      """
    Then the response status code should be 400
    And the response should contain error "Invalid password"
    And a user should exist with username "testuser"

  Scenario: Delete account without password
    When I send a DELETE request to "/api/auth/delete-account/"
    Then the response status code should be 400
    And a user should exist with username "testuser"