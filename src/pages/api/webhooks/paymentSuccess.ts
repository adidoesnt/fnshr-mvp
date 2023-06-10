import { stripe } from "../makePayment";
import { NextRequest } from "next/server";
import axios from "axios";
import { defaultReqConfig } from "../preflight";
import { fetchUsers } from "@/app/features/users/usersSlice";
import { store } from "@/app/store";
import { initDb } from "../repository";
import { User } from "../schemas";
import Queue from "bull";

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

export default async function handler(req: NextRequest) {
  if (req.method === "POST") {
    try {
      const reader = req.body?.getReader();
      let body = "";
      while (reader && true) {
        const { done, value } = await reader.read();
        if (done) break;
        body += new TextDecoder().decode(value);
      }
      let event;
      const stripeSignature = req.headers.get("stripe-signature") as
        | string
        | string[];
      event = stripe.webhooks.constructEvent(
        body,
        stripeSignature,
        WEBHOOK_SECRET || ""
      );
      await queue.add({
        event,
      });
      return new Response("webhook receieved", { status: 200 });
    } catch (error: any) {
      console.error("Error verifying webhook event:", error);
      return new Response(`Webhook Error: ${error.message}`, { status: 400 });
    }
  } else {
    return new Response("", { status: 405 });
  }
}
