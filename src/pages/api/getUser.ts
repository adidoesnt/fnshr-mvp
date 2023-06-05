import type { NextApiRequest, NextApiResponse } from "next";
import { initDb, closeDb } from "./repository";
import { User } from "./schemas";
import { preflight } from "./preflight";

type FindStatus = "success" | "failure";

type Data = {
  user?: typeof User;
  status: FindStatus;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if(!preflight(req)) {
    res.status(403).json({status: "unauthorised"} as any)
  }
  if (req.method === "GET") {
    const query = req.query;
    const { username } = query;
    await initDb();
    try {
      const user = (await User.findOne({ username })) as typeof User;
      res.status(200).json({ user, status: "success" });
    } catch (err) {
      res.status(404).json({ status: "failure" });
    }
    await closeDb();
  }
}
