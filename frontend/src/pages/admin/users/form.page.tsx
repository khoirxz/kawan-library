import { useState, useEffect } from "react";
import {
  Row,
  Col,
  Input,
  Form,
  Button,
  Upload,
  Select,
  message,
  Avatar,
  Skeleton,
} from "antd";
import type { FormProps } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import axios from "axios";
import { DEV_API } from "../../../api";

import AdminLayout from "../../../layouts/admin.layout";

type UserFormProps = {
  name: string;
  username: string;
  password: string;
  role: string;
  phone: string;
  avatar?: string;
};

const UserFormPage: React.FC = () => {
  const [form] = Form.useForm<UserFormProps>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const [messageApi, contextHolder] = message.useMessage();
  const { id } = useParams();

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const getData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${DEV_API}/users/${id}`, {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
          signal,
        });

        if (response.status === 200 && response.data.data) {
          form.setFieldsValue({
            name: response?.data?.data[0]?.name,
            username: response?.data?.data[0]?.username,
            phone: response?.data?.data[0]?.phone,
            role: response?.data?.data[0]?.role,
          });
          setAvatarUrl(response?.data?.data[0]?.avatarImg);
        }

        setIsLoading(false);
      } catch (error: any) {
        // Pastikan untuk memeriksa apakah error berasal dari pembatalan request
        if (axios.isCancel(error)) {
          console.log("Request canceled:", error.message);
        } else {
          console.error("Error fetching data:", error);
        }
      }
    };

    if (id) {
      getData();
    }

    return () => {
      controller.abort(); // Membatalkan request ketika komponen di-unmount
    };
  }, [id, form]);

  const onFinish: FormProps<UserFormProps>["onFinish"] = async (values) => {
    // console.log("Success:", values);
    try {
      setIsLoading(true);
      let response: any;

      if (id) {
        response = await axios.put(`${DEV_API}/users/${id}`, values, {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        });
        // console.log(response);
      } else {
        response = await axios.post(`${DEV_API}/users`, values, {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        });
      }

      if (response.status === 200) {
        if (id) {
          messageApi.open({
            type: "success",
            content: "Data berhasil diubah!",
          });
        } else {
          messageApi.open({
            type: "success",
            content: "Data berhasil dibuat!",
          });
        }

        // console.log(response);
      }

      setIsLoading(false);
    } catch (error: any) {
      messageApi.open({
        type: "error",
        content: `${error?.response?.data?.message}`,
      });
      console.log(error);
      // throw error;
    }
  };

  const onFinishFailed: FormProps<UserFormProps>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <AdminLayout>
      {contextHolder}
      <Row gutter={10}>
        <Col xs={24} md={12}>
          <div
            style={{
              padding: 5,
            }}>
            <h1>{id ? "Edit" : "Add"} Pegawai atau user</h1>
            <p>Masukan detail tentang Pegawai atau user di bidang berikut</p>
          </div>
        </Col>
        <Col xs={24} md={12}>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}>
            {id ? (
              <div style={{ padding: "1rem 0" }}>
                {avatarUrl === null ? (
                  <Skeleton.Avatar size={64} />
                ) : (
                  <Avatar
                    size={64}
                    src={`http://localhost:5000/uploads/avatars/${avatarUrl}`}
                  />
                )}
              </div>
            ) : null}

            {id ? (
              <Form.Item valuePropName="fileList">
                <Upload
                  name="avatar"
                  action={`${DEV_API}/users/avatar/${id}}`}
                  headers={{
                    Authorization: `${localStorage.getItem("token")}`,
                  }}
                  maxCount={1}>
                  <Button icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload>
              </Form.Item>
            ) : null}

            <Form.Item<UserFormProps>
              label="Full name"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please input your name!",
                },
              ]}>
              <Input size="large" disabled={isLoading} />
            </Form.Item>
            <Form.Item<UserFormProps>
              label="Username"
              name="username"
              rules={[
                {
                  required: true,
                  message: "Please input your username!",
                },
                {
                  min: 4,
                  message: "Username must be at least 4 characters!",
                },
              ]}>
              <Input size="large" />
            </Form.Item>
            <Form.Item<UserFormProps>
              label="Role"
              name="role"
              rules={[
                {
                  required: true,
                  message: "Please select your role!",
                },
              ]}>
              <Select
                size="large"
                disabled={isLoading}
                allowClear
                options={[
                  {
                    value: "admin",
                    label: "Admin",
                  },
                  {
                    value: "user",
                    label: "User",
                  },
                ]}
              />
            </Form.Item>
            <Form.Item<UserFormProps>
              label="Phone"
              name="phone"
              rules={[
                {
                  required: true,
                  message: "Please input your phone!",
                },
              ]}>
              <Input size="large" disabled={isLoading} />
            </Form.Item>
            <Form.Item<UserFormProps>
              label="Password"
              name="password"
              rules={[
                {
                  required: id ? false : true,
                  message: "Please input your password!",
                },
              ]}>
              <Input.Password size="large" disabled={isLoading} />
            </Form.Item>

            <Form.Item style={{ paddingTop: 20 }}>
              <Button type="primary" htmlType="submit" size="large">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </AdminLayout>
  );
};

export default UserFormPage;
