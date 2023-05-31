import type { NextApiRequest, NextApiResponse } from "next";
import { initDb, closeDb } from "./repository";
import { User } from "./schemas";
import { Notification } from "@/components/Notifications";

type UpdateStatus = "success" | "failure";

type Data = {
  username: string;
  friend: string;
  status: UpdateStatus;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    await initDb();
    const { username, friend, name } = req.body;
    try {
      const user = await User.findOne({ username: friend });
      const { notifications } = user;
      const notification: Notification = {
        content: `${username} called you out for the following task: ${name}!`,
        acknowledged: false,
      };
      notifications.unshift(notification);
      await User.updateOne({ username: friend }, { notifications });
      await closeDb();
      res.status(200).json({
        username,
        friend,
        status: "success",
      });
    } catch (err) {
      console.log(err);
      await closeDb();
      res.status(500).json({ username, friend, status: "failure" });
    }
  }
}
