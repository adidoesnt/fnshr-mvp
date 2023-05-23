import { useSelector } from "react-redux";
import { selectAllTasks } from "@/app/features/tasks/tasksSlice";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Heading,
  Text,
} from "@chakra-ui/react";

export type YourTasksProps = {
  username: string;
};

export default function YourTasks({ username }: YourTasksProps) {
  const tasks = useSelector(selectAllTasks);
  const filteredTasks = tasks.filter((task: any) => task.username === username);

  return (
    <Flex flexDir={"column"} w={"90%"} m={50}>
      <Heading fontSize={25}>Your Tasks</Heading>
      {filteredTasks.map((task: any, index: number) => {
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
            <CardFooter>
              <Heading fontSize={20}>Task Status:</Heading>
              <Text>{status}</Text>
            </CardFooter>
          </Card>
        );
      })}
    </Flex>
  );
}
