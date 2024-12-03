import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { ColumnDef } from "@tanstack/react-table";
import { Progress } from "@/components/ui/progress";
import { Link, useParams } from "react-router-dom";
import dayjs from "dayjs";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResponsiveTable } from "@/components/responsive-table";

import { baseAPI } from "@/api";
import UserLayout from "@/layouts/user";
import { decreeListProps } from "@/types/decree";
import { AppHeader } from "@/components/app-header";

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
    accessorKey: "createdAt",
    header: "Dibuat pada",
  },
  {
    id: "action",
    header: "Action",
    cell: ({ row }) => {
      const decree = row.original;
      return (
        <Button size="sm" asChild>
          <Link
            target="_blank"
            to={`${baseAPI.dev}/uploads/decrees/${decree.file_path}`}>
            Lihat Dokumen
          </Link>
        </Button>
      );
    },
  },
];

const UserDecreeListPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [listDecree, setListDecree] = useState<decreeListProps[]>([]);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const getDecree = async () => {
      try {
        const response = await axios.get<{
          code: number | null;
          status: string | null;
          message: string | null;
          data: decreeListProps[];
        }>(`${baseAPI.dev}/decrees`);

        setListDecree(response.data.data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        const axiosError = error as AxiosError;
        console.error(axiosError.response?.data || axiosError.message);
      }
    };
    getDecree();

    return () => {
      setListDecree([]);
    };
  }, []);

  return (
    <UserLayout>
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <AppHeader
          title="Daftar Dokumen Surat Keputusan"
          actionBtn={
            <Button variant="ghost" size="icon" asChild>
              <Link to={`/user/profile/${id}`}>
                <ArrowLeft />
              </Link>
            </Button>
          }
        />

        {isLoading ? (
          <Progress value={100} />
        ) : (
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <ResponsiveTable columns={columns} data={listDecree} />
            </div>
          </div>
        )}
      </div>
    </UserLayout>
  );
};

export default UserDecreeListPage;
