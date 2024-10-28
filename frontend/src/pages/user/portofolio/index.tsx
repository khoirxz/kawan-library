import { useEffect, useState, useRef } from "react";
import {
  Row,
  Col,
  Card,
  Avatar,
  Flex,
  Typography,
  Breadcrumb,
  Button,
} from "antd";
import { UserOutlined, PrinterOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import axios from "axios";
import { useReactToPrint } from "react-to-print";
import { baseAPI } from "../../../api";
import { ListCertificationsProps } from "../../../utils/types/certifications";
import { UserDataProps } from "../../../utils/types/userData";
import style from "./style.module.css";

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
  const [dataUser, setDataUser] = useState<UserDataProps>({} as UserDataProps);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({
    documentTitle: "Portofolio",
    contentRef,
    pageStyle: `
    @media print {
      @page {
        size: portrait;
      }

      body {
        -webkit-print-color-adjust: exact;
        margin: 0;
        padding: 2.1rem;
      }
    }
  `,
  });

  useEffect(() => {
    const cancelTokenSource = axios.CancelToken.source();

    const getCertificates = async () => {
      try {
        const headers = {
          Authorization: `${localStorage.getItem("token")}`,
        };

        const [userResponse, certificationResponse] = await Promise.all([
          axios.get(`${baseAPI.dev}/userdata/${data?.userId}`, {
            headers,
            cancelToken: cancelTokenSource.token,
          }),
          axios.get(`${baseAPI.dev}/certifications/user/${data?.userId}`, {
            headers,
            cancelToken: cancelTokenSource.token,
          }),
        ]);

        if (userResponse.status === 200) {
          setDataUser(userResponse.data.data[0]);
        }

        if (certificationResponse.status === 200) {
          const data = certificationResponse.data.data.map(
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
        // Mengecek jika kesalahan disebabkan oleh pembatalan
        if (axios.isCancel(error)) {
          console.log("Request canceled", error.message);
        } else {
          console.log(error);
        }
      }
    };

    if (data?.userId && localStorage.getItem("token") !== null) {
      getCertificates();
    }

    return () => {
      // Membatalkan request ketika komponen unmount atau `data` berubah
      cancelTokenSource.cancel("Operation canceled by the user.");
      setCertificates([]);
    };
  }, [data]);

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
          <Flex align="center" justify="space-between">
            <h2>Portfolio</h2>
            <Button icon={<PrinterOutlined />} onClick={() => reactToPrintFn()}>
              Cetak
            </Button>
          </Flex>
          <div className={style.portfolioContainer}>
            <Card style={{ width: "100%" }}>
              <Flex vertical ref={contentRef}>
                <div>
                  {data?.avatarImg === "" || data?.avatarImg === null ? (
                    <Avatar size={80} icon={<UserOutlined />} />
                  ) : (
                    <Avatar
                      size={80}
                      src={`http://localhost:5000/uploads/avatars/${data.avatarImg}`}
                    />
                  )}
                </div>
                <div>
                  <Typography.Title
                    level={5}
                    style={{ textTransform: "capitalize" }}>
                    {data?.name}
                  </Typography.Title>
                  <Typography.Paragraph>
                    {dataUser.address}, {dataUser.subdistrict}, {dataUser.city},{" "}
                    {dataUser.province}, {dataUser.country}
                  </Typography.Paragraph>
                  <Flex gap={8}>
                    <Typography.Link href={`mailto:${dataUser.email}`}>
                      {dataUser.email}
                    </Typography.Link>
                    <Typography.Link>085 1234 5678</Typography.Link>
                  </Flex>
                </div>
                <Flex vertical>
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
                        <Flex
                          key={item.id}
                          align="center"
                          justify="space-between">
                          <Typography.Paragraph>
                            {item.name} Sertifikat
                          </Typography.Paragraph>
                          <Typography.Paragraph>
                            {dayjs(item.date).format("DD MMMM YYYY")}
                          </Typography.Paragraph>
                        </Flex>
                      ))
                    )}
                  </div>
                </Flex>
              </Flex>
            </Card>
          </div>
        </Col>
      </Row>
    </UserLayout>
  );
};

export default PortfolioPage;
