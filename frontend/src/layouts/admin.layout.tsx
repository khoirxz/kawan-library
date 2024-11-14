import { useState, useRef, useEffect } from "react";
import { Box } from "@chakra-ui/react";

import NavBar from "@/components/custom/NavBar";
import { DrawerBackdrop, DrawerRoot } from "@/components/ui/drawer";
import SideBar from "@/components/custom/SideBar";

const height = 90;

const LayoutAdmin: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [navWidth, setNavWidth] = useState<number>(0);
  const [contentWidth, setContentWidth] = useState<number>(0);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        setContentWidth(entries[0].contentRect.width);
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
  }, []);

  console.log(ref.current?.offsetWidth);
  return (
    <Box fontFamily="Outfit" _light={{ bg: "#fcfcfc" }}>
      <DrawerRoot placement="start">
        <DrawerBackdrop />

        <Box w="full" position={"relative"}>
          <SideBar setNavWidth={setNavWidth} />
          <Box ml={navWidth} flex={1} position={"relative"}>
            {ref.current?.offsetWidth !== undefined ? (
              <NavBar height={height} navWidth={contentWidth} />
            ) : null}
            <Box ref={ref}>{children}</Box>
          </Box>
        </Box>
      </DrawerRoot>
    </Box>
  );
};

export default LayoutAdmin;
