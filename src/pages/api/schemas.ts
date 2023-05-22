import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true },
  salt: { type: String, required: true },
  hash: { type: String, required: true}
});

export const User = model("User", userSchema);
