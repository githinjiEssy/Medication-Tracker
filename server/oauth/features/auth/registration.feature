Feature: User Registration
  As a new user
  I want to register for an account
  So that I can access the medication tracker

  Background:
    Given the database is clean

  Scenario: Successful user registration with all fields
    When I send a POST request to "/api/auth/register/" with body:
      """
      {
        "username": "john_doe",
        "email": "john@example.com",
        "password": "StrongPass123!",
        "password2": "StrongPass123!",
        "first_name": "John",
        "last_name": "Doe",
        "phone_number": "+1234567890",
        "date_of_birth": "1990-01-01",
        "gender": "M",
        "blood_group": "O+",
        "emergency_contact_name": "Jane Doe",
        "emergency_contact_phone": "+1987654321",
        "allergies": "Penicillin",
        "chronic_conditions": "None"
      }
      """
    Then the response status code should be 201
    And the response should contain "access"
    And the response should contain "refresh"
    And the response should contain "user"
    And the response should contain "message" equal to "Registration successful"
    And the response user should have username "john_doe"
    And the response user should have email "john@example.com"
    And the response user should have first_name "John"
    And the response user should have last_name "Doe"
    And a user should exist with username "john_doe"
    And the user "john_doe" should have email "john@example.com"

  Scenario: Successful registration with minimal required fields
    When I send a POST request to "/api/auth/register/" with body:
      """
      {
        "username": "minimal_user",
        "email": "minimal@example.com",
        "password": "StrongPass123!",
        "password2": "StrongPass123!"
      }
      """
    Then the response status code should be 201
    And the response should contain "access"
    And the response should contain "refresh"
    And the response user should have username "minimal_user"
    And a user should exist with username "minimal_user"

  Scenario: Registration with password mismatch
    When I send a POST request to "/api/auth/register/" with body:
      """
      {
        "username": "newuser",
        "email": "newuser@example.com",
        "password": "StrongPass123!",
        "password2": "DifferentPass123!"
      }
      """
    Then the response status code should be 400
    And the response should contain error for field "password"
    And the error message should be "Password fields must match."
    And no user should exist with username "newuser"

  Scenario: Registration with existing username
    Given a user exists with:
      | username | email | password |
      | existing | existing@example.com | TestPass123! |
    When I send a POST request to "/api/auth/register/" with body:
      """
      {
        "username": "existing",
        "email": "new@example.com",
        "password": "StrongPass123!",
        "password2": "StrongPass123!"
      }
      """
    Then the response status code should be 400
    And the response should contain error for field "username"

  Scenario: Registration with existing email
    Given a user exists with:
      | username | email | password |
      | existing | existing@example.com | TestPass123! |
    When I send a POST request to "/api/auth/register/" with body:
      """
      {
        "username": "newuser",
        "email": "existing@example.com",
        "password": "StrongPass123!",
        "password2": "StrongPass123!"
      }
      """
    Then the response status code should be 400
    And the response should contain error for field "email"

  Scenario: Registration with weak password
    When I send a POST request to "/api/auth/register/" with body:
      """
      {
        "username": "weakuser",
        "email": "weak@example.com",
        "password": "weak",
        "password2": "weak"
      }
      """
    Then the response status code should be 400
    And the response should contain error for field "password"
    And the error message should contain "This password is too short"

  Scenario Outline: Registration with missing required fields
    When I send a POST request to "/api/auth/register/" with body:
      """
      {
        <fields>
      }
      """
    Then the response status code should be 400
    
    Examples:
      | fields |
      | "username": "testuser" |
      | "email": "test@example.com" |
      | "password": "Pass123!", "password2": "Pass123!" |