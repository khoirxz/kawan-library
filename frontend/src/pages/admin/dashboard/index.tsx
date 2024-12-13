import { useContext, useEffect } from "react";

import { useAppSelector } from "@/app/store";
import { Context } from "@/context";
import { AdminLayout } from "@/layouts/admin";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const DashboardPage: React.FC = () => {
  const { getDecree, listDecree } = useContext(Context);

  useEffect(() => {
    getDecree();
  }, []);

  const {
    main: {
      verify: { data },
    },
  } = useAppSelector((state) => state.authState);

  return (
    <AdminLayout>
      <div className="p-6">
        <Card className="text-white shadow-none border-0 relative rounded-2xl">
          <img
            src="/wave1.png"
            className="w-full h-full absolute z-0 object-cover rounded-2xl filter brightness-50 contrast-125 saturate-50"
          />
          <CardContent className="p-10 z-10 relative">
            <h1 className="text-2xl leading-10 font-bold">
              Selamat datang{" "}
              <span className="font-extralight">{data?.username}</span> 👋
            </h1>
            <p>Jelajahi layanan dan fitur</p>
            <Button className="mt-5">Mulai</Button>
          </CardContent>
        </Card>

        <div className="grid grid-cols-4 gap-4 mt-10">
          <Card className="shadow border">
            <CardContent className="p-5 space-y-3">
              <p className="font-semibold text-sm">Total Surat Keterangan</p>
              <p className="text-4xl font-semibold">{listDecree.length}</p>
            </CardContent>
          </Card>
          <Card className="shadow border">
            <CardContent className="p-5 space-y-3">
              <p className="font-semibold text-sm">Total Sertifikat</p>
              <p className="text-4xl font-semibold">{listDecree.length}</p>
            </CardContent>
          </Card>
          <Card className="shadow border">
            <CardContent className="p-5 space-y-3">
              <p className="font-semibold text-sm">User</p>
              <p className="text-4xl font-semibold">{listDecree.length}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DashboardPage;
