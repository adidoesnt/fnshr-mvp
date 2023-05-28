import type { NextApiRequest, NextApiResponse } from "next";
import { initDb, closeDb } from "./repository";
import bcrypt from "bcrypt";
import { User } from "./schemas";

type SignupStatus = "success" | "failure" | "user already exists";

type Data = {
  username: string;
  points?: number;
  friends?: string[];
  status: SignupStatus;
  admin?: boolean;
};

const saltRounds = 10;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    await initDb();
    const { username, password } = req.body;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    const points = 0;
    const testUser = await User.findOne({ username });
    const friends: string[] = [];
    const admin = false;
    if (testUser) {
      await closeDb();
      res.status(409).json({ username, status: "user already exists" });
    } else {
      try {
        await new User({
          username,
          salt,
          hash,
          points,
          friends,
          admin,
        }).save();
        await closeDb();
        res
          .status(201)
          .json({ username, points, friends, admin, status: "success" });
      } catch (err) {
        res.status(500).json({ username, status: "failure" });
      }
    }
  }
}
