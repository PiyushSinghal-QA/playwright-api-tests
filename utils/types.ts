/**
 * TypeScript interfaces for JSONPlaceholder API models.
 *
 * Type-safe alternative to raw JSON - IDE gives us autocomplete,
 * refactoring is safer, and bugs show up at compile time.
 */

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone?: string;
  website?: string;
  address?: Address;
  company?: Company;
}

export interface Address {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: {
    lat: string;
    lng: string;
  };
}

export interface Company {
  name: string;
  catchPhrase: string;
  bs: string;
}

export interface Post {
  id?: number;
  userId: number;
  title: string;
  body: string;
}

export interface Comment {
  id: number;
  postId: number;
  name: string;
  email: string;
  body: string;
}

export interface CreatePostRequest {
  userId: number;
  title: string;
  body: string;
}

export interface UpdatePostRequest {
  id?: number;
  userId?: number;
  title?: string;
  body?: string;
}
