import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

import { baseAPI } from "@/api";
import { userProp } from "@/types/user";

export function useProfile() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<userProp[]>([]);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchUsers = async () => {
      if (!id) return null;

      setIsLoading(true);

      try {
        const { data } = await axios.get<{
          code: number | null;
          status: string | null;
          message: string | null;
          data: userProp[];
        }>(`${baseAPI.dev}/users/`);

        setUsers(data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return {
    isLoading,
    users,
  };
}
