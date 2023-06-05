import type { NextApiRequest, NextApiResponse } from "next";
import { initDb, closeDb } from "./repository";
import { User } from "./schemas";
import { preflight } from "./preflight";

type UpdateStatus = "success" | "failure";

type Data = {
  username: string;
  friends?: string[];
  status: UpdateStatus;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if(!preflight(req)) {
    res.status(403).json({status: "unauthorised"} as any)
  }
  if (req.method === "POST") {
    await initDb();
    const { username, friend } = req.body;
    try {
      const user = await User.findOne({ username });
      const { friends } = user;
      const friendIndex = friends.findIndex((item: any) => item === friend);
      if (friendIndex > -1) {
        friends.splice(friendIndex, 1);
      }
      await User.updateOne({ username }, { friends });
      const otherUser = await User.findOne({ username: friend });
      const { friends: otherFriends } = otherUser;
      const ownIndex = otherFriends.findIndex((item: any) => item === username);
      if (ownIndex > -1) {
        otherFriends.splice(ownIndex, 1);
      }
      await User.updateOne({ username: friend }, { friends: otherFriends });
      await closeDb();
      res.status(200).json({ username, friends, status: "success" });
    } catch {
      await closeDb();
      res.status(500).json({ username, status: "failure" });
    }
  }
}
