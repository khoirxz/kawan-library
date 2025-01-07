import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";

import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/app-header";

import useProfileHook from "../profile/hook/profileHook";
import UserLayout from "@/layouts/user";
import { USERINVOICEPROPS } from "@/types/user";

const UserSalaryShowPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { id, idSalary } = useParams<{ idSalary: string; id: string }>();
  const [data, setData] = useState<USERINVOICEPROPS>({} as USERINVOICEPROPS);
  const { userProfile } = useProfileHook();
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({
    contentRef,
    bodyClass: "shadow-none p-4 border-0",
  });

  useEffect(() => {
    const getInvoice = async () => {
      try {
        const response = await axios.get<{
          data: USERINVOICEPROPS[];
        }>(`https://bprkawan.co.id/salary/api/show/${idSalary}`);

        setData(response.data.data[0]);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    };

    getInvoice();

    return () => {
      setData({} as USERINVOICEPROPS);
    };
  }, []);

  return (
    <UserLayout isRestricted>
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <AppHeader
          title="SLIP GAJI"
          actionBtn={
            <Button variant="ghost" size="icon" asChild>
              <Link to={`/user/salary/${id}`}>
                <ArrowLeft />
              </Link>
            </Button>
          }
        />

        <div className="flex justify-end">
          <Button
            className="mb-5"
            onClick={(_) =>
              contentRef.current && reactToPrintFn(() => contentRef.current)
            }>
            Cetak
          </Button>
        </div>
        <div
          ref={contentRef}
          className="shadow-md p-5 rounded-md box-border border flex flex-col gap-4">
          {isLoading ? (
            <Progress value={100} />
          ) : (
            <div className="flex flex-col gap-2">
              <div className="flex flex-col justify-between">
                <div className="flex flex-row justify-between">
                  <p className="text-sm text-gray-500">{data.bulan_transfer}</p>
                  <p className="text-sm">{data.tgl_transfer}</p>
                </div>
                <p className="font-semibold mb-5">SLIP GAJI</p>
                <p className="font-semibold">
                  {userProfile?.user_data?.firstName}{" "}
                  {userProfile?.user_data?.lastName}
                </p>
                <p className="text-sm text-gray-500">
                  {userProfile?.user_geography?.address},{" "}
                  {userProfile?.user_geography?.subdistrict},{" "}
                  {userProfile?.user_geography?.city},{" "}
                  {userProfile?.user_geography?.province},{" "}
                  {userProfile?.user_geography?.postal_code}
                </p>
                <p className="text-sm text-gray-500">
                  {userProfile?.user_contact?.phone}
                </p>
              </div>
              <div className="grid grid-cols-2 mt-4 gap-4">
                <div>
                  <p>Gaji Pokok</p>
                </div>
                <div className="text-right">
                  <p className="text-green-500">Rp. {data.gaji_utama}</p>
                </div>
                <div>
                  <p>Tunjangan Jabatan</p>
                </div>
                <div className="text-right">
                  <p className="text-green-500">Rp. {data.tun_jbt}</p>
                </div>
                <div>
                  <p>Tunjangan Transport</p>
                </div>
                <div className="text-right">
                  <p className="text-green-500">Rp. {data.tun_trans}</p>
                </div>
                <div>
                  <p>Tunjangan Uang Makan</p>
                </div>
                <div className="text-right">
                  <p className="text-green-500">Rp. {data.tun_makan}</p>
                </div>
                <div>
                  <p>Tunjangan Jamsostek</p>
                </div>
                <div className="text-right">
                  <p className="text-green-500">Rp. {data.tun_jams}</p>
                </div>
                <div>
                  <p>Tunjangan PPH 21</p>
                </div>
                <div className="text-right">
                  <p className="text-green-500">Rp. {data.tun_pph}</p>
                </div>
                <div>
                  <p>Tunjangan LAIN</p>
                </div>
                <div className="text-right">
                  <p className="text-green-500">Rp. {data.bonus}</p>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p>Potongan koperasi</p>
                </div>
                <div className="text-right">
                  <p className="text-red-500">Rp. {data.pot_kop}</p>
                </div>
                <div>
                  <p>Pinjaman Karyawan</p>
                </div>
                <div className="text-right">
                  <p className="text-red-500">Rp. {data.pot_krd}</p>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="grid grid-cols-2 mt-4 gap-4">
                <div>
                  <p>Total Gaji</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    Rp.{" "}
                    {data.gaji_utama +
                      data.tun_jbt +
                      data.tun_trans +
                      data.tun_jams +
                      data.tun_makan +
                      data.tun_pph -
                      data.pot_kop -
                      data.pot_krd}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </UserLayout>
  );
};

export default UserSalaryShowPage;
