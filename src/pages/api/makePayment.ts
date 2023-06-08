import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

type PaymentStatus = "success" | "failure";

type Data = {
  username: string;
  status: PaymentStatus;
  err?: any;
  clientSecret?: string;
};

const PRIVATE_KEY =
  process.env.ENV === "DEV"
    ? process.env.STRIPE_TEST_PRIVATE_KEY
    : process.env.STRIPE_PROD_PRIVATE_KEY;
export const stripe = new Stripe(PRIVATE_KEY || "", {
  apiVersion: "2022-11-15",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    const { username, customerID, amount } = req.body;
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: "sgd",
        payment_method_types: ["card"],
        customer: process.env.TEST_CUST_ID,
      });
      res.status(200).json({
        username,
        status: "success",
        clientSecret: paymentIntent.client_secret || "",
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ username, status: "failure", err });
    }
  }
}
