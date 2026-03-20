Feature: User Logout
  As an authenticated user
  I want to logout from my account
  So that I can secure my session

  Background:
    Given a user exists with:
      | username | email | password |
      | testuser | test@example.com | TestPass123! |
    And I am authenticated as "testuser"

  Scenario: Successful logout
    When I send a POST request to "/api/auth/logout/" with body:
      """
      {
        "refresh": "$refresh_token"
      }
      """
    Then the response status code should be 200
    And the response should contain "message" equal to "Logout successful"
    And the refresh token should be blacklisted
    And I should not be able to use the refresh token to get new access token

  Scenario: Logout with invalid token
    When I send a POST request to "/api/auth/logout/" with body:
      """
      {
        "refresh": "invalid_token_12345"
      }
      """
    Then the response status code should be 400
    And the response should contain error "Invalid token"

  Scenario: Logout without refresh token
    When I send a POST request to "/api/auth/logout/" with body:
      """
      {}
      """
    Then the response status code should be 400
    And the response should contain error for field "refresh"

  Scenario: Logout without authentication
    Given I am not authenticated
    When I send a POST request to "/api/auth/logout/" with body:
      """
      {
        "refresh": "some_token"
      }
      """
    Then the response status code should be 401