import type { FormProps } from "antd";
import { Button, Flex, Form, Input, Typography } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { baseAPI } from "../../api";

type FieldType = {
  name?: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
};

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    console.log("Success:", values);
    try {
      const response = await axios.post(`${baseAPI.dev}/auth/signup`, values);

      if (response.status === 201) {
        navigate("/?signup=true");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = async (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Flex justify="center" align="center" style={{ height: "100vh" }}>
      <Form
        layout="vertical"
        labelCol={{
          span: 8,
        }}
        style={{ maxWidth: 500, width: "100%" }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off">
        <Typography.Title level={2}>Signup</Typography.Title>

        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please input your name!" }]}>
          <Input size="large" />
        </Form.Item>

        <Form.Item<FieldType>
          label="Username"
          name="username"
          rules={[
            {
              pattern: /^[a-zA-Z0-9]+$/,
              message: "Username can only contain letters and numbers",
            },
            { required: true, message: "Please input your username!" },
          ]}>
          <Input size="large" />
        </Form.Item>

        <Form.Item<FieldType>
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}>
          <Input.Password size="large" />
        </Form.Item>

        <Form.Item<FieldType>
          label="Retype Password"
          name="confirmPassword"
          dependencies={["password"]}
          rules={[
            { required: true, message: "Please confirm your password!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }

                return Promise.reject(
                  new Error("The two passwords that you entered do not match!")
                );
              },
            }),
          ]}
          style={{ width: "500px" }}>
          <Input.Password size="large" />
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

export default SignupPage;
