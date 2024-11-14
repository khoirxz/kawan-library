import { useRef, useEffect } from "react";
import { Box, Flex } from "@chakra-ui/react";

import { NavLink, NavAccordion } from "@/components/custom/NavLink";
import {
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerBody,
  DrawerCloseTrigger,
} from "@/components/ui/drawer";

const SideBar: React.FC<{
  setNavWidth: React.Dispatch<React.SetStateAction<number>>;
}> = ({ setNavWidth }) => {
  const item = (
    <>
      <NavLink title="Dashboard" link="/admin/dashboard" />
      <NavAccordion title="Users">
        <NavLink title="List" link="/admin/list" />
        <NavLink title="Form" link="/admin/form" />
      </NavAccordion>
    </>
  );

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        setNavWidth(entries[0].contentRect.width);
      }
    });
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      if (ref.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(ref.current);
      }
    };
  }, [setNavWidth]);

  return (
    <>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Drawer Title</DrawerTitle>
        </DrawerHeader>
        <DrawerBody>{item}</DrawerBody>
        <DrawerCloseTrigger />
      </DrawerContent>
      <Box
        ref={ref}
        as="aside"
        height="100vh"
        overflow={"auto"}
        minW={"240px"}
        display={{ base: "none", lg: "block" }}
        position={"fixed"}
        gap={1}
        _dark={{
          bgColor: "#1C252E",
        }}
        _light={{
          bgColor: "#141A21",
        }}>
        <Flex flexDirection="column" padding={2} gap={1}>
          {item}
        </Flex>
      </Box>
    </>
  );
};

export default SideBar;
