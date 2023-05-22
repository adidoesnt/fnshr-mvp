import Head from "next/head";
import { Flex, Text } from "@chakra-ui/react";
import { Logo } from "../../public/Logo";

function Intro() {
  return (
    <Flex flexDir={"column"} alignItems={"center"} m={50}>
      <Logo />
      <Text>Social productivity at your fingertips.</Text>
    </Flex>
  );
}

export default function LoginPage() {
  return (
    <>
      <Head>
        <title>Fnshr</title>
      </Head>
      <main
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Intro />
      </main>
    </>
  );
}
