import { useSelector } from "react-redux";
import { fetchGlobalUser, selectGlobalUser } from "@/app/features/user/userSlice";
import Head from "next/head";
import FnshrPoints from "@/components/FnshrPoints";
import { useRouter } from "next/router";
import Loading from "@/components/Loading";
import { Button, Flex, Text } from "@chakra-ui/react";
import { AddIcon, SearchIcon, ViewIcon } from "@chakra-ui/icons";
import YourTasks, { YourTasksProps } from "@/components/YourTasks";
import FriendsTasks from "@/components/FriendsTasks";
import { useDispatch } from "react-redux";
import { clearGlobalUser } from "@/app/features/user/userSlice";
import { useWindowSize } from "@/app/hooks";
import Callouts from "@/components/Callouts";
import { persistor, store } from "@/app/store";
import Notifications from "@/components/Notifications";

type ContentProps = YourTasksProps & {
  points: number;
  friends: string[];
};

type FriendsButtonProps = {
  add: boolean;
};

function FriendsButton({ add }: FriendsButtonProps) {
  const router = useRouter();

  const handleClick = (add: boolean) => {
    const URI = add ? "/addFriends" : "/viewFriends";
    router.push(URI);
  };

  return (
    <Button display={"flex"} onClick={() => handleClick(add)} mb={5} w={200}>
      <Text w={"75%"} m={2.5}>
        {add ? "Add Friends" : "View Friends"}
      </Text>
      {add ? <SearchIcon m={2.5} /> : <ViewIcon m={2.5} />}
    </Button>
  );
}

type LogoutButtonProps = {
  username: string;
};

function LogoutButton({ username }: LogoutButtonProps) {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(clearGlobalUser);
    persistor.purge();
    router.push("/login");
  };

  return (
    <Flex w={"90%"} mt={"5%"}>
      <Flex justifyContent={"flex-start"} w={`${100 / 3}%`}>
        <Button w={"100px"} onClick={handleLogout}>
          Logout
        </Button>
      </Flex>
      <Flex justifyContent={"center"} alignItems={"center"} w={`${100 / 3}%`}>
        <Callouts />
      </Flex>
      <Flex justifyContent={"flex-end"} alignItems={"center"} w={`${100 / 3}%`}>
        <Notifications username={username} />
      </Flex>
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
      <Text w={"75%"} m={2.5}>
        Add Task
      </Text>
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
        <LogoutButton username={username} />
        <FnshrPoints points={points} />
        <FriendsButton add={false} />
        <FriendsButton add />
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
    <Content
      username={username}
      points={points}
      friends={friends}
    />
  ) : (
    <Loading />
  );
}
