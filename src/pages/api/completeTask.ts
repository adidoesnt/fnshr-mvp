import type { NextApiRequest, NextApiResponse } from "next";
import { initDb, closeDb } from "./repository";
import { Task } from "./schemas";
import axios from "axios";
import { fetchUsers } from "@/app/features/users/usersSlice";
import { store } from "@/app/store";
import { Notification } from "@/components/Notifications";

type UpdateStatus = "success" | "failure";

type Data = {
  id: string;
  status: UpdateStatus;
  points?: number;
};

const API_PREFIX =
  process.env.ENV === "PROD"
    ? process.env.CLOUD_API_PREFIX
    : process.env.LOCAL_API_PREFIX;

async function creditPledgeAmount(username: string, pledge: number) {
  const URI = `${API_PREFIX}creditPoints`;

  try {
    const response = await axios.post(URI, { username, pledge });
    console.log(response.data);
    await store.dispatch(fetchUsers());
    return response.data;
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
    const { id } = req.body;
    const status = "completed";
    try {
      const task = await Task.findOne({ _id: id });
      const { username, pledge, name } = task;
      await Task.updateOne({ _id: id }, { status });
      await closeDb();
      const data = await creditPledgeAmount(username, pledge);
      const { points } = data;
      res.status(200).json({ id, status: "success", points });
    } catch {
      await closeDb();
      res.status(500).json({ id, status: "failure" });
    }
  }
}
