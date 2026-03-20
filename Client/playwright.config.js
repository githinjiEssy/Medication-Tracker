import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

const testDir = defineBddConfig({
  features: 'tests/features/*.feature',
  steps: 'tests/steps/*.js',
});

export default defineConfig({
  testDir,
  reporter: 'html',
  // Standardizing the timeout helps with the "eventually redirected" checks
  timeout: 30000, 
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    // This ensures every test starts with a clean slate but the 'Before' hook 
    // we added above will re-seed the user immediately.
    storageState: { cookies: [], origins: [] }, 
  },
});