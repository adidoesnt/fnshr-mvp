import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Center,
  Heading,
  FormHelperText,
} from "@chakra-ui/react";
import { differenceInMinutes } from "date-fns";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { fetchTasks } from "@/app/features/tasks/tasksSlice";
import { store } from "@/app/store";
import { useDispatch, useSelector } from "react-redux";
import { selectGlobalUser, setPoints } from "@/app/features/user/userSlice";

export type TaskFormProps = {
  username: string;
};

export default function TaskForm({ username }: TaskFormProps) {
  const dispatch = useDispatch();
  const globalUser = useSelector(selectGlobalUser);
  const { points } = globalUser;

  const router = useRouter();
  const URI = "/api/addTask";

  const [name, setName] = useState("");
  const [deadline, setDeadline] = useState(new Date());
  const [pledge, setPledge] = useState(0);

  const [ submitting, setSubmitting ] = useState(false);

  const validateName = () => {
    return name !== "";
  };

  const validatePledge = () => {
    return pledge > 0 && pledge <= points;
  };

  const validateDate = () => {
    const now = new Date();
    const diff = differenceInMinutes(deadline, now);
    return diff >= 59;
  };

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const response = await axios.post(URI, {
        username,
        name,
        deadline,
        pledge,
      });
      const { points } = response.data;
      dispatch(setPoints(points));
      console.log(response.data);
      store.dispatch(fetchTasks());
      router.back();
    } catch (err) {
      console.log(err);
    }
    setSubmitting(false);
  }

  let submissionDisabled =
    !validateName() || !validatePledge() || !validateDate() || submitting;

  return (
    <Center w={"90%"} m={50} mt={0}>
      <FormControl>
        <Heading>Add New Task</Heading>
        <FormLabel mt={"20px"}>Task Name</FormLabel>
        <Input
          id="name"
          type={"text"}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <FormLabel mt={"15px"}>Task Deadline</FormLabel>
        <FormHelperText>
          When do you intend to complete this task by? This should be at least
          an hour from now.
        </FormHelperText>
        <Input
          mt={"5px"}
          placeholder="Select Date and Time"
          size="md"
          type="datetime-local"
          onChange={(e) => {
            const deadlineToSet = new Date(e.target.value);
            setDeadline(deadlineToSet);
          }}
        />
        <FormLabel mt={"15px"}>Pledge</FormLabel>
        <FormHelperText>
          How many Fnshr points would you like to pledge for this task? This
          should be at least 1, and at most the number of Fnshr points you have.
        </FormHelperText>
        <Input
          mt={"5px"}
          id="pledge"
          type={"text"}
          onChange={(e) => {
            setPledge(parseInt(e.target.value));
          }}
        />
        <Button
          mt={"20px"}
          onClick={handleSubmit}
          isDisabled={submissionDisabled}
        >
          Submit
        </Button>
      </FormControl>
    </Center>
  );
}
