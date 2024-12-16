// import { useEffect, useState } from "react";
// import { useSocket } from "../hooks/useSockets";
// import { useQuery, gql } from "@apollo/client";
// import { Notification } from "../types/notification";
// import { TestNotification } from "./TestNotification";

// const GET_NOTIFICATIONS = gql`
//   query GetNotifications {
//     notifications {
//       id
//       message
//       read
//       createdAt
//     }
//   }
// `;

// export const NotificationsList = () => {
//   const socket = useSocket();
//   const { data, loading } = useQuery(GET_NOTIFICATIONS);
//   const [notifications, setNotifications] = useState<Notification[]>([]);

//   useEffect(() => {
//     if (data) {
//       setNotifications(data.notifications);
//     }
//   }, [data]);

//   useEffect(() => {
//     if (socket) {
//       socket.on("notification", (newNotification: Notification) => {
//         setNotifications((prev) => [newNotification, ...prev]);
//       });

//       return () => {
//         socket.off("notification");
//       };
//     }
//   }, [socket]);

//   if (loading) return <div>Loading notifications...</div>;

//   return (
//     <div className="bg-white shadow rounded-lg p-6">
//       <h2 className="text-xl font-semibold mb-4">Notifications</h2>
//       <TestNotification />
//       <div className="space-y-4 mt-4">
//         {notifications.map((notification) => (
//           <div
//             key={notification.id}
//             className={`p-4 rounded-lg ${
//               notification.read ? "bg-gray-50" : "bg-blue-50"
//             }`}
//           >
//             <p className="text-gray-900">{notification.message}</p>
//             <p className="text-sm text-gray-500">
//               {new Date(notification.createdAt).toLocaleString()}
//             </p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };
