import { Center, Heading, Button, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";

export type FnshrPointsProps = {
  points: number;
  noTopupButton?: boolean;
};

function ExchangeRate() {
  return <Text>1 SGD = 10 FP</Text>;
}

export default function FnshrPoints({
  points,
  noTopupButton,
}: FnshrPointsProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push("/topup");
  };

  return (
    <Center w={"90%"} m={25} mb={35} flexDir={"column"}>
      <ExchangeRate />
      <Heading>Fnshr Points: {points}</Heading>
      {noTopupButton ? null : (
        <Button onClick={handleClick} mt={2.5}>
          Top up
        </Button>
      )}
    </Center>
  );
}
