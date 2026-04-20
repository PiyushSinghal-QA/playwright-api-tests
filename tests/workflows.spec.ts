import { test, expect } from '../fixtures/apiFixture';
import { ApiEndpoints } from '../utils/endpoints';
import { User, Post } from '../utils/types';

/**
 * End-to-end workflow tests - chaining multiple API calls.
 *
 * These tests simulate realistic user journeys through the API,
 * catching integration issues that isolated endpoint tests would miss.
 */

test.describe('E2E API Workflows @regression', () => {
  test('should get user, then fetch their posts, then create a new post for them', async ({
    apiContext,
  }) => {
    // Step 1: Get a user
    const userResponse = await apiContext.get(ApiEndpoints.userById(1));
    expect(userResponse.status()).toBe(200);
    const user: User = await userResponse.json();
    expect(user.id).toBe(1);

    // Step 2: Get all posts by that user
    const postsResponse = await apiContext.get(ApiEndpoints.POSTS, {
      params: { userId: user.id },
    });
    expect(postsResponse.status()).toBe(200);
    const userPosts: Post[] = await postsResponse.json();
    expect(userPosts.length).toBeGreaterThan(0);
    // Every returned post should belong to this user
    userPosts.forEach(post => expect(post.userId).toBe(user.id));

    // Step 3: Create a new post for that user
    const newPost = {
      userId: user.id,
      title: `New post by ${user.name}`,
      body: 'Created through E2E workflow test',
    };
    const createResponse = await apiContext.post(ApiEndpoints.POSTS, {
      data: newPost,
    });
    expect(createResponse.status()).toBe(201);

    const createdPost: Post = await createResponse.json();
    expect(createdPost.userId).toBe(user.id);
    expect(createdPost.title).toBe(newPost.title);
    expect(createdPost.id).toBeDefined();
  });

  test('should create a post, then fetch it, then update it, then delete it', async ({
    apiContext,
  }) => {
    // JSONPlaceholder doesn't actually persist, so we use an existing post ID
    // for the follow-up operations, but the workflow shape matches a real system.

    // CREATE
    const newPost = { userId: 1, title: 'Workflow Test Post', body: 'Initial content' };
    const createRes = await apiContext.post(ApiEndpoints.POSTS, { data: newPost });
    expect(createRes.status()).toBe(201);
    const created: Post = await createRes.json();
    expect(created.id).toBeDefined();

    // READ (using an existing ID since JSONPlaceholder doesn't persist new posts)
    const readRes = await apiContext.get(ApiEndpoints.postById(1));
    expect(readRes.status()).toBe(200);

    // UPDATE
    const updateRes = await apiContext.patch(ApiEndpoints.postById(1), {
      data: { title: 'Updated via workflow' },
    });
    expect(updateRes.status()).toBe(200);
    const updated: Post = await updateRes.json();
    expect(updated.title).toBe('Updated via workflow');

    // DELETE
    const deleteRes = await apiContext.delete(ApiEndpoints.postById(1));
    expect(deleteRes.status()).toBe(200);
  });
});
