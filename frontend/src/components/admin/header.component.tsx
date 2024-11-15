import {
  Layout,
  Button,
  theme,
  Flex,
  Avatar,
  Popover,
  Menu,
  Skeleton,
} from "antd";
import type { MenuProps } from "antd";
import { useNavigate } from "react-router-dom";
import { MenuUnfoldOutlined, UserOutlined } from "@ant-design/icons";
import { useAppSelector, useAppDispatch } from "../../app/store";
import { LogoutUser } from "../../features/AuthSlices";
import { baseAPI } from "../../api";

const { Header } = Layout;

type HeaderComponentProps = {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
};

type MenuItem = Required<MenuProps>["items"][number];

const HeaderComponent: React.FC<HeaderComponentProps> = ({
  collapsed,
  setCollapsed,
}) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const dispatch = useAppDispatch();

  const {
    main: { isLoading, verify },
  } = useAppSelector((state) => state.authState);
  const navigate = useNavigate();

  const items: MenuItem[] = [
    {
      key: "1",
      label: "Profile",
    },
    {
      key: "2",
      label: (
        <>
          <span
            role="button"
            onClick={() => {
              dispatch(LogoutUser(localStorage.getItem("token")));
            }}
            style={{ color: "red" }}>
            Logout
          </span>
        </>
      ),
    },
  ];

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
        <Flex align="center" gap={20}>
          <Button
            shape="round"
            type="primary"
            role="link"
            onClick={() => navigate("/home")}>
            Home
          </Button>
          {isLoading ? (
            <Skeleton />
          ) : (
            <Popover
              placement="bottomRight"
              title={
                <p style={{ padding: "0 16px" }}>
                  {verify?.data?.name?.substring(0, 6)}
                </p>
              }
              content={<Menu items={items} />}>
              {verify.data.avatarImg === "" ||
              verify.data.avatarImg === null ? (
                <Avatar icon={<UserOutlined />} />
              ) : (
                <Avatar
                  src={`${baseAPI.dev}/uploads/avatars/${verify.data.avatarImg}`}
                />
              )}
            </Popover>
          )}
        </Flex>
      </Flex>
    </Header>
  );
};

export default HeaderComponent;
