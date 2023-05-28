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
        <FormLabel mt={"20px"}>Username</FormLabel>
        <Input
          id="username"
          type={"text"}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
        <FormLabel mt={"15px"}>Password</FormLabel>
        <Input
          id="password"
          type={"password"}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <Button
          mt={"20px"}
          onClick={handleSubmit}
          isDisabled={submissionDisabled}
        >
          Submit
        </Button>
        <Text textAlign={"center"} mt={"15px"}>
          {navigation.text}{" "}
          <Link style={{ color: "black" }} href={navigation.link.uri}>
            {navigation.link.description}
          </Link>
        </Text>
      </FormControl>
    </Center>
  );
}
