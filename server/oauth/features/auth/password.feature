Feature: Password Management
  As an authenticated user
  I want to change my password
  So that I can maintain account security

  Background:
    Given a user exists with:
      | username | email | password |
      | testuser | test@example.com | OldPass123! |
    And I am authenticated as "testuser"

  Scenario: Change password successfully
    When I send a POST request to "/api/auth/change-password/" with body:
      """
      {
        "old_password": "OldPass123!",
        "new_password": "NewStrongPass456!",
        "new_password2": "NewStrongPass456!"
      }
      """
    Then the response status code should be 200
    And the response should contain "message" equal to "Password changed successfully"
    And the response should contain "access"
    And the response should contain "refresh"
    And I should be able to login with username "testuser" and password "NewStrongPass456!"

  Scenario: Change password with wrong old password
    When I send a POST request to "/api/auth/change-password/" with body:
      """
      {
        "old_password": "WrongPass123!",
        "new_password": "NewStrongPass456!",
        "new_password2": "NewStrongPass456!"
      }
      """
    Then the response status code should be 400
    And the response should contain error for field "old_password"
    And the error message should be "Wrong password"

  Scenario: Change password with mismatch
    When I send a POST request to "/api/auth/change-password/" with body:
      """
      {
        "old_password": "OldPass123!",
        "new_password": "NewStrongPass456!",
        "new_password2": "DifferentPass456!"
      }
      """
    Then the response status code should be 400
    And the response should contain error for field "new_password"
    And the error message should be "Password fields must match."

  Scenario: Change password with weak new password
    When I send a POST request to "/api/auth/change-password/" with body:
      """
      {
        "old_password": "OldPass123!",
        "new_password": "weak",
        "new_password2": "weak"
      }
      """
    Then the response status code should be 400
    And the response should contain error for field "new_password"
    And the error message should contain "This password is too short"

  Scenario: Change password without authentication
    Given I am not authenticated
    When I send a POST request to "/api/auth/change-password/" with body:
      """
      {
        "old_password": "OldPass123!",
        "new_password": "NewPass123!",
        "new_password2": "NewPass123!"
      }
      """
    Then the response status code should be 401