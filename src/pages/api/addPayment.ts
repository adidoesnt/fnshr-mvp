import type { NextApiRequest, NextApiResponse } from "next";
import { initDb, closeDb } from "./repository";
import { Payment } from "./schemas";

type PaymentCreationStatus = "success" | "failure";

type Data = {
  username: string;
  amount: number;
  refNumber: string;
  date: Date;
  status: PaymentCreationStatus;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    await initDb();
    const { username, amount, refNumber, date } = req.body;
    const numericAmount = parseInt(amount);
    try {
      await new Payment({
        username,
        amount: numericAmount,
        refNumber,
        date,
      }).save();
      await closeDb();
      return res.status(201).json({
        username,
        amount: numericAmount,
        refNumber,
        date,
        status: "success",
      });
    } catch (err) {
      await closeDb();
      res.status(500).json({
        username,
        amount: numericAmount,
        refNumber,
        date,
        status: "failure",
      });
    }
  }
}
