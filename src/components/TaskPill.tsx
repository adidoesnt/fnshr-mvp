import { useCallback } from "react";
import { Badge } from "@chakra-ui/react";

export type TaskPillProps = {
  status: "ongoing" | "missed" | "completed" | "all";
};

export default function TaskPill({ status }: TaskPillProps) {
  const getColor = useCallback(() => {
    switch (status) {
      case "ongoing":
        return "yellow";
      case "missed":
        return "red";
      case "completed":
        return "green";
      case "all":
        return "blue";
    }
  }, [status]);

  const color = getColor();

  return <Badge w={"fit-content"} colorScheme={color}>{status}</Badge>;
}
