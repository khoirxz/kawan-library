import { Link, useParams, useMatch } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { User, MapPin, Phone } from "lucide-react";

import UserLayout from "@/layouts/user";

const UserSettingLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { id } = useParams<{ id: string }>();

  return (
    <UserLayout>
      <div className="mt-16 max-w-screen-md mx-auto">
        <h1>Profile Setting</h1>
        <div className="flex mt-4 gap-3">
          <div className="flex flex-col gap-2 min-w-48">
            <CustomLink to={`/user/setting/personal/${id}`}>
              <User />
              Personal
            </CustomLink>
            <CustomLink to={`/user/setting/location/${id}`}>
              <MapPin />
              Lokasi
            </CustomLink>
            <CustomLink to={`/user/setting/contact/${id}`}>
              <Phone />
              Kontak
            </CustomLink>
          </div>
          <div className="flex-1 bg-white shadow-md rounded-md border p-5">
            {children}
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

const CustomLink: React.FC<{
  to: string;
  children: React.ReactNode;
}> = ({ to, children }) => {
  const match = useMatch(to);

  return (
    <Button
      variant={match ? "default" : "ghost"}
      className="justify-start inline-flex"
      asChild>
      <Link to={to}>{children}</Link>
    </Button>
  );
};

export default UserSettingLayout;
