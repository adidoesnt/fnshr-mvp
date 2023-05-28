import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Center,
  Heading,
  FormHelperText,
} from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";

export default function AdminForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date());
  const [refNumber, setRefNumber] = useState("");

  const validate = (data: string) => {
    return data !== "";
  };

  const validateDate = () => {
    try {
      const dateString = date.toISOString();
      return validate(dateString);
    } catch {
      return false;
    }
  };

  const handleSubmit = async () => {
    const URI = "api/addPayment";
    try {
      const response = await axios.post(URI, {
        username,
        amount,
        refNumber,
        date,
      });
      console.log(response.data);
      router.back();
    } catch (err) {
      console.log(err);
    }
  };

  const submissionDisabled =
    !validate(username) ||
    !validate(amount) ||
    !validate(refNumber) ||
    !validateDate();

  return (
    <Center w={"90%"} m={50}>
      <FormControl>
        <Heading>Add New Payment</Heading>
        <FormLabel>Username</FormLabel>
        <FormHelperText>
          This is the username of the user that paid.
        </FormHelperText>
        <Input
          id="username"
          type={"text"}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
        <FormLabel>Amount</FormLabel>
        <FormHelperText>This is the amount paid in SGD.</FormHelperText>
        <Input
          id="amount"
          type={"text"}
          onChange={(e) => {
            setAmount(e.target.value);
          }}
        />
        <FormLabel>Payment Date</FormLabel>
        <FormHelperText>
          This is the date and time the payment was made by the user.
        </FormHelperText>
        <Input
          placeholder="Select Date and Time"
          size="md"
          type="datetime-local"
          onChange={(e) => {
            const deadlineToSet = new Date(e.target.value);
            setDate(deadlineToSet);
          }}
        />
        <FormLabel>Reference Number</FormLabel>
        <FormHelperText>
          This is the reference number for the payment made.
        </FormHelperText>
        <Input
          id="refNumber"
          type={"text"}
          onChange={(e) => {
            setRefNumber(e.target.value);
          }}
        />
        <Button onClick={handleSubmit} isDisabled={submissionDisabled}>
          Submit
        </Button>
      </FormControl>
    </Center>
  );
}