const express = require("express");
const bcrypt = require("bcryptjs");
const {
  validateUser,
  validateUserLogin,
} = require("../validations/users.validation");
// const { pgPool } = require("../config/db");
const { createUser, fetchUser } = require("../services/database.service");
const { handleError } = require("../services/errorHandle.service");
const { generateToken } = require("../utils/auth.service");
const { logger } = require("../services/logger.service");

const userRouter = express.Router();

/**
 * User Registration Route
 */
userRouter.post("/register", async (req, res) => {
  try {
    const user = req.body;
    const { password, phoneNumber, loggedUserRole, ...userRequest } =
      validateUser({ user });

    logger.info(`✔️  User registration request validated successfully!`);

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (loggedUserRole === "admin") {
      logger.info(`🔒 Admin is creating a user.`);
      await createUser({
        hashedPassword,
        phoneNumber: phoneNumber?.toString(),
        ...userRequest,
      });
      logger.info(`✔️  User created successfully by admin.`);
      return res.status(200).json({ message: "User created successfully" });
    }
    logger.info(`📝 Creating a user with role: ${userRequest.role}`);
    const { userId, role, ...userData } = await createUser({
      hashedPassword,
      phoneNumber: phoneNumber?.toString(),
      ...userRequest,
    });
    logger.info(`✔️  User created successfully with userId: ${userId}`);
    return res.status(200).json({
      message: "User created successfully",
      data: { token: generateToken({ userId, role }), ...userData },
    });
  } catch (error) {
    logger.error(`❌  Error during user registration: ${error?.stack}`);
    return res.status(500).json(handleError({ error: error?.message }));
  }
});

/**
 * User Login Route
 */
userRouter.post("/login", async (req, res) => {
  try {
    const user = req.body;

    const { phoneNumber, email, password } = validateUserLogin({ user });
    logger.info(`✔️  User login request validated successfully!`);

    const {
      userId,
      password_hash: passwordHash,
      role,
      userName,
    } = await fetchUser({
      phoneNumber: phoneNumber?.toString(),
      email,
    });

    logger.info(`🔍  Fetched user details for userId: ${userId}`);

    // Compare password
    const isMatch = await bcrypt.compare(password, passwordHash);
    if (!isMatch) {
      logger.warn(
        `⚠️  Invalid login attempt for email: ${email || phoneNumber}`
      );
      return res
        .status(400)
        .json({ message: "Invalid credentials or user disabled" });
    }

    logger.info(`✔️  User logged in successfully: userId ${userId}`);
    return res.status(200).json({
      message: "User logged in successfully",
      data: {
        token: generateToken({ userId, role }),
        userName,
        phoneNumber,
        email,
      },
    });
  } catch (error) {
    logger.error(`❌  Error during user login: ${error?.stack}`);
    return res.status(500).json(handleError({ error: error?.message }));
  }
});

module.exports = userRouter;
