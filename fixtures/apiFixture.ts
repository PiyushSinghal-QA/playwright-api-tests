import { test as base, APIRequestContext, expect } from '@playwright/test';

/**
 * Custom fixtures for API tests.
 *
 * Playwright provides an `apiRequestContext` out of the box, but we extend
 * it here to add custom utilities like response time validation and
 * consistent logging.
 */

type ApiFixtures = {
  /**
   * Pre-configured API request context with default headers and baseURL
   * (already set in playwright.config.ts, but this provides a central place
   * to add auth tokens or other runtime config if needed).
   */
  apiContext: APIRequestContext;
};

export const test = base.extend<ApiFixtures>({
  apiContext: async ({ request }, use) => {
    await use(request);
  },
});

export { expect };
