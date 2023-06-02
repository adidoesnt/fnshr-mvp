import type { NextApiRequest, NextApiResponse } from "next";
import { initDb, closeDb } from "./repository";
import { Notification } from "./schemas";

type UpdateStatus = "success" | "failure";

type Data = {
  id: string;
  status: UpdateStatus;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    await initDb();
    const { id, username } = req.body;
    try {
      const notification = await Notification.findOne({ _id: id });
      const { toAcknowledge } = notification;
      const userIndex = toAcknowledge.findIndex(
        (item: any) => item === username
      );
      if (userIndex > -1) {
        toAcknowledge.splice(userIndex, 1);
      }
      await Notification.updateOne({ _id: id }, { toAcknowledge });
      await closeDb();
      res.status(200).json({ id, status: "success" });
    } catch {
      await closeDb();
      res.status(500).json({ id, status: "failure" });
    }
  }
}
