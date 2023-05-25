import { useSelector } from "react-redux";
import { fetchTasks, selectAllTasks } from "@/app/features/tasks/tasksSlice";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  Flex,
  Heading,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { parseISO } from "date-fns";
import { WarningIcon } from "@chakra-ui/icons";
import axios from "axios";
import { store } from "@/app/store";
import TaskPrompts from "./TaskPrompts";
import { selectGlobalUser } from "@/app/features/user/userSlice";
import { convertISOToLocalTime } from "./YourTasks";

export type FriendsTasksProps = {
  friends: string[];
};

type PromptButtonProps = {
  status: "ongoing" | "completed" | "missed";
  id: string;
  prompts: string[];
  globalUsername: string;
};

function PromptButton({
  status,
  id,
  globalUsername,
  prompts,
}: PromptButtonProps) {
  const URI = "/api/promptTask";
  const globalUser = useSelector(selectGlobalUser);
  const { username: prompter } = globalUser;

  async function handleClick(id: string) {
    try {
      const response = await axios.post(URI, { id, prompter });
      console.log(response.data);
      store.dispatch(fetchTasks());
    } catch (err) {
      console.log(err);
    }
  }

  const show =
    status === "missed" &&
    prompts.findIndex((prompter) => prompter === globalUsername) === -1;

  return show ? (
    <Flex w={"100%"} justifyContent={"center"}>
      <Button
        display={"flex"}
        w={"50%"}
        mb={"15px"}
        justifyContent={"space-evenly"}
        onClick={() => handleClick(id)}
      >
        <Text>Prompt</Text>
        <WarningIcon />
      </Button>
    </Flex>
  ) : null;
}

export default function FriendsTasks({ friends }: FriendsTasksProps) {
  const globalUser = useSelector(selectGlobalUser);
  const { username: globalUsername } = globalUser;
  const tasks = useSelector(selectAllTasks);
  const [buttonText, setButtonText] = useState("show");
  let filteredTasks = tasks.filter(
    (task: any) =>
      friends.findIndex((friend) => friend === task.username) !== -1
  );
  filteredTasks = filteredTasks.sort((a: any, b: any) => {
    const firstDate = parseISO(a.deadline);
    const secondDate = parseISO(b.deadline);
    if (firstDate < secondDate) {
      return -1;
    } else if (firstDate > secondDate) {
      return 1;
    } else {
      return 0;
    }
  });

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
        ? filteredTasks.map((task: any) => {
            const {
              _id: id,
              username,
              name,
              deadline,
              pledge,
              status,
              prompts,
            } = task;
            const convertedDeadline = convertISOToLocalTime(deadline);

            return (
              <Card key={id} m={2.5}>
                <TaskPrompts status={status} prompts={prompts} />
                <CardHeader>
                  <Heading fontSize={20}>Friend:</Heading>
                  <Text>{username}</Text>
                  <br />
                  <Heading fontSize={20}>Task Name:</Heading>
                  <Text>{name}</Text>
                </CardHeader>
                <CardBody>
                  <Heading fontSize={20}>Pledge Amount</Heading>
                  <Text>{pledge} points</Text>
                  <br />
                  <Heading fontSize={20}>Deadline</Heading>
                  <Text>{convertedDeadline}</Text>
                </CardBody>
                <CardFooter display={"flex"} flexDir={"column"}>
                  <Heading fontSize={20}>Task Status:</Heading>
                  <Text>{status}</Text>
                </CardFooter>
                <PromptButton
                  status={status}
                  id={id}
                  globalUsername={globalUsername}
                  prompts={prompts}
                />
              </Card>
            );
          })
        : null}
    </Card>
  );
}
