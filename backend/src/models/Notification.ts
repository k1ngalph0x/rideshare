import mongoose, { Document, Schema } from "mongoose";

export interface INotification extends Document {
  userId: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

const notificationSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export const Notification = mongoose.model<INotification>(
  "Notification",
  notificationSchema
);
