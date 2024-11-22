import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { Link, useNavigate } from "react-router-dom";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenuButton,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { BadgeCheck, Shield, EllipsisVertical, User } from "lucide-react";

import { baseAPI } from "@/api";
import { AdminLayout } from "@/layouts/admin";
import { useAppSelector } from "@/app/store";

type userListProps = {
  id: string;
  role: string;
  username: string;
  avatarImg: string | null;
  verified: boolean;
};

const UserListPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [listUser, setListUser] = useState<userListProps[]>([]);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await axios.get<{
          code: number | null;
          status: string | null;
          message: string | null;
          data: userListProps[];
        }>(`${baseAPI.dev}/users`);

        setIsLoading(false);
        setListUser(response.data.data);
      } catch (error) {
        setIsLoading(false);
        const axiosError = error as AxiosError;
        console.error(axiosError.response?.data || axiosError.message);
      }
    };

    getUsers();

    return () => {
      setListUser([]);
    };
  }, [isLoading]);

  return (
    <AdminLayout>
      <div className="p-4 lg:p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Daftar User</h1>
          <Button asChild>
            <Link to="/admin/user/form">Tambah</Link>
          </Button>
        </div>

        <div className="flex mt-10 gap-2 mb-3">
          <Input placeholder="Cari User" />
        </div>

        <div className="max-h-[400px] overflow-y-auto overflow-x-auto rounded-md border">
          {isLoading ? (
            <Progress value={100} />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Nama</TableHead>
                  <TableHead>Verified</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {listUser.map((user) => (
                  <TableItem
                    key={user.id}
                    {...user}
                    setIsLoading={setIsLoading}
                  />
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

const TableItem: React.FC<{
  username: string;
  verified: boolean;
  role: string;
  id: string;
  setIsLoading: (value: boolean) => void;
}> = ({ username, verified, role, id, setIsLoading }) => {
  const navigate = useNavigate();
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const {
    main: {
      verify: {
        data: { userId },
      },
    },
  } = useAppSelector((state) => state.authState);

  const handleDelete = async (id: string) => {
    try {
      await axios.delete<{
        code: number;
        status: string;
        message: string;
        data: number;
      }>(`${baseAPI.dev}/users/${id}`);

      setOpenAlert(false);
      setIsLoading(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <TableRow>
      <TableCell className="font-medium hover:underline">
        <Link to={`/profile/${id}`}>{username}</Link>
      </TableCell>
      <TableCell>
        {verified ? (
          <Badge
            className="py-1 border-blue-500 text-blue-500"
            variant="outline">
            <BadgeCheck className="mr-2 w-4 h-4 text-blue-500" />
            <span>Aktif</span>
          </Badge>
        ) : (
          <Badge
            className="py-1 border-gray-500 text-gray-500"
            variant="outline">
            <span>Nonaktif</span>
          </Badge>
        )}
      </TableCell>
      <TableCell>
        {role === "admin" ? (
          <Badge
            className="py-1 border-purple-500 text-purple-500"
            variant="outline">
            <Shield className="mr-2 w-4 h-4 text-purple-500" />
            {role}
          </Badge>
        ) : (
          <Badge
            className="py-1 border-blue-500 text-blue-500"
            variant="outline">
            <User className="mr-2 w-4 h-4 text-blue-500" />
            {role}
          </Badge>
        )}
      </TableCell>
      <TableCell className="flex justify-end">
        <Popover>
          <PopoverTrigger className="p-2 flex items-center rounded-sm border">
            <span>
              <EllipsisVertical className="w-4 h-4" />
            </span>
          </PopoverTrigger>
          <PopoverContent
            className="w-40 overflow-hidden rounded-lg p-0"
            align="end">
            <Sidebar collapsible="none" className="bg-transparent">
              <SidebarContent>
                <SidebarGroup className="border-b last:border-none">
                  <SidebarGroupContent className="gap-0">
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          onClick={() => navigate(`/admin/user/form/${id}`)}>
                          <span>Edit</span>
                        </SidebarMenuButton>

                        {id !== userId ? (
                          <SidebarMenuButton
                            onClick={() => setOpenAlert((prev) => !prev)}>
                            <span className="text-red-500">Hapus</span>
                          </SidebarMenuButton>
                        ) : null}
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
            </Sidebar>
          </PopoverContent>
        </Popover>

        <Dialog open={openAlert} onOpenChange={setOpenAlert}>
          <DialogContent className="rounded-md">
            <DialogHeader>
              <DialogTitle className="text-left">Peringatan</DialogTitle>
              <DialogDescription className="text-left">
                Apakah anda yakin ingin menghapus.?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex justify-end gap-2 flex-row">
              <Button variant="destructive" onClick={() => handleDelete(id)}>
                Hapus
              </Button>
              <Button
                onClick={() => setOpenAlert((prev) => !prev)}
                variant="outline">
                Kembali
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </TableCell>
    </TableRow>
  );
};

export default UserListPage;
