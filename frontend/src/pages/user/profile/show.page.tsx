import React from "react";
import { Avatar, Breadcrumb, Col, Row, Typography, Flex, Card } from "antd";
import { UserOutlined } from "@ant-design/icons";
import UserLayout from "../../../layouts/user.layout";

import style from "./custom.module.css";

const ProfilePage: React.FC = () => {
  return (
    <UserLayout>
      <Row>
        <Col span={24}>
          <h1>Profile</h1>
          <Breadcrumb
            items={[
              {
                title: <a href="/home">Home</a>,
              },
              {
                title: <a href="/profile">Profile</a>,
              },
            ]}
          />

          <Flex gap={24} vertical>
            <div className={style.profileBg}>
              <div>
                <Avatar size={100} icon={<UserOutlined />} />
                <Typography.Title
                  level={3}
                  style={{ color: "#fff", marginTop: "6px" }}>
                  Jhon doe the boss
                </Typography.Title>
              </div>
            </div>

            <Row gutter={24}>
              <Col xs={24} md={10}>
                <Card title="Tentang">
                  <p>Jl. Pahlawan No. 1, BSD, Tangerang, Indonesia</p>
                  <p>johntheboss@mail.com</p>
                  <p>Staf IT</p>
                </Card>
              </Col>
              <Col xs={24} md={14}>
                <Card title="Infomasi">
                  <p>SERTIFIKAT MENJADI KAPOLDA MALANG - 2024</p>
                </Card>
              </Col>
            </Row>
          </Flex>
        </Col>
      </Row>
    </UserLayout>
  );
};

export default ProfilePage;
