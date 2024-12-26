const jwt = require("jsonwebtoken");

/**
 * @fileoverview This module provides a function to
 * generate JSON Web Tokens (JWTs) for user authentication and authorization.
 */

/**
 * Generates a JWT token for a user.
 *
 * @param {Object} params - The input parameters.
 * @param {string} params.userId - The unique identifier for the user.
 * @param {string} params.role
 * - The role assigned to the user (e.g., admin, user).
 * @returns {string} - A signed JWT token.
 *
 * @description The token is signed using the secret key specified in
 * the `JWT_SECRET` environment variable.
 * The token is set to expire after 12 hours.
 */
function generateToken({ userId, role }) {
  try {
    const token = jwt.sign({ userId, role }, process.env.JWT_SECRET, {
      expiresIn: "12h", // Token expiry duration
    });
    console.info(
      `✔️  JWT Token generated successfully for userId: ${userId},
       role: ${role}`
    );
    return token;
  } catch (error) {
    console.error(`❌  Failed to generate JWT Token. Error: ${error.message}`);
    throw error;
  }
}

module.exports = { generateToken };
