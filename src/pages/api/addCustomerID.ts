import type { NextApiRequest, NextApiResponse } from "next";
import { initDb, closeDb } from "./repository";
import { User } from "./schemas";
import { preflight } from "./preflight";

type UpdateStatus = "success" | "failure";

type Data = {
  username: string;
  customerID?: string;
  status: UpdateStatus;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (!preflight(req)) {
    res.status(403).json({ status: "unauthorised" } as any);
  }
  if (req.method === "PUT") {
    await initDb();
    const { username, customerID } = req.body;
    try {
      await User.updateOne({ username }, { $set: { customerID } });
      await closeDb();
      res.status(200).json({ username, customerID, status: "success" });
    } catch {
      await closeDb();
      res.status(500).json({ username, status: "failure" });
    }
  }
}
