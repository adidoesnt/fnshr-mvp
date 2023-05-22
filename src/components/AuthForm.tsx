import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Center,
  Heading,
} from "@chakra-ui/react";
import { useState } from "react";

export type AuthFormProps = {
  title: string;
  onSubmit: (username: string, password: string) => void;
};

export default function AuthForm({ title, onSubmit }: AuthFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const validate = (data: string) => {
    return data !== "";
  };

  const handleSubmit = () => {
    onSubmit(username, password);
  };

  const submissionDisabled = !validate(username) || !validate(password);

  return (
    <Center w={"90%"} m={50}>
      <FormControl>
        <Heading>{title}</Heading>
        <FormLabel>Username</FormLabel>
        <Input
          id="username"
          type={"text"}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
        <FormLabel>Password</FormLabel>
        <Input
          id="password"
          type={"password"}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <Button onClick={handleSubmit} isDisabled={submissionDisabled}>
          Submit
        </Button>
      </FormControl>
    </Center>
  );
}
