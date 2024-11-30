import { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";

import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { ResponsiveTable } from "@/components/responsive-table";
import { ColumnDef } from "@tanstack/react-table";

import { baseAPI } from "@/api";
import { certificationListProps } from "@/types/certificate";

const columns: ColumnDef<certificationListProps>[] = [
  {
    accessorKey: "name",
    header: "Nama Sertifikat",
  },
  {
    accessorKey: "createdAt",
    header: "Dibuat pada",
    cell: ({ row }) => (
      <span>{dayjs(row.original.createdAt).format("DD-MMMM-YYYY")}</span>
    ),
  },
];

const TableCertificate: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [listUser, setListUser] = useState<certificationListProps[]>([]);

  useEffect(() => {
    const getCertificateByIdUser = async () => {
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
        console.log(error);
      }
    };

    getCertificateByIdUser();
  }, []);

  return (
    <>
      <div className="flex justify-between my-7 items-center">
        <h1 className="font-semibold text-xl">Daftar sertifikat</h1>
        <Button size="sm">Portofolio</Button>
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
                    id: "actions",
                    header: "Action",
                    cell: ({ row }) => (
                      <div className="flex justify-end items-center gap-3">
                        <a
                          target="_blank"
                          href={`${baseAPI.dev}/uploads/certificates/${row.original.file_path}`}>
                          <Eye className="cursor-pointer" />
                        </a>
                      </div>
                    ),
                  },
                ]}
                data={listUser}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TableCertificate;
