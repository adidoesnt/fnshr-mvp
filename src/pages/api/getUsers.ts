import type { NextApiRequest, NextApiResponse } from "next";
import { initDb, closeDb } from "./repository";
import { User } from "./schemas";
import { preflight } from "./preflight";

type FindStatus = "success" | "failure";

type Data = {
  users: (typeof User)[];
  status: FindStatus;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if(!preflight(req)) {
    res.status(403).json({status: "unauthorised"} as any)
    return;
  }
  if (req.method === "GET") {
    await initDb();
    try {
      const users = (await User.find({})) as (typeof User)[];
      res.status(200).json({ users, status: "success" });
    } catch (err) {
      res.status(500).json({ users: [], status: "failure" });
    }
    await closeDb();
  }
}
