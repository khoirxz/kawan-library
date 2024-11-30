// custom context
import React, { createContext, useState } from "react";

const Context = createContext<{
  modalAlert: boolean;
  setModalAlert: React.Dispatch<React.SetStateAction<boolean>>;
  modalAlertData: modalDataProps;
  setModalAlertData: React.Dispatch<React.SetStateAction<modalDataProps>>;
  resetSate: () => void;
}>({
  modalAlert: false,
  setModalAlert: () => {},
  modalAlertData: {} as modalDataProps,
  setModalAlertData: () => {},
  resetSate: () => {},
});

interface modalDataProps {
  title: string;
  description: string;
  status: "success" | "error" | "info";
}

const Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [modalAlert, setModalAlert] = useState<boolean>(false);
  const [modalAlertData, setModalAlertData] = useState<modalDataProps>(
    {} as modalDataProps
  );

  const resetState = () => {
    setModalAlert(false);
    setModalAlertData({} as modalDataProps);
  };

  return (
    <Context.Provider
      value={{
        modalAlert,
        setModalAlert,
        modalAlertData,
        setModalAlertData,
        resetSate: resetState,
      }}>
      {children}
    </Context.Provider>
  );
};

export { Context, Provider };
