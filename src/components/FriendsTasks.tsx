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
import TaskFilterMenu from "./TaskFilterMenu";
import LoadingSpinner from "./LoadingSpinner";
import TaskPill from "./TaskPill";

export type FriendsTasksProps = {
  friends: string[];
};

type PromptButtonProps = {
  promptee: string;
  status: "ongoing" | "completed" | "missed";
  id: string;
  prompts: string[];
  globalUsername: string;
};

function PromptButton({
  promptee,
  status,
  id,
  globalUsername,
  prompts,
}: PromptButtonProps) {
  const deductionURI = "api/deductPoints";
  const promptURI = "/api/promptTask";
  const globalUser = useSelector(selectGlobalUser);
  const { username: prompter } = globalUser;
  const penalty = 2;
  const [ submitting, setSubmitting ] = useState(false);

  async function handleClick(id: string) {
    setSubmitting(true);
    try {
      const promptResponse = await axios.post(promptURI, { id, prompter });
      console.log(promptResponse.data);
      const deductionResponse = await axios.post(deductionURI, {
        username: promptee,
        pledge: penalty,
      });
      console.log(deductionResponse.data);
      await store.dispatch(fetchTasks());
    } catch (err) {
      console.log(err);
    }
    setSubmitting(false);
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
        isDisabled={submitting}
      >
        {submitting ? <LoadingSpinner /> : <Text>Call out</Text>}
        <WarningIcon />
      </Button>
    </Flex>
  ) : null;
}

type TaskCardProps = {
  id: string;
  prompts: string[];
  status: "ongoing" | "completed" | "missed";
  username: string;
  name: string;
  pledge: number;
  convertedDeadline: string;
  globalUsername: string;
};

function TaskCard({
  id,
  prompts,
  status,
  username,
  name,
  pledge,
  convertedDeadline,
  globalUsername,
}: TaskCardProps) {
  const [expand, setExpand] = useState(false);

  return (
    <Card key={id} m={2.5}>
      <TaskPrompts status={status} prompts={prompts} />
      <CardHeader>
        <Heading fontSize={20}>Friend:</Heading>
        <Text>{username}</Text>
        <br />
        <Heading fontSize={20}>Task Name:</Heading>
        <Text>{name}</Text>
        <TaskPill status={status} />
      </CardHeader>
      {!expand ? <Button onClick={() => setExpand(true)}>Expand</Button> : null}
      {expand ? (
        <>
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
            promptee={username}
            status={status}
            id={id}
            globalUsername={globalUsername}
            prompts={prompts}
          />
          {expand ? (
            <Button onClick={() => setExpand(false)}>Collapse</Button>
          ) : null}
        </>
      ) : null}
    </Card>
  );
}

export default function FriendsTasks({ friends }: FriendsTasksProps) {
  const globalUser = useSelector(selectGlobalUser);
  const { username: globalUsername } = globalUser;
  const tasks = useSelector(selectAllTasks);
  const [buttonText, setButtonText] = useState("Show");
  const [filter, setFilter] = useState("All");
  let filteredTasks = tasks.filter(
    (task: any) =>
      friends.findIndex((friend) => friend === task.username) !== -1
  );
  if (filter !== "All") {
    filteredTasks = filteredTasks.filter(
      (task: any) => task.status === filter.toLowerCase()
    );
  }
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
    if (buttonText === "Show") {
      setButtonText("Hide");
    } else {
      setButtonText("Show");
    }
  };

  return (
    <Card display={"flex"} flexDir={"column"} w={"90%"} m={50} mt={2.5}>
      <Center alignItems={"center"}>
        <Heading fontSize={25} m={2.5} w={"50%"} textAlign={"center"}>
          Friends&apos; Tasks
        </Heading>
        <Flex flexDir={"column"} m={2.5} w={"50%"}>
          <Button mb={2.5} onClick={toggleButtonText}>
            {buttonText}
          </Button>
          <TaskFilterMenu setFilter={setFilter} />
        </Flex>
      </Center>
      {buttonText === "Hide"
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
              <TaskCard
                key={id}
                convertedDeadline={convertedDeadline}
                globalUsername={globalUsername}
                id={id}
                name={name}
                pledge={pledge}
                prompts={prompts}
                status={status}
                username={username}
              />
            );
          })
        : null}
    </Card>
  );
}
