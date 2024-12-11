import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import { baseAPI } from "@/api";
import { userProfileProps } from "@/types/user";

const useProfile = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [userProfile, setUserProfile] = useState<userProfileProps | null>(null);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const getUserPortfolio = async () => {
      try {
        const response = await axios.get<{
          code: number;
          status: string;
          message: string;
          data: userProfileProps | null;
        }>(`${baseAPI.dev}/user/profile/${id}`);

        const { data } = response.data;

        if (data) {
          setUserProfile(data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      getUserPortfolio();
    }

    return () => {
      setUserProfile(null);
    };
  }, [id]);

  return { loading, userProfile };
};

export default useProfile;
