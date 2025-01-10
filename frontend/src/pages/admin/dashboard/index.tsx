import axios from "axios";
import { useContext, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { baseAPI } from "@/api";
import { useAppSelector } from "@/app/store";
import { Context } from "@/context";
import { AdminLayout } from "@/layouts/admin";
import { certificationListProps } from "@/types/certificate";
import { userProp } from "@/types/user";

const DashboardPage: React.FC = () => {
  const [userData, setUserData] = useState<userProp[] | null>(null);
  const [certData, setCertData] = useState<certificationListProps[] | null>(
    null
  );
  const { getDecree, listDecree } = useContext(Context);

  useEffect(() => {
    getDecree();

    const fetchAll = async () => {
      try {
        const userResponse = await axios.get<{
          code: number | null;
          status: string | null;
          message: string | null;
          data: userProp[];
        }>(`${baseAPI.dev}/users`);
        setUserData(userResponse.data.data);

        const certificationResponse = await axios.get<{
          code: number | null;
          status: string | null;
          message: string | null;
          data: certificationListProps[];
        }>(`${baseAPI.dev}/certifications`);
        setCertData(certificationResponse.data.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchAll();
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
            alt="wave"
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
              <p className="text-4xl font-semibold">{certData?.length}</p>
            </CardContent>
          </Card>
          <Card className="shadow border">
            <CardContent className="p-5 space-y-3">
              <p className="font-semibold text-sm">User</p>
              <p className="text-4xl font-semibold">{userData?.length}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DashboardPage;
