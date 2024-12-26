const { pgPool } = require("../config/db");
const { createUserQuery, fetchUserQuery } = require("./dbQuery.service");
const { logger } = require("./logger.service");

/**
 * @fileoverview This module provides database management functions,
 * including connecting to the database. creating a new user,
 *  and fetching user details.
 */

/**
 * Establishes and verifies a connection to the database.
 *
 * Logs a success or failure message based on the outcome.
 *
 * @async
 * @throws Will throw an error if the connection to the database fails.
 */
async function manageDbConnection() {
  try {
    await pgPool.connect();
    logger.info(`✔️  Connected Db Successfully!`);
  } catch (error) {
    logger.error(`❌  Failed to Connect Db!, Error: ${error?.message}`);
    throw error;
  }
}

/**
 * Creates a new user in the database.
 *
 * @async
 * @param {Object} user - The user details.
 * @param {string} user.userName - The name of the user.
 * @param {string} user.email - The email address of the user.
 * @param {string} user.hashedPassword - The hashed password of the user.
 * @param {string} user.role
 * - The role assigned to the user (e.g., admin, user).
 * @param {string} user.phoneNumber - The phone number of the user.
 * @returns {Object}
 * - A confirmation object containing userId, userName, email, and phoneNumber.
 * @throws Will throw an error if the user creation fails.
 */
async function createUser({
  userName,
  email,
  hashedPassword,
  role,
  phoneNumber,
}) {
  try {
    const parameters = [userName, email, hashedPassword, role, phoneNumber];
    const { rows } = await pgPool.query(createUserQuery, parameters);
    const userId = rows[0].userId;
    logger.info(`✔️  User created Successfully with userId: ${userId}`);
    return { userId, userName, email, phoneNumber };
  } catch (error) {
    logger.error(`❌  Failed to Create User!, Error: ${error?.message}`);
    throw error;
  }
}

/**
 * Fetches user details from the database by email or phone number.
 *
 * @async
 * @param {Object} criteria - The criteria to search for a user.
 * @param {string} criteria.email - The email address of the user.
 * @param {string} criteria.phoneNumber - The phone number of the user.
 * @returns {Object} - The user details retrieved from the database.
 * @throws Will throw an error if fetching the user fails.
 */
async function fetchUser({ email, phoneNumber }) {
  try {
    const parameters = [email, phoneNumber];
    const { rows } = await pgPool.query(fetchUserQuery, parameters);
    const userData = rows[0];
    logger.info(`✔️  User details fetched Successfully`);
    return userData;
  } catch (error) {
    logger.error(`❌  Failed to fetch User!, Error: ${error?.message}`);
    throw error;
  }
}

module.exports = { manageDbConnection, createUser, fetchUser };
