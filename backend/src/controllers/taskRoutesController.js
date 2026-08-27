import Task from "../models/Tasks.js";

// getAllTasks controller
export const getAllTasks = async (req, res) => {
  try {
    const { boardId, status, priority, search } = req.query;

    const filter = {};

    // Filter by specific board
    if (boardId) {
      filter.boardId = boardId;
    }

    // Filter by status
    if (status) {
      filter.status = status;
    }

    // Filter by priority
    if (priority) {
      filter.priority = priority;
    }

    // Search by title or description
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

// getTaskById controller
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("assignee", "name email")
      .populate("createdBy", "name email");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(task);
  } catch (error) {
    console.error("Error in getTaskById controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// createTask controller
export const createTask = async (req, res) => {
  try {
    const {
      boardId,
      title,
      description,
      status,
      priority,
      dueDate,
      assignee,
      createdBy,
      order,
    } = req.body;

    if (!title || !boardId || !createdBy) {
      return res.status(400).json({
        message: "title, boardId, and createdBy are required fields",
      });
    }

    const task = new Task({
      boardId,
      title,
      description,
      status,
      priority,
      dueDate,
      assignee,
      createdBy: req.user._id,
      order,
    });

    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (error) {
    console.error("Error in createTask controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// updateTask controller
export const updateTask = async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    )
      .populate("assignee", "name email")
      .populate("createdBy", "name email");

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Error in updateTask controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// deleteTask controller
export const deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error in deleteTask controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};