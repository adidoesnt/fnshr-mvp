import type { NextApiRequest, NextApiResponse } from "next";
import { initDb, closeDb } from "./repository";
import { Task } from "./schemas";
import { differenceInMilliseconds, parseISO } from "date-fns";

type FindStatus = "success" | "failure";

type Data = {
  status: FindStatus;
};

const checkTaskOverdue = async (task: any) => {
  const { _id, deadline } = task;
  const convertedDeadline = parseISO(deadline);
  const now = parseISO(new Date().toISOString());
  const diff = differenceInMilliseconds(now, convertedDeadline);
  if (diff > 0) {
    await Task.updateOne({ _id }, { status: "missed" });
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    try {
      await initDb();
      const cursor = Task.find().cursor();
      const tasks: any[] = [];
      for await (const doc of cursor) {
        tasks.push(doc.toObject());
      }
      const ongoingTasks = tasks.filter((task) => task.status === "ongoing");
      for (let task of ongoingTasks) {
        await checkTaskOverdue(task);
      }
      await closeDb();
      res.status(200).json({ status: "success" });
    } catch (err) {
      await closeDb();
      res.status(500).json({ status: "failure" });
    }
  }
}
