import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Verified, Phone, FileText, Medal } from "lucide-react";

import UserLayout from "@/layouts/user";
import { userProfileProps } from "@/types/user";
import { baseAPI } from "@/api";

const ProfilePage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [userProfile, setUserProfile] = useState<userProfileProps | null>(null);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const getUserPortfolio = async () => {
      try {
        const response = await axios.get<{
          code: number;
          status: string;
          message: string;
          data: userProfileProps | null;
        }>(`${baseAPI.dev}/user/profile//${id}`);

        const { data } = response.data;

        if (data) {
          setUserProfile(data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      getUserPortfolio();
    }

    return () => {
      setUserProfile(null);
    };
  }, []);

  console.log(userProfile);

  return (
    <UserLayout>
      <div className="container max-w-2xl mx-auto px-4 py-8 space-y-5">
        <div className="flex gap-2">
          <Button asChild>
            <Link to={`/user/decree/${id}`}>Lihat SK</Link>
          </Button>
          <Button asChild>
            <Link to={`/user/certificate/${id}`}>Lihat Sertifikat</Link>
          </Button>
        </div>

        <div className="border p-6 rounded-md relative bg-white">
          <div className="flex flex-col items-center text-center gap-5">
            {loading ? (
              <Skeleton className="w-24 h-24" />
            ) : (
              <div className="w-24 h-24 relative z-0">
                <Avatar className="w-full h-full">
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                  <AvatarFallback>{userProfile?.username}</AvatarFallback>
                </Avatar>
                {userProfile?.verified ? (
                  <Verified className="absolute bottom-0 right-0 z-10 text-blue-600 fill-blue-50" />
                ) : null}
              </div>
            )}

            <div className="space-y-2">
              <span className="text-gray-500 bg-gray-600/10 px-2 py-1 rounded-md text-sm">
                @{userProfile?.username}
              </span>
              <h1 className="text-2xl">
                {userProfile?.user_data?.firstName}{" "}
                {userProfile?.user_data?.lastName}
              </h1>
              <p className="text-gray-500">
                {userProfile?.user_data_employe?.position}
              </p>
              <p className="text-gray-500 mt-2 text-sm">
                Bergabung {dayjs(userProfile?.createdAt).format("DD MMMM YYYY")}
              </p>
            </div>
            <Button className="absolute top-4 right-4" asChild>
              <Link to={`/user/setting/personal/${id}`}>Edit</Link>
            </Button>
          </div>
        </div>

        <div className="border p-6 rounded-md">
          <div className="grid grid-cols-2 gap-4">
            {userProfile?.user_geography ? (
              <ListItemProfile
                icon={<MapPin className="text-gray-500" />}
                title="Lokasi"
                subtitle={`${userProfile?.user_geography?.address}, ${userProfile?.user_geography?.subdistrict}, ${userProfile?.user_geography?.city}, ${userProfile?.user_geography?.province}, ${userProfile?.user_geography?.country}, ${userProfile?.user_geography?.postal_code}`}
              />
            ) : null}
            {userProfile?.user_contact ? (
              <ListItemProfile
                icon={<Phone className="text-gray-500" />}
                title="Phone"
                subtitle={userProfile?.user_contact?.phone}
              />
            ) : null}
            {userProfile?.decrees ? (
              <ListItemProfile
                icon={<FileText className="text-gray-500" />}
                title="SK"
                subtitle={userProfile?.decrees?.length + " SK"}
              />
            ) : null}
            {userProfile?.certifications ? (
              <ListItemProfile
                icon={<Medal className="text-gray-500" />}
                title="Sertifikat"
                subtitle={userProfile?.certifications?.length + " Sertifikat"}
              />
            ) : null}
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

const ListItemProfile: React.FC<{
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}> = ({ icon, title, subtitle }) => {
  return (
    <div className="flex flex-row items-start gap-4 h-full">
      <div className="w-8">{icon}</div>
      <div>
        <h1 className="font-semibold">{title}</h1>
        <p className="text-gray-500 text-sm">{subtitle}</p>
      </div>
    </div>
  );
};

export default ProfilePage;
