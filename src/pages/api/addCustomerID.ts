import type { NextApiRequest, NextApiResponse } from "next";
import { initDb, closeDb } from "./repository";
import { User } from "./schemas";
import { preflight } from "./preflight";
import { stripe } from "./makePayment";

type UpdateStatus = "success" | "failure";

type Data = {
  username: string;
  customerID?: string;
  status: UpdateStatus;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (!preflight(req)) {
    res.status(403).json({ status: "unauthorised" } as any);
  }
  if (req.method === "PUT") {
    await initDb();
    const { username } = req.body;
    try {
      const customer = await stripe.customers.create(
        {
          name: username,
        },
        { timeout: 20000 }
      );
      const { id: customerID } = customer;
      await User.updateOne({ username }, { customerID });
      await closeDb();
      res.status(200).json({ username, customerID, status: "success" });
    } catch {
      await closeDb();
      res.status(500).json({ username, status: "failure" });
    }
  }
}
