import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";

import { baseAPI } from "@/api";
import { useAppSelector } from "@/app/store";

const useAuth = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const {
    main: { login },
  } = useAppSelector((state) => state.authState);

  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get<{
          code: number | null;
          status: string | null;
          message: string | null;
          data: {
            userId: string;
            username: string;
            role: string;
            avatarImg: string;
          } | null;
        }>(`${baseAPI.dev}/auth/verify`);

        if (response.data.code === 200) {
          // navigate("/admin/dashboard");
          if (response.data.data?.role === "admin") {
            navigate("/admin/dashboard");
          } else {
            navigate("/home");
          }
        }
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error(axiosError.response?.data || axiosError.message);
      } finally {
        setIsLoading(false);
      }
    };

    verify();
  }, []);

  useEffect(() => {
    if (login.code === 200) {
      navigate("/home");
    }
  }, [login]);

  return { isLoading };
};

export default useAuth;
