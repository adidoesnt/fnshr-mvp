import { stripe } from "../makePayment";
import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { defaultReqConfig } from "../preflight";
import { fetchUsers } from "@/app/features/users/usersSlice";
import { store } from "@/app/store";
import { initDb } from "../repository";
import { User } from "../schemas";
import Queue from "bull";
import getRawBody from "raw-body";

const API_PREFIX =
  process.env.ENV === "PROD"
    ? process.env.CLOUD_API_PREFIX
    : process.env.LOCAL_API_PREFIX;

export const config = {
  api: {
    bodyParser: false,
  },
};

async function creditPoints(username: string, points: number) {
  const URI = `${API_PREFIX}creditPoints`;
  try {
    const response = await axios.post(
      URI,
      { username, pledge: points },
      defaultReqConfig
    );
    console.log(response.data);
    await store.dispatch(fetchUsers());
    return response.data;
  } catch (err) {
    console.log(err);
  }
}

const queue = new Queue("webhook-tasks", {
  redis: {
    host: process.env.REDIS_PROD_HOST,
    port: parseInt(process.env.REDIS_PROD_PORT || ""),
    password: process.env.REDIS_PROD_PASSWORD || "",
  },
});

queue.process(async (job) => {
  const { event } = job.data;
  try {
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as any;
      const { amount, customer } = paymentIntent;
      const points = parseInt(amount) / 10;
      await initDb();
      const user = await User.findOne({ customerID: customer });
      const { username } = user;
      await creditPoints(username, points);
    }
  } catch (error: any) {
    console.error("Error verifying webhook event:", error);
  }
});

const WEBHOOK_SECRET =
  process.env.ENV === "DEV"
    ? process.env.STRIPE_DEV_WEBHOOK_SIGNING_SECRET
    : process.env.STRIPE_PROD_WEBHOOK_SIGNING_SECRET;

export default async function handler(
  req: NextApiRequest & { rawBody: any },
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const rawBody = await getRawBody(req);
      const stripeSignature = req.headers["stripe-signature"] as string;
      let event;
      event = stripe.webhooks.constructEvent(
        rawBody,
        stripeSignature,
        WEBHOOK_SECRET || ""
      );
      await queue.add({
        event,
      });
      res.status(200).json({ received: true });
    } catch (error: any) {
      console.error("Error verifying webhook event:", error);
      return res.status(400).send(`Webhook Error: ${error.message}`);
    }
  } else {
    res.status(405).end();
  }
}
