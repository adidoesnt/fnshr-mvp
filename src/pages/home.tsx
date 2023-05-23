import { useSelector } from "react-redux";
import { selectGlobalUser } from "@/app/features/user/userSlice";
import Head from "next/head";
import FnshrPoints from "@/components/FnshrPoints";
import { useRouter } from "next/router";
import Loading from "@/components/Loading";
import { Button, Text } from "@chakra-ui/react";
import { AddIcon, SearchIcon } from "@chakra-ui/icons";
import YourTasks, { YourTasksProps } from "@/components/YourTasks";
import FriendsTasks from "@/components/FriendsTasks";

type ContentProps = YourTasksProps & {
  points: number;
  friends: string[];
};

function AddFriendsButton() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/addFriends");
  };

  return (
    <Button display={"flex"} onClick={handleClick} mb={5} w={200}>
      <Text m={2.5}>Add Friends</Text>
      <SearchIcon m={2.5} />
    </Button>
  );
}

function AddTaskButton() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/addTask");
  };

  return (
    <Button display={"flex"} onClick={handleClick} w={200}>
      <Text m={2.5}>Add Task</Text>
      <AddIcon m={2.5} />
    </Button>
  );
}

function Content({ username, points, friends }: ContentProps) {
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
        <AddFriendsButton />
        <AddTaskButton />
        <YourTasks username={username} />
        <FriendsTasks friends={friends} />
      </main>
    </>
  );
}

export default function Home() {
  const router = useRouter();
  const user = useSelector(selectGlobalUser);
  const { username, points, friends } = user;

  const auth = user.username !== "";

  if (!auth) {
    router.push("/login");
  }

  return auth ? (
    <Content username={username} points={points} friends={friends} />
  ) : (
    <Loading />
  );
}
