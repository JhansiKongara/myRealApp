const express = require("express");
const bcrypt = require("bcryptjs");
const {
  validateUser,
  validateUserLogin,
} = require("../validations/users.validation");
const { pgPool } = require("../config/db");
const { createUser, fetchUser } = require("../services/database.service");
const { handleError } = require("../services/errorHandle.service");
const { generateToken } = require("../utils/auth.service");

const userRouter = express.Router();

/**
 * User Registration Route
 */
userRouter.post("/register", async (req, res) => {
  try {
    const user = req.body;
    const { password, phoneNumber, loggedUserRole, ...userRequest } =
      validateUser({ user });

    console.info(`✔️  User registration request validated successfully!`);

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (loggedUserRole === "admin") {
      console.info(`🔒 Admin is creating a user.`);
      await createUser({
        hashedPassword,
        phoneNumber: phoneNumber?.toString(),
        ...userRequest,
      });
      console.info(`✔️  User created successfully by admin.`);
      return res.status(200).json({ message: "User created successfully" });
    } else {
      console.info(`📝 Creating a user with role: ${userRequest.role}`);
      const { userId, role, ...userData } = await createUser({
        hashedPassword,
        phoneNumber: phoneNumber?.toString(),
        ...userRequest,
      });
      console.info(`✔️  User created successfully with userId: ${userId}`);
      return res.status(200).json({
        message: "User created successfully",
        data: { token: generateToken({ userId, role }), ...userData },
      });
    }
  } catch (error) {
    console.error(`❌  Error during user registration: ${error?.stack}`);
    res.status(500).json(handleError({ error: error?.message }));
  }
});

/**
 * User Login Route
 */
userRouter.post("/login", async (req, res) => {
  try {
    const user = req.body;

    const { phoneNumber, email, password } = validateUserLogin({ user });
    console.info(`✔️  User login request validated successfully!`);

    const { userId, password_hash, role, userName } = await fetchUser({
      phoneNumber: phoneNumber?.toString(),
      email,
    });

    console.info(`🔍  Fetched user details for userId: ${userId}`);

    // Compare password
    const isMatch = await bcrypt.compare(password, password_hash);
    if (!isMatch) {
      console.warn(
        `⚠️  Invalid login attempt for email: ${email || phoneNumber}`
      );
      return res
        .status(400)
        .json({ message: "Invalid credentials or user disabled" });
    }

    console.info(`✔️  User logged in successfully: userId ${userId}`);
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
    console.error(`❌  Error during user login: ${error?.stack}`);
    res.status(500).json(handleError({ error: error?.message }));
  }
});

module.exports = userRouter;
