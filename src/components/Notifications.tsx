import { fetchUsers, selectAllUsers } from "@/app/features/users/usersSlice";
import { store } from "@/app/store";
import { BellIcon, CheckIcon } from "@chakra-ui/icons";
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
  Center,
  Card,
  CardBody,
  IconButton,
  Spinner,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { showNotification } from "../../public/browserNotifications";

export type Notification = {
  _id?: string;
  content: string;
  acknowledged: boolean;
};

type NotificationsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  username: string;
};

type NotificationCardProps = {
  username: string;
  notification: Notification;
};

function NotificationCard({ username, notification }: NotificationCardProps) {
  const { content, _id: id } = notification;
  const [submitting, setSubmitting] = useState(false);

  const handleNotificationAcknowledged = async () => {
    setSubmitting(true);
    const URI = "api/acknowledgeNotification";
    try {
      const response = await axios.post(URI, { username, id });
      await store.dispatch(fetchUsers());
      console.log(response.data);
    } catch (err) {
      console.log(err);
    }
    setSubmitting(false);
  };

  return (
    <Card m={"5px"} w={"300px"} display={"flex"}>
      <CardBody display={"flex"} alignItems={"center"}>
        <Text mr={2.5} w={"75%"} textOverflow={"ellipsis"}>
          {content}
        </Text>
        <IconButton
          ml={2.5}
          aria-label="add friend"
          icon={submitting ? <Spinner /> : <CheckIcon />}
          onClick={() => handleNotificationAcknowledged()}
          isDisabled={submitting}
        />
      </CardBody>
    </Card>
  );
}

function NotificationsModal({
  isOpen,
  onClose,
  notifications,
  username,
}: NotificationsModalProps) {
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
            {notifications?.length > 0 ? (
              notifications.map((notification: Notification, index: number) => {
                return (
                  <NotificationCard
                    key={index}
                    notification={notification}
                    username={username}
                  />
                );
              })
            ) : (
              <Text>No new notifications.</Text>
            )}
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
};

export default function Notifications({ username }: NotificationsProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const users = useSelector(selectAllUsers);
  const user: any = users.find((item: any) => item.username === username);
  const { notifications } = user;
  const filteredNotifications = notifications?.filter(
    (notification: Notification) => !notification.acknowledged
  );
  const numNotifications = filteredNotifications?.length || 0;
  const previousLengthRef = useRef(
    filteredNotifications ? filteredNotifications.length : 0
  );

  useEffect(() => {
    if (
      filteredNotifications &&
      filteredNotifications.length > previousLengthRef.current
    ) {
      const latestNotification = filteredNotifications[0];
      const { message } = latestNotification;

      console.log("notifying...")
      showNotification("New Notification", {
        body: message,
        icon: "/Logo_192x192.png",
      });
    }
    previousLengthRef.current = filteredNotifications
      ? filteredNotifications.length
      : 0;
  }, [filteredNotifications]);

  return (
    <Button w={"100px"} onClick={onOpen}>
      <NotificationsModal
        isOpen={isOpen}
        onClose={onClose}
        notifications={filteredNotifications}
        username={username}
      />
      <BellIcon mr={2.5} />
      <Text ml={2.5}>{numNotifications}</Text>
    </Button>
  );
}
