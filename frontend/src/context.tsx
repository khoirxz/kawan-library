// custom context
import { createContext, useState } from "react";
import axios, { AxiosError } from "axios";
import { decreeListProps } from "@/types/decree";

import { baseAPI } from "@/api";

const Context = createContext<{
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  modalAlert: boolean;
  setModalAlert: React.Dispatch<React.SetStateAction<boolean>>;
  modalAlertData: modalDataProps;
  setModalAlertData: React.Dispatch<React.SetStateAction<modalDataProps>>;
  resetStateModal: () => void;
  // decree
  getDecree: () => Promise<void>;
  listDecree: decreeListProps[];
}>({
  isLoading: true,
  setIsLoading: () => {},
  modalAlert: false,
  setModalAlert: () => {},
  modalAlertData: {} as modalDataProps,
  setModalAlertData: () => {},
  resetStateModal: () => {},
  // decree
  getDecree: () => Promise.resolve(),
  listDecree: [],
});

interface modalDataProps {
  title: string;
  description: string;
  status: "success" | "error" | "info";
  redirect?: string;
}

const Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [listDecree, setListDecree] = useState<decreeListProps[]>([]);

  const [modalAlert, setModalAlert] = useState<boolean>(false);
  const [modalAlertData, setModalAlertData] = useState<modalDataProps>(
    {} as modalDataProps
  );

  const getDecree = async () => {
    try {
      const response = await axios.get<{
        code: number | null;
        status: string | null;
        message: string | null;
        data: decreeListProps[];
      }>(`${baseAPI.dev}/decrees`);

      setListDecree(response.data.data);
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(axiosError.response?.data || axiosError.message);
    } finally {
      setIsLoading(false);
    }
  };

  const resetState = () => {
    setModalAlert(false);
    setModalAlertData({} as modalDataProps);
  };

  return (
    <Context.Provider
      value={{
        isLoading,
        setIsLoading,
        modalAlert,
        setModalAlert,
        modalAlertData,
        setModalAlertData,
        resetStateModal: resetState,
        getDecree,
        listDecree,
      }}>
      {children}
    </Context.Provider>
  );
};

export { Context, Provider };
