import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import dayjs from "dayjs";
import { ColumnDef } from "@tanstack/react-table";

import { ResponsiveTable } from "@/components/responsive-table";
import { Eye } from "lucide-react";

import { baseAPI } from "@/api";
import { decreeListProps } from "@/types/decree";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

const columns: ColumnDef<decreeListProps>[] = [
  {
    accessorKey: "title",
    header: "Nama SK",
  },
  {
    id: "date",
    header: "Tanggal efektif",
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
  },
];

const TableDecree: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [listDecree, setListDecree] = useState<decreeListProps[]>([]);

  useEffect(() => {
    const getDecreeByIdUser = async () => {
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
        if (error instanceof AxiosError) {
          console.log(error.response?.data);
        }
      }
    };

    getDecreeByIdUser();
  }, []);

  return (
    <>
      <div className="flex justify-between my-7 items-center">
        <h1 className="font-semibold text-xl">Daftar Surat Keputasan</h1>
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
                    header: () => <p className="text-center">Aksi</p>,
                    cell: ({ row }) => (
                      <div className="flex justify-center items-center gap-3">
                        <Button size="icon">
                          <a
                            target="_blank"
                            href={`${baseAPI.dev}/uploads/decrees/${row.original.file_path}`}>
                            <Eye className="cursor-pointer" />
                          </a>
                        </Button>
                      </div>
                    ),
                  },
                ]}
                data={listDecree}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TableDecree;
