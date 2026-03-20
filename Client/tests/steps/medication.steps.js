import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';

const { Given, When, Then } = createBdd();

Given('I am logged into MedTrack', async ({ page }) => {
  // Seed both the user and a mock token to bypass the login screen
  await page.goto('http://localhost:5173/');
  await page.evaluate(() => {
    const mockUser = { username: 'health_user', firstName: 'Sarah' };
    localStorage.setItem('mock_db_user', JSON.stringify(mockUser));
    localStorage.setItem('auth_token', 'mock_token_123');
  });
});

Given('I am on the Medications page', async ({ page }) => {
  await page.goto('http://localhost:5173/medications');
});

When('I search for {string} in the search bar', async ({ page }, term) => {
  // Targets the search input in your TopBar component
  await page.getByPlaceholder(/search/i).fill(term);
});

Then('I should only see {string} in my cabinet', async ({ page }, medName) => {
  const card = page.locator('h3', { hasText: medName });
  await expect(card).toBeVisible();
});

When('I click the {string} medication button', async ({ page }, buttonText) => {
  await page.getByRole('button', { name: buttonText }).click();
});

Then('I should see the {string} modal header', async ({ page }, title) => {
  // Targets the h2 inside your AddMedicationModal
  await expect(page.getByRole('heading', { name: title })).toBeVisible();
});

Then('the {string} input should be visible', async ({ page }, labelText) => {
  await expect(page.getByLabel(labelText)).toBeVisible();
});

Given('I should see {string} in my cabinet', async ({ page }, medName) => {
  const card = page.locator('h3', { hasText: medName });
  await expect(card).toBeVisible();
});

When('I click the {string} button for {string}', async ({ page }, action, medName) => {
  // Find the card containing the medication name, then find the button within that card
  const card = page.locator('.bg-white', { has: page.locator('h3', { hasText: medName }) });
  const deleteButton = card.getByRole('button', { name: new RegExp(action, 'i') });

  // Set up dialog listener BEFORE the click
  page.once('dialog', async dialog => {
    console.log(`Accepting dialog: ${dialog.message()}`);
    await dialog.accept();
  });

  await deleteButton.click();
});

When('I confirm the deletion', async ({ page }) => {
  const successToast = page.getByText(/successfully|removed/i);
  await successToast.waitFor({ state: 'visible', timeout: 2000 }).catch(() => {});
});

Then('I should not see {string}', async ({ page }, medName) => {
  const card = page.locator('h3', { hasText: medName });
  await expect(card).toBeHidden({ timeout: 7000 });
});