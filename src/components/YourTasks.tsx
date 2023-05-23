import { useSelector } from "react-redux";
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

export type YourTasksProps = {
  username: string;
};

export default function YourTasks({ username }: YourTasksProps) {
  const URI = "api/completeTask";
  const tasks = useSelector(selectAllTasks);
  const [buttonText, setButtonText] = useState("show");
  const filteredTasks = tasks.filter((task: any) => task.username === username);

  const toggleButtonText = () => {
    if(buttonText === "show") {
        setButtonText("hide");
    } else {
        setButtonText("show");
    }
  }

  async function handleCompleteTask(id: string) {
    try {
      const response = await axios.post(URI, { id });
      console.log(response.data);
      store.dispatch(fetchTasks());
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <Card display={"flex"} flexDir={"column"} w={"90%"} m={50} mb={2.5}>
      <Center alignItems={"center"}>
        <Heading fontSize={25} m={2.5}>
          Your Tasks
        </Heading>
        <Button onClick={toggleButtonText}>
            {buttonText}
        </Button>
      </Center>
      {buttonText === "hide" ? filteredTasks.map((task: any, index: number) => {
        const { _id: id, name, deadline, pledge, status } = task;
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
              { status === "ongoing" ? <Button m={2.5} onClick={() => handleCompleteTask(id)}>Mark Complete</Button> : null }
            </CardFooter>
          </Card>
        );
      }) : null }
    </Card>
  );
}
