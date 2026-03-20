Feature: User Profile Management
  As an authenticated user
  I want to manage my profile
  So that I can keep my information up to date

  Background:
    Given a user exists with:
      | username | email | password | first_name | last_name | phone_number | date_of_birth | gender | blood_group |
      | testuser | test@example.com | TestPass123! | John | Doe | +1234567890 | 1990-01-01 | M | O+ |
    And I am authenticated as "testuser"

  Scenario: Get user profile
    When I send a GET request to "/api/auth/profile/"
    Then the response status code should be 200
    And the response should contain "id"
    And the response should contain "username" equal to "testuser"
    And the response should contain "email" equal to "test@example.com"
    And the response should contain "first_name" equal to "John"
    And the response should contain "last_name" equal to "Doe"
    And the response should contain "full_name" equal to "John Doe"
    And the response should contain "phone_number" equal to "+1234567890"
    And the response should contain "age"
    And the response should contain "date_joined"
    And the response should contain "is_email_verified" equal to "False"
    And the response should contain "is_phone_verified" equal to "False"

  Scenario: Update user profile
    When I send a PATCH request to "/api/auth/profile/" with body:
      """
      {
        "first_name": "Jane",
        "last_name": "Smith",
        "phone_number": "+9876543210",
        "emergency_contact_name": "Emergency Contact",
        "emergency_contact_phone": "+1122334455",
        "allergies": "Peanuts",
        "chronic_conditions": "Asthma"
      }
      """
    Then the response status code should be 200
    And the response should contain "message" equal to "Profile updated successfully"
    And the response user should have first_name "Jane"
    And the response user should have last_name "Smith"
    And the response user should have phone_number "+9876543210"
    And the user "testuser" should have first_name "Jane"
    And the user "testuser" should have last_name "Smith"
    And the user "testuser" should have phone_number "+9876543210"

  Scenario: Update profile with invalid data
    When I send a PATCH request to "/api/auth/profile/" with body:
      """
      {
        "email": "invalid-email",
        "phone_number": "invalid-phone"
      }
      """
    Then the response status code should be 400

  Scenario: Get profile with unauthenticated user
    Given I am not authenticated
    When I send a GET request to "/api/auth/profile/"
    Then the response status code should be 401
    And the response should contain error "Authentication credentials were not provided."