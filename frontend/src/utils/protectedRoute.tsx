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
    if (msg) {
      console.log("hit protected route");
      messageApi.open({
        type: isError ? "error" : "success",
        content: msg,
      });
      dispatch(resetVerify());
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [msg, isError]);

  useEffect(() => {
    //! new PROBLEM
    // jika logout berarti verifikasi akan memberikan respon selain 200,
    // mengakibatkan kode dibawah ini akan dijalankan
    if (verify.code !== 200 && verify.code !== 0) {
      localStorage.clear();
      dispatch(resetVerify());
      navigate("/?unauthorized", {
        replace: true,
        state: { verify: false, showMessage: true },
      });
    } else if (verify.code === 200) {
      setLoadingPage(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, verify]);

  useEffect(() => {
    if (logout.code === 200) {
      setLoadingPage(true);
      localStorage.clear();
      dispatch(resetVerify());
      setTimeout(() => {
        navigate("/?logout", {
          replace: true,
          state: { logout: true },
        });
      }, 3000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logout, verify]);

  return (
    <>
      {contextHolder}
      {isLoading ? (
        <div
          style={{
            width: "100%",
            height: "100vh",
            background: "rgba(156, 156, 156, 0.3)",
            position: "absolute",
            zIndex: 999,
          }}>
          <div style={{ position: "absolute", top: "50%", left: "50%" }}>
            <Spin spinning />
          </div>
        </div>
      ) : loadingPage ? (
        <div
          style={{
            width: "100%",
            height: "100vh",
            background: "rgba(156, 156, 156, 0.3)",
            position: "absolute",
            zIndex: 999,
          }}>
          <div style={{ position: "absolute", top: "50%", left: "50%" }}>
            <Spin spinning={loadingPage} />
          </div>
          {logout.code === 200 ? (
            <p style={{ textAlign: "center" }}>Logout Successfully</p>
          ) : (
            <p style={{ textAlign: "center" }}>Loading...</p>
          )}
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
