import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";

import { baseAPI } from "@/api";
import UserLayout from "@/layouts/user";
import { userPortfolioProps } from "@/types/user";
import axios from "axios";

const UserPortfolioPage: React.FC = () => {
  const [portfolio, setPortfolio] = useState<userPortfolioProps | null>(null);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

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
    <UserLayout>
      <div className="container mx-auto px-4 py-8 max-w-screen-md flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={() => navigate(`/user/profile/${id}`, { replace: true })}>
            Kembali
          </Button>
          <Button>Cetak portofolio</Button>
        </div>

        <div className="shadow-md p-5 rounded-md box-border border flex flex-col gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
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
                      <p className="font-semibold">{certs.name}</p>
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
