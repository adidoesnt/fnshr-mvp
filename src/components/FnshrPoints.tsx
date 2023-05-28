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

export type FnshrPointsProps = {
  points: number;
};

type TopupModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

function ExchangeRate() {
  return <Text>1 SGD = 10 FP</Text>;
}

function TopupModal({ isOpen, onClose }: TopupModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
      <ModalOverlay backdropFilter="blur(10px) hue-rotate(10deg)" />
      <ModalContent
        w={"90%"}
        display={"flex"}
        alignSelf={"center"}
        maxH={"90%"}
        overflowY={"scroll"}
      >
        <ModalHeader>Top up Fnshr Points</ModalHeader>
        <ModalBody>
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
              Once the payment is received, the FNSHR team will top-up your
              wallet for you.
            </Text>
          </Center>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default function FnshrPoints({ points }: FnshrPointsProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Center w={"90%"} m={25} mb={35} flexDir={"column"}>
      <ExchangeRate />
      <Heading>Fnshr Points: {points}</Heading>
      <Button onClick={onOpen} mt={2.5}>
        Top up
      </Button>
      <TopupModal isOpen={isOpen} onClose={onClose} />
    </Center>
  );
}
