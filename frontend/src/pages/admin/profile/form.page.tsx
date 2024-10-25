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
import { Link, useParams, useNavigate } from "react-router-dom";

type ProfileFormProps = {
  address: string;
  subdistrict: string;
  city: string;
  province: string;
  country: string;
  postal_code: string;
  email: string;
};

const ProfileFormPage: React.FC = () => {
  const [form] = Form.useForm<ProfileFormProps>();
  const { id } = useParams();
  const navigate = useNavigate();

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
          }}>
          <Row>
            <Col sm={24} lg={8}>
              <Typography.Title level={4}>
                <Flex vertical align="center">
                  <Avatar
                    size={{ lg: 70, xl: 100, xxl: 160 }}
                    src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                  />
                  <Typography.Title level={3}>Jhon doe</Typography.Title>
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
