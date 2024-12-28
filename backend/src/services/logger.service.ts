import winston from "winston";
import type { TransformableInfo } from "logform";
import "winston-daily-rotate-file";
import path from "path";
import { existsSync, mkdirSync } from "fs";

const logDirectory = path.join(__dirname, "../logs");

if (!existsSync(logDirectory)) {
  mkdirSync(logDirectory, { recursive: true });
}

const transport = new winston.transports.DailyRotateFile({
  filename: path.join(logDirectory, "%DATE%.log"),
  datePattern: "YYYYMMDD",
  zippedArchive: true,
  maxFiles: "3y",
  level: "info",
});

const logger = winston.createLogger({
  level: "info",
  transports: [transport],
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(
      ({ timestamp, level, message }: TransformableInfo) => {
        const cleanedMessage = String(message)
          .replace(/[\n\t]/g, " ")
          .replace(/\s{2,}/g, " ")
          .trim();
        return `${timestamp} [${level}]: ${cleanedMessage}`;
      }
    )
  ),
});

export { logger };
