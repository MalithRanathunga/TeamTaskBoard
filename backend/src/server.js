import express from "express"
import dotenv from "dotenv"

import { connectDB } from "./config/db.js";
import userRoutes from "./routes/userRoute.js";
import taskRoutes from "./routes/taskRoute.js";
import boardRoutes from "./routes/boardRoute.js";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json())

app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/boards", boardRoutes);

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server started on port: ${port}`);
  })
})