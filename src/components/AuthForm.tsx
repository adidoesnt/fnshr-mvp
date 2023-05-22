import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Center,
  Heading,
  Text,
} from "@chakra-ui/react";
import Link from "next/link";
import { useState } from "react";

export type AuthFormNavigation = {
  text: string;
  link: {
    uri: string;
    description: string;
  };
};

export type AuthFormProps = {
  title: string;
  onSubmit: (username: string, password: string) => void;
  navigation: AuthFormNavigation;
};

export default function AuthForm({
  title,
  onSubmit,
  navigation,
}: AuthFormProps) {
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
        <Text>
          {navigation.text}{" "}
          <Link href={navigation.link.uri}>{navigation.link.description}</Link>
        </Text>
      </FormControl>
    </Center>
  );
}
