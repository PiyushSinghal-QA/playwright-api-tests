import { defineConfig } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * Playwright Configuration for API Testing
 *
 * Note: Unlike UI tests, API tests don't need browser projects.
 * We use a single "api" project with optimized settings for HTTP requests.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,

  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['list'],
    ['junit', { outputFile: 'test-results/junit.xml' }],
  ],

  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },

  use: {
    baseURL: process.env.BASE_URL || 'https://jsonplaceholder.typicode.com',
    // Capture trace on first retry for debugging failures
    trace: 'on-first-retry',
    // API-specific settings
    extraHTTPHeaders: {
      'Accept': 'application/json',
      'Content-Type': 'application/json; charset=UTF-8',
    },
    ignoreHTTPSErrors: true,
  },

  projects: [
    {
      name: 'api',
      testMatch: /.*\.spec\.ts/,
    },
  ],

  outputDir: 'test-results/',
});
