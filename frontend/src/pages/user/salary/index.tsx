import React, { useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Progress } from "@/components/ui/progress";
import { Link, useParams } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResponsiveTable } from "@/components/responsive-table";

import UserLayout from "@/layouts/user";
import { USERINVOICEPROPS } from "@/types/user";
import { AppHeader } from "@/components/app-header";
import useProfileHook from "../profile/hook/profileHook";

const columns: ColumnDef<USERINVOICEPROPS>[] = [
  {
    accessorKey: "tgl_transfer",
    header: "Tanggal Transfer",
  },
  {
    accessorKey: "jumlah_transfer",
    header: "Jumlah Transfer",
    cell: ({ row }) => (
      <p className="font-semibold">
        Rp.
        {row.original.gaji_utama +
          row.original.tun_jbt +
          row.original.tun_trans +
          row.original.tun_jams +
          row.original.tun_makan +
          row.original.tun_pph -
          row.original.pot_kop -
          row.original.pot_krd}
      </p>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.original.status === 1 ? "default" : "secondary"}>
        {row.original.status === 1 ? "Sukses" : "Pending"}
      </Badge>
    ),
  },
];

const UserSalaryListPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { userProfile, getInvoices, invoices, loading } = useProfileHook();

  useEffect(() => {
    if (id) {
      if (userProfile?.user_data_employe?.id_salary) {
        getInvoices({ idSalary: userProfile?.user_data_employe?.id_salary });
      }
    }
  }, [userProfile?.user_data_employe?.id_salary, id]);

  console.log(invoices);

  return (
    <UserLayout isRestricted>
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <AppHeader
          title="Invoice SLIP GAJI"
          actionBtn={
            <Button variant="ghost" size="icon" asChild>
              <Link to={`/user/profile/${id}`}>
                <ArrowLeft />
              </Link>
            </Button>
          }
        />

        {loading ? (
          <Progress value={100} />
        ) : (
          <div className="overflow-x-auto bg-white rounded-md shadow-lg p-3">
            <div className="inline-block min-w-full align-middle">
              <ResponsiveTable
                columns={[
                  {
                    accessorKey: "gaji_id",
                    header: "SLIP GAJI",
                    cell: ({ row }) => {
                      return (
                        <Link
                          to={`/user/salary/${id}/${row.original.gaji_id}`}
                          className="text-blue-500">
                          <div>
                            <p className="font-semibold text-black">
                              {row.original.bulan_transfer}
                            </p>
                            <p className="text-sm text-gray-500">
                              {row.original.gaji_id} - {row.original.kode_gaji}
                            </p>
                          </div>
                        </Link>
                      );
                    },
                  },
                  ...columns,
                ]}
                data={invoices}
              />
            </div>
          </div>
        )}
      </div>
    </UserLayout>
  );
};

export default UserSalaryListPage;
