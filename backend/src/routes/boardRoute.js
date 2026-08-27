import express from "express";

import { getAllBoards, getBoardById, createBoard, updateBoard, deleteBoard } from "../controllers/boardRoutesController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getAllBoards);
router.get("/:id", getBoardById);
router.post("/", createBoard);
router.put("/:id", updateBoard);
router.delete("/:id", deleteBoard);

export default router;