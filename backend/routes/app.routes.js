const express = require("express");
const userRouter = require("./userRoutes");
const { logger } = require("../services/logger.service");

const appRouter = express.Router();

/**
 * Main API router that handles user routes
 */
appRouter.use(
  "/api/users",
  (req, res, next) => {
    logger.info(
      `✔️  API Request received at /api/users: ${req.method} ${req.originalUrl}`
    );
    next();
  },
  userRouter
);

module.exports = appRouter;
