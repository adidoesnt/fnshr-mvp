import type { NextApiRequest, NextApiResponse } from "next";
import { initDb, closeDb } from "./repository";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

const User = mongoose.model("User");

type LoginStatus = "success" | "not found" | "incorrect password";

type Data = {
  username: string;
  status: LoginStatus;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    await initDb();
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      await closeDb();
      return res.status(404).json({ username, status: "not found", body: req.body } as any);
    } else {
      await closeDb();
      const { hash } = user;
      if (await bcrypt.compare(password, hash)) {
        return res.status(200).json({ username, status: "success" });
      } else {
        return res
          .status(401)
          .json({ username, status: "incorrect password" } as any);
      }
    }
  }
}
