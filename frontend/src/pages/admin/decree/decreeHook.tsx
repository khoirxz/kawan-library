import { useEffect, useState } from "react";
import axios from "axios";
import { baseAPI } from "@/api";
import { userProp } from "@/types/user";
import { decreeCategoryListProps } from "@/types/decree";

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
          data: decreeCategoryListProps[];
        }>(`${baseAPI.dev}/decree/category/`);

        const formattedCategories = data.data.map((category) => ({
          label: category.title,
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

    return () => {
      setIsLoading(true);
      setCategories([]);
      setUsers([]);
    };
  }, []);

  return { isLoading, categories, users };
};

export default useDecree;
