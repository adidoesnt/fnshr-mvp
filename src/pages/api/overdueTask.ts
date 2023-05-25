import type { NextApiRequest, NextApiResponse } from "next";
import { initDb, closeDb } from "./repository";
import { Task } from "./schemas";

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
    const { id } = req.body;
    const newStatus = "missed";
    try {
      const task = await Task.findOne({ _id: id });
      const { status } = task;
      if (status === "ongoing") {
        await Task.updateOne({ _id: id }, { status: newStatus });
      }
      await closeDb();
      res.status(200).json({ id, status: "success" });
    } catch {
      await closeDb();
      res.status(500).json({ id, status: "failure" });
    }
  }
}
