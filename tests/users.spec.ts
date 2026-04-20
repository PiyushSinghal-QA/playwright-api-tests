import { test, expect } from '../fixtures/apiFixture';
import { ApiEndpoints } from '../utils/endpoints';
import { schemaValidator } from '../utils/schemaValidator';
import { User } from '../utils/types';
import { invalidUserIds } from '../config/testData';
import userSchema from '../schemas/user.schema.json';

/**
 * Tests for GET /users endpoints.
 *
 * Demonstrates:
 *   - Status code assertions
 *   - Response body deserialization
 *   - Response time validation (performance)
 *   - JSON schema validation (contract testing)
 *   - Data-driven negative tests
 */

test.describe('GET /users @smoke @regression', () => {
  test('@smoke should return list of all users', async ({ apiContext }) => {
    const startTime = Date.now();
    const response = await apiContext.get(ApiEndpoints.USERS);
    const duration = Date.now() - startTime;

    expect(response.status()).toBe(200);
    expect(duration).toBeLessThan(2000);

    const users: User[] = await response.json();
    expect(users.length).toBeGreaterThan(0);
    expect(users.length).toBe(10);

    // Verify first user has required fields
    const firstUser = users[0];
    expect(firstUser.id).toBeDefined();
    expect(firstUser.email).toContain('@');
    expect(firstUser.name).toBeTruthy();
  });

  test('@smoke should return single user by ID', async ({ apiContext }) => {
    const userId = 2;
    const response = await apiContext.get(ApiEndpoints.userById(userId));

    expect(response.status()).toBe(200);

    const user: User = await response.json();
    expect(user.id).toBe(userId);
    expect(user.email).toContain('@');
    expect(user.name).toBeTruthy();
    expect(user.username).toBeTruthy();
  });

  test('@regression should match user JSON schema (contract test)', async ({ apiContext }) => {
    const response = await apiContext.get(ApiEndpoints.userById(1));
    expect(response.status()).toBe(200);

    const user = await response.json();
    // If backend changes the response structure, this assertion fails
    schemaValidator.validate('user', userSchema, user);
  });

  test('@regression all users in list should match schema', async ({ apiContext }) => {
    const response = await apiContext.get(ApiEndpoints.USERS);
    const users: User[] = await response.json();

    // Validate every user in the collection
    for (const user of users) {
      schemaValidator.validate('user', userSchema, user);
    }
  });

  test('@regression should filter users by query parameter', async ({ apiContext }) => {
    const response = await apiContext.get(ApiEndpoints.USERS, {
      params: { username: 'Bret' },
    });

    expect(response.status()).toBe(200);

    const users: User[] = await response.json();
    expect(users).toHaveLength(1);
    expect(users[0].username).toBe('Bret');
  });

  // Data-driven negative tests
  for (const { id, scenario } of invalidUserIds) {
    test(`@regression @negative should return 404 for invalid user: ${scenario}`, async ({
      apiContext,
    }) => {
      const response = await apiContext.get(ApiEndpoints.userById(id));
      expect(response.status()).toBe(404);
    });
  }
});
