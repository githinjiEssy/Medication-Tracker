Feature: Medication Management

  Background:
    Given I am logged into MedTrack

  Scenario: Searching for a specific medication
    Given I am on the Medications page
    When I search for "Metformin" in the search bar
    Then I should only see "Metformin" in my cabinet
    And I should not see "Lisinopril"

  Scenario: Opening the Add New Prescription modal
    Given I am on the Medications page
    When I click the "Add New Prescription" medication button
    Then I should see the "Add New Prescription" modal header
    And the "Medication Name" input should be visible

  Scenario: Deleting a medication from the cabinet
    Given I am on the Medications page
    And I should see "Metformin" in my cabinet
    When I click the "Delete" button for "Metformin"
    And I confirm the deletion
    Then I should not see "Metformin"