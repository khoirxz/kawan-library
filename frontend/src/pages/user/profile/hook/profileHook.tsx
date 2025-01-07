import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import { baseAPI } from "@/api";
import {
  userProfileProps,
  userJobHistoryProps,
  USERINVOICEPROPS,
} from "@/types/user";

const useProfile = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [userProfile, setUserProfile] = useState<userProfileProps | null>(null);
  const [userJobHistory, setUserJobHistory] = useState<
    userJobHistoryProps[] | null
  >(null);
  const [invoices, setInvoices] = useState<USERINVOICEPROPS[]>([]);
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
      setUserJobHistory(null);
      setInvoices([]);
    };
  }, [id]);

  const getUserJobHistory = async ({ idUser }: { idUser: string }) => {
    try {
      const response = await axios.get<{
        code: number;
        status: string;
        message: string;
        data: userJobHistoryProps[] | null;
      }>(`${baseAPI.dev}/user/job/history/${idUser}`);

      const { data } = response.data;

      if (data) {
        setUserJobHistory(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getInvoices = async ({ idSalary }: { idSalary: number }) => {
    try {
      const results = await axios.get<{
        data: USERINVOICEPROPS[];
      }>(`https://bprkawan.co.id/salary/api/get/${idSalary}`);

      setInvoices(results.data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return {
    loading,
    userProfile,
    userJobHistory,
    invoices,
    getUserJobHistory,
    getInvoices,
  };
};

export default useProfile;
