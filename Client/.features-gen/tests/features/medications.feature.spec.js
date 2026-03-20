// Generated from: tests\features\medications.feature
import { test } from "playwright-bdd";

test.describe('Medication Management', () => {

  test.beforeEach('Background', async ({ Given, page }, testInfo) => { if (testInfo.error) return;
    await Given('I am logged into MedTrack', null, { page }); 
  });
  
  test('Searching for a specific medication', async ({ Given, When, Then, And, page }) => { 
    await Given('I am on the Medications page', null, { page }); 
    await When('I search for "Metformin" in the search bar', null, { page }); 
    await Then('I should only see "Metformin" in my cabinet', null, { page }); 
    await And('I should not see "Lisinopril"', null, { page }); 
  });

  test('Opening the Add New Prescription modal', async ({ Given, When, Then, And, page }) => { 
    await Given('I am on the Medications page', null, { page }); 
    await When('I click the "Add New Prescription" medication button', null, { page }); 
    await Then('I should see the "Add New Prescription" modal header', null, { page }); 
    await And('the "Medication Name" input should be visible', null, { page }); 
  });

  test('Deleting a medication from the cabinet', async ({ Given, When, Then, And, page }) => { 
    await Given('I am on the Medications page', null, { page }); 
    await And('I should see "Metformin" in my cabinet', null, { page }); 
    await When('I click the "Delete" button for "Metformin"', null, { page }); 
    await And('I confirm the deletion', null, { page }); 
    await Then('I should not see "Metformin"', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('tests\\features\\medications.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":10,"pickleLine":6,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given I am logged into MedTrack","isBg":true,"stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given I am on the Medications page","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":8,"keywordType":"Action","textWithKeyword":"When I search for \"Metformin\" in the search bar","stepMatchArguments":[{"group":{"start":13,"value":"\"Metformin\"","children":[{"start":14,"value":"Metformin","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":13,"gherkinStepLine":9,"keywordType":"Outcome","textWithKeyword":"Then I should only see \"Metformin\" in my cabinet","stepMatchArguments":[{"group":{"start":18,"value":"\"Metformin\"","children":[{"start":19,"value":"Metformin","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":14,"gherkinStepLine":10,"keywordType":"Outcome","textWithKeyword":"And I should not see \"Lisinopril\"","stepMatchArguments":[{"group":{"start":17,"value":"\"Lisinopril\"","children":[{"start":18,"value":"Lisinopril","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":17,"pickleLine":12,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given I am logged into MedTrack","isBg":true,"stepMatchArguments":[]},{"pwStepLine":18,"gherkinStepLine":13,"keywordType":"Context","textWithKeyword":"Given I am on the Medications page","stepMatchArguments":[]},{"pwStepLine":19,"gherkinStepLine":14,"keywordType":"Action","textWithKeyword":"When I click the \"Add New Prescription\" medication button","stepMatchArguments":[{"group":{"start":12,"value":"\"Add New Prescription\"","children":[{"start":13,"value":"Add New Prescription","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":20,"gherkinStepLine":15,"keywordType":"Outcome","textWithKeyword":"Then I should see the \"Add New Prescription\" modal header","stepMatchArguments":[{"group":{"start":17,"value":"\"Add New Prescription\"","children":[{"start":18,"value":"Add New Prescription","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":21,"gherkinStepLine":16,"keywordType":"Outcome","textWithKeyword":"And the \"Medication Name\" input should be visible","stepMatchArguments":[{"group":{"start":4,"value":"\"Medication Name\"","children":[{"start":5,"value":"Medication Name","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":24,"pickleLine":18,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given I am logged into MedTrack","isBg":true,"stepMatchArguments":[]},{"pwStepLine":25,"gherkinStepLine":19,"keywordType":"Context","textWithKeyword":"Given I am on the Medications page","stepMatchArguments":[]},{"pwStepLine":26,"gherkinStepLine":20,"keywordType":"Context","textWithKeyword":"And I should see \"Metformin\" in my cabinet","stepMatchArguments":[{"group":{"start":13,"value":"\"Metformin\"","children":[{"start":14,"value":"Metformin","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":27,"gherkinStepLine":21,"keywordType":"Action","textWithKeyword":"When I click the \"Delete\" button for \"Metformin\"","stepMatchArguments":[{"group":{"start":12,"value":"\"Delete\"","children":[{"start":13,"value":"Delete","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":32,"value":"\"Metformin\"","children":[{"start":33,"value":"Metformin","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":28,"gherkinStepLine":22,"keywordType":"Action","textWithKeyword":"And I confirm the deletion","stepMatchArguments":[]},{"pwStepLine":29,"gherkinStepLine":23,"keywordType":"Outcome","textWithKeyword":"Then I should not see \"Metformin\"","stepMatchArguments":[{"group":{"start":17,"value":"\"Metformin\"","children":[{"start":18,"value":"Metformin","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
]; // bdd-data-end