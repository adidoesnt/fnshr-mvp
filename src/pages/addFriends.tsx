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
  Text,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import axios from "axios";
import { useDispatch } from "react-redux";
import BackButton from "@/components/BackButton";
import Head from "next/head";
import { useWindowSize } from "@/app/hooks";

type ContentProps = {
  username: string;
  users: any[];
  friends: string[];
};

function Content({ username, users, friends }: ContentProps) {
  const size = useWindowSize();
  const URI = "api/addFriend";
  const dispatch = useDispatch();

  const [searchValue, setSearchValue] = useState("");
  const filteredUsers = users.filter((user) => {
    return (
      user.username !== username &&
      user.username.includes(searchValue) &&
      friends.findIndex((friend) => friend === user.username) === -1
    );
  });

  async function handleAddFriend(friend: string) {
    try {
      const response = await axios.post(URI, {
        username,
        friend,
      });
      console.log(response.data);
      const { friends } = response.data;
      dispatch(setFriends(friends));
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <Head>
        <title>Fnshr - Add Task</title>
      </Head>
      <main
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          width: size.width,
          height: size.height
        }}
      >
        <BackButton w={"90%"} mt={"5%"} />
        <Center flexDir={"column"} m={25}>
          <Heading>Add Friends</Heading>
          <Input
            w={"90%"}
            id="search"
            type={"text"}
            onChange={(e) => setSearchValue(e.target.value)}
            value={searchValue}
            placeholder={"search username..."}
            m={5}
          />
          {filteredUsers.map((user: any, index: number) => {
            return (
              <Card key={index}>
                <CardBody display={"flex"} alignItems={"center"}>
                  <Text mr={2.5}>{user.username}</Text>
                  <IconButton
                    ml={2.5}
                    aria-label="add friend"
                    icon={<AddIcon />}
                    onClick={() => handleAddFriend(user.username)}
                  />
                </CardBody>
              </Card>
            );
          })}
        </Center>
      </main>
    </>
  );
}

export default function AddFriends() {
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
