import { Menu, MenuButton, MenuList, MenuItem, Button } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import TaskPill from "./TaskPill";
import { useState } from "react";

export type TaskFilterMenuProps = {
  setFilter: (filter: string) => void;
};

export default function TaskFilterMenu({ setFilter }: TaskFilterMenuProps) {
  const taskPills = {
    all: <TaskPill status={"all"} />,
    ongoing: <TaskPill status={"ongoing"} />,
    completed: <TaskPill status={"completed"} />,
    missed: <TaskPill status={"missed"} />,
  };

  const [activePill, setActivePill] = useState(taskPills.all);
  
  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
        {activePill}
      </MenuButton>
      <MenuList>
        <MenuItem
          onClick={() => {
            setActivePill(taskPills.all);
            setFilter("All");
          }}
        >
          {taskPills.all}
        </MenuItem>
        <MenuItem
          onClick={() => {
            setActivePill(taskPills.ongoing);
            setFilter("Ongoing");
          }}
        >
          {taskPills.ongoing}
        </MenuItem>
        <MenuItem
          onClick={() => {
            setActivePill(taskPills.completed);
            setFilter("Completed");
          }}
        >
          {taskPills.completed}
        </MenuItem>
        <MenuItem
          onClick={() => {
            setActivePill(taskPills.missed);
            setFilter("Missed");
          }}
        >
          {taskPills.missed}
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
