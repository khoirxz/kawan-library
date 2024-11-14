import { Button, Collapsible, Box } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export const NavLink: React.FC<{
  title: string;
  link: string;
  dir?: string;
  size?: string;
  width?: string;
}> = ({ title, link, dir, size, width }) => {
  return (
    <Link to={link}>
      <Button
        colorScheme={"light"}
        variant={"ghost"}
        w={width ? width : "full"}
        justifyContent={dir ? dir : "flex-start"}
        fontSize={size ? size : "md"}
        _light={{ color: "#eff6ff" }}
        _hover={{ bg: "#3737374a" }}>
        {title}
      </Button>
    </Link>
  );
};

export const NavAccordion: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => {
  return (
    <Collapsible.Root>
      <Collapsible.Trigger paddingY="3" w={"full"} p="0px">
        <Button
          as="a"
          variant={"ghost"}
          w={"full"}
          justifyContent={"flex-start"}
          fontSize={"md"}
          _light={{ color: "#eff6ff" }}
          _hover={{ bg: "#3737374a" }}>
          {title}
        </Button>
      </Collapsible.Trigger>
      <Collapsible.Content paddingLeft={"4"} w={"full"}>
        <Box
          borderLeft={"2px"}
          borderColor={"gray.200"}
          borderStyle={"solid"}
          mt={"2"}
          pl="1">
          {children}
        </Box>
      </Collapsible.Content>
    </Collapsible.Root>
  );
};
