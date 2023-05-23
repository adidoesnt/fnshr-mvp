import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { selectGlobalUser } from "@/app/features/user/userSlice";
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

type ContentProps = {
  username: string;
  users: any[];
};

function Content({ username, users }: ContentProps) {
  const [searchValue, setSearchValue] = useState("");
  const filteredUsers = users.filter((user) => {
    return user.username !== username && user.username.includes(searchValue);
  });

  const handleAddFriend = () => {
    // TODO: implement logic
  };

  return (
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
                onClick={handleAddFriend}
              />
            </CardBody>
          </Card>
        );
      })}
    </Center>
  );
}

export default function AddFriends() {
  const router = useRouter();
  const user = useSelector(selectGlobalUser);
  const users = useSelector(selectAllUsers);
  const { username } = user;

  const auth = username !== "";

  if (!auth) {
    router.push("/login");
  }

  return auth ? <Content username={username} users={users} /> : <Loading />;
}
