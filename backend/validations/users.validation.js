const Joi = require("joi");
const { logger } = require("../services/logger.service");

/**
 * Validates user data for registration.
 *
 * @param {Object} params - The input parameters.
 * @param {Object} params.user
 * - The user object containing details like userName, email, password, etc.
 * @returns {Object} - The validated user data.
 * @throws Will throw an error if validation fails or if
 * the user role creation is not permitted.
 */
function validateUser({ user }) {
  const schema = Joi.object({
    userName: Joi.string().required(),
    password: Joi.string().required(),
    email: Joi.string().email().messages({
      "string.email": "Please provide a valid email address.",
      "string.empty": "Email cannot be empty.",
    }),
    phoneNumber: Joi.string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .required()
      .messages({
        "string.base": "Phone number must be a string.",
        "string.empty": "Phone number is required.",
        "string.length": "Phone number must be exactly 10 digits.",
        "string.pattern.base": "Phone number must contain only digits.",
      }),
    role: Joi.string().required(),
    loggedUserRole: Joi.allow().optional(),
  });

  const { error, value } = schema.validate(user);
  const role = value?.role;
  const loggedUserRole = value?.loggedUserRole;

  if (
    (loggedUserRole && loggedUserRole !== "admin") ||
    ["admin", "sub_admin"].includes(role)
  ) {
    logger.warn(
      `⚠️  Access Denied: Attempt to create '${role}' 
      User by '${loggedUserRole}'`
    );
    throw new Error(
      `You don't have access to create '${role}' User. Please contact support.`
    );
  }

  if (error) {
    logger.error(`❌  Validation Error: ${error.message}`);
    throw error;
  }

  logger.info(`✔️  User validation successful for: ${value?.userName}`);
  return value;
}

/**
 * Validates user data for login.
 *
 * @param {Object} params - The input parameters.
 * @param {Object} params.user
 * - The user object containing details like email, phoneNumber, and password.
 * @returns {Object} - The validated login data.
 * @throws Will throw an error if validation fails.
 */
function validateUserLogin({ user }) {
  const schema = Joi.object({
    password: Joi.string().required().messages({
      "string.empty": "Password is required.",
    }),
    email: Joi.string().email().messages({
      "string.email": "Please provide a valid email address.",
    }),
    phoneNumber: Joi.string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .messages({
        "string.base": "Phone number must be a string.",
        "string.length": "Phone number must be exactly 10 digits.",
        "string.pattern.base": "Phone number must contain only digits.",
      }),
  })
    .or("email", "phoneNumber")
    .messages({
      "object.missing": "Either email or phone number is required.",
    });

  const { error, value } = schema.validate(user);

  if (error) {
    logger.error(`❌  Login Validation Error: ${error.message}`);
    throw error;
  }

  logger.info(
    `✔️  Login validation successful for: ${value.email || value.phoneNumber}`
  );
  return value;
}

module.exports = { validateUser, validateUserLogin };
