import { useSelector } from "react-redux";
import { selectAllTasks } from "@/app/features/tasks/tasksSlice";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  Heading,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";

export type FriendsTasksProps = {
  friends: string[];
};

export default function FriendsTasks({ friends }: FriendsTasksProps) {
  const tasks = useSelector(selectAllTasks);
  const [buttonText, setButtonText] = useState("show");
  const filteredTasks = tasks.filter(
    (task: any) => friends.findIndex((friend) => friend === task.username) !== -1
  );

  const toggleButtonText = () => {
    if (buttonText === "show") {
      setButtonText("hide");
    } else {
      setButtonText("show");
    }
  };

  return (
    <Card display={"flex"} flexDir={"column"} w={"90%"} m={50} mt={2.5}>
      <Center alignItems={"center"}>
        <Heading fontSize={25} m={2.5}>
          Friends&apos; Tasks
        </Heading>
        <Button onClick={toggleButtonText}>{buttonText}</Button>
      </Center>
      {buttonText === "hide"
        ? filteredTasks.map((task: any, index: number) => {
            const { name, deadline, pledge, status } = task;
            return (
              <Card key={index} m={2.5}>
                <CardHeader>
                  <Heading fontSize={20}>Task Name:</Heading>
                  <Text>{name}</Text>
                </CardHeader>
                <CardBody>
                  <Heading fontSize={20}>Pledge Amount</Heading>
                  <Text>{pledge} points</Text>
                  <br />
                  <Heading fontSize={20}>Deadline</Heading>
                  <Text>{deadline}</Text>
                </CardBody>
                <CardFooter display={"flex"} flexDir={"column"}>
                  <Heading fontSize={20}>Task Status:</Heading>
                  <Text>{status}</Text>
                </CardFooter>
              </Card>
            );
          })
        : null}
    </Card>
  );
}
