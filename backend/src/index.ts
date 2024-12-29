import dotEnv from "dotenv";

import express from "express";
import cors from "cors";
import morgan from "morgan";
// import redis from "redis";
import path from "path";
const envPath = path.join(__dirname, `.env.${process.env.NODE_ENV}`);
dotEnv.config({ path: envPath });
import { logger } from "./services/logger.service";
const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 5000;
app.listen(port, () => {
  logger.info(
    `✔️  Server started successfully!,
    🌐 Running on: ${process.env.SERVER_HOST}${port}`
  );
});
