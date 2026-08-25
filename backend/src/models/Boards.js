import mongoose from "mongoose"

const boardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Board must have an owner"]
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    columns: {
      type: [String],
      default: ["todo", "in-progress", "done"],
    },
  }, { timestamps: true }
)

const Board = mongoose.model("Board", boardSchema)

export default Board