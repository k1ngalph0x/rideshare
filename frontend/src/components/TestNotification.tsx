import { useSocket } from "../hooks/useSockets";

export const TestNotification = () => {
  const socket = useSocket();

  const sendTestNotification = () => {
    if (socket) {
      socket.emit("update_status", "Testing notification");
    }
  };

  return (
    <button
      onClick={sendTestNotification}
      className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
    >
      Send Test Notification
    </button>
  );
};
