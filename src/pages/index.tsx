import Head from "next/head";
import { Flex, Text } from "@chakra-ui/react";
import { Logo } from "../../public/Logo";
import Link from "next/link";
import { useWindowSize } from "@/app/hooks";

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

export default function HomePage() {
  const size = useWindowSize();
  
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
          width: size.width,
          height: size.height
        }}
      >
        <Intro />
      </main>
    </>
  );
}
