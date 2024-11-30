import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { ColumnDef } from "@tanstack/react-table";

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
import { Eye, EllipsisVertical } from "lucide-react";
import { ResponsiveTable } from "@/components/responsive-table";

import { baseAPI } from "@/api";
import { AdminLayout } from "@/layouts/admin";
import { decreeListProps } from "@/types/decree";

const columns: ColumnDef<decreeListProps>[] = [
  {
    accessorKey: "title",
    header: "Judul",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    id: "effective_date",
    header: "Tanggal",
    cell: ({ row }) => (
      <div className="flex flex-col flex-wrap gap-2">
        {row.original.effective_date === row.original.expired_date ? (
          <span>
            {dayjs(row.original.effective_date).format("DD-MMMM-YYYY")}
          </span>
        ) : (
          <>
            <span>
              {dayjs(row.original.effective_date).format("DD-MMMM-YYYY")}
            </span>
            <span>
              {dayjs(row.original.expired_date).format("DD-MMMM-YYYY")}
            </span>
          </>
        )}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Dibuat pada",
  },
];

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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Daftar Surat Keputusan</h1>
          <Button asChild>
            <Link to="/admin/decree/form">Tambah</Link>
          </Button>
        </div>

        <div className="flex mb-4">
          <Input placeholder="Cari User" className="max-w-sm" />
        </div>

        <div className="border rounded-lg">
          {isLoading ? (
            <Progress value={100} />
          ) : (
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full align-middle w-[200px]">
                <ResponsiveTable
                  columns={[
                    ...columns,
                    {
                      id: "action",
                      header: "Action",

                      cell: ({ row }) => (
                        <ActionButton
                          file_path={row.original.file_path}
                          id={row.original.id}
                          setIsLoading={setIsLoading}
                        />
                      ),
                    },
                  ]}
                  data={listUser}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

const ActionButton: React.FC<{
  file_path: string;
  id: string;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ file_path, id, setIsLoading }) => {
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
    <>
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
                          onClick={() => navigate(`/admin/decree/form/${id}`)}>
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
    </>
  );
};

export default DecreeListPage;
