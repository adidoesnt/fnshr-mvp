import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { selectGlobalUser, setFriends } from "@/app/features/user/userSlice";
import { selectAllUsers } from "@/app/features/users/usersSlice";
import Loading from "@/components/Loading";
import { useState } from "react";
import {
  Card,
  CardBody,
  Center,
  Heading,
  IconButton,
  Input,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { MinusIcon } from "@chakra-ui/icons";
import axios from "axios";
import { useDispatch } from "react-redux";
import BackButton from "@/components/BackButton";
import Head from "next/head";
import { useWindowSize } from "@/app/hooks";
import { defaultReqConfig } from "./api/preflight";

type ContentProps = {
  username: string;
  users: any[];
  friends: string[];
};

type FriendCardProps = {
  username: string;
};

function FriendCard({ username }: FriendCardProps) {
  const dispatch = useDispatch();
  const [submitting, setSubmitting] = useState(false);
  const { username: ownUsername } = useSelector(selectGlobalUser);

  async function notifyFriend(username: string, friend: string) {
    const URI = `/api/notifyFriend`;
    const content = `${username} has removed you as a friend.`;
    try {
      const response = await axios.post(URI, { content, friend }, defaultReqConfig);
      console.log(response.data);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleRemoveFriend(friend: string) {
    const URI = "api/removeFriend";
    setSubmitting(true);
    try {
      const response = await axios.post(URI, {
        username: ownUsername,
        friend,
      }, defaultReqConfig);
      console.log(response.data);
      const { friends } = response.data;
      dispatch(setFriends(friends));
      await notifyFriend(ownUsername, friend);
    } catch (err) {
      console.log(err);
    }
    setSubmitting(false);
  }

  return (
    <Card m={"5px"} w={"200px"} display={"flex"}>
      <CardBody display={"flex"} alignItems={"center"}>
        <Text mr={2.5} w={"75%"} textOverflow={"ellipsis"}>
          {username}
        </Text>
        <IconButton
          ml={2.5}
          aria-label="remove friend"
          icon={submitting ? <Spinner /> : <MinusIcon />}
          onClick={() => handleRemoveFriend(username)}
          w={"25%"}
          isDisabled={submitting}
        />
      </CardBody>
    </Card>
  );
}

function Content({ username, users, friends }: ContentProps) {
  const size = useWindowSize();

  const [searchValue, setSearchValue] = useState("");
  const filteredUsers = users.filter((user) => {
    return (
      user.username !== username &&
      user.username.includes(searchValue) &&
      friends.findIndex((friend) => friend === user.username) !== -1
    );
  });

  return (
    <>
      <Head>
        <title>Fnshr - View Friends</title>
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
        <BackButton w={"90%"} mt={"5%"} />
        <Center flexDir={"column"} m={25}>
          <Heading>View Friends</Heading>
          <Input
            w={"90%"}
            id="search"
            type={"text"}
            onChange={(e) => setSearchValue(e.target.value)}
            value={searchValue}
            placeholder={"Search username..."}
            m={5}
          />
          {filteredUsers.map((user: any) => {
            return <FriendCard username={user.username} key={user.username} />;
          })}
        </Center>
      </main>
    </>
  );
}

export default function ViewFriends() {
  const router = useRouter();
  const user = useSelector(selectGlobalUser);
  const users = useSelector(selectAllUsers);
  const { username, friends } = user;

  const auth = username !== "";

  if (!auth) {
    router.push("/login");
  }

  return auth ? (
    <Content username={username} users={users} friends={friends} />
  ) : (
    <Loading />
  );
}
