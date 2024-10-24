import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import type { FormProps } from "antd";
import { Button, Flex, Form, Input, Typography, Spin, Alert } from "antd";
import axios from "axios";
import { baseAPI } from "../../api";
import { useAppDispatch, useAppSelector } from "../../app/store";
import { LoginUser, resetAll } from "../../features/AuthSlices";
// style module
import styles from "./login.module.css";

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  type FieldType = {
    username?: string;
    password?: string;
  };
  const {
    main: { login, isLoading, message: msg, isError },
  } = useAppSelector((state) => state.authState);
  const navigate = useNavigate();
  const [loadingPage, setLoadingPage] = useState<boolean>(true);
  const location = useLocation();
  const token = localStorage.getItem("token");

  // check if user already logged in
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const response = await axios.get(`${baseAPI.dev}/auth/verify/`, {
          timeout: 6000,
        });

        if (response.status === 200) {
          navigate("/admin/dashboard", {
            replace: true,
            state: { verify: true },
          });
        }
      } catch (error) {
        setLoadingPage(false);
        // disable for production
        // console.error("Verification failed:", error);
      }
    };

    if (token === null) {
      setLoadingPage(false);
    } else {
      if (!location.state?.logout) {
        checkLogin();
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (login.code === 200) {
      localStorage.setItem("token", login.token);

      dispatch(resetAll());
      navigate("/admin/dashboard", { replace: true, state: { login: true } });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [login]);

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    // console.log("Success:", values);
    dispatch(resetAll());
    dispatch(
      LoginUser({
        username: values.username,
        password: values.password,
      })
    );
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  if (loadingPage) {
    return (
      <div className={styles.loadingContainer}>
        <Spin spinning={loadingPage} />
      </div>
    );
  }

  return (
    <>
      <Flex
        justify="center"
        align="center"
        style={{ height: "100vh" }}
        className={styles.loginContainer}>
        <Form
          layout="vertical"
          labelCol={{
            span: 8,
          }}
          style={{ maxWidth: 400, width: "100%" }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off">
          {msg ? (
            <Alert
              message={msg}
              type={isError ? "error" : "success"}
              showIcon
              style={{ marginBottom: 20 }}
            />
          ) : null}

          <Typography.Title level={3}>Login</Typography.Title>
          <Form.Item<FieldType>
            label="Username"
            name="username"
            rules={[
              { required: true, message: "Please input your username!" },
            ]}>
            <Input
              style={{
                display: "block",
                width: "100%",
              }}
              disabled={isLoading}
            />
          </Form.Item>

          <Form.Item<FieldType>
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please input your password!" },
            ]}>
            <Input.Password disabled={isLoading} />
          </Form.Item>

          <Form.Item wrapperCol={{ style: { marginTop: 16 } }}>
            <Button type="primary" htmlType="submit" disabled={isLoading}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Flex>
    </>
  );
};

export default LoginPage;
