import { Link, useParams, useNavigate } from "react-router-dom";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

import { baseAPI } from "@/api";
import { useAppSelector, useAppDispatch } from "@/app/store";
import { LogoutUser } from "@/reducer/authSlice";

const UserLayout: React.FC<{
  children: React.ReactNode;
  isRestricted?: boolean;
}> = ({ children, isRestricted = false }) => {
  const {
    main: {
      verify: { data },
    },
  } = useAppSelector((state) => state.authState);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();

  const handleLogout = () => {
    dispatch(LogoutUser());
  };

  if (isRestricted) {
    if (!data || (data.userId !== id && data.role !== "admin")) {
      return (
        <div className="font-public flex items-center h-screen flex-col justify-center space-y-10">
          <p>Anda tidak memiliki hak untuk mengakses halaman ini</p>
          <Button onClick={() => navigate("/home", { replace: true })}>
            Kembali ke halaman
          </Button>
        </div>
      );
    }
  }

  return (
    <div className="font-public">
      {isRestricted ? (
        data?.userId !== id ? (
          <div className="bg-red-600 text-white p-2">
            <p className="text-xs">
              <User className="inline-block mr-2" width={16} /> Anda melihat
              sebagai admin
            </p>
          </div>
        ) : null
      ) : null}

      <nav className="flex justify-between items-center p-5 shadow-md bg-white">
        <h1 className="text-2xl font-bold">Kawan Library</h1>
        <div className="flex items-center gap-2 relative">
          <Button asChild variant="link" className="p-2">
            <Link to="/home">Home</Link>
          </Button>
          {data?.role === "admin" && (
            <Button asChild variant="link" className="p-2">
              <Link to="/admin/dashboard">Dashboard</Link>
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger>
              {data?.avatarImg ? (
                <Avatar>
                  <AvatarImage
                    src={`${baseAPI.dev}/uploads/avatars/${data?.avatarImg}`}
                    alt="profile"
                    className="object-cover"
                  />
                </Avatar>
              ) : (
                <div className="w-10 h-10 flex items-center justify-center bg-gray-400 rounded-full text-gray-600">
                  <User />
                </div>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mr-5">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Button
                  asChild
                  variant="link"
                  className="w-full justify-start p-0 h-full">
                  <Link to={`/user/profile/${data?.userId}`}>Profile</Link>
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Button
                  onClick={handleLogout}
                  variant="link"
                  className="w-full text-red-500 justify-start p-0 h-full">
                  Logout
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
      <div className="bg-gray-200/30 min-h-screen">{children}</div>
    </div>
  );
};

export default UserLayout;
