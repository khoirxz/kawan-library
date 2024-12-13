import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "@/app/store";
import { VerifyToken, resetAll } from "@/reducer/authSlice";

import LoadingScreen from "@/components/loadingScreen";

type Props = {
  children: React.ReactNode;
  redirectTo?: string; // Optional redirect path for unauthorized users
};

const AuthRouter: React.FC<Props> = ({ children, redirectTo = "/" }) => {
  const {
    main: {
      isLoading,
      verify: { code },
      logout: { code: logoutCode },
    },
  } = useAppSelector((state) => state.authState);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(VerifyToken());
  }, [navigate]);

  useEffect(() => {
    if (!isLoading) {
      if (code === 401) {
        navigate(redirectTo, { replace: true });
      }
    }
  }, [code, navigate, redirectTo]);

  useEffect(() => {
    if (logoutCode === 200) {
      // return to login page with reload
      // We're going to figure out a better way; sorry. :(
      dispatch(resetAll());
      window.location.href = "/"; // <- development
      // window.location.href = "/library"; // <- production
    }
  }, [logoutCode, navigate, redirectTo]);

  if (code == null) {
    return <LoadingScreen />;
  }

  if (code === 401) {
    // Optional: Return null to prevent rendering children for unauthorized users
    return null;
  }

  return <>{children}</>;
};

export default AuthRouter;
