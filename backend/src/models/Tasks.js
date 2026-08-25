import mongoose from "mongoose"

const taskSchema = new mongoose.Schema(
  {
    boardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
      required: [true, "Task must belong to a board"]
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true
    },
    description: {
      type: String,
      default: ""
    },
    status: {
      type: String,
      default: "todo",
      enum: ["todo", "in-progress", "done"]
    },
    priority: {
      type: String,
      default: "medium",
      enum: ["low", "medium", "high"],
    },
    dueDate: {
      type: Date,
      default: null
    },
    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    order: {
      type: Number,
      default: 0
    },
  }, { timestamps: true }
)

const Task = mongoose.model("Task", taskSchema)

export default Task