// import { useEffect, useState } from "react";
// import { Socket } from "socket.io-client";
// import { useAuth } from "./useAuth";
// import { socketService } from "../services/socket";

// export const useSocket = () => {
//   const { token } = useAuth();
//   const [socket, setSocket] = useState<Socket | null>(null);

//   useEffect(() => {
//     if (token) {
//       const newSocket = socketService.connect(token);
//       setSocket(newSocket);

//       return () => {
//         socketService.disconnect();
//       };
//     }
//   }, [token]);

//   return socket;
// };
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { useAuth } from "./useAuth";
import { socketService } from "../services/socket";
export const useSocket = () => {
  const { token } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!token) {
      console.log("No token available");
      return;
    }

    console.log("Attempting to connect with token");
    const newSocket = socketService.connect(token);
    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [token]);

  return socket;
};
