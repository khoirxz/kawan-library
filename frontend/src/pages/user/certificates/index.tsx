import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { ColumnDef } from "@tanstack/react-table";
import { Progress } from "@/components/ui/progress";
import { Link, useParams } from "react-router-dom";
import dayjs from "dayjs";

import { Button } from "@/components/ui/button";
import { ResponsiveTable } from "@/components/responsive-table";
import { ArrowLeft } from "lucide-react";

import { baseAPI } from "@/api";
import UserLayout from "@/layouts/user";
import { certificationListProps } from "@/types/certificate";
import { userPortfolioProps } from "@/types/user";
import { AppHeader } from "@/components/app-header";

const columns: ColumnDef<certificationListProps>[] = [
  {
    accessorKey: "name",
    header: "Nama Sertifikat",
    cell: ({ row }) => (
      <div className="space-y-2">
        <p className="font-semibold text-lg">{row.original.title}</p>
        <p className="text-sm bg-gray-300 rounded-md py-1 px-2 inline-block text-gray-500">
          {dayjs(row.original.date).format("DD/MMMM/YYYY")}
        </p>
        <p className="text-gray-500">{row.original.description}</p>
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Dibuat pada",
    cell: ({ row }) => {
      return <p>{dayjs(row.original.createdAt).format("DD/MM/YYYY")}</p>;
    },
  },
];

const UserCertificateListPage: React.FC = () => {
  const [btnAvaiable, setBtnAvaiable] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [listCerts, setListCerts] = useState<certificationListProps[]>([]);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const getCertificates = async () => {
      try {
        const response = await axios.get<{
          code: number | null;
          status: string | null;
          message: string | null;
          data: certificationListProps[];
        }>(`${baseAPI.dev}/certifications/search/${id}`);

        setIsLoading(false);
        setListCerts(response.data.data);
      } catch (error) {
        setIsLoading(false);
        const axiosError = error as AxiosError;
        console.error(axiosError.response?.data || axiosError.message);
      }
    };

    const getPortfolio = async () => {
      try {
        const response = await axios.get<{
          code: number;
          status: string;
          message: string;
          data: userPortfolioProps;
        }>(`${baseAPI.dev}/user/portfolio/${id}`);

        const dataPortfolio = response.data.data;

        if (
          dataPortfolio.user_data !== null &&
          dataPortfolio.user_contact !== null &&
          dataPortfolio.user_geography !== null &&
          dataPortfolio.user_info !== null
        ) {
          setBtnAvaiable(true);
        }
      } catch (error) {
        console.error(error);
      }
    };

    getPortfolio();
    getCertificates();

    return () => {
      setListCerts([]);
    };
  }, [isLoading]);

  return (
    <UserLayout>
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <AppHeader
          title="Daftar Sertifikat"
          subtitle={`Total sertifikat: ${listCerts.length}`}
          actionBtn={
            <Button variant="ghost" size="icon" asChild>
              <Link to={`/user/profile/${id}`}>
                <ArrowLeft />
              </Link>
            </Button>
          }
          additionalContent={
            <Button variant={"outline"} size="sm" asChild>
              {btnAvaiable ? (
                <Link to={`/user/portfolio/${id}`}>Lihat Portofolio</Link>
              ) : (
                <span>Lengkapi data dirikamu</span>
              )}
            </Button>
          }
        />

        {isLoading ? (
          <Progress value={100} />
        ) : (
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <ResponsiveTable
                columns={[
                  ...columns,
                  {
                    id: "action",
                    header: "Aksi",
                    cell: ({ row }) => (
                      <>
                        <Button size="sm" asChild>
                          <a
                            href={`${baseAPI.dev}/uploads/certificates/${row.original.file_path}`}>
                            lihat dokumen
                          </a>
                        </Button>
                      </>
                    ),
                  },
                ]}
                data={listCerts}
              />
            </div>
          </div>
        )}
      </div>
    </UserLayout>
  );
};

export default UserCertificateListPage;
