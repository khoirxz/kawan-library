import { useState, useCallback } from "react";
import axios from "axios";
import { baseAPI } from "@/api";
import { userProp } from "@/types/user";
import { decreeCategoryListProps, decreeListProps } from "@/types/decree";
import { responseProps, paginateProps } from "@/types/response";
import { apiHelper } from "@/utils/httpClient";

const useDecree = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [categories, setCategories] = useState<
    {
      label: string;
      value: number;
    }[]
  >([]);
  const [users, setUsers] = useState<userProp[]>([]);
  const [listDecree, setListDecree] = useState<{
    data: decreeListProps[];
    pagination: paginateProps;
  }>({
    data: [],
    pagination: {
      totalItem: 0,
      totalPages: 0,
      currentPage: 1,
      pageSize: 10,
    },
  });
  const [error, setError] = useState<Error | null>(null);

  const fetchDecree = useCallback(
    (params: {
      search?: string;
      userId?: string;
      page?: number;
      limit?: number;
    }) => {
      const controller = new AbortController();
      setIsLoading(true);
      setError(null);

      apiHelper
        .get<
          responseProps & { data: decreeListProps[]; pagination: paginateProps }
        >("decrees", params, controller.signal)
        .then((response) => {
          setListDecree(response);
        })
        .catch((err: any) => {
          if (err.name === "AbortError") {
            console.log("Request was aborted.");
          } else {
            setError(err);
            console.error("Error fetching decrees:", err);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });

      // Return the abort function directly for use in cleanup
      return () => controller.abort();
    },
    []
  );

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

  return {
    error,
    isLoading,
    setIsLoading,
    categories,
    users,
    listDecree,
    setListDecree,
    fetchDecree,
    fetchCategories,
    fetchUsers,
  };
};

export default useDecree;
