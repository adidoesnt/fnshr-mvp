import { useSelector } from "react-redux";
import { selectGlobalUser } from "@/app/features/user/userSlice";
import Head from "next/head";
import FnshrPoints from "@/components/FnshrPoints";
import { useRouter } from "next/router";
import Loading from "@/components/Loading";
import { Button, Flex, Text } from "@chakra-ui/react";
import { AddIcon, SearchIcon } from "@chakra-ui/icons";
import YourTasks, { YourTasksProps } from "@/components/YourTasks";
import FriendsTasks from "@/components/FriendsTasks";
import { useDispatch } from "react-redux";
import { clearGlobalUser } from "@/app/features/user/userSlice";
import { useWindowSize } from "@/app/hooks";

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

function LogoutButton() {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(clearGlobalUser);
    router.push("/login");
  };

  return (
    <Flex w={"90%"} justifyContent={"flex-start"} mt={"5%"}>
      <Button onClick={handleLogout}>Logout</Button>
    </Flex>
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
  const size = useWindowSize();

  return (
    <>
      <Head>
        <title>Fnshr - Home</title>
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
        <LogoutButton />
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
