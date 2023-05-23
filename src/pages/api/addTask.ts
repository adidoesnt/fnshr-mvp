import type { NextApiRequest, NextApiResponse } from "next";
import { initDb, closeDb } from "./repository";
import { Task } from "./schemas";

type CreationStatus = "success" | "failure";

type Data = {
  name: string;
  status: CreationStatus;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    await initDb();
    const { username, name, deadline, pledge } = req.body;
    const status = "ongoing";
    const newTask = {
      username,
      name,
      deadline,
      pledge,
      status,
    };
    try {
      await new Task(newTask).save();
      await closeDb();
      res.status(201).json({ name, status: "success" });
    } catch (err) {
      await closeDb();
      res.status(500).json({ name, status: "failure" });
    }
  }
}
