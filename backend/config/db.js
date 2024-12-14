const { Pool } = require("pg");

/**
 * @fileoverview This module exports a PostgreSQL connection pool instance using the `pg` library.
 * The pool is configured using environment variables for secure database connection settings.
 */

/**
 * PostgreSQL connection pool.
 *
 * This pool is initialized with the following environment variables:
 * - `DB_HOST`: Hostname or IP address of the database server.
 * - `DB_PASSWORD`: Password for the database user.
 * - `DB_PORT`: Port on which the database server is listening.
 * - `DB_NAME`: Name of the database to connect to.
 * - `DB_USER`: Username for database authentication.
 *
 * @constant {Pool}
 * @property {string} host - Host of the database.
 * @property {string} password - Password for the database.
 * @property {number} port - Port number of the database.
 * @property {string} database - Name of the database.
 * @property {string} user - Database username.
 * @property {number} maxUses - Limits the number of times a connection can be used.
 */
const pgPool = new Pool({
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  maxUses: 1, // Limit each connection to a single use before recycling.
});

module.exports = { pgPool };
