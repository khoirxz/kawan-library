import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { Link } from "react-router-dom";
import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ResponsiveTable, ActionButton } from "@/components/responsive-table";
import { BadgeCheck } from "lucide-react";

import { useAppSelector } from "@/app/store";
import { baseAPI } from "@/api";
import { AdminLayout } from "@/layouts/admin";
import { userProp } from "@/types/user";
import { cn } from "@/lib/utils";

const columns: ColumnDef<userProp>[] = [
  {
    accessorKey: "username",
    header: "Username",
    cell: ({ row }) => (
      <Link to={`/user/profile/${row.original.id}`}>
        <div className="p-2">
          <p className="font-semibold hover:underline">
            {row.original.username}
          </p>
          <p className="text-gray-500">
            {row.original.user_data ? (
              `${row.original.user_data.firstName || ""} ${
                row.original.user_data.lastName || ""
              }`
            ) : (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild className="inline">
                    <p>No Data</p>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>User belum melengkapi data</p>
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
  const {
    main: {
      verify: {
        data: { userId },
      },
    },
  } = useAppSelector((state) => state.authState);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await axios.get<{
          code: number | null;
          status: string | null;
          message: string | null;
          data: userProp[];
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
                          id={row.original.id}
                          setIsLoading={setIsLoading}
                          linkAction={`/admin/user/form`}
                          linkDelete={`users`}
                          isDelete={userId === row.original.id ? false : true}
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

export default UserListPage;
