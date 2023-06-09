import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { selectGlobalUser } from "@/app/features/user/userSlice";
import Loading from "@/components/Loading";
import Head from "next/head";
import { useWindowSize } from "@/app/hooks";
import BackButton from "@/components/BackButton";
import TopupForm from "@/components/TopupForm";
import FnshrPoints from "@/components/FnshrPoints";
import { StripeElementsOptions, loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import axios from "axios";
import { Elements } from "@stripe/react-stripe-js";
import {
  Button,
  Card,
  CardHeader,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Text,
} from "@chakra-ui/react";

export type ContentProps = {
  points: number;
};

const KEY =
  process.env.NEXT_PUBLIC_ENV === "DEV"
    ? process.env.NEXT_PUBLIC_STRIPE_TEST_PUBLIC_KEY
    : process.env.NEXT_PUBLIC_STRIPE_PROD_PUBLIC_KEY;
const stripePromise = loadStripe(KEY || "");

type TopupAmountSelectorProps = {
  amount: number;
  setAmount: (amount: number) => void;
  setSubmitted: (submitted: boolean) => void;
  submitted: boolean;
};

function TopupAmountSelector({
  amount,
  setAmount,
  setSubmitted,
  submitted,
}: TopupAmountSelectorProps) {
  const points = amount * 10;

  return (
    <Card m={"5%"} w={"90%"} p={"5%"}>
      <FormControl>
        <CardHeader>
          <Heading textAlign={"center"}>Top-up</Heading>
        </CardHeader>
        <Heading></Heading>
        <Flex mb={"20px"}>
          <Text>
            For every top-up, a <b>processing fee of $1</b> applies, allowing
            the FNSHR team to cover our processing fees with our integrated
            payment partner, <b>Stripe</b>.
          </Text>
        </Flex>
        <FormLabel>Select Amount</FormLabel>
        <FormHelperText mb={5}>
          Select the top-up amount before proceeding to checkout.
        </FormHelperText>
        <Input
          type={"range"}
          min={5}
          max={20}
          step={5}
          onChange={(e) => setAmount(parseInt(e.target.value))}
          defaultValue={5}
          isDisabled={submitted}
        />
        <Text textAlign={"center"}>
          {amount} SGD = {points} FP
        </Text>
      </FormControl>
      <Button
        mt={"10px"}
        onClick={() => setSubmitted(true)}
        isDisabled={submitted}
      >
        Set amount
      </Button>
    </Card>
  );
}

function Content({ points }: ContentProps) {
  const size = useWindowSize();
  const [amount, setAmount] = useState(5);
  const amountInCents = amount * 100;
  const [submitted, setSubmitted] = useState(false);

  const [clientSecret, setClientSecret] = useState("");

  const user = useSelector(selectGlobalUser);
  const { username, customerID } = user;

  useEffect(() => {
    if (submitted) {
      const URI = "/api/makePayment";
      axios
        .post(URI, {
          username,
          customerID,
          amount: amountInCents,
        })
        .then((response) => {
          const { data } = response;
          const { clientSecret: newClientSecret } = data;
          setClientSecret(newClientSecret);
        });
    }
  }, [amountInCents, customerID, username, submitted]);

  const appearance = {
    theme: "stripe",
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <>
      <Head>
        <title>Fnshr - Top Up</title>
      </Head>
      <main
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          width: size.width,
          height: size.height,
        }}
      >
        <BackButton w={"90%"} mt={"5%"} />
        <FnshrPoints points={points} noTopupButton noRefreshButton />
        {submitted ? null : (
          <TopupAmountSelector
            amount={amount}
            setAmount={setAmount}
            setSubmitted={setSubmitted}
            submitted={submitted}
          />
        )}
        {clientSecret !== "" ? (
          <Elements
            options={options as StripeElementsOptions}
            stripe={stripePromise}
          >
            <TopupForm amount={amount} />
          </Elements>
        ) : null}
      </main>
    </>
  );
}

export default function Topup() {
  const router = useRouter();
  const user = useSelector(selectGlobalUser);
  const { username, admin, points } = user;

  const auth = username !== "" || admin;

  if (!auth) {
    router.push("/login");
  }

  return auth ? <Content points={points} /> : <Loading />;
}
