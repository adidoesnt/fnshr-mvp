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
  Card,
  CardHeader,
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
  process.env.ENV === "DEV"
    ? process.env.STRIPE_TEST_PUBLIC_KEY
    : process.env.STRIPE_TEST_PUBLIC_KEY;
const stripePromise = loadStripe(
  KEY ||
    "pk_test_51MpyVZJeBXv7Fk8avWiQ3bmLjhPRrlfS3pGdPwdZYhkhX2g9YkqUkwWxemUXUYfeSc6xXaNz5VwcKzXaM9Qz0sZq00dv0hMvNF"
);

type TopupAmountSelectorProps = {
  amount: number;
  setAmount: (amount: number) => void;
};

function TopupAmountSelector({ amount, setAmount }: TopupAmountSelectorProps) {
  const points = amount * 10;

  return (
    <Card m={"5%"} w={"90%"} p={"5%"}>
      <FormControl>
        <CardHeader>
          <Heading textAlign={"center"}>Top-up</Heading>
        </CardHeader>
        <FormLabel>Select Amount</FormLabel>
        <FormHelperText mb={5}>Select the top-up amount before proceeding to checkout.</FormHelperText>
        <Input
          type={"range"}
          min={1}
          max={100}
          onChange={(e) => setAmount(parseInt(e.target.value))}
          defaultValue={1}
        />
        <Text textAlign={"center"}>
          {amount} SGD = {points} FP
        </Text>
      </FormControl>
    </Card>
  );
}

function Content({ points }: ContentProps) {
  const size = useWindowSize();
  const [amount, setAmount] = useState(1);
  const amountInCents = amount * 100;

  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    const URI = "/api/makePayment";
    axios
      .post(URI, {
        username: "init",
        amount: amountInCents,
      })
      .then((response) => {
        const { data } = response;
        const { clientSecret: newClientSecret } = data;
        setClientSecret(newClientSecret);
      });
  }, [amountInCents]);

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
        <FnshrPoints points={points} noTopupButton />
        <TopupAmountSelector amount={amount} setAmount={setAmount} />
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
