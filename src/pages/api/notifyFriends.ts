import type { NextApiRequest, NextApiResponse } from "next";
import { initDb, closeDb } from "./repository";
import { Notification, User } from "./schemas";
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
  if (req.method === "POST") {
    const { username, content } = req.body;
    await initDb();
    try {
      const user = await User.findOne({ username });
      const { friends } = user;
      const notification = new Notification({
        content,
        toAcknowledge: friends,
      });
      await notification.save();
      res.status(200).json({ user, status: "success" });
    } catch (err) {
      res.status(404).json({ status: "failure" });
    }
    await closeDb();
  }
}
