import type { NextApiRequest, NextApiResponse } from "next";
import { initDb, closeDb } from "./repository";
import { User } from "./schemas";

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
  if (req.method === "POST") {
    await initDb();
    const { username, friend } = req.body;
    try {
      const user = await User.findOne({ username });
      const { friends } = user;
      friends.push(friend);
      await User.updateOne({ username }, { friends });
      const otherUser = await User.findOne({ username: friend });
      const { friends: otherFriends } = otherUser;
      otherFriends.push(username);
      await User.updateOne(
        { username: friend },
        { friends: otherFriends }
      );
      await closeDb();
      res.status(200).json({ username, friends, status: "success" });
    } catch {
      await closeDb();
      res.status(500).json({ username, status: "failure" });
    }
  }
}
