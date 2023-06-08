import type { NextApiRequest, NextApiResponse } from "next";
import { initDb, closeDb } from "./repository";
import bcrypt from "bcrypt";
import { User } from "./schemas";
import { preflight } from "./preflight";
import { stripe } from "./makePayment";

export type SignupStatus = "Success" | "Failure" | "User already exists";

type Data = {
  username: string;
  points?: number;
  friends?: string[];
  status: SignupStatus;
  admin?: boolean;
  customerID?: string;
};

const saltRounds = 10;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (!preflight(req)) {
    res.status(403).json({ status: "unauthorised" } as any);
  }
  if (req.method === "POST") {
    await initDb();
    const { username, password } = req.body;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    const points = 0;
    const testUser = await User.findOne({ username });
    const friends: string[] = [];
    const admin = false;
    if (testUser) {
      await closeDb();
      res.status(409).json({ username, status: "User already exists" });
    } else {
      try {
        const customer = await stripe.customers.create({
          name: username,
        });
        const { id: customerID } = customer;
        await new User({
          username,
          salt,
          hash,
          points,
          friends,
          admin,
          customerID,
        }).save();
        await closeDb();
        res
          .status(201)
          .json({
            username,
            points,
            friends,
            customerID,
            admin,
            status: "Success",
          });
      } catch (err) {
        res.status(500).json({ username, status: "Failure" });
      }
    }
  }
}
