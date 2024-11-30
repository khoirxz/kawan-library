import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ResponsiveTable, ActionButton } from "@/components/responsive-table";

import { baseAPI } from "@/api";
import { AdminLayout } from "@/layouts/admin";
import { decreeListProps } from "@/types/decree";

const columns: ColumnDef<decreeListProps>[] = [
  {
    accessorKey: "title",
    header: "Judul",
    cell: ({ row }) => (
      <div>
        <p>{row.original.category.name}</p>
        {row.original.user ? (
          <p>{row.original.user?.user_data?.firstName}</p>
        ) : null}
        <p>{row.original.title}</p>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        className={
          row.original.status === "draft"
            ? "bg-yellow-500 hover:bg-yellow-600"
            : row.original.status === "approved"
            ? "bg-green-500 hover:bg-green-600"
            : "bg-red-500 hover:bg-red-600"
        }>
        {row.original.status}
      </Badge>
    ),
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
    cell: ({ row }) => (
      <div>{dayjs(row.original.createdAt).format("DD-MMMM-YYYY")}</div>
    ),
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
                          linkAction="/admin/decree/form"
                          linkDelete="decrees"
                          linkView="decrees"
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

export default DecreeListPage;
