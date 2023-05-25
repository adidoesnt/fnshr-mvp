import { WarningIcon } from "@chakra-ui/icons";
import { Card, Flex, Text } from "@chakra-ui/react";

export type TaskPromptsProps = {
  status: "ongoing" | "completed" | "missed";
  prompts: string[];
};

export default function TaskPrompts({ status, prompts }: TaskPromptsProps) {
  return status === "missed" ? (
    <Flex w="100%" mt={"15px"} pr={"15px"} justifyContent={"flex-end"}>
      <Card
        display={"flex"}
        flexDir={"row"}
        justifyContent={"space-evenly"}
        alignItems={"center"}
      >
        <WarningIcon m={2.5} />
        <Text m={2.5}>{prompts.length}</Text>
      </Card>
    </Flex>
  ) : null;
}
