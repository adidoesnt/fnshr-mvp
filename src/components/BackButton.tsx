import { ChevronLeftIcon } from "@chakra-ui/icons";
import { Flex, IconButton } from "@chakra-ui/react";
import { useRouter } from "next/router";

export type BackButtonProps = {
  w: number | string;
  mt: number | string;
};

export default function BackButton({ w, mt }: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    router.back();
  };

  return (
    <Flex w={w} justifyContent={"flex-start"} mt={mt}>
      <IconButton
        aria-label="back"
        icon={<ChevronLeftIcon />}
        onClick={handleClick}
      />
    </Flex>
  );
}
