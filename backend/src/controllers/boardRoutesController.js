import Board from "../models/Boards.js";

// getAllBoards controller
export const getAllBoards = async (req, res) => {
  try {
    const boards = await Board.find()
      .populate("owner", "name email")
      .populate("members", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(boards);
  } catch (error) {
    console.error("Error in getAllBoards controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// getBoardById controller
export const getBoardById = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id)
      .populate("owner", "name email")
      .populate("members", "name email");

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    res.status(200).json(board);
  } catch (error) {
    console.error("Error in getBoardById controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// createBoard controller
export const createBoard = async (req, res) => {
  try {
    const { title, description, owner, members, columns } = req.body;

    if (!title || !owner) {
      return res.status(400).json({
        message: "Title and owner are required fields",
      });
    }

    const board = new Board({
      title,
      description,
      owner,
      members,
      columns,
    });

    const savedBoard = await board.save();
    res.status(201).json(savedBoard);
  } catch (error) {
    console.error("Error in createBoard controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// updateBoard controller
export const updateBoard = async (req, res) => {
  try {
    const updatedBoard = await Board.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    )
      .populate("owner", "name email")
      .populate("members", "name email");

    if (!updatedBoard) {
      return res.status(404).json({ message: "Board not found" });
    }

    res.status(200).json(updatedBoard);
  } catch (error) {
    console.error("Error in updateBoard controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// deleteBoard controller
export const deleteBoard = async (req, res) => {
  try {
    const deletedBoard = await Board.findByIdAndDelete(req.params.id);

    if (!deletedBoard) {
      return res.status(404).json({ message: "Board not found" });
    }

    res.status(200).json({ message: "Board deleted successfully" });
  } catch (error) {
    console.error("Error in deleteBoard controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};