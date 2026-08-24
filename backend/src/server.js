import express from "express"
import dotenv from "dotenv"

import { connectDB } from "./config/db.js";

dotenv.config();

const app = express();
const port = process.env.PORT;

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server started on port: ${port}`);
  })
})