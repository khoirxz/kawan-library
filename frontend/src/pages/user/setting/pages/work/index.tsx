import { useState, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import axios, { AxiosError } from "axios";
import { useParams, Link } from "react-router-dom";

import { Progress } from "@/components/ui/progress";
import { ResponsiveTable, ActionButton } from "@/components/responsive-table";

import { baseAPI } from "@/api";
import UserSettingLayout from "../..";
import { userJobHistoryProps } from "@/types/user";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const columns: ColumnDef<userJobHistoryProps>[] = [
  {
    accessorKey: "company_name",
    header: "Company Name",
  },
  {
    accessorKey: "start_date",
    header: "Awal Kerja",
  },
];

const UserSettingWorkListPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [jobList, setJobList] = useState<userJobHistoryProps[] | null>(null);
  const { id } = useParams<string>();

  useEffect(() => {
    const getJobList = async () => {
      try {
        const response = await axios.get<{
          code: number;
          status: string;
          message: string;
          data: userJobHistoryProps[] | null;
        }>(`${baseAPI.dev}/user/job/history/${id}`);

        setJobList(response.data.data);
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error(axiosError.response?.data || axiosError.message);
      } finally {
        setIsLoading(false);
      }
    };

    getJobList();

    return () => {
      setJobList([]);
    };
  }, [isLoading]);

  return (
    <UserSettingLayout>
      <SidebarProvider className="flex flex-col">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h1 className="text-lg">Daftar Riwayat kerja</h1>
            <p className="text-sm text-gray-500">
              Tambah, ubah, dan hapus riwayat kerja.
            </p>
          </div>
          <div>
            <Button asChild>
              <Link to={`/user/setting/work/form/${id}`}>Tambah</Link>
            </Button>
          </div>
        </div>
        {isLoading ? (
          <Progress />
        ) : (
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
                    linkAction={`/user/setting/work/form/${id}`}
                    linkDelete="user/job/history"
                  />
                ),
              },
            ]}
            data={jobList || []}
          />
        )}
      </SidebarProvider>
    </UserSettingLayout>
  );
};

export default UserSettingWorkListPage;
