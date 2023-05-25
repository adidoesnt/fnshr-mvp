import { useDispatch, useSelector } from "react-redux";
import { fetchTasks, selectAllTasks } from "@/app/features/tasks/tasksSlice";
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
import axios from "axios";
import { store } from "@/app/store";
import { parseISO } from "date-fns";
import TaskPrompts from "./TaskPrompts";
import { setPoints } from "@/app/features/user/userSlice";

export type YourTasksProps = {
  username: string;
};

export const convertISOToLocalTime = (deadline: string) => {
  const deadlineDate: Date = parseISO(deadline);
  const dateString = deadlineDate.toLocaleDateString();
  const timeString = deadlineDate.toLocaleTimeString();
  return `${dateString} ${timeString}`;
}

export default function YourTasks({ username }: YourTasksProps) {
  const dispatch = useDispatch();
  const URI = "api/completeTask";
  const tasks = useSelector(selectAllTasks);
  const [buttonText, setButtonText] = useState("show");
  let filteredTasks = tasks.filter((task: any) => task.username === username);
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

  async function handleCompleteTask(id: string) {
    try {
      const response = await axios.post(URI, { id });
      const { points } = response.data;
      dispatch(setPoints(points));
      console.log(response.data);
      store.dispatch(fetchTasks());
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Card display={"flex"} flexDir={"column"} w={"90%"} m={50} mb={2.5}>
      <Center alignItems={"center"}>
        <Heading fontSize={25} m={2.5}>
          Your Tasks
        </Heading>
        <Button onClick={toggleButtonText}>{buttonText}</Button>
      </Center>
      {buttonText === "hide"
        ? filteredTasks.map((task: any, index: number) => {
            const { _id: id, name, deadline, pledge, status, prompts } = task;
            const convertedDeadline = convertISOToLocalTime(deadline);
            return (
              <Card key={index} m={2.5}>
                <TaskPrompts prompts={prompts} status={status} />
                <CardHeader>
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
                  {status === "ongoing" ? (
                    <Button m={2.5} onClick={() => handleCompleteTask(id)}>
                      Mark Complete
                    </Button>
                  ) : null}
                </CardFooter>
              </Card>
            );
          })
        : null}
    </Card>
  );
}
