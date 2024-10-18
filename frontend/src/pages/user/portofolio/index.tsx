import { useEffect, useState } from "react";
import { Row, Col, Card, Avatar, Flex, Typography, Breadcrumb } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import axios from "axios";
import { baseAPI } from "../../../api";
import { ListCertificationsProps } from "../../../utils/types/certifications";

import { useAppSelector } from "../../../app/store";

import UserLayout from "../../../layouts/user.layout";

const PortfolioPage: React.FC = () => {
  const {
    main: {
      verify: { data },
    },
  } = useAppSelector((state) => state.authState);
  const [certificates, setCertificates] = useState<ListCertificationsProps[]>(
    []
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const getCertificates = async () => {
      try {
        const response = await axios.get(`${baseAPI.dev}/certifications`, {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        });

        if (response.status === 200) {
          const data = response.data.data.map(
            (item: ListCertificationsProps) => {
              return {
                key: item.id,
                id: item.id,
                name: item.name,
                date: item.date,
                user_id: item.user_id,
              };
            }
          );

          setCertificates(data);
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getCertificates();

    return () => {
      setCertificates([]);
    };
  }, []);

  return (
    <UserLayout>
      <Row>
        <Col span={24}>
          <Breadcrumb
            items={[
              { title: <Link to="/home">Home</Link> },
              { title: <Link to="/certificate">Sertifikat</Link> },
              { title: <Link to="/portfolio">Portofolio</Link> },
            ]}
          />
          <h2>Portfolio</h2>
          <Flex vertical>
            <Card style={{ width: "100%" }}>
              <Avatar size={80} icon={<UserOutlined />} />
              <div>
                <Typography.Title
                  level={5}
                  style={{ textTransform: "capitalize" }}>
                  {data?.name}
                </Typography.Title>
                <Typography.Paragraph>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Laboriosam minus.
                </Typography.Paragraph>
              </div>
              <Flex>
                <div>
                  <Typography.Title level={5}>Sertifikat</Typography.Title>
                  {isLoading ? (
                    <Typography.Paragraph>Loading...</Typography.Paragraph>
                  ) : certificates.length === 0 ? (
                    <Typography.Paragraph>
                      Tidak ada sertifikat
                    </Typography.Paragraph>
                  ) : (
                    certificates.map((item) => (
                      <Typography.Paragraph>
                        {item.name} Sertifikat
                      </Typography.Paragraph>
                    ))
                  )}
                </div>
              </Flex>
            </Card>
          </Flex>
        </Col>
      </Row>
    </UserLayout>
  );
};

export default PortfolioPage;
