import { useEffect, ReactNode, useState } from "react";
import { Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/store";
import { resetVerify, VerifyToken } from "../features/AuthSlices";

type ProtectedRouteProps = {
  children: ReactNode;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    main: { isLoading, isError, verify, logout },
  } = useAppSelector((state) => state.authState);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    dispatch(VerifyToken({}));
    setIsAuth(true);
  }, [dispatch]);

  useEffect(() => {
    if (logout.code === 200) {
      localStorage.clear();

      navigate("/", { replace: true });
    } else if (isAuth && verify.code !== 200) {
      localStorage.clear();
      dispatch(resetVerify());
      navigate("/", { replace: true });
    }
  }, [verify, navigate, dispatch, isLoading, isAuth, logout]);

  return (
    <>
      {isLoading ? (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "#9c9c9ca3",
            position: "absolute",
            zIndex: 999,
          }}
          className="loading-page">
          <div style={{ position: "absolute", top: "50%", left: "50%" }}>
            <Spin />
          </div>
        </div>
      ) : isError ? (
        <div
          style={{
            width: "100%",
            height: "100vh",
            background: "#9c9c9ca3",
            position: "absolute",
            zIndex: 999,
          }}
          className="error-page">
          <div style={{ position: "absolute", top: "50%", left: "50%" }}>
            <Spin />
            <p>Something went wrong</p>
          </div>
        </div>
      ) : null}
      {children}
    </>
  );
};

export const AdminOnly: React.FC<{ children: ReactNode }> = ({ children }) => {
  const {
    main: { verify },
  } = useAppSelector((state) => state.authState);

  const navigate = useNavigate();

  useEffect(() => {
    if (verify.data.role !== "") {
      if (verify.data.role !== "admin") {
        navigate("/home");
      }
    }
  }, [navigate, verify.data.role]);

  return <>{children}</>;
};

export const UserOnly: React.FC<{ children: ReactNode }> = ({ children }) => {
  const {
    main: { verify },
  } = useAppSelector((state) => state.authState);

  const navigate = useNavigate();

  useEffect(() => {
    if (verify.data.role !== "user") {
      navigate("/admin/dashboard");
    }
  }, [navigate, verify.data.role]);

  return <>{children}</>;
};

export default ProtectedRoute;
