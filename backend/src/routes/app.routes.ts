import express from "express";
import userRouter from "./userRoutes";
import { logger } from "../services/logger.service";

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

export = appRouter;
