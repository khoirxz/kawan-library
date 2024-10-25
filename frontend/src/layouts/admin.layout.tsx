import { ReactNode, useEffect, useState } from "react";

import { Layout, theme } from "antd";
import SidebarComponent from "../components/admin/sidebar.componen";
import HeaderComponent from "../components/admin/header.component";

const { Content, Footer, Sider } = Layout;

const sideStyle: React.CSSProperties = {
  overflow: "auto",
  height: "100vh",
  position: "fixed",
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
  scrollbarWidth: "thin",
  scrollbarGutter: "stable",
};

const AdminLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    // if width is less than 768px, set collapsed to true
    if (window.innerWidth < 768) {
      setCollapsed(true);
    }
  }, []);

  return (
    <Layout>
      <Sider
        trigger={null}
        collapsed={collapsed}
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
        style={sideStyle}>
        <div className="demo-logo-vertical" />
        <SidebarComponent />
      </Sider>
      <Layout style={{ marginInlineStart: collapsed ? 0 : 200 }}>
        <HeaderComponent collapsed={collapsed} setCollapsed={setCollapsed} />
        <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}>
            {children}
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
