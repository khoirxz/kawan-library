import { Box, Text, Input, Flex, Stack } from "@chakra-ui/react";

import { Field } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import {
  FileUploadList,
  FileUploadRoot,
  FileUploadTrigger,
} from "@/components/ui/file-button";
import { GoUpload } from "react-icons/go";
import LayoutAdmin from "@/layouts/admin.layout";

const UserFormPage: React.FC = () => {
  return (
    <LayoutAdmin>
      <Box px={5} pt={"28"}>
        <Flex>
          <Text textStyle="3xl" mb={6}>
            List
          </Text>
        </Flex>

        <Box
          rounded="md"
          shadow="sm"
          p="4"
          _light={{
            bgColor: "#ffffff",
          }}
          _dark={{
            bgColor: "#1e1e1e",
          }}>
          <Stack gap={4}>
            <Field label="Username">
              <FileUploadRoot>
                <FileUploadTrigger>
                  <Button as="a">
                    <GoUpload /> Upload file
                  </Button>
                </FileUploadTrigger>
                <FileUploadList />
              </FileUploadRoot>
            </Field>
            <Field label="Username">
              <Input placeholder="Username" />
            </Field>

            <Box>
              <Button>Simpan</Button>
            </Box>
          </Stack>
        </Box>
      </Box>
    </LayoutAdmin>
  );
};

export default UserFormPage;
