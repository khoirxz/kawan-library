import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Input,
  Form,
  Button,
  DatePicker,
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
import { baseAPI } from "../../../api";
import { UserFormProps } from "../../../utils/types/users";

import AdminLayout from "../../../layouts/admin.layout";

type CertificateFormProps = {
  name: string;
  description: string;
  date: null;
};

const CertificateFormPage: React.FC = () => {
  const [form] = Form.useForm<CertificateFormProps>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserFormProps>({} as UserFormProps);
  const [messageApi, contextHolder] = message.useMessage();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [fileCertificate, setFileCertificate] = useState<string | null>(null);

  const { id, certificateId } = useParams();

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const getData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${baseAPI.dev}/users/${id}`, {
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

    const getCertificate = async () => {
      try {
        setIsLoading(true);

        const response = await axios.get(
          `${baseAPI.dev}/certifications/${certificateId}`,
          {
            headers: {
              Authorization: `${localStorage.getItem("token")}`,
            },
            signal,
          }
        );

        if (response.status === 200 && response.data.data) {
          form.setFieldsValue({
            name: response?.data?.data?.name,
            description: response.data.data.description,
            date: [dayjs(response.data.data.date)],
          });
          setFileCertificate(response.data.data.file_path);
        }
        console.log(response.data.data.file_path);
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

    if (certificateId) {
      getCertificate();
    }

    return () => {
      controller.abort();
    };
  }, [id, form, certificateId]);

  const onFinish: FormProps<CertificateFormProps>["onFinish"] = async (
    values
  ) => {
    // return console.log("Success:", values);
    try {
      const formData = new FormData();
      formData.append("user_id", id || "");
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("date", dayjs(values.date).format("YYYY-MM-DD"));
      fileList.forEach((file: any) => {
        formData.append("certificateFile", file || "");
      });

      let response: any;

      if (certificateId) {
        response = await axios.put(
          `${baseAPI.dev}/certifications/${certificateId}`,
          formData,
          {
            headers: {
              Authorization: `${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        response = await axios.post(`${baseAPI.dev}/certifications`, formData, {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        });
      }

      if (response.status === 201) {
        messageApi.success(response.data.message);
        // form.resetFields();
      } else if (response.status === 200) {
        messageApi.success(response.data.message);
      }
    } catch (error: any) {
      console.log(error);
      messageApi.error(error.response.data.message);
    }
  };

  const onFinishFailed: FormProps<CertificateFormProps>["onFinishFailed"] = (
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
              <h1>Buat Data Portofolio</h1>
              <p>Input detail dari Pelatihan/Sertifikat yang diikuti</p>
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
            {certificateId ? (
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
                        `http://localhost:5000/uploads/certificates/${fileCertificate}`,
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
                    src={`http://localhost:5000/uploads/certificates/${fileCertificate}`}
                  />
                )}
              </Card>
            ) : null}

            <Form.Item
              label="File Sertifikat (Format PDF)"
              name="certificateFile"
              rules={[
                {
                  required: certificateId ? false : true,
                  message: "Wajib diisi",
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

            <Form.Item<CertificateFormProps>
              label="Nama pelatihan/sertifikat"
              name="name"
              rules={[{ required: true, message: "Wajib diisi" }]}
              style={{ marginBottom: "1rem" }}>
              <Input disabled={isLoading} />
            </Form.Item>

            <Form.Item<CertificateFormProps>
              label="Deskripsi singkat tentang pelatihan/sertifikat"
              name="description"
              rules={[{ required: true, message: "Wajib diisi" }]}
              style={{ marginBottom: "1rem" }}>
              <Input.TextArea disabled={isLoading} />
            </Form.Item>

            <Form.Item<CertificateFormProps>
              label="Tahun pelatihan/sertifikat"
              name="date"
              rules={[{ required: true, message: "Wajib diisi" }]}
              style={{ marginBottom: "1rem" }}>
              <DatePicker
                format={"DD-MM-YYYY"}
                disabled={isLoading}
                style={{ width: "100%", marginBottom: "2rem" }}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={isLoading}>
                Simpan
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </AdminLayout>
  );
};

export default CertificateFormPage;
