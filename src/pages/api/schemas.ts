import mongoose from "mongoose";
const { model, Schema } = mongoose;

export const notificationSchema = new Schema({
  content: { type: String, required: true },
  toAcknowledge: { type: [String], required: true },
});

export const userSchema = new Schema({
  username: { type: String, required: true },
  salt: { type: String, required: true },
  hash: { type: String, required: true },
  points: { type: Number, required: true },
  friends: { type: [String], required: true },
  admin: { type: Boolean, required: true },
});

export const taskSchema = new Schema({
  username: { type: String, required: true },
  name: { type: String, required: true },
  deadline: { type: String, required: true },
  pledge: { type: String, required: true },
  status: {
    type: String,
    required: true,
    enum: ["ongoing", "completed", "missed"],
  },
  prompts: {
    type: [String],
    required: true,
  },
});

export const paymentSchema = new Schema({
  username: { type: String, required: true },
  amount: { type: Number, required: true },
  refNumber: { type: String, required: true },
  date: { type: String, required: true },
});

export const User = mongoose.models.User || model("User", userSchema);
export const Task = mongoose.models.Task || model("Task", taskSchema);
export const Payment =
  mongoose.models.Payment || model("Payment", paymentSchema);
export const Notification =
  mongoose.models.Notification || model("Notification", notificationSchema);
