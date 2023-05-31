import { selectAllTasks } from "@/app/features/tasks/tasksSlice";
import { selectAllUsers } from "@/app/features/users/usersSlice";
import { BellIcon, WarningIcon } from "@chakra-ui/icons";
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

type NotificationsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

function NotificationsModal({ isOpen, onClose }: NotificationsModalProps) {
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
        <ModalHeader>Notifications</ModalHeader>
        <ModalBody>
          <Center flexDir={"column"}>
            <Heading fontSize={20} mt={2.5} mb={2.5}>
              What is this?
            </Heading>
            <Text>
              This feature is a work in progress.
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

export type NotificationsProps = {
    username: string;
}

export default function Notifications({ username }: NotificationsProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const users = useSelector(selectAllUsers);
  const user: any = users.find((item: any) => item.username === username);
  const { notifications } = user;
  const numNotifications = notifications.length;

  return (
    <Button w={"100px"} onClick={onOpen}>
      <NotificationsModal isOpen={isOpen} onClose={onClose} />
      <BellIcon mr={2.5} />
      <Text ml={2.5}>{numNotifications}</Text>
    </Button>
  );
}
