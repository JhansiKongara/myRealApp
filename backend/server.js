const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const redis = require("redis");
const jwt = require("jsonwebtoken");
const path = require("path");
const dotEnv = require("dotenv");

dotEnv.config({ path: `.env.${process.env.NODE_ENV}` });
const userRoutes = require("./routes/userRoutes");
const { managedDbConnection } = require("./services/database.service");
const appRouter = require("./routes/app.routes");

const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
managedDbConnection().then(() => {
  console.info("✔️  Database connection established successfully!");
});

// Redis client setup
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

redisClient.on("connect", function () {
  console.info("✔️  Connected to Redis.");
});

redisClient.on("error", function (err) {
  console.error(`❌  Redis connection error: ${err.message}`);
});

// JWT authentication middleware
function authenticateJWT(req, res, next) {
  const token = req.header("Authorization");
  if (!token) {
    console.warn(
      `⚠️  Token not provided in request: ${req.method} ${req.originalUrl}`
    );
    return res.status(403).json({ message: "Access denied" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.warn(
        `⚠️  Invalid token for request: ${req.method} ${req.originalUrl}`
      );
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = user;
    next();
  });
}

// Use routes
app.use("/", appRouter);

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "frontend", "build")));
  app.get("*", (req, res) => {
    console.info(`✔️  Serving static file for request: ${req.originalUrl}`);
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
}

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.info(
    `✔️  Server started successfully! 🌐 Running on: ${process.env.SERVER_HOST}${port}`
  );
});
