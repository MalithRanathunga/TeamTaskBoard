import { Server } from "socket.io";

let io = null;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`Socket client connected: ${socket.id}`);

    // Join a specific board room
    socket.on("join_board", (boardId) => {
      socket.join(boardId);
      console.log(`Socket ${socket.id} joined board room: ${boardId}`);
    });

    // Leave a board room
    socket.on("leave_board", (boardId) => {
      socket.leave(boardId);
      console.log(`Socket ${socket.id} left board room: ${boardId}`);
    });

    socket.on("disconnect", () => {
      console.log(`Socket client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};