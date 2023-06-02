import type { NextApiRequest, NextApiResponse } from "next";
import { initDb, closeDb } from "./repository";
import { Notification } from "./schemas";

type FindStatus = "success" | "failure";

type Data = {
  notifications: (typeof Notification)[];
  status: FindStatus;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "GET") {
    await initDb();
    try {
      const notifications = (await Notification.find({})) as (typeof Notification)[];
      res.status(200).json({ notifications, status: "success" });
    } catch (err) {
      res.status(500).json({ notifications: [], status: "failure" });
    }
    await closeDb();
  }
}
