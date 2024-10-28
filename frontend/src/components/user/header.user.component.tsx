import { Avatar, Col, Layout, Row, Flex, Popover, Menu, Skeleton } from "antd";
import { UserOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { useAppDispatch, useAppSelector } from "../../app/store";
import { LogoutUser } from "../../features/AuthSlices";

const { Header } = Layout;

const headerStyle: React.CSSProperties = {
  backgroundColor: "#fff",
  boxShadow: "0 1px 1px rgba(0, 0, 0, 0.2)",
};

type MenuItem = Required<MenuProps>["items"][number];

const HeaderUserComponent: React.FC = () => {
  const {
    main: { isLoading, verify },
  } = useAppSelector((state) => state.authState);

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
  const dispatch = useAppDispatch();

  return (
    <Header style={headerStyle}>
      <Row>
        <Col span={12}>Kawan Library</Col>
        <Col span={12}>
          <Flex justify="end" align="center" style={{ height: "100%" }}>
            {isLoading ? (
              <Skeleton active />
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
                    src={`http://localhost:5000/uploads/avatars/${verify.data.avatarImg}`}
                  />
                )}
              </Popover>
            )}
          </Flex>
        </Col>
      </Row>
    </Header>
  );
};

export default HeaderUserComponent;
