/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth from "../auth.js";
import type * as banners from "../banners.js";
import type * as blogs from "../blogs.js";
import type * as bookings from "../bookings.js";
import type * as branches from "../branches.js";
import type * as categories from "../categories.js";
import type * as companies from "../companies.js";
import type * as http from "../http.js";
import type * as messages from "../messages.js";
import type * as movies from "../movies.js";
import type * as posts from "../posts.js";
import type * as reactions from "../reactions.js";
import type * as replies from "../replies.js";
import type * as rows from "../rows.js";
import type * as screeningRooms from "../screeningRooms.js";
import type * as seats from "../seats.js";
import type * as showtimes from "../showtimes.js";
import type * as upload from "../upload.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  banners: typeof banners;
  blogs: typeof blogs;
  bookings: typeof bookings;
  branches: typeof branches;
  categories: typeof categories;
  companies: typeof companies;
  http: typeof http;
  messages: typeof messages;
  movies: typeof movies;
  posts: typeof posts;
  reactions: typeof reactions;
  replies: typeof replies;
  rows: typeof rows;
  screeningRooms: typeof screeningRooms;
  seats: typeof seats;
  showtimes: typeof showtimes;
  upload: typeof upload;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
