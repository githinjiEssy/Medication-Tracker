import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';

const { Given, When, Then } = createBdd();

Given('I am on the MedTrack login page', async ({ page }) => {
  // Navigate to the page first to lock in the origin
  await page.goto('http://localhost:5173/login');

  // Seed the data directly on that origin
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

When('I click the {string} button', async ({ page }, buttonText) => {
  await page.getByRole('button', { name: buttonText }).click();
});

Then('I should see the loading spinner', async ({ page }) => {
  const loader = page.locator('.animate-spin');
  await expect(loader).toBeVisible();
});

Then('I should eventually be redirected to the dashboard', async ({ page }) => {
  // Increased timeout helps if your mock delay (800ms) is active
  await expect(page).toHaveURL(/.*dashboard/, { timeout: 10000 });
});