import type { NextApiRequest, NextApiResponse } from "next";
import { initDb, closeDb } from "./repository";
import { Task } from "./schemas";

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
    const { id, prompter } = req.body;
    try {
      const task = await Task.findOne({ _id: id });
      const { prompts } = task;
      prompts.push(prompter);
      await Task.updateOne({ _id: id }, { prompts });
      await closeDb();
      res.status(200).json({ id, prompts, status: "success" });
    } catch {
      await closeDb();
      res.status(500).json({ id, status: "failure" });
    }
  }
}
