import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { useAuth } from "./useAuth";
import { socketService } from "../services/socket";

export const useSocket = () => {
  const { token } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (token) {
      const newSocket = socketService.connect(token);
      setSocket(newSocket);

      return () => {
        socketService.disconnect();
      };
    }
  }, [token]);

  return socket;
};
