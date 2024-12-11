import { useState, useEffect } from "react";
import { useSocket } from "../hooks/useSockets";

export const Chat = () => {
  const socket = useSocket();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    Array<{
      message: string;
      timestamp: string;
    }>
  >([]);

  useEffect(() => {
    if (socket) {
      socket.on("global_notification", (data) => {
        setMessages((prev) => [
          ...prev,
          {
            message: data.message,
            timestamp: data.createdAt,
          },
        ]);
      });

      socket.on("user_status_change", (data) => {
        setMessages((prev) => [
          ...prev,
          {
            message: `${data.username} changed status to: ${data.status}`,
            timestamp: new Date().toISOString(),
          },
        ]);
      });
    }
  }, [socket]);

  const sendMessage = () => {
    if (socket && message.trim()) {
      socket.emit("broadcast_message", message);
      setMessage("");
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Global Chat</h2>
      <div className="space-y-4 max-h-60 overflow-y-auto mb-4">
        {messages.map((msg, index) => (
          <div key={index} className="p-3 bg-gray-50 rounded">
            <p>{msg.message}</p>
            <p className="text-xs text-gray-500">
              {new Date(msg.timestamp).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 border rounded p-2"
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};
