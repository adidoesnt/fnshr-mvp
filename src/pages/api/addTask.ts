import type { NextApiRequest, NextApiResponse } from "next";
import { initDb, closeDb } from "./repository";
import { Task } from "./schemas";
import axios from "axios";
import { differenceInMilliseconds, parseISO } from "date-fns";
import { store } from "@/app/store";
import { fetchTasks } from "@/app/features/tasks/tasksSlice";
import { fetchUsers } from "@/app/features/users/usersSlice";

type CreationStatus = "success" | "failure";

type Data = {
  name: string;
  status: CreationStatus;
  timings?: {
    created: Date;
    due: Date;
    diff: number;
  };
};

async function handleTaskOverdue(id: string) {
  const API_PREFIX =
    process.env.ENV === "PROD"
      ? process.env.CLOUD_API_PREFIX
      : process.env.LOCAL_API_PREFIX;
  const URI = `${API_PREFIX}overdueTask`;

  try {
    const response = await axios.post(URI, { id });
    console.log(response.data);
    store.dispatch(fetchTasks());
  } catch (err) {
    console.log(err);
  }
}

async function deductPledgeAmount(username: string, pledge: number) {
  const API_PREFIX =
    process.env.ENV === "PROD"
      ? process.env.CLOUD_API_PREFIX
      : process.env.LOCAL_API_PREFIX;
  const URI = `${API_PREFIX}deductPoints`;

  try {
    const response = await axios.post(URI, { username, pledge });
    console.log(response.data);
    store.dispatch(fetchUsers);
  } catch (err) {
    console.log(err);
  }
}

const calculateTimeout = (deadline: string) => {
  const parsedDeadline: Date = parseISO(deadline);
  const now = parseISO(new Date().toISOString());
  const diff = differenceInMilliseconds(parsedDeadline, now);
  return {
    created: now,
    due: parsedDeadline,
    diff,
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    await initDb();
    const { username, name, deadline, pledge } = req.body;
    const status = "ongoing";
    const prompts: string[] = [];
    const newTask = {
      username,
      name,
      deadline,
      pledge,
      status,
      prompts,
    };
    try {
      const task = await new Task(newTask).save();
      const { _id: id } = task;
      const { created, due, diff } = calculateTimeout(deadline);
      setTimeout(() => handleTaskOverdue(id), diff);
      await closeDb();
      await deductPledgeAmount(username, pledge);
      res
        .status(201)
        .json({ name, status: "success", timings: { created, due, diff } });
    } catch (err) {
      await closeDb();
      res.status(500).json({ name, status: "failure" });
    }
  }
}
