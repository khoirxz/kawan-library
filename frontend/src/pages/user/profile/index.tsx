import React from "react";
import { Layout } from "antd";

const { Header, Content, Footer } = Layout;

const UserPage: React.FC = () => {
  return (
    <Layout>
      <Header>Header</Header>
      <Content>Content</Content>
      <Footer>Footer</Footer>
    </Layout>
  );
};

export default UserPage;
