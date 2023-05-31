import { selectAllTasks } from "@/app/features/tasks/tasksSlice";
import { selectGlobalUser } from "@/app/features/user/userSlice";
import { WarningIcon } from "@chakra-ui/icons";
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
} from "@chakra-ui/react";
import { useSelector } from "react-redux";

type CalloutModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

function CalloutModal({ isOpen, onClose }: CalloutModalProps) {
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
        <ModalHeader>Callouts</ModalHeader>
        <ModalBody>
          <Center flexDir={"column"}>
            <Heading fontSize={20} mt={2.5} mb={2.5}>
              What are these alerts?
            </Heading>
            <Text>
              These alerts are prompts, or callouts. Your friends are able to
              call you out when you have a task overdue.
              <br /> The number displayed here is the total number of callouts
              you have received.
              <br /> The penalty for each callout is 2 FNSHR points.
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

export default function Callouts() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const user = useSelector(selectGlobalUser);
  const tasks = useSelector(selectAllTasks);
  const filteredTasks = tasks.filter(
    (task: any) => task.username === user.username
  );
  const mappedTasks = filteredTasks.map((task: any) => task.prompts.length);
  const numPrompts = mappedTasks.reduce((a: number, b: number) => a + b, 0);

  return (
    <Button w={"100px"} onClick={onOpen}>
      <CalloutModal isOpen={isOpen} onClose={onClose} />
      <WarningIcon mr={2.5} />
      <Text ml={2.5}>{numPrompts}</Text>
    </Button>
  );
}
