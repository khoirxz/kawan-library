import { Row, Col, Card, Button, Skeleton } from "antd";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../app/store";

import UserLayout from "../../layouts/user.layout";

const menu: { id: number; name: string; path: string }[] = [
  {
    id: 1,
    name: "Surat Keputusan",
    path: "/decree",
  },
  {
    id: 2,
    name: "Portofolio",
    path: "/certificate",
  },
];

const HomePage: React.FC = () => {
  const {
    main: {
      verify: { data },
    },
  } = useAppSelector((state) => state.authState);

  console.log(data.name);
  return (
    <UserLayout>
      <Row>
        <Col span={24}>
          {data.name !== "" ? (
            <h1 style={{ textTransform: "capitalize" }}>Hello {data.name}</h1>
          ) : (
            <Skeleton style={{ width: "120px" }} />
          )}

          <Card title="Menu">
            <Row>
              {menu.map((item) => (
                <Col xs={24} sm={12} md={8} key={item.id}>
                  <Card.Grid style={{ width: "100%", height: "100%" }}>
                    <Link to={item.path}>
                      <Button type="text">{item.name}</Button>
                    </Link>
                  </Card.Grid>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>
    </UserLayout>
  );
};

export default HomePage;
