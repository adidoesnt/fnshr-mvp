import type { NextApiRequest, NextApiResponse } from "next";
import { initDb, closeDb } from "./repository";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

const User = mongoose.model("User");

type SignupStatus = "success" | "failure";

type Data = {
  username: string;
  status: SignupStatus;
};

const saltRounds = 10;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await initDb();
  const { username, password } = req.body;
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(password, salt);
  try {
    await new User({
      username,
      salt,
      hash,
    }).save();
    await closeDb();
    res.status(201).json({ username, status: "success" });
  } catch (err) {
    res.status(500).json({ username, status: "failure"});
  }
}
