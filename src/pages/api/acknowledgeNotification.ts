import type { NextApiRequest, NextApiResponse } from "next";
import { initDb, closeDb } from "./repository";
import { User } from "./schemas";

type UpdateStatus = "success" | "failure";

type Data = {
  id: string;
  prompts?: string[];
  status: UpdateStatus;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    await initDb();
    const { username, id } = req.body;
    try {
      const user = await User.findOne({ username });
      const { notifications } = user;
      const notificationIndex = notifications.findIndex(
        (item: any) =>  item._id.toString() === id
      );
      notifications[notificationIndex].acknowledged = true;
      await User.updateOne({ username }, { notifications });
      await closeDb();
      res
        .status(200)
        .json({
          id,
          status: "success",
          notifications,
          type: typeof notifications,
        } as any);
    } catch(err) {
        console.log(err)
      await closeDb();
      res.status(500).json({ id, status: "failure" });
    }
  }
}
