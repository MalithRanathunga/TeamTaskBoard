import express from "express"
import dotenv from "dotenv"
import cors from "cors"

import { connectDB } from "./config/db.js";
import userRoutes from "./routes/userRoute.js";
import taskRoutes from "./routes/taskRoute.js";
import boardRoutes from "./routes/boardRoute.js";
import authRoutes from "./routes/authRoute.js";
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json())

app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api/auth", authRoutes);

app.use(notFound);
app.use(errorHandler);

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server started on port: ${port}`);
  })
})