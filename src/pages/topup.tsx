import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { selectGlobalUser } from "@/app/features/user/userSlice";
import Loading from "@/components/Loading";
import Head from "next/head";
import { useWindowSize } from "@/app/hooks";
import BackButton from "@/components/BackButton";
import TopupForm from "@/components/TopupForm";
import { Flex } from "@chakra-ui/react";
import Notifications from "@/components/Notifications";

type ContentProps = {
  username: string;
};

function Content({ username }: ContentProps) {
  const size = useWindowSize();

  return (
    <>
      <Head>
        <title>Fnshr - Top Up</title>
      </Head>
      <main
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          width: size.width,
          height: size.height,
        }}
      >
        <Flex w={"90%"} alignItems={"center"} mt={"5%"}>
          <BackButton w={"90%"} />
          <Notifications username={username} />
        </Flex>
        <TopupForm />
      </main>
    </>
  );
}

export default function Topup() {
  const router = useRouter();
  const user = useSelector(selectGlobalUser);
  const { username } = user;

  const auth = username !== "";

  if (!auth) {
    router.push("/login");
  }

  return auth ? <Content username={username} /> : <Loading />;
}
