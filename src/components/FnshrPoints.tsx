import {
  fetchGlobalUser,
  selectGlobalUser,
} from "@/app/features/user/userSlice";
import { store } from "@/app/store";
import { Center, Heading, Button, Text, Flex } from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

export type FnshrPointsProps = {
  points: number;
  noTopupButton?: boolean;
  noRefreshButton?: boolean;
};

function ExchangeRate() {
  return <Text>1 SGD = 10 FP</Text>;
}

export default function FnshrPoints({
  points,
  noTopupButton,
  noRefreshButton,
}: FnshrPointsProps) {
  const user = useSelector(selectGlobalUser);
  const { username } = user;
  const router = useRouter();

  const handleTopupClick = () => {
    router.push("/topup");
  };

  const handleRefreshClick = async () => {
    await store.dispatch(fetchGlobalUser(username));
  };

  return (
    <Center w={"90%"} m={25} mb={35} flexDir={"column"}>
      <ExchangeRate />
      <Heading>Fnshr Points: {points}</Heading>
      <Flex>
        {noTopupButton ? null : (
          <Button mr={2.5} w={"150px"} onClick={handleTopupClick} mt={2.5}>
            Top up Points
          </Button>
        )}
        {noRefreshButton ? null : (
          <Button ml={2.5} w={"150px"} onClick={handleRefreshClick} mt={2.5}>
            Refresh Points
          </Button>
        )}
      </Flex>
    </Center>
  );
}
