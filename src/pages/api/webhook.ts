// import type { NextApiRequest, NextApiResponse } from "next";
// import { buffer } from "micro";
// import { stripe } from "./makePayment";
// import axios from "axios";
// import { store } from "@/app/store";
// import { fetchGlobalUser } from "@/app/features/user/userSlice";

// const handleSuccess = async (username: string, amount: number) => {
//   const URI = "/api/creditPoints";
//   const points = amount/10;
//   try {
//     const response = await axios.post(URI, {
//       username,
//       pledge: points,
//     });
//     console.log(response.data);
//     store.dispatch(fetchGlobalUser(username));
//   } catch (err) {
//     console.log(err);
//   }
// };

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// const webhookHandler = async (req: NextApiRequest, res: NextApiResponse) => {
//   if (req.method === "POST") {
//     const sig = req.headers['stripe-signature'];
//     let event;

//   try {
//     event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
//   } catch (err) {
//     res.status(400).send(`Webhook Error: ${err}`);
//     return;
//   }
// };

// export default webhookHandler;
