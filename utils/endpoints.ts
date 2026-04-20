/**
 * ApiEndpoints - Centralizes all API paths.
 *
 * If a URL changes, it's updated in one place instead of hunting through test files.
 * This is equivalent to the Page Object pattern applied to REST endpoints.
 */

export const ApiEndpoints = {
  // User endpoints
  USERS: '/users',
  userById: (id: number) => `/users/${id}`,

  // Post endpoints
  POSTS: '/posts',
  postById: (id: number) => `/posts/${id}`,
  commentsByPost: (postId: number) => `/posts/${postId}/comments`,

  // Comment endpoints
  COMMENTS: '/comments',
} as const;
