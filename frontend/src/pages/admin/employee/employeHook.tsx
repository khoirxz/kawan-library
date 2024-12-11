import { useEffect, useState } from "react";
import axios from "axios";
import { baseAPI } from "@/api";
import { userProp } from "@/types/user";

const useEmployee = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<userProp[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
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

    return () => {
      setIsLoading(true);
      setUsers([]);
    };
  }, []);

  return { isLoading, users };
};

export default useEmployee;
