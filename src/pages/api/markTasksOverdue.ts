import type { NextApiRequest, NextApiResponse } from "next";
import { initDb, closeDb } from "./repository";
import { Task } from "./schemas";
import { differenceInMilliseconds, parseISO } from "date-fns";
import axios from "axios";
import { Notification } from "@/components/Notifications";

type FindStatus = "success" | "failure";

type Data = {
  status: FindStatus;
};

const API_PREFIX =
  process.env.ENV === "PROD"
    ? process.env.CLOUD_API_PREFIX
    : process.env.LOCAL_API_PREFIX;

async function notifyFriends(username: string, notification: Notification) {
  const URI = `${API_PREFIX}sendNotifications`;

  try {
    const response = await axios.post(URI, { username, notification });
    console.log(response.data);
  } catch (err) {
    console.log(err);
  }
}

const checkTaskOverdue = async (task: any) => {
  const { _id, deadline, username, name } = task;
  const convertedDeadline = parseISO(deadline);
  const now = parseISO(new Date().toISOString());
  const diff = differenceInMilliseconds(now, convertedDeadline);
  if (diff > 0) {
    await Task.updateOne({ _id }, { status: "missed" });
    const notification: Notification = {
      content: `${username} missed their task: ${name}`,
      acknowledged: false,
    }
    await notifyFriends(username, notification);
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
