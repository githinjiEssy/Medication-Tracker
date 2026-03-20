// Generated from: tests\features\login.feature
import { test } from "playwright-bdd";

test.describe('User Login', () => {

  test('Successful login leads to Dashboard', async ({ Given, When, Then, And, page }) => { 
    await Given('I am on the MedTrack login page', null, { page }); 
    await When('I fill in "Username" with "health_user"', null, { page }); 
    await And('I fill in "Password" with "securePassword123"', null, { page }); 
    await And('I click the "Log In" login button', null, { page }); 
    await Then('I should see the loading spinner', null, { page }); 
    await And('I should eventually be redirected to the dashboard', null, { page }); 
  });

  test('Failed login shows error message', async ({ Given, When, Then, And, page }) => { 
    await Given('I am on the MedTrack login page', null, { page }); 
    await When('I fill in "Username" with "wrong_user"', null, { page }); 
    await And('I fill in "Password" with "wrong_pass"', null, { page }); 
    await And('I click the "Log In" login button', null, { page }); 
    await Then('I should see an error message "Invalid username or password."', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('tests\\features\\login.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":6,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given I am on the MedTrack login page","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Action","textWithKeyword":"When I fill in \"Username\" with \"health_user\"","stepMatchArguments":[{"group":{"start":10,"value":"\"Username\"","children":[{"start":11,"value":"Username","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":26,"value":"\"health_user\"","children":[{"start":27,"value":"health_user","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":9,"gherkinStepLine":9,"keywordType":"Action","textWithKeyword":"And I fill in \"Password\" with \"securePassword123\"","stepMatchArguments":[{"group":{"start":10,"value":"\"Password\"","children":[{"start":11,"value":"Password","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":26,"value":"\"securePassword123\"","children":[{"start":27,"value":"securePassword123","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":10,"gherkinStepLine":10,"keywordType":"Action","textWithKeyword":"And I click the \"Log In\" login button","stepMatchArguments":[{"group":{"start":12,"value":"\"Log In\"","children":[{"start":13,"value":"Log In","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":11,"gherkinStepLine":11,"keywordType":"Outcome","textWithKeyword":"Then I should see the loading spinner","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":12,"keywordType":"Outcome","textWithKeyword":"And I should eventually be redirected to the dashboard","stepMatchArguments":[]}]},
  {"pwTestLine":15,"pickleLine":14,"tags":[],"steps":[{"pwStepLine":16,"gherkinStepLine":15,"keywordType":"Context","textWithKeyword":"Given I am on the MedTrack login page","stepMatchArguments":[]},{"pwStepLine":17,"gherkinStepLine":16,"keywordType":"Action","textWithKeyword":"When I fill in \"Username\" with \"wrong_user\"","stepMatchArguments":[{"group":{"start":10,"value":"\"Username\"","children":[{"start":11,"value":"Username","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":26,"value":"\"wrong_user\"","children":[{"start":27,"value":"wrong_user","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":18,"gherkinStepLine":17,"keywordType":"Action","textWithKeyword":"And I fill in \"Password\" with \"wrong_pass\"","stepMatchArguments":[{"group":{"start":10,"value":"\"Password\"","children":[{"start":11,"value":"Password","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":26,"value":"\"wrong_pass\"","children":[{"start":27,"value":"wrong_pass","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":19,"gherkinStepLine":18,"keywordType":"Action","textWithKeyword":"And I click the \"Log In\" login button","stepMatchArguments":[{"group":{"start":12,"value":"\"Log In\"","children":[{"start":13,"value":"Log In","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":20,"gherkinStepLine":19,"keywordType":"Outcome","textWithKeyword":"Then I should see an error message \"Invalid username or password.\"","stepMatchArguments":[{"group":{"start":30,"value":"\"Invalid username or password.\"","children":[{"start":31,"value":"Invalid username or password.","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
]; // bdd-data-end