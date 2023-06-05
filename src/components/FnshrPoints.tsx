import {
  Center,
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  useDisclosure,
  Text,
} from "@chakra-ui/react";
import PaymentQR from "./PaymentQR";
import { useRouter } from "next/router";

export type FnshrPointsProps = {
  points: number;
};

export function ExchangeRate() {
  return <Text>1 SGD = 10 FP</Text>;
}


export default function FnshrPoints({ points }: FnshrPointsProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push("topup");
  }

  return (
    <Center w={"90%"} m={25} mb={35} flexDir={"column"}>
      <ExchangeRate />
      <Heading>Fnshr Points: {points}</Heading>
      <Button onClick={handleClick} mt={2.5}>
        Top up
      </Button>
    </Center>
  );
}
