import { Menu, MenuButton, MenuList, MenuItem, Button } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";

export type TaskFilterMenuProps = {
    setFilter: (filter: string) => void;
}

export default function TaskFilterMenu({ setFilter }: TaskFilterMenuProps) {
  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
        Filter Tasks...
      </MenuButton>
      <MenuList>
        <MenuItem onClick={() => setFilter("All")}>All</MenuItem>
        <MenuItem onClick={() => setFilter("Ongoing")}>Ongoing</MenuItem>
        <MenuItem onClick={() => setFilter("Completed")}>Completed</MenuItem>
        <MenuItem onClick={() => setFilter("Missed")}>Missed</MenuItem>
      </MenuList>
    </Menu>
  );
}
