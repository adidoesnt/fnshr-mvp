import { useState, useEffect, useCallback } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { PaymentIntent, StripePaymentElementOptions } from "@stripe/stripe-js";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Text,
} from "@chakra-ui/react";
import LoadingSpinner from "./LoadingSpinner";
import axios from "axios";
import { selectGlobalUser } from "@/app/features/user/userSlice";
import { useSelector } from "react-redux";
import { store } from "@/app/store";
import { fetchGlobalUser } from "@/app/features/user/userSlice";

type TopupFormProps = {
  amount: number;
};

export default function TopupForm({ amount }: TopupFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const points = amount * 10;
  const user = useSelector(selectGlobalUser);
  const { username } = user;

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    stripe
      .retrievePaymentIntent(clientSecret)
      .then(async ({ paymentIntent }) => {
        switch (paymentIntent?.status) {
          case "succeeded":
            setMessage("Payment succeeded!");
            break;
          case "processing":
            setMessage("Your payment is processing.");
            break;
          case "requires_payment_method":
            setMessage("Your payment was not successful, please try again.");
            break;
          default:
            setMessage("Something went wrong.");
            break;
        }
      });
  }, [stripe]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: "http://localhost:3000/home",
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    const DEFAULT_ERR_MESSAGE = "An unexpected error occurred.";
    if (error?.type === "card_error" || error?.type === "validation_error") {
      setMessage(error?.message || DEFAULT_ERR_MESSAGE);
    } else {
      setMessage(DEFAULT_ERR_MESSAGE);
    }

    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: "tabs",
  };

  return (
    <Card w={"90%"} p={"5%"} mb={"5%"} overflowY="scroll">
      <CardHeader textAlign={"center"}>
        <Heading>Buy FNSHR points</Heading>
        <Text textAlign={"center"}>
          {amount} SGD = {points} FP
        </Text>
      </CardHeader>
      <CardBody>
        <form id="payment-form" onSubmit={handleSubmit}>
          <PaymentElement
            id="payment-element"
            options={paymentElementOptions as StripePaymentElementOptions}
          />
          <Button
            mt={5}
            disabled={isLoading || !stripe || !elements}
            id="submit"
            onClick={handleSubmit}
          >
            <span id="Button-text">
              {isLoading ? <LoadingSpinner /> : "Pay now"}
            </span>
          </Button>
          {/* Show any error or success messages */}
          {message && (
            <div id="payment-message" style={{ marginTop: "5px" }}>
              {message}
            </div>
          )}
        </form>
      </CardBody>
    </Card>
  );
}
