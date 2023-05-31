import type { NextApiRequest, NextApiResponse } from "next";
import { initDb, closeDb } from "./repository";
import { User } from "./schemas";

type UpdateStatus = "success" | "failure";

type Data = {
  username: string;
  friends?: string[];
  status: UpdateStatus;
};

const notifyFriend = async (friendUsername: string, notification: string) => {
  const friend = await User.findOne({ username: friendUsername });
  const { notifications } = friend;
  notifications.push(notification);
  await User.updateOne({ username: friendUsername, notifications });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    const { username, notification } = req.body;
    try {
      await initDb();
      const user = await User.findOne({ username });
      const { friends } = user;
      for (let friend of friends) {
        await notifyFriend(friend, notification);
      }
      await closeDb();
      res.status(200).json({ username, friends, status: "success" });
    } catch {
      await closeDb();
      res.status(500).json({ username, status: "failure" });
    }
  }
}