import { useEffect, useState } from "react";
import AdminLayout from "../../../layouts/admin.layout";
import {
  Breadcrumb,
  Row,
  Col,
  Typography,
  Flex,
  Avatar,
  Divider,
  Form,
  Input,
  Button,
} from "antd";
import type { FormProps } from "antd";
import { UserOutlined } from "@ant-design/icons";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import { baseAPI } from "../../../api";

type ProfileFormProps = {
  address: string;
  subdistrict: string;
  city: string;
  province: string;
  country: string;
  postal_code: string;
  email: string;
};

type UserFormProps = {
  name: string;
  avatarImg: string;
};

const ProfileFormPage: React.FC = () => {
  const [form] = Form.useForm<ProfileFormProps>();
  const [userData, setUserData] = useState<UserFormProps>({} as UserFormProps);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = {
          Authorization: `${localStorage.getItem("token")}`,
        };

        const [userResponse, dataResponse] = await Promise.all([
          axios.get(`${baseAPI.dev}/users/${id}`, { headers }),
          axios.get(`${baseAPI.dev}/userdata/${id}`, { headers }),
        ]);

        if (userResponse.data.code === 200) {
          setUserData({
            name: userResponse.data.data[0].name,
            avatarImg: userResponse.data.data[0].avatarImg,
          });
        }

        if (dataResponse.data.code === 200) {
          const data = dataResponse.data.data[0];
          form.setFieldsValue({
            country: data.country,
            province: data.province,
            city: data.city,
            subdistrict: data.subdistrict,
            postal_code: data.postal_code,
            address: data.address,
            email: data.email,
          });
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [id, form]);

  const onFinish: FormProps<ProfileFormProps>["onFinish"] = async (values) => {
    try {
      const response = await axios.put(
        `${baseAPI.dev}/userdata`,
        {
          user_id: id,
          ...values,
        },
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 409) {
        await axios.post(
          `${baseAPI.dev}/userdata`,
          {
            user_id: id,
            ...values,
          },
          {
            headers: {
              Authorization: `${localStorage.getItem("token")}`,
            },
          }
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AdminLayout>
      <div>
        <Flex align="center" justify="space-between">
          <Breadcrumb
            items={[
              {
                title: <Link to="/admin/users">Daftar User</Link>,
              },
              {
                title: <Link to={`/admin/profile/form/${id}`}>Profil</Link>,
              },
            ]}
          />
          <Button
            variant="solid"
            type="primary"
            onClick={() => navigate("/profile")}>
            Lihat profil
          </Button>
        </Flex>

        <Divider />
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            country: "Indonesia",
          }}
          onFinish={onFinish}>
          <Row>
            <Col sm={24} lg={8}>
              <Typography.Title level={4}>
                <Flex vertical align="center">
                  {userData.avatarImg ? (
                    <Avatar
                      style={{ marginBottom: 10 }}
                      size={{ sm: 80, xl: 100, xxl: 160 }}
                      src={`http://localhost:5000/uploads/avatars/${userData.avatarImg}`}
                    />
                  ) : (
                    <Avatar
                      style={{ marginBottom: 10 }}
                      size={{ sm: 80, xl: 100, xxl: 160 }}
                      icon={<UserOutlined />}
                    />
                  )}

                  <Typography.Title
                    level={3}
                    style={{ textTransform: "capitalize" }}>
                    {userData.name}
                  </Typography.Title>
                </Flex>
              </Typography.Title>
            </Col>
            <Col sm={24} lg={16}>
              <Row gutter={[8, 8]}>
                <Col xs={24} sm={12}>
                  <Form.Item<ProfileFormProps>
                    label="Negara"
                    name="country"
                    rules={[{ required: true, message: "Negara wajib diisi" }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item<ProfileFormProps>
                    label="Provinsi"
                    name="province"
                    rules={[
                      { required: true, message: "Provinsi wajib diisi" },
                    ]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item<ProfileFormProps>
                    label="Kota"
                    name="city"
                    rules={[{ required: true, message: "Kota wajib diisi" }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item<ProfileFormProps>
                    label="Kecamatan"
                    name="subdistrict"
                    rules={[
                      { required: true, message: "Kecamatan wajib diisi" },
                    ]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item<ProfileFormProps>
                    label="Kode pos"
                    name="postal_code"
                    rules={[
                      { required: true, message: "Kodepos wajib diisi" },
                    ]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item<ProfileFormProps>
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: "Email wajib diisi" }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  <Form.Item<ProfileFormProps>
                    label="Alamat"
                    name="address"
                    rules={[{ required: true, message: "Alamat wajib diisi" }]}>
                    <Input.TextArea rows={4} />
                  </Form.Item>
                </Col>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Simpan
                  </Button>
                </Form.Item>
              </Row>
            </Col>
          </Row>
        </Form>
      </div>
    </AdminLayout>
  );
};

export default ProfileFormPage;
