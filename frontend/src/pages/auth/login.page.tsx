import { useEffect } from "react";
import type { FormProps } from "antd";
import {
  Button,
  Flex,
  Form,
  Input,
  Typography,
  message as antMessage,
} from "antd";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/store";
import { LoginUser, resetAll, resetLogin } from "../../features/AuthSlices";

const LoginPage: React.FC = () => {
  const [messageApi, contextHolder] = antMessage.useMessage();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    main: { isLoading, message, login, isSuccess },
  } = useAppSelector((state) => state.authState);
  type FieldType = {
    username?: string;
    password?: string;
  };

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

  useEffect(() => {
    if (login.code === 200) {
      localStorage.setItem("token", login.token);
      if (!isLoading) {
        dispatch(resetLogin());
        navigate("/admin/dashboard", { replace: true });
      }
    }
  }, [login, navigate, isLoading, dispatch]);

  useEffect(() => {
    if (message) {
      messageApi.open({
        type: isSuccess ? "success" : "error",
        content: message,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Flex justify="center" align="center" style={{ height: "100vh" }}>
      {contextHolder}
      <Form
        layout="vertical"
        labelCol={{
          span: 8,
        }}
        style={{ maxWidth: 400, width: "100%" }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off">
        <Typography.Title level={3}>
          Login {isLoading ? "..." : ""}
        </Typography.Title>
        <Form.Item<FieldType>
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}>
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
          rules={[{ required: true, message: "Please input your password!" }]}>
          <Input.Password disabled={isLoading} />
        </Form.Item>

        <Form.Item wrapperCol={{ style: { marginTop: 16 } }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Flex>
  );
};

export default LoginPage;
