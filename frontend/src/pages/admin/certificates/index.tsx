import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { Link } from "react-router-dom";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ResponsiveTable, ActionButton } from "@/components/responsive-table";

import { baseAPI } from "@/api";
import { AdminLayout } from "@/layouts/admin";
import { certificationListProps } from "@/types/certificate";

const columns: ColumnDef<certificationListProps>[] = [
  {
    accessorKey: "title",
    header: "Nama Sertifikat",
    cell: ({ row }) => (
      <div className="flex flex-col justify-start items-start gap-1">
        <p className="font-semibold">{row.original.user?.username}</p>
        <Link to={`/profile/${row.original.id}`}>
          <span className="font-semibold text-md">{row.original.title}</span>
        </Link>
        <span className="text-gray-500">{row.original.description}</span>
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Dibuat pada",
    cell: ({ row }) => (
      <div className="flex flex-col justify-start items-start gap-1">
        <p className="font-semibold">{row.original.user?.username}</p>
        <span className="text-gray-500">
          {dayjs(row.original.createdAt).format("DD-MMM-YYYY")}
        </span>
      </div>
    ),
  },
];

const CertificateListPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [listUser, setListUser] = useState<certificationListProps[]>([]);

  useEffect(() => {
    const getCertificates = async () => {
      try {
        const response = await axios.get<{
          code: number | null;
          status: string | null;
          message: string | null;
          data: certificationListProps[];
        }>(`${baseAPI.dev}/certifications`);

        setIsLoading(false);
        setListUser(response.data.data);
      } catch (error) {
        setIsLoading(false);
        const axiosError = error as AxiosError;
        console.error(axiosError.response?.data || axiosError.message);
      }
    };

    getCertificates();

    return () => {
      setListUser([]);
    };
  }, [isLoading]);

  return (
    <AdminLayout>
      <div className="p-4 lg:p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Daftar Sertifikat</h1>
          <Button asChild>
            <Link to="/admin/certificate/form">Tambah</Link>
          </Button>
        </div>

        <div className="flex mt-10 gap-2 mb-3">
          <Input placeholder="Cari User" />
        </div>

        <div className="rounded-md border">
          {isLoading ? (
            <Progress value={100} />
          ) : (
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full align-middle">
                <ResponsiveTable
                  columns={[
                    ...columns,
                    {
                      id: "actions",
                      header: "Action",
                      cell: ({ row }) => (
                        <ActionButton
                          id={row.original.id}
                          setIsLoading={setIsLoading}
                          file_path={row.original.file_path}
                          linkAction="/admin/certificate/form"
                          linkDelete="certifications"
                          linkView="certificates"
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

export default CertificateListPage;
