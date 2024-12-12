import { io, Socket } from "socket.io-client";

class SocketService {
  private socket: Socket | null = null;

  API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

  connect(token: string) {
    this.socket = io(this.API_URL, {
      auth: { token },
    });

    this.socket.on("connect", () => {
      console.log("Connected to WebSocket");
    });

    this.socket.on("connect_error", (error) => {
      console.error("WebSocket connection error:", error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket() {
    return this.socket;
  }
}

export const socketService = new SocketService();
