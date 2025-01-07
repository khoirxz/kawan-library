import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

import {
  ResponsiveTable,
  ActionButton,
  PaginationBar,
  RowData,
} from "@/components/responsive-table";

import { AdminLayout } from "@/layouts/admin";
import { decreeListProps } from "@/types/decree";
import useDecree from "./decreeHook";

const columns: ColumnDef<decreeListProps>[] = [
  {
    accessorKey: "title",
    header: "Judul",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <p className="font-semibold underline">{row.original.title}</p>
        <p className="font-semibold">{row.original.category.title}</p>
        {row.original.user ? <p>{row.original.user.username}</p> : null}
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
  const [row, setRow] = useState<number>(10);
  const [search, setSearch] = useState<string>("");
  const {
    isLoading,
    listDecree,
    categories,
    setIsLoading,
    fetchDecree,
    fetchCategories,
  } = useDecree();

  useEffect(() => {
    const abortFetch = fetchDecree({ limit: row, search });
    fetchCategories();
    setIsLoading(false);

    return () => abortFetch();
  }, [row, search]);

  return (
    <AdminLayout>
      <div className="p-4 lg:p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Daftar Surat Keputusan</h1>
          {categories?.length > 0 ? (
            <Button asChild>
              <Link to="/admin/decree/form">Tambah</Link>
            </Button>
          ) : (
            <Button disabled>Anda belum membuat kategori</Button>
          )}
        </div>

        <div className="flex mb-4">
          <Input
            placeholder="Cari surat keputusan"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="border rounded-lg">
          {isLoading ? (
            <Progress value={100} />
          ) : (
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
              data={listDecree.data}
            />
          )}
        </div>
        <div className="mt-2 gap-6 sm:gap-0 flex flex-col sm:flex-row justify-between">
          <RowData setRow={setRow} />

          {listDecree.data.length === 0 ? null : (
            <PaginationBar
              total={listDecree.pagination?.totalItem}
              currentPage={listDecree.pagination?.currentPage}
              onPageChange={() => {}}
            />
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

DecreeListPage.displayName = "DecreeListPage";

export default DecreeListPage;
