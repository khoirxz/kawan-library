import {
  Box,
  Text,
  Table,
  Flex,
  Input,
  createListCollection,
  HStack,
  IconButton,
} from "@chakra-ui/react";
import { CiMenuKebab } from "react-icons/ci";

import { Field } from "@/components/ui/field";
import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@/components/ui/select";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "@/components/ui/pagination";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";
import LayoutAdmin from "@/layouts/admin.layout";

const frameworks = createListCollection({
  items: [
    { label: "Admin", value: "admin" },
    { label: "User", value: "user" },
  ],
});

const UserListPage: React.FC = () => {
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
          _light={{
            bgColor: "#ffffff",
          }}
          _dark={{
            bgColor: "#1e1e1e",
          }}>
          <Flex mb={4} gap={2} px="4" pt="4">
            <Field maxW="100px">
              <SelectRoot collection={frameworks}>
                <SelectLabel>Role</SelectLabel>
                <SelectTrigger>
                  <SelectValueText placeholder="Pilih role" />
                </SelectTrigger>
                <SelectContent>
                  {frameworks.items.map((movie) => (
                    <SelectItem item={movie} key={movie.value}>
                      {movie.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </SelectRoot>
            </Field>
            <Field label="Cari">
              <Input placeholder="Cari username" />
            </Field>
          </Flex>

          <Table.ScrollArea maxH="350px">
            <Table.Root>
              <Table.Header>
                <Table.Row
                  _light={{
                    backgroundColor: "#ebebeb",
                  }}
                  _dark={{
                    backgroundColor: "#272727",
                  }}>
                  <Table.ColumnHeader>Username</Table.ColumnHeader>
                  <Table.ColumnHeader>Verified</Table.ColumnHeader>
                  <Table.ColumnHeader>Role</Table.ColumnHeader>
                  <Table.ColumnHeader></Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>Username</Table.Cell>
                  <Table.Cell>Verified</Table.Cell>
                  <Table.Cell>Role</Table.Cell>
                  <Table.Cell>
                    <MenuRoot>
                      <MenuTrigger asChild>
                        <IconButton variant="outline" size="sm">
                          <CiMenuKebab />
                        </IconButton>
                      </MenuTrigger>
                      <MenuContent>
                        <MenuItem value="edit">Edit</MenuItem>
                        <MenuItem
                          value="delete"
                          color="fg.error"
                          _hover={{ bg: "bg.error", color: "fg.error" }}>
                          Hapus
                        </MenuItem>
                      </MenuContent>
                    </MenuRoot>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table.Root>
          </Table.ScrollArea>

          <PaginationRoot
            px="4"
            py="4"
            borderTop={"1px"}
            borderColor="#e5e5e5"
            borderStyle={"solid"}
            count={10}
            pageSize={2}
            defaultPage={1}>
            <HStack>
              <PaginationPrevTrigger />
              <PaginationItems />
              <PaginationNextTrigger />
            </HStack>
          </PaginationRoot>
        </Box>
      </Box>
    </LayoutAdmin>
  );
};

export default UserListPage;
