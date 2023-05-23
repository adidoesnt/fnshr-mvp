import { useSelector } from "react-redux";
import { selectGlobalUser } from "@/app/features/user/userSlice";
import Head from "next/head";
import FnshrPoints from "@/components/FnshrPoints";
import { useRouter } from "next/router";
import Loading from "@/components/Loading";
import { Button, Text } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

type ContentProps = {
  points: number;
};

function AddTaskButton() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/addTask");
  }

  return (
    <Button display={"flex"} onClick={handleClick}>
      <Text m={2.5}>Add Task</Text>
      <AddIcon m={2.5} />
    </Button>
  );
}

function Content({ points }: ContentProps) {
  return (
    <>
      <Head>
        <title>Fnshr - Home</title>
      </Head>
      <main
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <FnshrPoints points={points} />
        <AddTaskButton />
      </main>
    </>
  );
}

export default function Home() {
  const router = useRouter();
  const user = useSelector(selectGlobalUser);
  const points: number = user.points;

  const auth = user.username !== "";

  if (!auth) {
    router.push("/login");
  }

  return auth ? <Content points={points} /> : <Loading />;
}
