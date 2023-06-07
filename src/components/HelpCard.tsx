import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Center,
  Heading,
  Text,
} from "@chakra-ui/react";
import { ExchangeRate } from "./FnshrPoints";
import PaymentQR from "./PaymentQR";
import { useState } from "react";

type ToggleButtonProps = {
  handleClick: () => void;
  collapse: boolean;
  mt?: string | number;
};

function ToggleButton({ handleClick, collapse, mt }: ToggleButtonProps) {
  return (
    <Center>
      <Button mt={mt} onClick={handleClick}>
        {collapse ? "Help" : "Hide"}
      </Button>
    </Center>
  );
}

export default function HelpCard() {
  const [collapse, setCollapse] = useState(true);

  const handleClick = () => {
    setCollapse(!collapse);
  };

  return (
    <Card w={"95%"}>
      <CardHeader textAlign={"center"}>
        <Heading>Top up Fnshr Points</Heading>
      </CardHeader>
      <CardBody>
        {collapse ? (
          <Center flexDir={"column"}>
            <ExchangeRate />
            <PaymentQR />
            <ToggleButton handleClick={handleClick} collapse />
          </Center>
        ) : (
          <Center flexDir={"column"}>
            <ExchangeRate />
            <PaymentQR />
            <Heading fontSize={20} mt={2.5} mb={2.5}>
              How does this work?
            </Heading>
            <Text>
              Paylah! your desired amount to this QR code to fill your FNSHR
              wallet with FNSHR Points. <br />
              Do remember to add your username as the payment reference/comment.
              <br />
              Once the form below has been submitted, the points should be
              automatically credited to your account!
            </Text>
            <ToggleButton mt={5} handleClick={handleClick} collapse={false} />
          </Center>
        )}
      </CardBody>
    </Card>
  );
}
