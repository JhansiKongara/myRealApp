const winston = require("winston");
require("winston-daily-rotate-file");
const path = require("path");
const { existsSync, mkdirSync } = require("fs");

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
    winston.format.printf(({ timestamp, level, message }) => {
      const cleanedMessage = message
        .replace(/[\n\t]/g, " ")
        .replace(/\s{2,}/g, " ")
        .trim();
      return `${timestamp} [${level}]: ${cleanedMessage}`;
    })
  ),
});

module.exports = { logger };
