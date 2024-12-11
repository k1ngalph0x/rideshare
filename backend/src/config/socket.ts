import { Server as SocketServer } from "socket.io";
import { Server } from "http";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

export const setupSocketIO = (httpServer: Server) => {
  const io = new SocketServer(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error("Authentication error"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        id: string;
      };
      const user = await User.findById(decoded.id);

      if (!user) {
        return next(new Error("Authentication error"));
      }

      socket.data.user = user;
      next();
    } catch (error) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.data.user.username}`);

    socket.join(`user:${socket.data.user.id}`);

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.data.user.username}`);
    });

    socket.on("update_status", (status: string) => {
      io.emit("user_status_changed", {
        userId: socket.data.user.id,
        status: status,
      });
    });
  });

  return io;
};
