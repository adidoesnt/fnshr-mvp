import type { NextApiRequest, NextApiResponse } from "next";
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
  if (req.method === "POST") {
    const { username } = req.body;
    try {
      const customer = await stripe.customers.create(
        {
          name: username,
        }
      );
      const { id: customerID } = customer;
      res.status(200).json({ username, customerID, status: "success" });
    } catch {
      res.status(500).json({ username, status: "failure" });
    }
  }
}
