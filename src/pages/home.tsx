import { useSelector } from "react-redux";
import { selectGlobalUser } from "@/app/features/user/userSlice";
import Head from "next/head";
import FnshrPoints from "@/components/FnshrPoints";
import { useRouter } from "next/router";
import Loading from "@/components/Loading";
import { Button, Center, Flex, Text } from "@chakra-ui/react";
import { AddIcon, SearchIcon } from "@chakra-ui/icons";
import YourTasks, { YourTasksProps } from "@/components/YourTasks";
import FriendsTasks from "@/components/FriendsTasks";
import { useDispatch } from "react-redux";
import { clearGlobalUser } from "@/app/features/user/userSlice";
import { useWindowSize } from "@/app/hooks";
import Callouts from "@/components/Callouts";
import { persistor } from "@/app/store";

type ContentProps = YourTasksProps & {
  points: number;
  friends: string[];
  admin: boolean;
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

type LogoutButtonProps = {
  admin: boolean;
};

function LogoutButton({ admin }: LogoutButtonProps) {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleClick = () => {
    router.push("/admin");
  };

  const handleLogout = () => {
    dispatch(clearGlobalUser);
    persistor.purge();
    router.push("/login");
  };

  return (
    <Flex w={"90%"} mt={"5%"}>
      <Flex justifyContent={"flex-start"} w={admin ? `${100 / 3}%` : "100%"}>
        <Button w={"100px"} onClick={handleLogout}>
          Logout
        </Button>
      </Flex>
      <Flex justifyContent={"center"} alignItems={"center"} w={`${100 / 3}%`}>
        <Callouts />
      </Flex>
      {admin ? (
        <Flex justifyContent={"flex-end"} w={`${100 / 3}%`}>
          <Button display={"flex"} w={"100px"} onClick={handleClick}>
            Admin
          </Button>
        </Flex>
      ) : null}
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

function Content({ username, points, friends, admin }: ContentProps) {
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
        <LogoutButton admin={admin} />
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
  const { username, points, friends, admin } = user;

  const auth = user.username !== "";

  if (!auth) {
    router.push("/login");
  }

  return auth ? (
    <Content
      username={username}
      points={points}
      friends={friends}
      admin={admin}
    />
  ) : (
    <Loading />
  );
}
