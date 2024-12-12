import { useState, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import axios, { AxiosError } from "axios";
import { useParams, Link } from "react-router-dom";
import dayjs from "dayjs";

import { Progress } from "@/components/ui/progress";
import { ResponsiveTable, ActionButton } from "@/components/responsive-table";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Dot } from "lucide-react";

import { baseAPI } from "@/api";
import UserSettingLayout from "../..";
import { userJobHistoryProps } from "@/types/user";

const columns: ColumnDef<userJobHistoryProps>[] = [
  {
    accessorKey: "company_name",
    header: "Company Name",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col items-start gap-2">
          <p className="font-semibold text-lg">{row.original.position}</p>
          <div className="flex flex-row gap-3 flex-wrap">
            <p className="text-sm bg-emerald-600/20 text-emerald-700 px-1 rounded-sm flex flex-row flex-wrap items-center">
              <span>{row.original.company_name}</span>
              <Dot />
              <span>{row.original.location}</span>
            </p>
            <p className="text-sm bg-fuchsia-600/20 text-fuchsia-700 px-1 rounded-sm flex flex-row flex-wrap items-center">
              <span>
                {dayjs(row.original.start_date).format("DD MMMM YYYY")}
              </span>
              <Dot />
              <span>{dayjs(row.original.end_date).format("DD MMMM YYYY")}</span>
            </p>
          </div>

          <p className="text-gray-500">{row.original.job_description}</p>
        </div>
      );
    },
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
      <SidebarProvider className="flex flex-col min-h-[400px]">
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
