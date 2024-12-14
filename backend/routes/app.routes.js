const express = require("express");
const userRouter = require("./userRoutes");

const appRouter = express.Router();

/**
 * Main API router that handles user routes
 */
appRouter.use(
  "/api/users",
  (req, res, next) => {
    console.info(
      `✔️  API Request received at /api/users: ${req.method} ${req.originalUrl}`
    );
    next(); // Proceed to the next middleware or route
  },
  userRouter
);

module.exports = appRouter;
