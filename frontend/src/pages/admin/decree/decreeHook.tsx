import { useEffect, useState } from "react";
import axios from "axios";
import { baseAPI } from "@/api";
import { userProp } from "@/types/user";

type categoryListProps = {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

const useDecree = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [categories, setCategories] = useState<
    {
      label: string;
      value: number;
    }[]
  >([]);
  const [users, setUsers] = useState<userProp[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);

      try {
        const { data } = await axios.get<{
          code: number | null;
          status: string | null;
          message: string | null;
          data: categoryListProps[];
        }>(`${baseAPI.dev}/decree/category/`);

        const formattedCategories = data.data.map((category) => ({
          label: category.name,
          value: category.id,
        }));
        setCategories(formattedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

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
    fetchCategories();
  }, []);

  return { isLoading, categories, users };
};

export default useDecree;
