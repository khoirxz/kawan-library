import { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, EllipsisVertical } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenuButton,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { baseAPI } from "@/api";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function ResponsiveTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-x-auto">
      <div className="inline-block min-w-full align-middle w-[200px]">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export function ActionButton({
  id,
  file_path,
  setIsLoading,
  linkAction,
  linkDelete,
  linkView,
  isDelete = true,
}: {
  id: string | number;
  file_path?: string;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  linkAction: string;
  linkDelete: string;
  linkView?: string;
  isDelete?: boolean;
}) {
  const navigate = useNavigate();
  const [openAlert, setOpenAlert] = useState<boolean>(false);

  const handleDelete = async (id: string | number) => {
    try {
      await axios.delete<{
        code: number;
        status: string;
        message: string;
        data: number;
      }>(`${baseAPI.dev}/${linkDelete}/${id}`);

      setOpenAlert(false);
      setIsLoading(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex justify-end items-center gap-3">
        {file_path && (
          <Button variant="outline" size="icon" asChild>
            <a
              href={`${baseAPI.dev}/uploads/${linkView}/${file_path}`}
              target="_blank">
              <Eye className="w-4 h-4" />
            </a>
          </Button>
        )}

        <Popover>
          <PopoverTrigger className="p-2 flex items-center rounded-sm border">
            <span>
              <EllipsisVertical className="w-4 h-4" />
            </span>
          </PopoverTrigger>
          <PopoverContent
            className="w-40 overflow-hidden rounded-lg p-0"
            align="end">
            <Sidebar collapsible="none" className="bg-transparent">
              <SidebarContent>
                <SidebarGroup className="border-b last:border-none">
                  <SidebarGroupContent className="gap-0">
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          onClick={() => navigate(`${linkAction}/${id}`)}>
                          <span>Edit</span>
                        </SidebarMenuButton>

                        {isDelete && (
                          <SidebarMenuButton
                            onClick={() => setOpenAlert((prev) => !prev)}>
                            <span className="text-red-500">Hapus</span>
                          </SidebarMenuButton>
                        )}
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
            </Sidebar>
          </PopoverContent>
        </Popover>
      </div>

      <Dialog open={openAlert} onOpenChange={setOpenAlert}>
        <DialogContent className="rounded-md">
          <DialogHeader>
            <DialogTitle className="text-left">Peringatan</DialogTitle>
            <DialogDescription className="text-left">
              Apakah anda yakin ingin menghapus.?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2 flex-row">
            <Button variant="destructive" onClick={() => handleDelete(id)}>
              Hapus
            </Button>
            <Button
              onClick={() => setOpenAlert((prev) => !prev)}
              variant="outline">
              Kembali
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export const PaginationBar: React.FC<{
  total: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}> = ({ total, currentPage, onPageChange }) => {
  const pages = Array.from({ length: total }, (_, i) => i + 1);

  return (
    <Pagination className="w-full justify-center sm:justify-end">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          />
        </PaginationItem>

        {pages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              href="#"
              onClick={() => onPageChange(page)}
              className={page === currentPage ? "active" : ""}>
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={() => onPageChange(Math.min(currentPage + 1, total))}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export const RowData: React.FC<{
  setRow: React.Dispatch<React.SetStateAction<number>>;
}> = ({ setRow }) => {
  return (
    <Select onValueChange={(value) => setRow(parseInt(value) || 10)}>
      <SelectTrigger className="w-[80px]">
        <SelectValue placeholder="10" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Row per page</SelectLabel>
          <SelectItem value="10">10</SelectItem>
          <SelectItem value="15">15</SelectItem>
          <SelectItem value="20">20</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
