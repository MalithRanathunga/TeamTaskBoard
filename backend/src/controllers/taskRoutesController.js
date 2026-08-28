import Task from "../models/Tasks.js";
import { getIO } from "../socket.js";

// Helper to broadcast safely without crashing if socket is uninitialized during tests
const broadcastToBoard = (boardId, eventName, data) => {
  try {
    const io = getIO();
    io.to(boardId.toString()).emit(eventName, data);
  } catch (err) {
    // Suppress error during test environments
  }
};

export const getAllTasks = async (req, res) => {
  try {
    const { boardId, status, priority, search } = req.query;
    const filter = {};

    if (boardId) filter.boardId = boardId;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const tasks = await Task.find(filter)
      .populate("assignee", "name email")
      .populate("createdBy", "name email")
      .sort({ order: 1, createdAt: -1 });

    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error in getAllTasks controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("assignee", "name email")
      .populate("createdBy", "name email");

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.status(200).json(task);
  } catch (error) {
    console.error("Error in getTaskById controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createTask = async (req, res) => {
  try {
    const { boardId, title, description, status, priority, dueDate, assignee, order } = req.body;

    if (!title || !boardId) {
      return res.status(400).json({ message: "title and boardId are required fields" });
    }

    const task = new Task({
      boardId,
      title,
      description,
      status: status || "todo",
      priority: priority || "medium",
      dueDate,
      assignee: assignee || null,
      createdBy: req.user._id,
      order: order || 0,
    });

    const savedTask = await task.save();

    const populatedTask = await Task.findById(savedTask._id)
      .populate("assignee", "name email")
      .populate("createdBy", "name email");

    // Real-time broadcast to board members
    broadcastToBoard(boardId, "task_created", populatedTask);

    res.status(201).json(populatedTask);
  } catch (error) {
    console.error("Error in createTask controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateTask = async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    )
      .populate("assignee", "name email")
      .populate("createdBy", "name email");

    if (!updatedTask) return res.status(404).json({ message: "Task not found" });

    // Real-time broadcast to board members
    broadcastToBoard(updatedTask.boardId, "task_updated", updatedTask);

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Error in updateTask controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (!deletedTask) return res.status(404).json({ message: "Task not found" });

    // Real-time broadcast to board members
    broadcastToBoard(deletedTask.boardId, "task_deleted", { taskId: deletedTask._id });

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error in deleteTask controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};