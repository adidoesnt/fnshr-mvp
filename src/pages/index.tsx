import Head from "next/head";
import { Flex, Text } from "@chakra-ui/react";
import { Logo } from "../../public/Logo";
import Link from "next/link";

function Intro() {
  return (
    <Link href={"/login"}>
      <Flex flexDir={"column"} alignItems={"center"} m={50}>
        <Logo />
        <Text textAlign={"center"}>
          Social productivity at your fingertips. Tap to begin.
        </Text>
      </Flex>
    </Link>
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
