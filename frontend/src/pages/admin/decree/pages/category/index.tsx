import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ResponsiveTable, ActionButton } from "@/components/responsive-table";

import { baseAPI } from "@/api";
import { AdminLayout } from "@/layouts/admin";
import { decreeCategoryListProps } from "@/types/decree";

const columns: ColumnDef<decreeCategoryListProps>[] = [
  {
    accessorKey: "id",
    header: () => <p className="text-center">ID</p>,
    cell: ({ row }) => (
      <div className="text-center">
        <p className="font-mono">{row.original.id}</p>
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: "Nama",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <span className="font-semibold">{row.original.title}</span>
        <span className="text-sm text-gray-500">
          {row.original.description}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Dibuat/Diperbarui",
    cell: ({ row }) => (
      <>{dayjs(row.original.createdAt).format("DD/MMMM/YYYY")}</>
    ),
  },
];

const DecreeCategoryListPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [listUser, setListUser] = useState<decreeCategoryListProps[]>([]);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await axios.get<{
          code: number | null;
          status: string | null;
          message: string | null;
          data: decreeCategoryListProps[];
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
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full align-middle w-[200px]">
                <ResponsiveTable
                  columns={[
                    ...columns,
                    {
                      id: "action",
                      header: () => <p className="text-right">Aksi</p>,
                      cell: ({ row }) => (
                        <ActionButton
                          id={row.original.id}
                          setIsLoading={setIsLoading}
                          linkAction="/admin/decree/category/form"
                          linkDelete="decree/category"
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

export default DecreeCategoryListPage;
