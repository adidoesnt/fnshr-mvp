import type { NextApiRequest, NextApiResponse } from "next";
import { initDb, closeDb } from "./repository";
import { User } from "./schemas";

type UpdateStatus = "success" | "failure";

type Data = {
  username: string;
  points?: number;
  status: UpdateStatus;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    await initDb();
    const { username, pledge } = req.body;
    try {
      const user = await User.findOne({ username });
      const { points } = user;
      let numericPoints = parseInt(points);
      const numericPledge = parseInt(pledge);
      numericPoints -= numericPledge;
      await User.updateOne({ username }, { points: numericPoints });
      await closeDb();
      res.status(200).json({ username, points: numericPoints, status: "success" });
    } catch {
      await closeDb();
      res.status(500).json({ username, status: "failure" });
    }
  }
}
