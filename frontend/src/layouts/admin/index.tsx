import { Link, useNavigate } from "react-router-dom";

import {
  SidebarFooter,
  SidebarMenuItem,
  SidebarMenu,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronUp, User } from "lucide-react";

import { useAppSelector, useAppDispatch } from "@/app/store";
import { LogoutUser } from "@/reducer/authSlice";

import "@/App.css";
import { baseAPI } from "@/api";
import { useEffect } from "react";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const {
    main: {
      isLoading,
      verify: { data },
    },
  } = useAppSelector((state) => state.authState);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (data?.role !== "admin") {
      navigate("/home");
    }
  }, [data, navigate]);

  const handleLogout = () => {
    dispatch(LogoutUser());
  };

  if (isLoading) return <p>Loading</p>;

  if (!data) {
    return <p>Loading</p>;
  } else {
    if (data.role === "admin") {
      return (
        <SidebarProvider className="font-public">
          <AppSidebar>
            <SidebarFooter>
              <SidebarMenu>
                <SidebarMenuItem>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuButton className="h-full">
                        {data?.avatarImg ? (
                          <Avatar>
                            <AvatarImage
                              src={`${baseAPI.dev}/uploads/avatars/${data?.avatarImg}`}
                              alt={data?.username}
                            />
                          </Avatar>
                        ) : (
                          <div className="bg-gray-200 w-10 h-10 rounded-full flex items-center justify-center mr-2 text-gray-400">
                            <User />
                          </div>
                        )}
                        <span className="font-semibold">{data?.username}</span>
                        <ChevronUp className="ml-auto" />
                      </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      side="top"
                      className="w-[--radix-popper-anchor-width]">
                      <DropdownMenuItem asChild>
                        <Link to={`/user/setting/personal/${data?.userId}`}>
                          Pengaturan Akun
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Button
                          onClick={handleLogout}
                          className="text-red-600 w-full justify-start cursor-pointer"
                          variant="link">
                          Logout
                        </Button>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          </AppSidebar>
          <div className="flex-1">
            <div className="flex items-center justify-between border-b border-gray-200">
              <div className="flex items-center space-x-4 h-16 p-6">
                <SidebarTrigger />
                <Separator orientation="vertical" />
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/components">
                        Components
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </div>

            {children}
          </div>
        </SidebarProvider>
      );
    }
  }
}
