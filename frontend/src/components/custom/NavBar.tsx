import { Flex, Box, IconButton } from "@chakra-ui/react";
import { Avatar } from "@/components/ui/avatar";
import { ColorModeButton } from "@/components/ui/color-mode";
import { DrawerTrigger } from "@/components/ui/drawer";
import { MdOutlineMenu } from "react-icons/md";

const NavBar: React.FC<{ height: number; navWidth: number }> = ({
  height,
  navWidth,
}) => {
  return (
    <Box
      as="nav"
      zIndex={10}
      position={"fixed"}
      w={`${navWidth}px`}
      height={`${height}px`}>
      <Flex
        alignItems="center"
        justifyContent={{ base: "space-between", lg: "flex-end" }}
        padding={4}
        h="full">
        <DrawerTrigger asChild>
          <IconButton
            aria-label="menu"
            size="sm"
            display={{ base: "flex", lg: "none" }}>
            <MdOutlineMenu />
          </IconButton>
        </DrawerTrigger>

        <Box display={"flex"} gap={4}>
          <Avatar size="md" name="Sage Adesaya" />
          <ColorModeButton />
        </Box>
      </Flex>
    </Box>
  );
};

export default NavBar;
