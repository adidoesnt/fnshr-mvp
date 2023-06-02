import type { NextApiRequest, NextApiResponse } from "next";
import { initDb, closeDb } from "./repository";
import { Notification } from "./schemas";

type FindStatus = "success" | "failure";

type Data = {
  status: FindStatus;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    const { content, friend } = req.body;
    await initDb();
    try {
      const notification = new Notification({
        content,
        toAcknowledge: [friend],
      });
      await notification.save();
      res.status(200).json({ status: "success" });
    } catch (err) {
      res.status(404).json({ status: "failure" });
    }
    await closeDb();
  }
}
