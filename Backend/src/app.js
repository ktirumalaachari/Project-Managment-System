import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// Basic Configurations
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//cors Configurations
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Import the Routes
import healthCheckRouter from "./routes/HealthCheck.routes.js";
import authRouter from "./routes/auth.routes.js";
import projectRouter from "./routes/project.routes.js";
import taskRouter from "./routes/task.routes.js";
import noteRouter from "./routes/note.routes.js";

app.use("/api/v1/healthcheck", healthCheckRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/tasks", taskRouter);
app.use("/api/v1/notes", noteRouter);

app.get("/", (req, res) =>{
  res.send("Welcome to Backend Project.")
});

import { ApiError } from "./utils/api-error.js";

app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode || 500).json({
      success: err.success,
      message: err.message,
      errors: err.errors,
      data: err.data
    });
  }
  return res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack: err.stack
  });
});

export default app;
