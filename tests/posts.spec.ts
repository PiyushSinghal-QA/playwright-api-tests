import { test, expect } from '../fixtures/apiFixture';
import { ApiEndpoints } from '../utils/endpoints';
import { schemaValidator } from '../utils/schemaValidator';
import { Post } from '../utils/types';
import { testPosts } from '../config/testData';
import postSchema from '../schemas/post.schema.json';

/**
 * Full CRUD coverage for /posts endpoints.
 *
 * Covers: GET (list + single), POST, PUT, PATCH, DELETE
 */

test.describe('Posts - Full CRUD @regression', () => {
  test('@smoke GET /posts - should return all posts', async ({ apiContext }) => {
    const response = await apiContext.get(ApiEndpoints.POSTS);

    expect(response.status()).toBe(200);

    const posts: Post[] = await response.json();
    expect(posts.length).toBe(100);
    expect(posts[0]).toHaveProperty('id');
    expect(posts[0]).toHaveProperty('title');
  });

  test('@smoke GET /posts/:id - should return single post', async ({ apiContext }) => {
    const response = await apiContext.get(ApiEndpoints.postById(1));

    expect(response.status()).toBe(200);

    const post: Post = await response.json();
    expect(post.id).toBe(1);
    schemaValidator.validate('post', postSchema, post);
  });

  test('@smoke POST /posts - should create a new post', async ({ apiContext }) => {
    const startTime = Date.now();
    const response = await apiContext.post(ApiEndpoints.POSTS, {
      data: testPosts.valid,
    });
    const duration = Date.now() - startTime;

    expect(response.status()).toBe(201);
    expect(duration).toBeLessThan(2000);

    const created: Post = await response.json();
    expect(created.title).toBe(testPosts.valid.title);
    expect(created.body).toBe(testPosts.valid.body);
    expect(created.userId).toBe(testPosts.valid.userId);
    expect(created.id).toBeDefined();
  });

  test('@regression POST /posts - should handle long content', async ({ apiContext }) => {
    const response = await apiContext.post(ApiEndpoints.POSTS, {
      data: testPosts.longContent,
    });

    expect(response.status()).toBe(201);
    const created: Post = await response.json();
    expect(created.title.length).toBe(100);
    expect(created.body.length).toBe(1000);
  });

  test('@regression PUT /posts/:id - should fully update a post', async ({ apiContext }) => {
    const updatePayload = {
      id: 1,
      userId: 1,
      title: 'Updated via PUT',
      body: 'Fully replaced content via PUT method.',
    };

    const response = await apiContext.put(ApiEndpoints.postById(1), {
      data: updatePayload,
    });

    expect(response.status()).toBe(200);

    const updated: Post = await response.json();
    expect(updated.title).toBe('Updated via PUT');
    expect(updated.body).toBe('Fully replaced content via PUT method.');
  });

  test('@regression PATCH /posts/:id - should partially update a post', async ({ apiContext }) => {
    const response = await apiContext.patch(ApiEndpoints.postById(1), {
      data: { title: 'Only title changed via PATCH' },
    });

    expect(response.status()).toBe(200);

    const updated: Post = await response.json();
    expect(updated.title).toBe('Only title changed via PATCH');
    // Body should be preserved from original (not overwritten by PATCH)
    expect(updated.body).toBeTruthy();
  });

  test('@regression DELETE /posts/:id - should delete a post', async ({ apiContext }) => {
    const response = await apiContext.delete(ApiEndpoints.postById(1));
    expect(response.status()).toBe(200);
  });
});

test.describe('Posts - Relationships @regression', () => {
  test('GET /posts/:id/comments - should return comments for a post', async ({
    apiContext,
  }) => {
    const response = await apiContext.get(ApiEndpoints.commentsByPost(1));

    expect(response.status()).toBe(200);

    const comments = await response.json();
    expect(Array.isArray(comments)).toBeTruthy();
    expect(comments.length).toBeGreaterThan(0);

    // All comments should reference the requested post
    for (const comment of comments) {
      expect(comment.postId).toBe(1);
      expect(comment.email).toContain('@');
    }
  });
});
