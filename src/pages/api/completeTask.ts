import type { NextApiRequest, NextApiResponse } from "next";
import { initDb, closeDb } from "./repository";
import { Task } from "./schemas";
import axios from "axios";
import { fetchUsers } from "@/app/features/users/usersSlice";
import { store } from "@/app/store";

type UpdateStatus = "success" | "failure";

type Data = {
  id: string;
  status: UpdateStatus;
};

async function creditPledgeAmount(username: string, pledge: number) {
  const API_PREFIX =
    process.env.ENV === "PROD"
      ? process.env.CLOUD_API_PREFIX
      : process.env.LOCAL_API_PREFIX;
  const URI = `${API_PREFIX}creditPoints`;

  try {
    const response = await axios.post(URI, { username, pledge });
    console.log(response.data);
    store.dispatch(fetchUsers);
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
      const { username, pledge } = task;
      await Task.updateOne({ _id: id }, { status });
      await closeDb();
      await creditPledgeAmount(username, pledge);
      res.status(200).json({ id, status: "success" });
    } catch {
      await closeDb();
      res.status(500).json({ id, status: "failure" });
    }
  }
}
