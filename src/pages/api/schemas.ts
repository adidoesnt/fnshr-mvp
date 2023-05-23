import mongoose from "mongoose";
const { model, Schema } = mongoose;

export const userSchema = new Schema({
  username: { type: String, required: true },
  salt: { type: String, required: true },
  hash: { type: String, required: true },
  points: { type: Number, required: true },
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
});

export const User = mongoose.models.User || model("User", userSchema);
export const Task = mongoose.models.Task || model("Task", taskSchema);
