import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";
import connectDB from "./config/db.js";
import { initSocket } from "./socket.js";

import authRoutes from "./routes/authRoute.js";
import boardRoutes from "./routes/boardRoute.js";
import taskRoutes from "./routes/taskRoute.js";
import userRoutes from "./routes/userRoute.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Swagger Documentation Route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);

// Create HTTP Server & Initialize WebSockets
const server = http.createServer(app);
initSocket(server);

// Connect the database and start the server
connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running on port: ${PORT}`);
      console.log(`Swagger Docs: http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server due to database error:", err);
  });