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
import { EllipsisVertical } from "lucide-react";

import { baseAPI } from "@/api";
import { AdminLayout } from "@/layouts/admin";

type categoryListProps = {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

const DecreeCategoryListPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [listUser, setListUser] = useState<categoryListProps[]>([]);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await axios.get<{
          code: number | null;
          status: string | null;
          message: string | null;
          data: categoryListProps[];
        }>(`${baseAPI.dev}/decree/category/`);

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
          <h1 className="text-2xl font-semibold">Daftar Kategori SK</h1>
          <Button asChild>
            <Link to="/admin/decree/category/form">Tambah</Link>
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
                  <TableHead className="text-center">Kode</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Dibuat/Diperbarui</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {listUser.map((category) => (
                  <TableItem
                    key={category.id}
                    {...category}
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

const TableItem: React.FC<
  categoryListProps & { setIsLoading: (value: boolean) => void }
> = ({ id, name, description, createdAt, updatedAt, setIsLoading }) => {
  const navigate = useNavigate();
  const [openAlert, setOpenAlert] = useState<boolean>(false);

  const handleDelete = async (id: number) => {
    try {
      await axios.delete<{
        code: number;
        status: string;
        message: string;
        data: number;
      }>(`${baseAPI.dev}/decree/category/${id}`);

      setOpenAlert(false);
      setIsLoading(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <TableRow>
      <TableCell className="font-medium hover:underline">
        <div className="flex flex-col items-center">
          <p className="capitalize font-mono">{id}</p>
        </div>
      </TableCell>
      <TableCell>
        <span>{name}</span>
      </TableCell>
      <TableCell>{description}</TableCell>
      <TableCell>
        {updatedAt
          ? dayjs(updatedAt).format("DD-MMMM-YYYY")
          : dayjs(createdAt).format("DD-MMMM-YYYY")}
      </TableCell>
      <TableCell>
        <div className="flex justify-end items-center gap-3">
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
                              navigate(`/admin/decree/category/form/${id}`)
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

export default DecreeCategoryListPage;
