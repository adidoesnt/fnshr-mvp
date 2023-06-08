import type { NextApiRequest, NextApiResponse } from "next";
import { initDb, closeDb } from "./repository";
import bcrypt from "bcrypt";
import { User } from "./schemas";
import { preflight } from "./preflight";

export type LoginStatus = "Success" | "User not found" | "Incorrect password";

type Data = {
  username: string;
  points: number;
  friends: string[];
  admin: boolean;
  customerID: string;
  status: LoginStatus;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (!preflight(req)) {
    res.status(403).json({ status: "unauthorised" } as any);
  }
  if (req.method === "POST") {
    await initDb();
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      await closeDb();
      return res
        .status(404)
        .json({ username, status: "User not found" } as any);
    } else {
      await closeDb();
      const { hash, points, friends, admin, customerID } = user;
      if (await bcrypt.compare(password, hash)) {
        return res
          .status(200)
          .json({
            username,
            points,
            friends,
            admin,
            customerID,
            status: "Success",
          });
      } else {
        return res
          .status(401)
          .json({ username, status: "Incorrect password" } as any);
      }
    }
  }
}
