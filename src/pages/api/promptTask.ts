import type { NextApiRequest, NextApiResponse } from "next";
import { initDb, closeDb } from "./repository";
import { Task } from "./schemas";
import axios from "axios";

type UpdateStatus = "success" | "failure";

type Data = {
  id: string;
  prompts?: string[];
  status: UpdateStatus;
};

const API_PREFIX =
  process.env.ENV === "PROD"
    ? process.env.CLOUD_API_PREFIX
    : process.env.LOCAL_API_PREFIX;

async function notifyFriend(username: string, friend: string, name: string) {
  const URI = `${API_PREFIX}notifyPromptedUser`;
  try {
    const response = await axios.post(URI, { username, friend, name });
    console.log(response.data);
  } catch (err) {
    console.log(err);
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    await initDb();
    const { id, prompter } = req.body;
    try {
      const task = await Task.findOne({ _id: id });
      const { username, name, prompts } = task;
      prompts.push(prompter);
      await Task.updateOne({ _id: id }, { prompts });
      await closeDb();
      await notifyFriend(prompter, username, name);
      res.status(200).json({ id, prompts, status: "success" });
    } catch {
      await closeDb();
      res.status(500).json({ id, status: "failure" });
    }
  }
}
