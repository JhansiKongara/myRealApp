/**
 * @fileoverview This module defines SQL queries for user-related operations, including creating a user
 * and fetching user details from the database.
 */

/**
 * SQL query to create a new user in the database.
 *
 * @constant {string}
 * @description This query inserts a new user into the `users` table with the following fields:
 * - `username`: The name of the user.
 * - `email`: The email address of the user.
 * - `password_hash`: The hashed password for the user.
 * - `role`: The role assigned to the user (e.g., admin, user).
 * - `phone_number`: The phone number of the user.
 *
 * Returns:
 * - `user_id` as "userId" for the newly created user.
 */
const createUserQuery = `
  INSERT INTO public.users
  (username, email, password_hash, "role", phone_number)
  VALUES ($1::VARCHAR, $2::VARCHAR, $3::VARCHAR, $4::VARCHAR, $5::VARCHAR)
  RETURNING user_id AS "userId";
`;

/**
 * SQL query to fetch user details by email or phone number.
 *
 * @constant {string}
 * @description This query retrieves a user from the `users` table based on the following conditions:
 * - `email` matches the provided email (case-insensitive).
 * - OR `phone_number` matches the provided phone number.
 * - AND the `isactive` field is '1', indicating the user is active.
 *
 * Returns:
 * - All columns from the `users` table for the matched user.
 */
const fetchUserQuery = `
  SELECT * FROM users u
  WHERE email ILIKE $1::VARCHAR 
  OR phone_number = $2::VARCHAR
  AND isactive = '1';
`;

module.exports = { createUserQuery, fetchUserQuery };
