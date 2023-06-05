import type { NextApiRequest, NextApiResponse } from "next";
import { initDb, closeDb } from "./repository";
import { Task } from "./schemas";
import { preflight } from "./preflight";

type FindStatus = "success" | "failure";

type Data = {
  tasks: (typeof Task)[];
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
    await initDb();
    try {
      const tasks = (await Task.find({})) as (typeof Task)[];
      res.status(200).json({ tasks, status: "success" });
    } catch (err) {
      res.status(500).json({ tasks: [], status: "failure" });
    }
    await closeDb();
  }
}
