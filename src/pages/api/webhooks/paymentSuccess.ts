import { stripe } from "../makePayment";
import { NextApiRequest, NextApiResponse } from "next";
import Queue from "bee-queue";
import axios from "axios";
import { defaultReqConfig } from "../preflight";
import { fetchUsers } from "@/app/features/users/usersSlice";
import { store } from "@/app/store";
import { initDb } from "../repository";
import { User } from "../schemas";

const API_PREFIX =
  process.env.ENV === "PROD"
    ? process.env.CLOUD_API_PREFIX
    : process.env.LOCAL_API_PREFIX;

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

const REDIS_SERVER = process.env.ENV === "DEV" ? {} : {
  host: process.env.REDIS_PROD_HOST,
  port: process.env.REDIS_PROD_PORT,
  password: process.env.REDIS_PROD_PASSWORD
}

const queue = new Queue("webhook-tasks", {
  redis: REDIS_SERVER
});

interface WebhookTask {
  event: any;
  res: NextApiResponse;
}

queue.process(async (job) => {
  const { event, res }: WebhookTask = job.data;
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
    res.status(200).json({ received: true });
  } catch (error: any) {
    console.error("Error verifying webhook event:", error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});

const WEBHOOK_SECRET =
  process.env.ENV === "DEV"
    ? process.env.STRIPE_DEV_WEBHOOK_SIGNING_SECRET
    : process.env.STRIPE_PROD_WEBHOOK_SIGNING_SECRET;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const buf = await new Promise<Buffer>((resolve, reject) => {
        let body = Buffer.alloc(0);
        req.on("data", (chunk) => (body = Buffer.concat([body, chunk])));
        req.on("end", () => resolve(body));
        req.on("error", reject);
      });
      const stripeSignature = req.headers["stripe-signature"] as string;
      const event = stripe.webhooks.constructEvent(
        buf,
        stripeSignature,
        WEBHOOK_SECRET || ""
      );
      if (event.type === "payment_intent.succeeded") {
        await queue.createJob({
          event,
          res,
        }).save();
      }
      res.status(200).json({ received: true });
    } catch (error: any) {
      console.error("Error verifying webhook event:", error);
      return res.status(400).send(`Webhook Error: ${error.message}`);
    }
  } else {
    res.status(405).end();
  }
}
