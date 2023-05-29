import { useDispatch, useSelector } from "react-redux";
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
import axios from "axios";
import { store } from "@/app/store";
import { parseISO } from "date-fns";
import TaskPrompts from "./TaskPrompts";
import { setPoints } from "@/app/features/user/userSlice";
import TaskFilterMenu from "./TaskFilterMenu";
import LoadingSpinner from "./LoadingSpinner";

export type YourTasksProps = {
  username: string;
};

export const convertISOToLocalTime = (deadline: string) => {
  const deadlineDate: Date = parseISO(deadline);
  const dateString = deadlineDate.toLocaleDateString();
  const timeString = deadlineDate.toLocaleTimeString();
  return `${dateString} ${timeString}`;
};

type TaskCardProps = {
  id: string;
  prompts: string[];
  status: "ongoing" | "completed" | "missed";
  name: string;
  pledge: number;
  convertedDeadline: string;
};

function TaskCard({
  id,
  prompts,
  status,
  name,
  pledge,
  convertedDeadline,
}: TaskCardProps) {
  const [expand, setExpand] = useState(false);
  const URI = "api/completeTask";
  const dispatch = useDispatch();
  const [submitting, setSubmitting] = useState(false);
  async function handleCompleteTask(id: string) {
    setSubmitting(true);
    try {
      const response = await axios.post(URI, { id });
      const { points } = response.data;
      dispatch(setPoints(points));
      console.log(response.data);
      await store.dispatch(fetchTasks());
    } catch (err) {
      console.log(err);
    }
    setSubmitting(false);
  }

  return (
    <Card key={id} m={2.5}>
      <TaskPrompts prompts={prompts} status={status} />
      <CardHeader>
        <Heading fontSize={20}>Task Name:</Heading>
        <Text>{name}</Text>
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
            {status === "ongoing" ? (
              <Button
                m={2.5}
                onClick={() => handleCompleteTask(id)}
                isDisabled={submitting}
              >
                {submitting ? <LoadingSpinner /> : "Mark Complete"}
              </Button>
            ) : null}
          </CardFooter>
          {expand ? (
            <Button onClick={() => setExpand(false)}>Collapse</Button>
          ) : null}
        </>
      ) : null}
    </Card>
  );
}

export default function YourTasks({ username }: YourTasksProps) {
  const tasks = useSelector(selectAllTasks);
  const [buttonText, setButtonText] = useState("Show");
  const [filter, setFilter] = useState("All");
  let filteredTasks = tasks.filter((task: any) => task.username === username);
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
    <Card display={"flex"} flexDir={"column"} w={"90%"} m={50} mb={2.5}>
      <Center alignItems={"center"}>
        <Heading fontSize={25} m={2.5} w={"50%"} textAlign={"center"}>
          Your Tasks
        </Heading>
        <Flex flexDir={"column"} m={2.5} w={"50%"}>
          <Button mb={2.5} onClick={toggleButtonText}>
            {buttonText}
          </Button>
          <TaskFilterMenu setFilter={setFilter} />
        </Flex>
      </Center>
      {buttonText === "Hide"
        ? filteredTasks.map((task: any, index: number) => {
            const { _id: id, name, deadline, pledge, status, prompts } = task;
            const convertedDeadline = convertISOToLocalTime(deadline);

            return (
              <TaskCard
                key={id}
                convertedDeadline={convertedDeadline}
                id={id}
                name={name}
                pledge={pledge}
                status={status}
                prompts={prompts}
              />
            );
          })
        : null}
    </Card>
  );
}
