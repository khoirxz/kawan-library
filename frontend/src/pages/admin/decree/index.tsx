import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";

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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Eye, EllipsisVertical } from "lucide-react";

import { baseAPI } from "@/api";
import { AdminLayout } from "@/layouts/admin";

type decreeListProps = {
  id: string;
  user: {
    id: string;
    role: string;
    username: string;
    avatarImg: string | null;
    verified: boolean;
  } | null;
  category: {
    name: string;
    id: number;
  };
  title: string;
  description: string;
  status: "approved" | "rejected" | "draft";
  effective_date: string;
  expired_date: string;
  file_path: string;
  createdAt: string;
  updatedAt: string;
};

const DecreeListPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [listUser, setListUser] = useState<decreeListProps[]>([]);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await axios.get<{
          code: number | null;
          status: string | null;
          message: string | null;
          data: decreeListProps[];
        }>(`${baseAPI.dev}/decrees`);

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
            <Link to="/admin/decree/form">Tambah</Link>
          </Button>
        </div>

        <div className="flex mt-10 gap-2 mb-3">
          <Input placeholder="Cari User" />
        </div>

        <div className="rounded-md border">
          {isLoading ? (
            <Progress value={100} />
          ) : (
            <ScrollArea className="max-h-[400px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama SK</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Dibuat/Diperbarui</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {listUser.map((decree) => (
                    <TableItem
                      key={decree.id}
                      {...decree}
                      setIsLoading={setIsLoading}
                    />
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

const TableItem: React.FC<
  decreeListProps & { setIsLoading: (value: boolean) => void }
> = ({
  id,
  user,
  category,
  title,
  description,
  status,
  effective_date,
  expired_date,
  file_path,
  createdAt,
  updatedAt,
  setIsLoading,
}) => {
  const navigate = useNavigate();
  const [openAlert, setOpenAlert] = useState<boolean>(false);

  const handleDelete = async (id: string) => {
    try {
      await axios.delete<{
        code: number;
        status: string;
        message: string;
        data: number;
      }>(`${baseAPI.dev}/decrees/${id}`);

      setOpenAlert(false);
      setIsLoading(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <TableRow>
      <TableCell className="font-medium hover:underline min-w-[200px]">
        <div className="flex flex-col justify-start items-start gap-1">
          <Badge>{category.name}</Badge>
          <p className="font-semibold">{user?.username}</p>
          <Link to={`/profile/${id}`}>
            <span className="font-semibold text-md">{title}</span>
          </Link>
          <span className="text-gray-500">{description}</span>
        </div>
      </TableCell>
      <TableCell>
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            status === "approved"
              ? "bg-green-100 text-green-800"
              : status === "draft"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}>
          {status}
        </span>
      </TableCell>
      <TableCell>
        <div className="flex flex-col flex-wrap gap-2">
          {effective_date === expired_date ? (
            <span>{dayjs(effective_date).format("DD-MMMM-YYYY")}</span>
          ) : (
            <>
              <span>{dayjs(effective_date).format("DD-MMMM-YYYY")}</span>
              <span>{dayjs(expired_date).format("DD-MMMM-YYYY")}</span>
            </>
          )}
        </div>
      </TableCell>
      <TableCell>
        {updatedAt
          ? dayjs(updatedAt).format("DD-MMMM-YYYY")
          : dayjs(createdAt).format("DD-MMMM-YYYY")}
      </TableCell>
      <TableCell>
        <div className="flex justify-end items-center gap-3">
          <Button variant="outline" size="icon" asChild>
            <a
              href={`${baseAPI.dev}/uploads/decrees/${file_path}`}
              target="_blank">
              <Eye className="w-4 h-4" />
            </a>
          </Button>

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
                            onClick={() =>
                              navigate(`/admin/decree/form/${id}`)
                            }>
                            <span>Edit</span>
                          </SidebarMenuButton>

                          <SidebarMenuButton
                            onClick={() => setOpenAlert((prev) => !prev)}>
                            <span className="text-red-500">Hapus</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </SidebarGroup>
                </SidebarContent>
              </Sidebar>
            </PopoverContent>
          </Popover>
        </div>

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

export default DecreeListPage;
