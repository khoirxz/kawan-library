import { useEffect, ReactNode } from "react";
import { Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/store";
import { VerifyToken, reset } from "../features/AuthSlices";

type ProtectedRouteProps = {
  children: ReactNode;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    main: { isLoading, isError },
  } = useAppSelector((state) => state.authState);

  useEffect(() => {
    dispatch(VerifyToken({}));
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      dispatch(reset());
      navigate("/");
    }
  }, [isError, dispatch, navigate]);

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

export default ProtectedRoute;
