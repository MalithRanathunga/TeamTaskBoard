import express from "express";
import {
  getAllBoards,
  getBoardById,
  createBoard,
  addMemberToBoard,
  updateBoard,
  deleteBoard,
} from "../controllers/boardRoutesController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Boards
 *   description: Board management and collaboration
 */

/**
 * @swagger
 * /boards:
 *   get:
 *     summary: Get all boards accessible by the authenticated user
 *     tags: [Boards]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user boards
 *   post:
 *     summary: Create a new board
 *     tags: [Boards]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title:
 *                 type: string
 *                 example: Sprint 1 Workspace
 *               description:
 *                 type: string
 *                 example: Core sprint tracking board
 *     responses:
 *       201:
 *         description: Board created successfully
 */
router.get("/", getAllBoards);
router.post("/", createBoard);

/**
 * @swagger
 * /boards/{id}:
 *   get:
 *     summary: Get board details by ID
 *     tags: [Boards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Board details
 *       404:
 *         description: Board not found
 *   put:
 *     summary: Update board details
 *     tags: [Boards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Board updated
 *   delete:
 *     summary: Delete a board
 *     tags: [Boards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Board deleted
 */
router.get("/:id", getBoardById);
router.put("/:id", updateBoard);
router.delete("/:id", deleteBoard);

/**
 * @swagger
 * /boards/{id}/members:
 *   post:
 *     summary: Add a member to a board by email
 *     tags: [Boards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 example: teammate@example.com
 *     responses:
 *       200:
 *         description: Member added successfully
 *       404:
 *         description: User or Board not found
 */
router.post("/:id/members", addMemberToBoard);

export default router;