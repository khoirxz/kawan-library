import { Box, Text } from "@chakra-ui/react";
import LayoutAdmin from "@/layouts/admin.layout";

const DashboardPage: React.FC = () => {
  return (
    <LayoutAdmin>
      <Box px={5} pt={"28"}>
        <Text textStyle="3xl">Dashboard</Text>
      </Box>
    </LayoutAdmin>
  );
};

export default DashboardPage;
