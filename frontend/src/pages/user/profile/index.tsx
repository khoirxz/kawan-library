import { Link, useParams } from "react-router-dom";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Verified, AlertCircle } from "lucide-react";

import useProfileHook from "./hook/profileHook";
import UserLayout from "@/layouts/user";
import { baseAPI } from "@/api";
import gradientImg from "@/assets/gradient.png";

const UserProfileLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { loading, userProfile } = useProfileHook();
  const { id } = useParams<{ id: string }>();

  return (
    <UserLayout isRestricted>
      <div className="container max-w-screen-lg mx-auto px-4 py-8 space-y-5">
        <div className="flex gap-2">
          <Button asChild>
            <Link to={`/user/decree/${id}`}>Lihat SK</Link>
          </Button>
          <Button asChild>
            <Link to={`/user/certificate/${id}`}>Lihat Sertifikat</Link>
          </Button>
        </div>

        {!userProfile?.user_contact &&
        !userProfile?.user_geography &&
        !userProfile?.user_data ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Data diri belum lengkap!</AlertTitle>
            <AlertDescription>
              Lengkapi data diri anda terlebih dahulu untuk menikmati layanan.
            </AlertDescription>
          </Alert>
        ) : null}

        <div className="border rounded-md shadow-sm">
          <div className="relative h-[200px]">
            <Button className="absolute top-4 right-4 z-20" asChild>
              <Link to={`/user/setting/personal/${id}`}>Edit</Link>
            </Button>
            <img
              alt="background"
              src={gradientImg}
              className="object-cover filter brightness-75 w-full h-full absolute z-0 rounded-t-md"
            />

            <div className="flex flex-row gap-5 z-10 absolute -bottom-10 left-0 p-4">
              {loading ? (
                <Skeleton className="w-24 h-24" />
              ) : (
                <div className="w-24 h-24 relative z-0">
                  <Avatar className="w-full h-full border-2 border-blue-500 bg-white">
                    <AvatarImage
                      src={
                        userProfile?.avatarImg === null
                          ? "/profile.png"
                          : `${baseAPI.dev}/uploads/avatars/${userProfile?.avatarImg}`
                      }
                      className="object-cover"
                      alt={userProfile?.username}
                    />

                    <AvatarFallback>{userProfile?.username}</AvatarFallback>
                  </Avatar>
                  {userProfile?.verified ? (
                    <Verified className="absolute bottom-0 right-0 z-10 text-blue-600 fill-blue-50" />
                  ) : null}
                </div>
              )}

              <div className="space-y-2">
                <span className="text-gray-100 bg-gray-200/10 px-2 py-1 rounded-md text-sm">
                  @{userProfile?.username}
                </span>
                <h1 className="text-2xl text-white">
                  {userProfile?.user_data?.firstName}{" "}
                  {userProfile?.user_data?.lastName}
                </h1>
                <p className="text-black">
                  {userProfile?.user_data_employe?.position}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white px-6 mt-14 rounded-b-md space-x-3">
            <Button
              className="font-semibold border-b border-black rounded-none"
              variant="ghost">
              Personal
            </Button>
          </div>
        </div>

        {children}
      </div>
    </UserLayout>
  );
};

export default UserProfileLayout;
