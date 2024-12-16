// import { useState, useEffect } from "react";
// import { useSocket } from "../hooks/useSockets";

// export const Chat = () => {
//   const socket = useSocket();
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState<
//     Array<{
//       message: string;
//       timestamp: string;
//     }>
//   >([]);

//   useEffect(() => {
//     if (socket) {
//       socket.on("global_notification", (data) => {
//         setMessages((prev) => [
//           ...prev,
//           {
//             message: data.message,
//             timestamp: data.createdAt,
//           },
//         ]);
//       });

//       socket.on("user_status_change", (data) => {
//         setMessages((prev) => [
//           ...prev,
//           {
//             message: `${data.username} changed status to: ${data.status}`,
//             timestamp: new Date().toISOString(),
//           },
//         ]);
//       });
//     }
//   }, [socket]);

//   const sendMessage = () => {
//     if (socket && message.trim()) {
//       socket.emit("broadcast_message", message);
//       setMessage("");
//     }
//   };

//   return (
//     <div className="bg-white shadow rounded-lg p-6">
//       <h2 className="text-xl font-semibold mb-4">Global Chat</h2>
//       <div className="space-y-4 max-h-60 overflow-y-auto mb-4">
//         {messages.map((msg, index) => (
//           <div key={index} className="p-3 bg-gray-50 rounded">
//             <p>{msg.message}</p>
//             <p className="text-xs text-gray-500">
//               {new Date(msg.timestamp).toLocaleString()}
//             </p>
//           </div>
//         ))}
//       </div>
//       <div className="flex gap-2">
//         <input
//           type="text"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           className="flex-1 border rounded p-2"
//           placeholder="Type your message..."
//         />
//         <button
//           onClick={sendMessage}
//           className="bg-blue-500 text-white px-4 py-2 rounded"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// };
import { useState, useEffect } from "react";
import { useSocket } from "../hooks/useSockets";

interface ChatMessage {
  username: string;
  message: string;
  timestamp: string;
}

export const Chat = () => {
  const socket = useSocket();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (socket) {
      socket.on("connect", () => {
        console.log("Chat connected");
        setIsConnected(true);
      });

      socket.on("disconnect", () => {
        console.log("Chat disconnected");
        setIsConnected(false);
      });

      // Listen for chat messages
      socket.on("chat_message", (data: ChatMessage) => {
        console.log("Received message:", data);
        setMessages((prev) => [...prev, data]);
      });

      // Listen for user disconnections
      socket.on("user_disconnected", (data) => {
        setMessages((prev) => [
          ...prev,
          {
            username: "System",
            message: `${data.username} has left the chat`,
            timestamp: data.timestamp,
          },
        ]);
      });

      return () => {
        socket.off("connect");
        socket.off("disconnect");
        socket.off("chat_message");
        socket.off("user_disconnected");
      };
    }
  }, [socket]);

  const sendMessage = () => {
    if (socket && message.trim()) {
      console.log("Sending message:", message);
      socket.emit("broadcast_message", message);
      setMessage("");
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">
        Global Chat {isConnected ? "(Connected)" : "(Disconnecting...)"}
      </h2>

      <div className="space-y-4 max-h-60 overflow-y-auto mb-4 bg-gray-50 p-4 rounded">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-center">No messages yet</p>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className="p-3 bg-white rounded shadow">
              <p className="text-sm font-semibold text-gray-600">
                {msg.username}
              </p>
              <p className="break-words">{msg.message}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(msg.timestamp).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 border rounded p-2"
          placeholder="Type your message..."
          disabled={!isConnected}
        />
        <button
          onClick={sendMessage}
          disabled={!isConnected || !message.trim()}
          className={`px-4 py-2 rounded ${
            isConnected && message.trim()
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Send
        </button>
      </div>
    </div>
  );
};
