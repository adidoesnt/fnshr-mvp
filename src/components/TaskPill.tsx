import { useCallback } from "react";
import { Badge } from "@chakra-ui/react";

export type TaskPillProps = {
  status: "ongoing" | "missed" | "completed";
};

export default function TaskPill({ status }: TaskPillProps) {
  const getColor = useCallback(() => {
    switch (status) {
      case "ongoing":
        return "blue";
      case "missed":
        return "red";
      case "completed":
        return "green";
    }
  }, [status]);

  const color = getColor();

  return <Badge w={"fit-content"} colorScheme={color}>{status}</Badge>;
}
