import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ResponsiveTable } from "@/components/responsive-table";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BadgeCheck, EllipsisVertical, Eye } from "lucide-react";

import { useAppSelector } from "@/app/store";
import { baseAPI } from "@/api";
import { AdminLayout } from "@/layouts/admin";
import { userProp } from "@/types/user";
import { cn } from "@/lib/utils";

const columns: ColumnDef<userProp>[] = [
  {
    accessorKey: "username",
    header: () => <p className="px-4">Username</p>,
    cell: ({ row }) => (
      <Link
        to={`/user/profile/${row.original.id}`}
        className="flex items-center gap-2">
        <div>
          <Avatar className="w-14 h-14">
            {row.original.avatarImg ? (
              <AvatarImage
                src={`${baseAPI.dev}/uploads/avatars/${row.original.avatarImg}`}
                className="object-cover"
              />
            ) : (
              <AvatarFallback>
                <span className="sr-only">{row.original.username}</span>
              </AvatarFallback>
            )}
          </Avatar>
        </div>
        <div className="p-2 space-y-1">
          <p className="font-semibold hover:underline">
            @{row.original.username}
          </p>
          <p className="text-gray-500 font-semibold">
            {row.original.user_data ? (
              `${row.original.user_data.firstName || ""} ${
                row.original.user_data.lastName || ""
              }`
            ) : (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild className="inline">
                    <span>No Data</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <span>User belum melengkapi data</span>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </p>
          <p className="text-gray-500">
            {row.original.user_data_employe ? (
              `${row.original.user_data_employe.position || ""}`
            ) : (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild className="inline">
                    <span>No Data Employee</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <span>Lengkapi data karyawan</span>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </p>
        </div>
      </Link>
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={
          row.original.role === "admin"
            ? cn("text-indigo-700 border-indigo-500")
            : cn("text-cyan-700 border-cyan-500")
        }>
        {row.original.role}
      </Badge>
    ),
  },
  {
    accessorKey: "verified",
    header: "Verified",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={row.original.verified ? "text-blue-700" : "text-red-700"}>
        {row.original.verified ? (
          <BadgeCheck width={15} className="mr-2" />
        ) : null}
        {row.original.verified ? "Ya" : "Tidak"}
      </Badge>
    ),
  },
];

const UserListPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [listUser, setListUser] = useState<userProp[]>([]);
  const [search, setSearch] = useState<string>("");
  const {
    main: {
      verify: { data },
    },
  } = useAppSelector((state) => state.authState);

  useEffect(() => {
    const source = axios.CancelToken.source();

    const delayDebounceFn = setTimeout(
      () => {
        const getUsers = async () => {
          const urlParam = search ? `?search=${search}` : "";

          try {
            const response = await axios.get<{
              code: number | null;
              status: string | null;
              message: string | null;
              data: userProp[];
            }>(`${baseAPI.dev}/users${urlParam}`, {
              cancelToken: source.token,
            });

            setIsLoading(false);
            setListUser(response.data.data);
          } catch (error) {
            if (axios.isCancel(error)) {
              console.log("Request canceled", error.message);
            } else {
              setIsLoading(false);
              const axiosError = error as AxiosError;
              console.error(axiosError.response?.data || axiosError.message);
            }
          }
        };

        getUsers();
      },
      search ? 1000 : 0
    );

    return () => {
      clearTimeout(delayDebounceFn);
      source.cancel("Operation canceled by the user.");
      setListUser([]);
    };
  }, [isLoading, search]);

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
          <Input
            placeholder="Cari User"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="max-h-[400px] overflow-y-auto overflow-x-auto rounded-md border">
          {isLoading ? (
            <Progress value={100} />
          ) : (
            <ResponsiveTable
              columns={[
                ...columns,
                {
                  id: "action",
                  header: () => <p className="text-right px-4">Action</p>,
                  cell: ({ row }) => (
                    <ActionButton
                      id={row.original.id}
                      setIsLoading={setIsLoading}
                      linkAction={`/admin/user/form`}
                      linkDelete={`users`}
                      isDelete={data?.userId !== row.original.id}
                    />
                  ),
                },
              ]}
              data={listUser}
            />
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export function ActionButton({
  id,
  setIsLoading,
  linkAction,
  linkDelete,
  isDelete = true,
}: Readonly<{
  id: string | number;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  linkAction: string;
  linkDelete: string;
  isDelete?: boolean;
}>) {
  const navigate = useNavigate();
  const [openAlert, setOpenAlert] = useState<boolean>(false);

  const handleDelete = async (id: string | number) => {
    try {
      await axios.delete<{
        code: number;
        status: string;
        message: string;
        data: number;
      }>(`${baseAPI.dev}/${linkDelete}/${id}`);

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
          <a href={`/user/profile/${id}`} target="_blank">
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
                          onClick={() => navigate(`${linkAction}/${id}`)}>
                          <span>Edit user</span>
                        </SidebarMenuButton>
                        <SidebarMenuButton
                          onClick={() =>
                            navigate(`/admin/employee/form/${id}`)
                          }>
                          <span>Edit pegawai</span>
                        </SidebarMenuButton>
                        <SidebarMenuButton
                          onClick={() =>
                            navigate(`/user/setting/personal/${id}`)
                          }>
                          <span>Edit personal</span>
                        </SidebarMenuButton>
                        {isDelete && (
                          <SidebarMenuButton
                            onClick={() => setOpenAlert((prev) => !prev)}>
                            <span className="text-red-500">Hapus</span>
                          </SidebarMenuButton>
                        )}
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
}

export default UserListPage;
