import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import dayjs from "dayjs";

import {
  MapPin,
  Phone,
  FileText,
  Medal,
  BriefcaseBusiness,
  DollarSign,
} from "lucide-react";

import useProfileHook from "../../hook/profileHook";
import UserProfileLayout from "../..";
import { userJobHistoryProps, USERINVOICEPROPS } from "@/types/user";
import { Badge } from "@/components/ui/badge";

const UserProfilePage: React.FC = () => {
  const {
    userProfile,
    userJobHistory,
    getUserJobHistory,
    getInvoices,
    invoices,
  } = useProfileHook();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      getUserJobHistory({ idUser: id });

      if (userProfile?.user_data_employe?.id_salary) {
        getInvoices({ idSalary: userProfile?.user_data_employe?.id_salary });
      }
    }
  }, [userProfile?.user_data_employe?.id_salary, id]);

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div>
          <div className="flex justify-between items-end mb-3 my-5">
            <h1 className="text-xl font-semibold">Riwayat Pekerjaan</h1>

            <Link
              to={`/user/setting/work/${id}`}
              className="text-sm text-blue-600">
              Edit
            </Link>
          </div>

          <div className="border p-6 rounded-md bg-white shadow space-y-6">
            {userJobHistory?.length === 0 ? (
              <p>Tidak ada riwayat pekerjaan</p>
            ) : (
              userJobHistory?.map((item) => (
                <ListItemWorkExperience key={item.id} {...item} />
              ))
            )}
          </div>
        </div>
        <div>
          <div className="flex justify-between items-end mb-3 my-5">
            <h1 className="text-xl font-semibold">Salary</h1>

            <Link to={`/user/salary/${id}`} className="text-sm text-blue-600">
              Lihat semua
            </Link>
          </div>

          <div className="border p-6 rounded-md bg-white shadow space-y-6">
            {invoices?.length === 0 ? (
              <p>Belum ada invoice</p>
            ) : (
              <ListItemInvoice invoices={invoices} />
            )}
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

const ListItemWorkExperience: React.FC<userJobHistoryProps> = ({
  company_name,
  job_description,
  start_date,
  end_date,
  position,
  location,
}) => {
  return (
    <div className="space-y-1 flex flex-row items-start">
      <div className="py-2 pr-3">
        <BriefcaseBusiness className="text-blue-500" />
      </div>
      <div className="space-y-1">
        <h1 className="font-semibold">{company_name}</h1>
        <p className="text-sm text-gray-500 flex flex-row gap-4">
          <span className="text-black">{position}</span>
          <span>
            {dayjs(start_date).format("DD MMMM YYYY")} -
            {dayjs(end_date).format("DD MMMM YYYY")}
          </span>
          <span>{location}</span>
        </p>
        <p className="text-gray-500 text-sm">{job_description}</p>
      </div>
    </div>
  );
};

const ListItemInvoice: React.FC<{ invoices: USERINVOICEPROPS[] }> = ({
  invoices,
}) => {
  const data = invoices[0];

  return (
    <div className="flex justify-between">
      <div className="flex flex-row gap-2 items-start">
        <DollarSign className="text-blue-500" />
        <div>
          <p className="text-sm text-gray-500">
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
          <h1 className="font-semibold">SLIP GAJI - {data.tgl_transfer}</h1>
        </div>
      </div>
      <div>
        <Badge>{data.status === 1 ? "Sukses" : "Pending"}</Badge>
      </div>
    </div>
  );
};

export default UserProfilePage;
