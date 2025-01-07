import { useEffect, useState } from "react";
import axios from "axios";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle } from "lucide-react";
import { FcDocument, FcDiploma1 } from "react-icons/fc";

import { baseAPI } from "@/api";
import UserLayout from "@/layouts/user";
import { userProfileProps } from "@/types/user";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";

const items: {
  id: number;
  title: string;
  href: string;
  icon: React.ReactElement;
}[] = [
  {
    id: 1,
    title: "Surat Keputusan",
    icon: <FcDocument className="w-8 h-8" />,
    href: "/user/decree",
  },
  {
    id: 2,
    title: "Sertifikat",
    icon: <FcDiploma1 className="w-8 h-8" />,
    href: "/user/certificate",
  },
];
const UserHomePage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [profile, setProfile] = useState<userProfileProps | null>(null);

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const response = await axios.get<{
          code: number;
          status: string;
          message: string;
          data: userProfileProps | null;
        }>(`${baseAPI.dev}/user/profile`);

        setProfile(response.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    getUserProfile();

    return () => {
      setProfile(null);
    };
  }, []);

  const AlertPopup: React.FC<{
    user_contact: userProfileProps["user_contact"] | null;
    user_data: userProfileProps["user_data"] | null;
    user_geography: userProfileProps["user_geography"] | null;
  }> = ({ user_contact, user_data, user_geography }) => {
    return (
      <>
        {isLoading ? (
          <Skeleton className="h-28" />
        ) : !user_contact && !user_data && !user_geography ? (
          <Alert variant="destructive">
            <AlertCircle className="w-4 h-4" />
            <AlertTitle>Peringatan</AlertTitle>
            <AlertDescription>
              Anda belum melengkapi data diri, silahkan lengkapi terlebih dahulu
              untuk pengalaman menggunakan layanan ini.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert variant="default">
            <CheckCircle className="w-4 h-4" />
            <AlertTitle>Kerja bagus!</AlertTitle>
            <AlertDescription>
              Data dirimu sudah lengkap, kamu bisa menikmati layanan dari Kawan
              Library
            </AlertDescription>
          </Alert>
        )}
      </>
    );
  };

  return (
    <UserLayout>
      <div className="container max-w-screen-md mx-auto px-4 py-8 space-y-5">
        <div className="px-8 py-10 rounded-lg bg-white border bg-[url('/wave.jpg')] bg-cover text-white">
          <h1 className="text-3xl font-thin">
            Selamat Datang di Kawan Library
          </h1>
          <p className="mt-2">Ayo mulai jelajahi sekarang</p>
          <Button
            className="mt-5 bg-blue-800 hover:bg-blue-950"
            variant="default">
            Mulai
          </Button>
        </div>

        <div>
          <AlertPopup
            user_contact={profile?.user_contact || null}
            user_data={profile?.user_data || null}
            user_geography={profile?.user_geography || null}
          />
        </div>

        <div className="space-y-4">
          <h1 className="text-lg font-semibold">Layanan</h1>
          <div className="grid grid-cols-4 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-md border p-4 flex flex-col items-start gap-3">
                {item.icon}
                <Link to={item.href + "/" + profile?.id}>
                  <p>{item.title}</p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default UserHomePage;
