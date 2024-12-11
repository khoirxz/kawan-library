import { Link, useParams } from "react-router-dom";

import {
  MapPin,
  Phone,
  FileText,
  Medal,
  BriefcaseBusiness,
} from "lucide-react";

import useProfileHook from "../../hook/profileHook";
import UserProfileLayout from "../..";

const UserProfileEmployePage: React.FC = () => {
  const { userProfile } = useProfileHook();
  const { id } = useParams<{ id: string }>();

  return (
    <UserProfileLayout>
      <div className="border p-6 rounded-md bg-white shadow-sm">
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

      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div>
          <div className="flex justify-between items-end mb-3 my-5">
            <h1 className="text-xl font-semibold">Riwayat Pekerjaan</h1>

            <Link
              to={`/user/work-experience/${id}`}
              className="text-sm text-blue-600">
              Edit
            </Link>
          </div>

          <div className="border p-6 rounded-md bg-white shadow-sm space-y-6">
            <ListItemWorkExperience />
            <ListItemWorkExperience />
          </div>
        </div>
      </div>
    </UserProfileLayout>
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

const ListItemWorkExperience: React.FC = () => {
  return (
    <div className="space-y-1 flex flex-row items-start">
      <div className="py-2 pr-3">
        <BriefcaseBusiness className="text-blue-500" />
      </div>
      <div className="space-y-1">
        <h1 className="font-semibold text-xl">Hello World</h1>
        <p className="text-sm text-gray-500 flex flex-row gap-4">
          <span className="text-black">Staf IT</span> <span>2022-2024</span>{" "}
          <span>PT. XYZ</span>
          <span>Surabaya</span>
        </p>
        <p className="text-gray-500 text-sm">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Neque
          repellendus voluptates ut.
        </p>
      </div>
    </div>
  );
};

export default UserProfileEmployePage;
