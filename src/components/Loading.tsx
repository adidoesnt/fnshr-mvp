import { Center, Text } from "@chakra-ui/react";
import Head from "next/head";

export default function Loading() {
  return (
    <>
      <Head>
        <title>Fnshr - Loading...</title>
      </Head>
      <main
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Center w={"90%"} m={50}>
          <Text>Loading...</Text>
        </Center>
      </main>
    </>
  );
}
