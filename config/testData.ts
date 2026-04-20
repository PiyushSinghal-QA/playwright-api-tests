import { CreatePostRequest } from '../utils/types';

/**
 * Centralized test data for reusability across tests.
 */

export const testPosts = {
  valid: {
    userId: 1,
    title: 'Test Post by Piyush',
    body: 'This is a test post created via Playwright API automation.',
  } as CreatePostRequest,

  minimal: {
    userId: 1,
    title: 'Minimal Post',
    body: '',
  } as CreatePostRequest,

  longContent: {
    userId: 1,
    title: 'A'.repeat(100),
    body: 'B'.repeat(1000),
  } as CreatePostRequest,
};

export const invalidUserIds = [
  { id: 999,    scenario: 'Non-existent user ID' },
  { id: 99999,  scenario: 'Very large user ID' },
  { id: 0,      scenario: 'Zero user ID' },
];
