Feature: User Login
  As a registered user
  I want to login to my account
  So that I can access protected resources

  Background:
    Given a user exists with:
      | username | email | password | is_active |
      | testuser | test@example.com | TestPass123! | True |

  Scenario: Successful login
    When I send a POST request to "/api/auth/login/" with body:
      """
      {
        "username": "testuser",
        "password": "TestPass123!"
      }
      """
    Then the response status code should be 200
    And the response should contain "access"
    And the response should contain "refresh"
    And the response should contain "user"
    And the response should contain "message" equal to "Login successful"
    And the response user should have username "testuser"
    And the response user should have email "test@example.com"

  Scenario: Login with wrong password
    When I send a POST request to "/api/auth/login/" with body:
      """
      {
        "username": "testuser",
        "password": "WrongPass123!"
      }
      """
    Then the response status code should be 400
    And the response should contain error "Invalid username or password."

  Scenario: Login with non-existent user
    When I send a POST request to "/api/auth/login/" with body:
      """
      {
        "username": "nonexistent",
        "password": "TestPass123!"
      }
      """
    Then the response status code should be 400
    And the response should contain error "Invalid username or password."

  Scenario: Login with inactive user
    Given a user exists with:
      | username | email | password | is_active |
      | inactive | inactive@example.com | TestPass123! | False |
    When I send a POST request to "/api/auth/login/" with body:
      """
      {
        "username": "inactive",
        "password": "TestPass123!"
      }
      """
    Then the response status code should be 400
    And the response should contain error "User account is disabled."

  Scenario: Login without username
    When I send a POST request to "/api/auth/login/" with body:
      """
      {
        "password": "TestPass123!"
      }
      """
    Then the response status code should be 400
    And the response should contain error "Must include \"username\" and \"password\"."

  Scenario: Login without password
    When I send a POST request to "/api/auth/login/" with body:
      """
      {
        "username": "testuser"
      }
      """
    Then the response status code should be 400
    And the response should contain error "Must include \"username\" and \"password\"."