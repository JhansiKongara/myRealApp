/**
 * @fileoverview This module handles database-related errors,
 * providing specific error messages
 * for known cases such as unique constraint violations
 * and invalid role entries.
 */

/**
 * Handles specific database errors and returns a user-friendly error message.
 *
 * @param {Object} params - The input parameters.
 * @param {string} params.error - The error message or code from the database.
 * @returns {Object} - An object containing:
 * - `message`: A user-friendly error message.
 * - `error`: The original error message or code for debugging.
 */
function handleError({ error }) {
  if (
    error == 'duplicate key value violates unique constraint "users_email_key"'
  ) {
    return { message: "Email already exists", error };
  } else if (
    error ==
    'duplicate key value violates unique constraint "users_phone_number_key"'
  ) {
    return { message: "Phone number already exists", error };
  }
  if (error.includes("You don't have access to create")) {
    return {
      message: error,
      error,
    };
  }
  if (
    error ==
    'new row for relation "users" violates check constraint "users_role_check"'
  ) {
    return {
      message: `Selected Role not existed in the database.
Please select these listed roles only: owner, agent, buyer, seller`,
      error,
    };
  }
  return {
    message: "Failed to create user!",
    error,
  };
}

module.exports = { handleError };
