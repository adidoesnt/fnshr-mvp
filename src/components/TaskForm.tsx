import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Center,
  Heading,
  FormHelperText,
} from "@chakra-ui/react";
import { differenceInHours } from "date-fns";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { fetchTasks } from "@/app/features/tasks/tasksSlice";
import { store } from "@/app/store";

export type TaskFormProps = {
  username: string;
};

export default function TaskForm({ username }: TaskFormProps) {
    const router = useRouter();
    const URI = "/api/addTask";

  const [name, setName] = useState("");
  const [deadline, setDeadline] = useState(new Date());
  const [pledge, setPledge] = useState(0);

  const validateName = () => {
    return name !== "";
  };

  const validatePledge = () => {
    return pledge > 0;
  };

  const validateDate = () => {
    const now = new Date();
    const diff = differenceInHours(deadline, now);
    return diff > 0;
  };

  async function handleSubmit() {
    try {
      const response = await axios.post(URI, {
        username,
        name,
        deadline,
        pledge
      });
      console.log(response.data);
      store.dispatch(fetchTasks());
      router.push("/home");
    } catch (err) {
      console.log(err);
    }
  };

  const submissionDisabled =
    !validateName() || !validatePledge() || !validateDate();

  return (
    <Center w={"90%"} m={50}>
      <FormControl>
        <Heading>Add New Task</Heading>
        <FormLabel>Task Name</FormLabel>
        <Input
          id="name"
          type={"text"}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <FormLabel>Task Deadline</FormLabel>
        <FormHelperText>
          When do you intend to complete this task by? This should be at least
          an hour from now.
        </FormHelperText>
        <Input
          placeholder="Select Date and Time"
          size="md"
          type="datetime-local"
          onChange={(e) => {
            const deadlineToSet = new Date(e.target.value);
            setDeadline(deadlineToSet);
          }}
        />
        <FormLabel>Pledge</FormLabel>
        <FormHelperText>
          How many Fnshr points would you like to pledge for this task? This
          should be at least 1.
        </FormHelperText>
        <Input
          id="pledge"
          type={"text"}
          onChange={(e) => {
            setPledge(parseInt(e.target.value));
          }}
        />
        <Button onClick={handleSubmit} isDisabled={submissionDisabled}>
          Submit
        </Button>
      </FormControl>
    </Center>
  );
}