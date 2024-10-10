import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Input,
  Form,
  Button,
  DatePicker,
  Select,
  message,
  Flex,
  Avatar,
  Typography,
  Upload,
  Card,
  Skeleton,
} from "antd";
import {
  UploadOutlined,
  UserOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import type { FormProps, UploadFile } from "antd";
import { useParams } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import { DEV_API } from "../../../api";
import { UserFormProps } from "../../../utils/types/users";

import AdminLayout from "../../../layouts/admin.layout";

type DecreeFormProps = {
  title: string;
  description: string;
  category: string;
  status: string;
  effective_date: null;
  expired_date: null;
};

const DecreeFormPage: React.FC = () => {
  const [form] = Form.useForm<DecreeFormProps>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fileDecree, setFileDecree] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserFormProps>({} as UserFormProps);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [messageApi, contextHolder] = message.useMessage();

  const { id, decreeId } = useParams();

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
          setUserData(response.data.data[0]);
        }
        setIsLoading(false);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("Request canceled:", error.message);
        } else {
          console.error("Error fetching data:", error);
        }
      }
    };

    const getDecree = async () => {
      try {
        setIsLoading(true);

        const response = await axios.get(`${DEV_API}/decrees/${decreeId}`, {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
          signal,
        });

        console.log(dayjs("2024-10-09T17:00:00.000Z"));

        if (response.status === 200 && response.data.data) {
          form.setFieldsValue({
            title: response.data.data.title,
            description: response.data.data.description,
            category: response.data.data.category,
            status: response.data.data.status,
            effective_date: [dayjs(response.data.data.effective_date)],
            expired_date: [dayjs(response.data.data.expired_date)],
          });
          setFileDecree(response.data.data.file_path);
        }
        setIsLoading(false);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("Request canceled:", error.message);
        } else {
          console.error("Error fetching data:", error);
        }
      }
    };

    getData();

    if (decreeId) {
      getDecree();
    }

    return () => {
      controller.abort();
    };
  }, [id, form, decreeId]);

  const onFinish: FormProps<DecreeFormProps>["onFinish"] = async (values) => {
    // return console.log("Success:", values);
    // return console.log("Success:", fileList[0]);
    try {
      // insert to FormData
      const formData = new FormData();
      formData.append("user_id", id?.toString() || "");
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("category", values.category);
      formData.append("status", values.status);
      formData.append(
        "effective_date",
        dayjs(values.effective_date).format("DD-MM-YYYY")
      );
      if (values.expired_date !== null) {
        formData.append(
          "expired_date",
          dayjs(values.expired_date).format("DD-MM-YYYY")
        );
      }
      // formData.append("decreeFile", fileList[0] as Blob);
      fileList.forEach((file: any) => {
        formData.append("decreeFile", file || "");
      });

      let response: any;
      if (decreeId) {
        response = await axios.put(`${DEV_API}/decrees/${decreeId}`, formData, {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        // insert to backend
        response = await axios.post(`${DEV_API}/decrees`, formData, {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }

      //   console.log(response);
      if (response.status === 200) {
        messageApi.success("Surat keputusan created successfully");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onFinishFailed: FormProps<DecreeFormProps>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <AdminLayout>
      {contextHolder}
      <Row>
        <Col sm={24} lg={12} style={{ marginBottom: "2rem" }}>
          <Flex vertical>
            <Flex vertical gap={5}>
              {userData.avatarImg === undefined ||
              userData.avatarImg === null ? (
                <Avatar size={48} icon={<UserOutlined />} />
              ) : (
                <Avatar
                  size={48}
                  src={`http://localhost:5000/uploads/avatars/${userData.avatarImg}`}
                />
              )}

              <Typography.Text>{userData.name}</Typography.Text>
            </Flex>
            <div>
              <h1>Buat Surat Keputusan</h1>
              <p>Input detail dari surat keputusan</p>
            </div>
          </Flex>
        </Col>
        <Col sm={24} lg={12}>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off">
            {decreeId ? (
              <Card
                style={{
                  marginBottom: "2rem",
                  minHeight: "120px",
                }}
                title="Surat Keputusan"
                extra={
                  <Button
                    type="primary"
                    icon={<DownloadOutlined />}
                    onClick={() => {
                      window.open(
                        `http://localhost:5000/uploads/decrees/${fileDecree}`,
                        "_blank"
                      );
                    }}>
                    Download
                  </Button>
                }>
                {isLoading ? (
                  <Skeleton active loading={isLoading} />
                ) : (
                  <iframe
                    style={{ width: "100%", height: "100%" }}
                    title="Decree"
                    src={`http://localhost:5000/uploads/decrees/${fileDecree}`}
                  />
                )}
              </Card>
            ) : null}

            <Form.Item
              label="File Surat Keputusan"
              name="decreeFile"
              rules={[
                {
                  required: true,
                  message: "Please input file!",
                },
              ]}>
              <Upload
                maxCount={1}
                accept="application/pdf"
                fileList={fileList}
                beforeUpload={(file) => {
                  setFileList([file]);
                  return false;
                }}>
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload>
            </Form.Item>

            <Form.Item<DecreeFormProps>
              label="Judul Surat Keputusan"
              name="title"
              rules={[{ required: true, message: "Please input title!" }]}
              style={{
                marginBottom: "2rem",
              }}>
              <Input disabled={isLoading} />
            </Form.Item>

            <Form.Item<DecreeFormProps>
              label="Deskripsi Surat Keputusan"
              name="description"
              rules={[{ required: true, message: "Please input description!" }]}
              style={{
                marginBottom: "2rem",
              }}>
              <Input.TextArea disabled={isLoading} />
            </Form.Item>

            <Form.Item<DecreeFormProps>
              label="Kategori Surat Keputusan"
              name="category"
              rules={[{ required: true, message: "Please input category!" }]}
              style={{
                marginBottom: "2rem",
              }}>
              <Input disabled={isLoading} />
            </Form.Item>

            <Form.Item<DecreeFormProps>
              label="Status Surat Keputusan"
              name="status"
              rules={[{ required: true, message: "Please input status!" }]}
              style={{
                marginBottom: "2rem",
              }}>
              <Select disabled={isLoading}>
                <Select.Option value="draft">Draft</Select.Option>
                <Select.Option value="approved">Di setujui</Select.Option>
                <Select.Option value="canceled">Di batalkan</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item<DecreeFormProps>
              label="Tgl Efektif Surat Keputusan"
              name="effective_date"
              rules={[
                { required: true, message: "Please input effective date!" },
              ]}
              style={{
                marginBottom: "2rem",
              }}>
              <DatePicker
                format={"DD-MM-YYYY"}
                disabled={isLoading}
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Form.Item<DecreeFormProps>
              label="Tgl Expired Surat Keputusan"
              name="expired_date"
              style={{
                marginBottom: "2rem",
              }}>
              <DatePicker
                format={"DD-MM-YYYY"}
                disabled={isLoading}
                style={{ width: "100%", marginBottom: "2rem" }}
              />
            </Form.Item>

            <Form.Item>
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

export default DecreeFormPage;
