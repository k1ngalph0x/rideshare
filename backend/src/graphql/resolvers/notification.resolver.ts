// import { Notification } from "../../models/Notification";
// import { pubsub } from "../../config/pubsub";

// const NOTIFICATION_RECEIVED = "NOTIFICATION_RECEIVED";

// export const notificationResolvers = {
//   Query: {
//     notifications: async (_, __, { user }) => {
//       return await Notification.find({ userId: user.id }).sort({
//         createdAt: -1,
//       });
//     },
//   },

//   Mutation: {
//     markNotificationRead: async (_, { id }, { user }) => {
//       const notification = await Notification.findOneAndUpdate(
//         { _id: id, userId: user.id },
//         { read: true },
//         { new: true }
//       );
//       return notification;
//     },
//   },

//   Subscription: {
//     notificationReceived: {
//       subscribe: () => pubsub.asyncIterator([NOTIFICATION_RECEIVED]),
//     },
//   },
// };
