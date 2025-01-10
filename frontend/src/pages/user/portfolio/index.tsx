import { useEffect, useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { useReactToPrint } from "react-to-print";

import { baseAPI } from "@/api";
import UserLayout from "@/layouts/user";
import { userPortfolioProps } from "@/types/user";
import axios from "axios";

const UserPortfolioPage: React.FC = () => {
  const [portfolio, setPortfolio] = useState<userPortfolioProps | null>(null);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({
    contentRef,
    bodyClass: "shadow-none p-4 border-0",
  });

  useEffect(() => {
    const getPortfolio = async () => {
      try {
        const response = await axios.get<{
          code: number;
          status: string;
          message: string;
          data: userPortfolioProps;
        }>(`${baseAPI.dev}/user/portfolio/${id}`);

        setPortfolio(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };

    if (id) {
      getPortfolio();
    }

    return () => {
      setPortfolio(null);
    };
  }, [id]);

  return (
    <UserLayout isRestricted>
      <div className="container mx-auto px-4 py-8 max-w-screen-md flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={() =>
              navigate(`/user/certificate/${id}`, { replace: true })
            }>
            Kembali
          </Button>
          <Button
            onClick={(_) =>
              contentRef.current && reactToPrintFn(() => contentRef.current)
            }>
            Cetak portofolio
          </Button>
        </div>

        <div
          ref={contentRef}
          className="shadow-md p-5 rounded-md box-border border flex flex-col gap-4">
          <Avatar className="w-24 h-24">
            {portfolio?.avatarImg === null ? (
              <AvatarFallback>{portfolio?.username}</AvatarFallback>
            ) : (
              <AvatarImage
                src={`${baseAPI.dev}/uploads/avatars/${portfolio?.avatarImg}`}
                alt={portfolio?.username}
                className="object-cover aspect-square"
              />
            )}

            <AvatarFallback>{portfolio?.username}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl">
              {portfolio?.user_info?.firstName} {portfolio?.user_info?.lastName}
            </h1>

            <div className="text-gray-500 text-sm flex gap-4">
              <span className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                {portfolio?.user_contact?.email}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                {portfolio?.user_contact?.phone}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {portfolio?.user_geography?.address},{" "}
                {portfolio?.user_geography?.city},{" "}
                {portfolio?.user_geography?.country}
              </span>
            </div>

            <div className="mt-3 space-y-2">
              <div>
                <h1 className="font-semibold text-lg">Keahlian</h1>
              </div>
              <div className="space-y-2">
                {portfolio?.certifications?.map((certs) => (
                  <div
                    className="flex justify-between items-start"
                    key={certs.id}>
                    <div>
                      <a
                        target="_blank"
                        href={`${baseAPI.dev}/uploads/certificates/${certs.file_path}`}>
                        <p className="font-semibold">{certs.title}</p>
                      </a>
                      <p className="text-gray-500 text-sm">
                        {certs.description}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500">
                      {dayjs(certs.createdAt).format("DD MMMM YYYY")}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default UserPortfolioPage;
