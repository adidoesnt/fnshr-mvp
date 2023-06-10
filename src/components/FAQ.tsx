import { QuestionIcon } from "@chakra-ui/icons";
import {
  Button,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  useDisclosure,
  Heading,
  Center,
  Divider,
} from "@chakra-ui/react";

type FAQModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

function FAQModal({ isOpen, onClose }: FAQModalProps) {
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
        <ModalHeader>Help and FAQ</ModalHeader>
        <ModalBody>
          <Center flexDir={"column"}>
            <Heading
              w={"100%"}
              textAlign={"left"}
              fontSize={20}
              mt={2.5}
              mb={2.5}
            >
              What is FNSHR?
            </Heading>
            <Text mb={30}>
              FNSHR is a <b>task management application</b> designed to leverage
              social and monetary accountability to facilitate improvements in
              productivity.
            </Text>
            <Divider />
            <Heading
              w={"100%"}
              textAlign={"left"}
              fontSize={20}
              mt={2.5}
              mb={2.5}
            >
              How do you pronounce FNSHR?
            </Heading>
            <Text w={"100%"} mb={30}>
              Finisher!
            </Text>
            <Divider />
            <Heading
              w={"100%"}
              textAlign={"left"}
              fontSize={20}
              mt={2.5}
              mb={2.5}
            >
              What is the plan for FNSHR?
            </Heading>
            <Text mb={30}>
              FNSHR is a startup founded by 3 NUS students. We released this app
              as our second MVP, ahead of our next round of pitching in June.
              <br />
              <br />
              We aim to use this application as a form of market validation, in
              order to show that there is need for the service we provide. Thus,{" "}
              <b>we need all the support that we can get</b> from you.
              <br />
              <br />
              This validation cycle will last <b>until July.</b>
            </Text>
            <Divider />
            <Heading
              w={"100%"}
              textAlign={"left"}
              fontSize={20}
              mt={2.5}
              mb={2.5}
            >
              How do I use the application?
            </Heading>
            <Text mb={30}>
              When you sign up, you&apos;ll need to top up some points. These
              points will be <b>pledged on tasks</b> that you add later on.
              <br />
              <br /> If you <b>complete your tasks</b> on time, you will{" "}
              <b>get your points back.</b> However, if you{" "}
              <b>miss the deadline</b> for your task, you will{" "}
              <b>lose your points.</b>
              <br />
              <br /> Furthermore, each of your friends will be able to{" "}
              <b>call you out</b> for your missed task.{" "}
              <b>
                Each call-out will result in a further 2 points being deducted
              </b>{" "}
              from your account.
            </Text>
            <Divider />
            <Heading textAlign={"left"} fontSize={20} mt={2.5} mb={2.5}>
              What is the conversion rate between Singapore Dollars and FNSHR
              points?
            </Heading>
            <Text w={"100%"} mb={30}>
              1 Singapore Dollar is 10 FNSHR points.
            </Text>
            <Divider />
            <Heading
              w={"100%"}
              textAlign={"left"}
              fontSize={20}
              mt={2.5}
              mb={2.5}
            >
              What happens to our money?
            </Heading>
            <Text mb={30}>
              When we reach <b>the end of our validation cycle in July</b>, the
              points that you have in your account will be converted back to
              currency and <b>refunded to you</b>. <br />
              <br />
              It is important to note that{" "}
              <b>for every top-up, an SG$1 processing fee applies</b>, in order
              to cover the processing fees imposed by our payment partner,
              Stripe. <br />
              <br />
              Since SG$1 is equivalent to 10 FNSHR points, the net amount you
              will be refunded is{" "}
              <b>
                the remaining number of points you have divided by 10, minus a
                dollar for each time you topped up.
              </b>
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

export default function FAQ() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Button display={"flex"} onClick={onOpen} w={200}>
      <FAQModal isOpen={isOpen} onClose={onClose} />
      <Text w={"75%"} m={2.5}>
        Help and FAQ
      </Text>
      <QuestionIcon m={2.5} />
    </Button>
  );
}
