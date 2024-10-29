import { Col, Row } from "antd";
import AdminLayout from "../../../layouts/admin.layout";
import CardUser from "./partials/cardUser";

const DashboardPage: React.FC = () => {
  return (
    <AdminLayout>
      <h1>Dashboard</h1>

      <Row>
        <Col xs={24} md={18}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={6}>
              <CardUser />
            </Col>
          </Row>
        </Col>
        <Col xs={24} md={6}></Col>
      </Row>
    </AdminLayout>
  );
};

export default DashboardPage;
