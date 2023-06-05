import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Center,
  Heading,
  Text,
  Card,
  CardHeader,
  CardBody,
  FormErrorMessage,
  Badge,
} from "@chakra-ui/react";
import Link from "next/link";
import { useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import type { LoginStatus } from "@/pages/api/login";
import type { SignupStatus } from "@/pages/api/signup";

export type AuthStatus = LoginStatus & SignupStatus;

export type ErrorModalProps = {
  errorMessage: AuthStatus;
};

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
  submitting: boolean;
  error: AuthStatus;
  setError: (errMessage: AuthStatus) => void;
};

export default function AuthForm({
  title,
  onSubmit,
  navigation,
  submitting,
  error,
  setError,
}: AuthFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const validate = (data: string) => {
    return data !== "";
  };

  const handleSubmit = () => {
    setError("Success")
    onSubmit(username.trim(), password);
  };

  const submissionDisabled =
    !validate(username) || !validate(password) || submitting;

  return (
    <Center w={"90%"} m={25} display={"flex"} flexDir={"column"}>
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
          {submitting ? <LoadingSpinner /> : "Submit"}
        </Button>
        <Text textAlign={"center"} mt={"15px"}>
          {navigation.text}{" "}
          <Link style={{ color: "black" }} href={navigation.link.uri}>
            {navigation.link.description}
          </Link>
        </Text>
      </FormControl>
      {error === "Success" ? null : <Badge mt={"10px"} colorScheme={"red"}>{error}</Badge>}
    </Center>
  );
}
