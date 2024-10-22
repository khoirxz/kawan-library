import { useEffect, ReactNode, useState } from "react";
import { message, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/store";
import { resetVerify, VerifyToken } from "../features/AuthSlices";

type ProtectedRouteProps = {
  children: ReactNode;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    main: { isLoading, isError, verify, logout, message: msg },
  } = useAppSelector((state) => state.authState);
  const [loadingPage, setLoadingPage] = useState<boolean>(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    dispatch(VerifyToken({}));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  useEffect(() => {
    if (verify.code !== 0 && verify.code !== 200 && !token) {
      localStorage.clear();
      dispatch(resetVerify());
      navigate("/", {
        replace: true,
        state: { verify: false, showMessage: true },
      });
    } else if (verify.code === 200) {
      setLoadingPage(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verify]);

  useEffect(() => {
    if (logout.code === 200) {
      localStorage.clear();
      dispatch(resetVerify());
      navigate("/", {
        replace: true,
        state: { logout: true },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logout, verify]);

  useEffect(() => {
    if (msg) {
      messageApi.open({
        type: isError ? "error" : "success",
        content: msg,
      });
      dispatch(resetVerify());
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [msg, isError]);

  return (
    <>
      {contextHolder}
      {isLoading ? (
        <div
          style={{
            width: "100%",
            height: "100vh",
            background: "#9c9c9ca3",
            position: "absolute",
            zIndex: 999,
          }}
          className="loading-page">
          <Spin />
        </div>
      ) : loadingPage ? (
        <div
          style={{
            width: "100%",
            height: "100vh",
            background: "#9c9c9ca3",
            position: "absolute",
            zIndex: 999,
          }}
          className="loading-page">
          <Spin />
        </div>
      ) : (
        <>{children}</>
      )}
    </>
  );
};

export const AdminOnly: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

export const UserOnly: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

export default ProtectedRoute;
