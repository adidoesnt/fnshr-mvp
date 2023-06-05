import type { NextApiRequest, NextApiResponse } from "next";
import { initDb, closeDb } from "./repository";
import { Payment } from "./schemas";
import { preflight } from "./preflight";

type PaymentCreationStatus = "success" | "failure";

type Data = {
  username: string;
  amount: number;
  screenshot: string;
  date: Date;
  status: PaymentCreationStatus;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if(!preflight(req)) {
    res.status(403).json({status: "unauthorised"} as any)
  }
  if (req.method === "POST") {
    await initDb();
    const { username, points, screenshot } = req.body;
    const numericPoints = parseInt(points);
    const date = new Date();
    try {
      await new Payment({
        username,
        points: numericPoints,
        screenshot,
        date,
      }).save();
      await closeDb();
      return res.status(201).json({
        username,
        amount: numericPoints,
        screenshot,
        date,
        status: "success",
      });
    } catch (err) {
      await closeDb();
      res.status(500).json({
        username,
        amount: numericPoints,
        screenshot,
        date,
        status: "failure",
        err
      } as any);
    }
  }
}
