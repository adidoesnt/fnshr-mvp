import { useState, useEffect } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { StripePaymentElementOptions } from "@stripe/stripe-js";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Text,
} from "@chakra-ui/react";
import LoadingSpinner from "./LoadingSpinner";
type TopupFormProps = {
  amount: number;
};

export default function TopupForm({ amount }: TopupFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const points = amount * 10;

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
      return;
    }

    setIsLoading(true);

    const URI =
      process.env.NEXT_PUBLIC_ENV === "DEV"
        ? process.env.NEXT_PUBLIC_STRIPE_DEV_RETURN_URL
        : process.env.NEXT_PUBLIC_STRIPE_PROD_RETURN_URL;

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: URI || "",
      },
    });

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
