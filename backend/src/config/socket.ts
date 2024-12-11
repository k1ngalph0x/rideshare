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
    const username = socket.data.user.username;
    console.log(`User connected: ${username}`);

    socket.join(`user:${socket.data.user.id}`);

    socket.join("global-updates");

    socket.on("broadcast_message", (message: string) => {
      io.to("global-updates").emit("global_notification", {
        id: Date.now().toString(),
        message: `${username}: ${message}`,
        createdAt: new Date().toISOString(),
        read: false,
      });
    });

    socket.on("update_status", (status: string) => {
      socket.broadcast.emit("user_status_change", {
        userId: socket.data.user.id,
        username: username,
        status: status,
      });

      io.to(`user:${socket.data.user.id}`).emit("notification", {
        id: Date.now().toString(),
        message: `Your status was updated to: ${status}`,
        createdAt: new Date().toISOString(),
        read: false,
      });
    });

    socket.on("disconnect", () => {
      io.to("global-updates").emit("user_disconnected", {
        username: username,
        timestamp: new Date().toISOString(),
      });
      console.log(`User disconnected: ${username}`);
    });
  });

  return io;
};
