import React from "react";
import { Layout, Typography } from "antd";
import HeaderUserComponent from "../components/user/header.user.component";

const { Content, Footer } = Layout;

const contentStyle: React.CSSProperties = {
  minHeight: "90vh",
  padding: "30px 50px",
};

const footerStyle: React.CSSProperties = {
  textAlign: "center",
  backgroundColor: "#001d66",
};

const UserLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Layout>
      <HeaderUserComponent />
      <Content style={contentStyle}>{children}</Content>
      <Footer style={footerStyle}>
        <Typography.Text style={{ color: "#fff" }}>
          Copyright © {new Date().getFullYear()} Kawan Library
        </Typography.Text>
      </Footer>
    </Layout>
  );
};

export default UserLayout;
