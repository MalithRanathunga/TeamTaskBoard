import Board from "../models/Boards.js";
import User from "../models/User.js";

// getAllBoards controller
export const getAllBoards = async (req, res) => {
  try {
    const boards = await Board.find({
      $or: [{ owner: req.user._id }, { members: req.user._id }],
    })
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
    const { title, description, members, columns } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "Title is a required field",
      });
    }

    const board = new Board({
      title,
      description,
      owner: req.user._id,
      members: members && members.length > 0 ? members : [req.user._id],
      columns: columns || ["todo", "in-progress", "done"],
    });

    const savedBoard = await board.save();
    const populatedBoard = await Board.findById(savedBoard._id)
      .populate("owner", "name email")
      .populate("members", "name email");

    res.status(201).json(populatedBoard);
  } catch (error) {
    console.error("Error in createBoard controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// addMemberToBoard controller
export const addMemberToBoard = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const userToInvite = await User.findOne({ email: email.toLowerCase() });
    if (!userToInvite) {
      return res.status(404).json({ message: "User with this email not found" });
    }

    const board = await Board.findById(req.params.id);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    // Check if user is already a member
    const isAlreadyMember = board.members.some(
      (memberId) => memberId.toString() === userToInvite._id.toString()
    );

    if (isAlreadyMember) {
      return res.status(400).json({ message: "User is already a member of this board" });
    }

    board.members.push(userToInvite._id);
    await board.save();

    const updatedBoard = await Board.findById(board._id)
      .populate("owner", "name email")
      .populate("members", "name email");

    res.status(200).json(updatedBoard);
  } catch (error) {
    console.error("Error in addMemberToBoard controller:", error);
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