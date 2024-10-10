import { Layout, Button, theme, Flex, Avatar } from "antd";
import { MenuUnfoldOutlined, UserOutlined } from "@ant-design/icons";

const { Header } = Layout;

type HeaderComponentProps = {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
};

const HeaderComponent: React.FC<HeaderComponentProps> = ({
  collapsed,
  setCollapsed,
}) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Header style={{ padding: "0 28px", background: colorBgContainer }}>
      <Flex
        justify="space-between"
        align="center"
        style={{
          height: "100%",
        }}>
        <Button
          onClick={() => setCollapsed(!collapsed)}
          icon={<MenuUnfoldOutlined />}
        />
        <Avatar icon={<UserOutlined />} />
      </Flex>
    </Header>
  );
};

export default HeaderComponent;
