import { Link, useParams, useMatch } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import {
  User,
  MapPin,
  Phone,
  Menu,
  Dot,
  BriefcaseBusiness,
} from "lucide-react";

import UserLayout from "@/layouts/user";

const UserSettingLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { id } = useParams<{ id: string }>();

  return (
    <UserLayout isRestricted>
      <div className="pt-16 max-w-screen-lg mx-auto p-5">
        <div className="flex items-center gap-5">
          <Drawer>
            <DrawerTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu />
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <VisuallyHidden.Root>
                <DrawerHeader>
                  <DrawerTitle>Are you absolutely sure?</DrawerTitle>
                  <DrawerDescription>
                    This action cannot be undone.
                  </DrawerDescription>
                </DrawerHeader>
              </VisuallyHidden.Root>

              <div className="px-2 py-3 flex items-center gap-2 justify-center">
                <CustomButton
                  to={`/user/setting/personal/${id}`}
                  icon={<User />}>
                  Personal
                </CustomButton>
                <CustomButton
                  to={`/user/setting/work/${id}`}
                  icon={<BriefcaseBusiness />}>
                  Kerja
                </CustomButton>
                <CustomButton
                  to={`/user/setting/location/${id}`}
                  icon={<MapPin />}>
                  Lokasi
                </CustomButton>
                <CustomButton
                  to={`/user/setting/contact/${id}`}
                  icon={<Phone />}>
                  Kontak
                </CustomButton>
              </div>

              <VisuallyHidden.Root>
                <DrawerFooter>
                  <Button>Submit</Button>
                  <DrawerClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DrawerClose>
                </DrawerFooter>
              </VisuallyHidden.Root>
            </DrawerContent>
          </Drawer>
          <h1>Profile Setting</h1>
        </div>

        <div className="flex flex-row mt-4 gap-3 w-full">
          <div className="hidden lg:flex flex-col gap-2 ">
            <CustomLink to={`/user/setting/personal/${id}`}>
              <User />
              Personal
            </CustomLink>
            <CustomLink to={`/user/setting/work/${id}`}>
              <BriefcaseBusiness />
              Riwayat Kerja
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
          <div className="flex-1 bg-white shadow-md rounded-md border p-5 w-full">
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

const CustomButton: React.FC<{
  to: string;
  children: React.ReactNode;
  icon: React.ReactNode;
}> = ({ to, children, icon }) => {
  const match = useMatch(to);

  return (
    <Link to={to}>
      <Button variant="ghost" className="flex flex-col h-full w-20">
        {icon}
        {children}
        {match ? <Dot /> : null}
      </Button>
    </Link>
  );
};

export default UserSettingLayout;
