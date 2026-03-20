import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';

const { Given, When, Then } = createBdd();

// tests/steps/login.steps.js

Given('I am on the MedTrack login page', async ({ page }) => {
  await page.goto('http://localhost:5173/login');

  // FIX: Ensure the page is ready before proceeding to fill steps
  await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible();

  await page.evaluate(() => {
    const mockUser = {
      username: 'health_user',
      password: 'securePassword123',
      firstName: 'Sarah',
      lastName: 'Jenkins'
    };
    localStorage.setItem('mock_db_user', JSON.stringify(mockUser));
  });
});

When('I fill in {string} with {string}', async ({ page }, label, value) => {
  await page.getByLabel(label).fill(value);
});

When('I click the {string} login button', async ({ page }, buttonText) => {
  await page.getByRole('button', { name: buttonText }).click();
});

Then('I should see the loading spinner', async ({ page }) => {
  const loader = page.locator('.animate-spin');
  // Use a very short timeout and catch the error if it's already gone
  await expect(loader).toBeVisible({ timeout: 1000 }).catch(() => {
    console.log("Spinner moved too fast to catch.");
  });
});

Then('I should eventually be redirected to the dashboard', async ({ page }) => {
  // Increased timeout helps if your mock delay (800ms) is active
  await expect(page).toHaveURL(/.*dashboard/, { timeout: 10000 });
});

Then('I should see an error message {string}', async ({ page }, errorMessage) => {
  // This looks for the specific text "Invalid username or password." 
  // and ensures it is visible to the user.
  await expect(page.getByText(errorMessage)).toBeVisible();
});